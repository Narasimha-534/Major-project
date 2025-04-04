import express from "express";
import multer from "multer";
import path from "path";
import pool from "../config/database.js";
import fs from "fs";
import { parseExcelFile } from "../utils/excelProcessor.js";

const router = express.Router();

// Set up file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const fileTypes = /xlsx|xls/;
    const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
    if (extName) {
      return cb(null, true);
    } else {
      return cb(new Error("Only Excel files are allowed!"));
    }
  },
});

router.post("/upload-result", upload.single("file"), async (req, res) => {
  console.log("File upload endpoint hit");

  try {
    const { batchNumber, semester, department } = req.body;
    console.log("Received data:", req.body);

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    console.log("File received:", req.file.path);

    // Parse Excel file
    const resultData = await parseExcelFile(req.file.path);
    console.log("Parsed data:", resultData);

    if (resultData.length === 0) {
      return res.status(400).json({ message: "Excel file is empty or invalid format" });
    }

    const subjects = Object.keys(resultData[0]).slice(2); 
    console.log("Subjects:", subjects);

    // Ensure department is provided
    if (!department) {
      return res.status(400).json({ message: "Department is required" });
    }

    // Use department in table name to prevent conflicts
    const tableName = `student_results_${department}_${batchNumber.replace(/-/g, "_")}_${semester}`;

    const client = await pool.connect();
    try {
      let createTableQuery = `CREATE TABLE IF NOT EXISTS ${tableName} (
        id SERIAL PRIMARY KEY,
        roll_number VARCHAR(50) NOT NULL,
        ${subjects.map(sub => `"${sub}" INT CHECK ("${sub}" BETWEEN 0 AND 10)`).join(", ")}
      )`;
      
      await client.query(createTableQuery);
      console.log(`Table ${tableName} checked/created successfully.`);

      // Insert data into the table
      for (const row of resultData) {
        const rollNumber = row["Roll Number"]; 
        const subjectValues = subjects.map(subject => row[subject] || 0);

        const insertQuery = `
          INSERT INTO ${tableName} (roll_number, ${subjects.map(sub => `"${sub}"`).join(", ")})
          VALUES ($1, ${subjects.map((_, index) => `$${index + 2}`).join(", ")})
        `;

        await client.query(insertQuery, [rollNumber, ...subjectValues]);
      }

      res.status(200).json({ message: "File uploaded and processed successfully" });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error processing file upload:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});



export default router;
