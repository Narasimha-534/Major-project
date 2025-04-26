import express from 'express';
import pool from '../config/database.js';
import transporter from '../config/email.js';
import cron from 'node-cron';

const router = express.Router();


const updateEventStatus = async () => {
  try {
    await pool.query(`
      UPDATE events 
      SET status = CASE
        WHEN CURRENT_DATE > end_date THEN 'Completed'
        WHEN CURRENT_DATE BETWEEN scheduled_date AND end_date THEN 'Ongoing'
        ELSE 'Scheduled'
      END;
    `);
  } catch (error) {
    console.error('Error updating event statuses:', error);
  }
};

router.get('/events', async (req, res) => {

  await updateEventStatus();
  const { department, id } = req.query;

  try {
    let result;
    if (department) {
      result = await pool.query(
        'SELECT * FROM events WHERE department = $1 ORDER BY scheduled_date DESC',
        [department]
      );
    } else if (id) {
      result = await pool.query(
        'SELECT * FROM events WHERE id = $1',
        [id]
      );
    } else {
      result = await pool.query('SELECT * FROM events ORDER BY scheduled_date DESC');
    }

    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




router.post('/events', async (req, res) => {
  const { event_name,event_type, description, start_date,end_date, department, status } = req.body;

  if (!start_date || isNaN(new Date(start_date).getTime())) {
    return res.status(400).json({ error: 'Invalid start date' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO events (event_name, event_type, description, scheduled_date,end_date, department, status) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [event_name, event_type, description, start_date,end_date, department, status]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create event' });
  }
});


router.get('/results', async (req, res) => {
  console.log("Received GET request to /api/results with params:", req.query);
  const { year, semester } = req.query;
  try {
    const result = await pool.query(
      'SELECT * FROM student_results WHERE year = $1 AND semester = $2',
      [year, semester]
    );
    console.log("Database query executed. Rows found:", result.rows.length);
    res.json({ results: result.rows });
  } catch (error) {
    console.error('Error fetching results:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/check-data', async (req, res) => {
  const { batchNumber, semester, department } = req.query;

  try {
      // Format batch (e.g., "2021-2025" -> "2021_2025")
      const formattedBatch = batchNumber.replace("-", "_");
      const semesterNumber = semester.replace("Sem", ""); // Convert "Sem1" to "1"

      const tableName = `student_results_${department.toLowerCase()}_${formattedBatch}_${semesterNumber}`;

      const query = `SELECT to_regclass('${tableName}') IS NOT NULL AS exists;`; // PostgreSQL query
      // For MySQL: `SHOW TABLES LIKE '${tableName}';`

      const result = await pool.query(query);
      const tableExists = result.rows[0].exists; // true or false

      res.json({ exists: tableExists });
  } catch (error) {
      console.error("Error checking table existence:", error);
      res.status(500).json({ error: "Server error" });
  }
});



router.get("/analytics", async (req, res) => {
  const { department, batchNumber, semester } = req.query;
  console.log(department, batchNumber, semester);

  if (!department || !batchNumber || !semester) {
    return res.status(400).json({ error: "Department, batch number, and semester are required" });
  }

  const formattedBatch = batchNumber.replace(/-/g, "_");
  const tableName = `student_results_${department.toLowerCase()}_${formattedBatch}_${semester}`;
  console.log(tableName);

  try {
    const client = await pool.connect();

    // Check if table exists
    const tableExistsQuery = `
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = $1
      ) AS exists;
    `;
    const tableExistsResult = await client.query(tableExistsQuery, [tableName]);

    if (!tableExistsResult.rows[0].exists) {
      client.release();
      return res.status(404).json({ error: "Results data not found for the given inputs" });
    }

    // Fetch subjects dynamically (excluding roll_number, student_name, and id)
    const subjectsQuery = `
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = $1 
      AND column_name NOT IN ('roll_number', 'student_name', 'id');
    `;
    const subjectsResult = await client.query(subjectsQuery, [tableName]);
    const subjects = subjectsResult.rows.map(row => row.column_name);

    if (subjects.length === 0) {
      client.release();
      return res.status(400).json({ error: "No subjects found in the results table" });
    }

    // Fetch average marks per subject
    const avgMarksQuery = `
      SELECT ${subjects.map(subject => `AVG("${subject}") AS "${subject}"`).join(", ")}
      FROM ${tableName};
    `;
    const avgMarksResult = await client.query(avgMarksQuery);

    // Fetch fail counts (students scoring < 5 in each subject)
    const failCountsQuery = `
      SELECT ${subjects.map(subject => `COUNT(*) FILTER (WHERE "${subject}" < 5) AS "${subject}_fails"`).join(", ")}
      FROM ${tableName};
    `;
    const failCountsResult = await client.query(failCountsQuery);

    // **Pass Percentage Calculation**
    const passPercentageQuery = `
      SELECT ${subjects.map(subject => `
        (COUNT(*) FILTER (WHERE "${subject}" >= 5) * 100.0 / COUNT(*)) AS "${subject}_pass_percentage"
      `).join(", ")}
      FROM ${tableName};
    `;
    const passPercentageResult = await client.query(passPercentageQuery);

    // Process the results
    const averageMarks = Object.entries(avgMarksResult.rows[0])
      .map(([subject, average_marks]) => ({ subject, average_marks }));

    const failCounts = Object.entries(failCountsResult.rows[0])
      .map(([subject, fail_count]) => ({ subject: subject.replace("_fails", ""), fail_count }));

    const passPercentage = Object.entries(passPercentageResult.rows[0])
      .map(([subject, pass_percentage]) => ({
        subject: subject.replace("_pass_percentage", ""),
        pass_percentage: parseFloat(pass_percentage).toFixed(2) + "%"
      }));

    // **Calculate Semester-Wise Overall Pass Percentage**
    const overallPassPercentage = passPercentage
      .map(item => parseFloat(item.pass_percentage))
      .reduce((sum, value) => sum + value, 0) / passPercentage.length;

    console.log(`Overall Pass Percentage for ${semester}:`, overallPassPercentage);

    // **Save the semester-wise pass percentage in a table**
    const saveSemesterPerformanceQuery = `
      INSERT INTO semester_performance (department, batch, semester, pass_percentage)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (department, batch, semester) 
      DO UPDATE SET pass_percentage = EXCLUDED.pass_percentage;
    `;
    await client.query(saveSemesterPerformanceQuery, [department, batchNumber, semester, overallPassPercentage]);

    client.release();

    res.json({
      averageMarks,
      failCounts,
      passPercentage,
      overallPassPercentage: overallPassPercentage.toFixed(2) + "%" // Return overall percentage
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/batch-performance", async (req, res) => {
  const { batch } = req.query;
  console.log(batch)

  if (!batch) {
    return res.status(400).json({ error: "Batch is required" });
  }

  try {
    const client = await pool.connect();
    const query = `
      SELECT department, semester, AVG(pass_percentage) AS avg_pass_percentage
      FROM semester_performance
      WHERE batch = $1
      GROUP BY department, semester
      ORDER BY semester;
    `;
    const query2 = `
      SELECT 
          department, 
          AVG(pass_percentage) AS average_pass_percentage
      FROM 
          semester_performance
      GROUP BY 
          department;

    `
    const result = await client.query(query, [batch]);
    const result2 = await client.query(query2)
    client.release();

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "No data found for the selected batch" });
    }
    res.json({
      batchPerformance: result.rows,
      overallDepartmentPerformance: result2.rows,
    });
    
  } catch (error) {
    console.error("Error fetching batch performance:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});




    router.post("/achievements", async (req, res) => {
      try {
        const { name, user_id, title, description, date, category, department, document_url, type } = req.body;

        const result = await pool.query(
          `INSERT INTO achievements (name, user_id, title, description, date, category, department, document_url, type)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
          [name, user_id, title, description, date, category, department, document_url, type] // Ensure all 9 values are passed
      );
      
          res.status(201).json(result.rows[0]);
      } catch (err) {
          res.status(500).json({ error: err.message });
      }
  });

  router.get("/achievements", async (req, res) => {
    try {
        const { type, department } = req.query;
        const result = await pool.query(
            `SELECT * FROM achievements WHERE type = $1 AND department = $2 ORDER BY date DESC`,
            [type,department]
        );
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.get('/achievements/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const query = 'SELECT * FROM achievements WHERE id = $1';
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Achievement not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




//Sending Email before One day

const sendEventReminders = async () => {
  try {
    const result = await pool.query(`
      SELECT id, event_name, department, scheduled_date, description 
      FROM events 
      WHERE scheduled_date = CURRENT_DATE + INTERVAL '1 day'
    `);

    if (result.rows.length === 0) {
      console.log('No events scheduled for tomorrow.');
      return;
    }

    for (const event of result.rows) {
      console.log(`Sending reminders for event: ${event.event_name}`);

      // Fetch users in the same department
      const users = await pool.query(
        `SELECT email FROM users WHERE department = $1`,
        [event.department]
      );

      if (users.rows.length === 0) {
        console.log(`No users found in department: ${event.department}`);
        continue;
      }

      for (const user of users.rows) {
        const mailOptions = {
          from: 'aarettinarasimha@gmail.com', 
          to: user.email,
          subject: `Reminder: Upcoming Event - ${event.event_name}`,
          text: `Hello,\n\nThis is a reminder that the event "${event.event_name}" is scheduled for tomorrow.\n\nDescription: ${event.description}\n\nBest Regards,\nYour Institution`,
        };

        await transporter.sendMail(mailOptions);
        console.log(`Email sent to: ${user.email}`);
      }
    }

    console.log('All reminder emails sent successfully.');
  } catch (error) {
    console.error('Error sending event reminders:', error);
  }
};

cron.schedule('0 9 * * *', sendEventReminders);

router.get('/test-reminder', async (req, res) => {
  try {
    await sendEventReminders();
    res.status(200).json({ message: 'Test reminder triggered successfully' });
  } catch (error) {
    console.error('Error triggering test reminder:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


//Annual report generator

// router.get('/events/by-academic-year', async (req, res) => {
//   const { academicYear } = req.query;

//   if (!academicYear || !/^\d{4}-\d{4}$/.test(academicYear)) {
//     return res.status(400).json({ error: 'Invalid academic year format. Use YYYY-YYYY (e.g., 2024-2025).' });
//   }

//   const [startYear, endYear] = academicYear.split('-').map(Number);
//   const startDate = `${startYear}-08-01`; 
//   const endDate = `${endYear}-07-31`;


//   try {
//     const result = await pool.query(
//       `SELECT * FROM events WHERE scheduled_date BETWEEN $1 AND $2 ORDER BY scheduled_date DESC`,
//       [startDate, endDate]
//     );

//     res.status(200).json(result.rows);
//   } catch (error) {
//     console.error('Error fetching events by academic year:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// router.get('/achievements/by-academic-year', async (req, res) => {
//   console.log('🔵 Achievements API hit!');
//   const { academicYear } = req.query;
//   console.log('Received Academic Year:', academicYear);
// });

router.get('/data/by-academic-year', async (req, res) => {
  const { academicYear } = req.query;

  if (!academicYear || !/^\d{4}-\d{4}$/.test(academicYear)) {
    return res.status(400).json({ error: 'Invalid academic year format. Use YYYY-YYYY (e.g., 2024-2025).' });
  }

  const [startYear, endYear] = academicYear.split('-').map(Number);
  const startDate = `${startYear}-08-01`; 
  const endDate = `${endYear}-07-31`;

  try {
    // Fetch events and achievements concurrently
    const [eventsResult, achievementsResult] = await Promise.all([
      pool.query(`SELECT * FROM events WHERE scheduled_date BETWEEN $1::DATE AND $2::DATE ORDER BY scheduled_date DESC`, [startDate, endDate]),
      pool.query(`SELECT * FROM achievements WHERE date BETWEEN $1::DATE AND $2::DATE ORDER BY date DESC`, [startDate, endDate])
    ]);

    res.status(200).json({
      events: eventsResult.rows,
      achievements: achievementsResult.rows
    });
  } catch (error) {
    console.error('Error fetching data by academic year:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.get('/annual-report', async (req, res) => {
  const { academicYear } = req.query;

  try {
    let result;
    
    if (academicYear) {
      result = await pool.query(
        `SELECT * FROM annual_reports WHERE academic_year = $1`,
        [academicYear]
      );
    } else {
      result = await pool.query(`SELECT * FROM annual_reports`);
    }

    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching annual reports:", err);
    res.status(500).json({ error: err.message });
  }
});



// router.get('/achievements/by-academic-year', async (req, res) => {
//   const { academicYear } = req.query;

//   console.log('Received Academic Year:', academicYear);

//   if (!academicYear || !/^\d{4}-\d{4}$/.test(academicYear)) {
//     return res.status(400).json({ error: 'Invalid academic year format. Use YYYY-YYYY (e.g., 2024-2025).' });
//   }

//   const [startYear, endYear] = academicYear.split('-').map(Number);
//   const startDate = `${startYear}-08-01`; 
//   const endDate = `${endYear}-07-31`;

//   console.log(startDate, endDate);

//   try {
//     const result = await pool.query(
//       `SELECT * FROM achievements WHERE date BETWEEN $1::DATE AND $2::DATE ORDER BY date DESC`,
//       [startDate, endDate]
//     );

//     res.status(200).json(result.rows);
//   } catch (error) {
//     console.error('Error fetching achievements by academic year:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });



export default router
