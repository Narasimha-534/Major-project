import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { Document, Packer, Paragraph, TextRun } from "docx";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const generateAIReport = async (eventDetails, images = []) => {
    let prompt = `
    You are a professional report writer. Your task is to generate a **highly structured and detailed event report** based on the provided event details. 

    🔹 **Guidelines:**  
    - Write the report **in a formal, professional tone**.  
    - **Do not mention missing details**; instead, focus on the given data to create a **cohesive** and **complete** report.  
    - Use information from "Additional Information" carefully, as it may contain **key insights** about the event.  
    - **Structure the report properly** with sections like **Introduction, Event Details, Key Highlights, Outcomes, and Conclusion**.  

    ----
    ## 📌 Event Report
    
    ### 1️⃣ Introduction  
    Provide a compelling introduction about the event, summarizing its purpose and significance.

    ### 2️⃣ Event Details
    - Event Type: ${eventDetails.event_type}  
    - Event Name: ${eventDetails.event_name || "N/A"}  
    - Description:${eventDetails.description || "N/A"}  
    - Key Information:
    ${eventDetails.dynamicfields ? JSON.stringify(eventDetails.dynamicfields, null, 2) : "N/A"}  

    ### 3️⃣ Key Highlights 
    Extract and elaborate on the most important aspects of the event, especially from "Additional Information".

    ### 4️⃣ Outcomes & Impact 
    Discuss the event’s impact, learnings, and any key takeaways.

    ### 5️⃣ Conclusion 
    Provide a well-rounded closing statement summarizing the event's success and significance.

    ----
    **Ensure the report is structured, formal, and free of placeholders for missing data.**
`;

    try {
        const result = await model.generateContent(prompt);
        const reportText = result.response.text();
        const formattedText = cleanAIResponse(reportText);

        const reportDir = path.join(process.cwd(), "reports");
        if (!fs.existsSync(reportDir)) fs.mkdirSync(reportDir);

        const pdfPath = path.join(reportDir, `${eventDetails.id}.pdf`);
        const wordPath = path.join(reportDir, `${eventDetails.id}.docx`);

        generatePDF(formattedText, pdfPath, images, eventDetails.id, reportDir);

        generateWord(formattedText, wordPath, images);

        return { pdfPath, wordPath };
    } catch (error) {
        console.error("Error generating AI report:", error);
        return null;
    }
};

function generatePDF(text, filePath, images, eventId, reportDir) {
    const pdfDoc = new PDFDocument();
    const writeStream = fs.createWriteStream(filePath);
    pdfDoc.pipe(writeStream);

    pdfDoc.fontSize(18).text("Event Report", { align: "center", underline: true }).moveDown();

    text.split("\n").forEach((line) => {
        if (line.startsWith("**") && line.endsWith("**")) {
            pdfDoc.font("Helvetica-Bold").fontSize(14).text(line.replace(/\*\*/g, ""), { align: "left" });
        } else if (line.startsWith("- ")) {
            pdfDoc.font("Helvetica").fontSize(12).text(`• ${line.slice(2)}`, { indent: 20 });
        } else {
            pdfDoc.font("Helvetica").fontSize(12).text(line, { align: "left" });
        }
        pdfDoc.moveDown(0.5);
    });

    images.forEach((base64Image, index) => {
        const buffer = Buffer.from(base64Image, "base64");
        const imagePath = path.join(reportDir, `image_${eventId}_${index}.png`);
        fs.writeFileSync(imagePath, buffer);
        pdfDoc.addPage().image(imagePath, { fit: [500, 400], align: "center" }).moveDown();
    });

    pdfDoc.end();
}

function generateWord(text, filePath, images) {
    const doc = new Document({
        sections: [
            {
                children: text.split("\n").map((line) => {
                    if (line.startsWith("**") && line.endsWith("**")) {
                        return new Paragraph({ children: [new TextRun({ text: line.replace(/\*\*/g, ""), bold: true, size: 28 })] });
                    } else if (line.startsWith("- ")) {
                        return new Paragraph({ text: `• ${line.slice(2)}`, bullet: { level: 0 }, spacing: { after: 100 } });
                    } else {
                        return new Paragraph({ text: line, spacing: { after: 100 } });
                    }
                }),
            },
        ],
    });

    Packer.toBuffer(doc).then((buffer) => {
        fs.writeFileSync(filePath, buffer);
    });
}

function cleanAIResponse(text) {
    return text
        .replace(/\*\*(.*?)\*\*/g, "**$1**") 
        .replace(/^\s*- /gm, "- ") 
        .replace(/\n\s*\n/g, "\n")
        .trim();
}
