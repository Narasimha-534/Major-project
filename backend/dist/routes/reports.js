import express from "express";
import multer from "multer";
import pool from "../config/database.js";
import { generateAIReport } from "../utils/aiReportGenerator.js";
import fs from "fs";

const router = express.Router();
const upload = multer();

router.post("/generate-report", upload.array("images", 5), async (req, res) => {
    const { eventId, eventName, eventType, description, dynamicFields } = req.body;

    if (!eventId) {
        return res.status(400).json({ error: "Event ID is required" });
    }

    console.log("Received dynamicFields:", req.body.dynamicFields);

    try {
        const eventResult = await pool.query("SELECT * FROM events WHERE id = $1", [eventId]);

        if (eventResult.rows.length === 0) {
            return res.status(404).json({ error: "Event not found" });
        }

        const event = eventResult.rows[0];

        await pool.query(
            "UPDATE events SET event_name = $1, event_type = $2, description = $3, dynamicfields = $4::jsonb WHERE id = $5",
            [
                eventName,
                eventType,
                description,
                typeof dynamicFields === "string" ? dynamicFields : JSON.stringify(dynamicFields), 
                eventId
            ]
        );

        const images = req.files.map((file) => file.buffer.toString("base64"));

        const reportPath = await generateAIReport({ ...event, eventName, eventType, description, dynamicFields }, images);

        if (!reportPath) {
            return res.status(500).json({ error: "Failed to generate report" });
        }

        const reportURL = `http://localhost:5000/reports/${eventId}.pdf`;
        const wordURL = `http://localhost:5000/reports/${eventId}.docx`;

        await pool.query(
            "UPDATE events SET report_url = $1, report_docx_url = $2 WHERE id = $3",
            [reportURL, wordURL, eventId]
        );

        res.status(200).json({ 
            success: true, 
            message: "Report generated successfully", 
            report_url: reportURL,
            word_url: wordURL
        });
    } catch (error) {
        console.error("Error generating report:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get("/:fileName", (req, res) => {
    const filePath = `./reports/${req.params.fileName}`;
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath, { root: process.cwd() });
    } else {
        res.status(404).json({ error: "File not found" });
    }
});

export default router;
