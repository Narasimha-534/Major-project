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


router.get('/analytics', async (req, res) => {
      const { year, semester } = req.query;
      try {
        const avgMarks = await pool.query(
          'SELECT subject, AVG(marks) AS average_marks FROM student_results WHERE year = $1 AND semester = $2 GROUP BY subject',
          [year, semester]
        );
        
        const topPerformers = await pool.query(
          'SELECT student_name, AVG(marks) AS avg_marks FROM student_results WHERE year = $1 AND semester = $2 GROUP BY student_name ORDER BY avg_marks DESC LIMIT 5',
          [year, semester]
        );
    
        const performanceTrend = await pool.query(
          'SELECT semester, AVG(marks) AS avg_marks FROM student_results WHERE year = $1 GROUP BY semester ORDER BY semester',
          [year]
        );
    
        res.json({
          averageMarks: avgMarks.rows,
          topPerformers: topPerformers.rows,
          performanceTrend: performanceTrend.rows,
        });
      } catch (error) {
        console.error('Error fetching analytics:', error);
        res.status(500).json({ error: 'Internal Server Error' });
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
