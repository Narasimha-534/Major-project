import express from "express";
import multer from "multer";
import path from 'path';
import pool from "../config/database.js";
import fs from "fs";
import { parseExcelFile } from "../utils/excelProcessor.js";

const router = express.Router();

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
    }
  });
  

  router.post("/upload-result", upload.single("file"), async (req, res) => {
    console.log("File upload endpoint hit");
    try {
      const { year, semester } = req.body;
      console.log("Received data:", req.body);
  
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      console.log("File received:", req.file.path);
      
      const resultData = await parseExcelFile(req.file.path);
      console.log("Parsed data:", resultData);
  
      const client = await pool.connect();
      try {
        for (const row of resultData) {
          const { student_name, subject, marks } = row; 
          await client.query(
            `INSERT INTO student_results (year, semester, student_name, subject, marks) 
             VALUES ($1, $2, $3, $4, $5)`,
            [year, semester, student_name, subject, marks]
          );
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

//   router.get("/test", (req, res) => {
//     console.log("Test route hit!");
//     res.json({ message: "GET API is working" });
//   });
  
  
  
  

  
  
  
  
//   

// export default router;

// const router = express.Router();

// // Test route
// router.get("/test", (req, res) => {
//   console.log("Test route hit!");
//   res.json({ message: "GET API is working" });
// });

export default router;
