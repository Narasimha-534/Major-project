import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { Document, Packer, Paragraph, TextRun } from "docx";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const generateAnnualReport = async (reportData) => {
    const { academicYear,performance, events, achievements, placements } = reportData;

    console.log(reportData);

    let prompt = `
    You are a professional report writer. Generate a formal and structured **Annual Report** based on the provided academic year data.  
    The report should focus on **Events, Achievements, and Placements**, maintaining a **professional and academic tone**.

    🔹 **Guidelines:**
    - Follow a structured format with clear sections: **Introduction, Events, Achievements, Placements, and Conclusion**.
    - **Do not mention missing data**—only focus on the available information.
    - Ensure that the report maintains a **cohesive and detailed narrative** while staying concise and professional.
    - The language should be **formal, academic, and well-organized**.
    - Under **Placements**, provide a **descriptive paragraph** followed by a **table with placement statistics**.

    ---

    ### 📌 Annual Report: Academic Year **${academicYear}**

    ### **1️⃣ Introduction**  
    This report provides an overview of key academic activities, achievements, and placement statistics for the academic year **${academicYear}**.  
    The institution remained committed to **fostering academic excellence, professional development, and student career growth**.

    ### **2️⃣ Events**  
    Below is a summary of key events conducted during **${academicYear}**:

    ${events.map(event => `- **${event.name}**: ${event.description || "No description available."}`).join("\n")}

    These events contributed to **faculty development, student engagement, and industry collaborations**, enhancing the overall learning experience.

    ### **3️⃣ Achievements**  
    Some key highlights include:

    ${achievements.map(ach => `- **${ach.title}**: ${ach.description || "No details available."}`).join("\n")}

    These accomplishments reflect the **dedication of faculty and students** in various domains.

    ### **4️⃣ Performance**  
    The performance of students across different departments during **${academicYear}** was exemplary. The average pass percentages by department are as follows:

    ${performance.map(department => `- **${department.department}**: Average Pass Percentage: ${department.average_pass_percentage}%`).join("\n")}

    This highlights the **outstanding academic achievements** of students across various disciplines, reflecting the institution's strong academic framework and dedication to excellence.

    ### **4️⃣ Placements**
    The institution achieved **remarkable success** in campus placements for the academic year **${academicYear}**.  
    With strong industry collaborations, rigorous training programs, and dedicated career support, students secured excellent job opportunities across various sectors.  

    These numbers demonstrate the institution's **strong ties with industry partners** and its commitment to **student career growth**.

    **Please provide a concise summary of placement achievements in a **plain-text paragraph only**, without using tables, bullet points, or placeholders. Do not generate a table or ask for additional data.**

    ### **5️⃣ Conclusion**  
    The academic year **${academicYear}** was marked by **significant milestones**, including impactful events, notable achievements, and strong placement outcomes.  
    The institution continues to **enhance academic excellence and industry engagement** to foster student success. Moving forward, efforts will be directed towards further improving these initiatives.

    ---
    **Ensure the AI-generated report follows this structure and maintains a formal academic tone.**  
    The placement section must include a **descriptive paragraph** followed by a **table** for placement statistics.

    `;

    try {
        const result = await model.generateContent(prompt);
        const reportText = result.response.candidates[0].content.parts[0].text; 
        const formattedText = cleanAIResponse(reportText);

        const reportDir = path.join(process.cwd(), "annual_reports");
        if (!fs.existsSync(reportDir)) fs.mkdirSync(reportDir);

        const pdfPath = path.join(reportDir, `Annual_Report_${academicYear}.pdf`);
        const wordPath = path.join(reportDir, `Annual_Report_${academicYear}.docx`);

        await generatePDF(formattedText, pdfPath, events, achievements, placements);   // ✅ Ensure Execution Completes
        await generateWord(formattedText, wordPath); // ✅ Ensure Execution Completes

        return { pdfPath, wordPath };
    } catch (error) {
        console.error("Error generating Annual Report:", error);
        return null;
    }
};

async function generatePDF(text, filePath, events, achievements, placements) {
    try {
        console.log("Generating PDF with:", {
            eventsCount: events?.length || 0,
            achievementsCount: achievements?.length || 0,
            placements: placements || 'No placements data'
        });

        const pdfDoc = new PDFDocument({ 
            margin: 40,
            size: 'A4'
        });
        
        const writeStream = fs.createWriteStream(filePath);
        writeStream.on('error', (err) => {
            console.error('Error writing PDF:', err);
        });

        pdfDoc.pipe(writeStream);

        // Title
        pdfDoc.fontSize(18).text("Annual Report", { align: "center", underline: true }).moveDown();
        
        const lines = text.split("\n");
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            
            // Events Section
            if (line.includes("2. Events") || line.includes("2️⃣ Events")) {
                pdfDoc.font("Helvetica-Bold").fontSize(14)
                    .text("2. Events", { align: "left" })
                    .moveDown();
                
                pdfDoc.font("Helvetica").fontSize(12)
                    .text("The institution organized several academic and professional events throughout the year. Below is a summary of key events conducted:", { align: "left" })
                    .moveDown();
                
                if (events && events.length > 0) {
                    const tableHeaders = ["Event Name", "Type", "Description", "Date"];
                    const colWidths = [120, 80, 180, 80];
                    
                    let currentY = pdfDoc.y;
                    currentY += drawTableRow(pdfDoc, tableHeaders, currentY, colWidths);
                    
                    events.forEach((event) => {
                        const date = new Date(event.scheduled_date).toLocaleDateString();
                        currentY += drawTableRow(
                            pdfDoc,
                            [
                                event.event_name,
                                event.event_type,
                                event.description,
                                date
                            ],
                            currentY,
                            colWidths,
                            "Helvetica",
                            12
                        );
                    });
                    
                    // Reset x position and update y position after table
                    pdfDoc.x = 40; // Reset to left margin
                    pdfDoc.y = currentY + 20;
                }
                continue;
            }
            
            // Achievements Section
            if (line.includes("3. Achievements") || line.includes("3️⃣ Achievements")) {
                pdfDoc.x = 40; // Reset to left margin
                pdfDoc.font("Helvetica-Bold").fontSize(14)
                    .text("3. Achievements", { align: "left" })
                    .moveDown();
                
                pdfDoc.font("Helvetica").fontSize(12)
                    .text("The institution witnessed notable achievements during the academic year. Key highlights include:", { align: "left" })
                    .moveDown();
                
                if (achievements && achievements.length > 0) {
                    const tableHeaders = ["Title", "Category", "Name", "Description", "Date"];
                    const colWidths = [100, 80, 80, 140, 80];
                    
                    let currentY = pdfDoc.y;
                    currentY += drawTableRow(pdfDoc, tableHeaders, currentY, colWidths);
                    
                    achievements.forEach((achievement) => {
                        const date = new Date(achievement.date).toLocaleDateString();
                        currentY += drawTableRow(
                            pdfDoc,
                            [
                                achievement.title,
                                achievement.category,
                                achievement.name,
                                achievement.description,
                                date
                            ],
                            currentY,
                            colWidths,
                            "Helvetica",
                            12
                        );
                    });
                    
                    // Reset x position and update y position after table
                    pdfDoc.x = 40; // Reset to left margin
                    pdfDoc.y = currentY + 20;
                }
                continue;
            }

            // Placements Section
            if (line.includes("4. Placements") || line.includes("4️⃣ Placements")) {
                pdfDoc.x = 40; // Reset to left margin
                pdfDoc.font("Helvetica-Bold").fontSize(14)
                    .text("4. Placements", { align: "left" })
                    .moveDown();
                
                if (placements) {
                    pdfDoc.font("Helvetica").fontSize(12)
                        .moveDown();
                    
                    const tableHeaders = ["Metric", "Count"];
                    const colWidths = [250, 150];
                    let currentY = pdfDoc.y;
                    
                    currentY += drawTableRow(pdfDoc, tableHeaders, currentY, colWidths);
                    
                    const placementRows = [
                        ["Total Registered Students", placements.totalRegistered || '0'],
                        ["Number of Companies Arrived", placements.companiesArrived || '0'],
                        ["Total Students Placed", placements.studentsPlaced || '0'],
                        ["Placement Percentage", placements.totalRegistered ? 
                            `${((placements.studentsPlaced / placements.totalRegistered) * 100).toFixed(2)}%` : 
                            '0%'
                        ]
                    ];
                    
                    placementRows.forEach(row => {
                        currentY += drawTableRow(pdfDoc, row, currentY, colWidths, "Helvetica", 12);
                    });
                    
                    // Reset x position and update y position after table
                    pdfDoc.x = 40; // Reset to left margin
                    pdfDoc.y = currentY + 20;
                }
                continue;
            }

            // Regular text processing for other sections
            if (line.trim()) {
                pdfDoc.x = 40; // Reset to left margin for all content
                if (line.startsWith("###")) {
                    pdfDoc.font("Helvetica-Bold").fontSize(14)
                        .text(line.replace(/[#*]/g, "").trim(), { align: "left" })
                        .moveDown();
                } else if (line.startsWith("**") && line.endsWith("**")) {
                    pdfDoc.font("Helvetica-Bold").fontSize(12)
                        .text(line.replace(/\*\*/g, ""), { align: "left" });
                } else if (line.startsWith("- ") || line.startsWith("* ")) {
                    pdfDoc.font("Helvetica").fontSize(12)
                        .text(`• ${line.slice(2)}`, { indent: 20 });
                } else {
                    pdfDoc.font("Helvetica").fontSize(12)
                        .text(line, { align: "left" });
                }
                pdfDoc.moveDown(0.5);
            }
        }

        pdfDoc.end();
        return new Promise((resolve, reject) => {
            writeStream.on("finish", resolve);
            writeStream.on("error", reject);
        });
    } catch (error) {
        console.error("Error generating PDF:", error);
        throw error;
    }
}

// Helper function to draw table rows
function drawTableRow(doc, cells, y, widths, font = "Helvetica-Bold", fontSize = 12) {
    const startX = 40;
    let x = startX;
    let maxHeight = 40; // minimum row height

    // Calculate required height for each cell
    cells.forEach((cell, i) => {
        const cellText = cell?.toString() || '';
        doc.font(font).fontSize(fontSize);
        const cellHeight = doc.heightOfString(cellText, {
            width: widths[i] - 10,
            align: 'left'
        }) + 10; // Add padding
        maxHeight = Math.max(maxHeight, cellHeight);
    });

    // Draw cell backgrounds and borders
    doc.lineWidth(1);
    x = startX;
    cells.forEach((cell, i) => {
        doc.rect(x, y, widths[i], maxHeight).stroke();
        x += widths[i];
    });

    // Draw cell content
    x = startX;
    cells.forEach((cell, i) => {
        const cellText = cell?.toString() || '';
        doc.font(font).fontSize(fontSize);
        doc.text(cellText, x + 5, y + 5, {
            width: widths[i] - 10,
            height: maxHeight - 10,
            align: 'left',
            lineGap: 2
        });
        x += widths[i];
    });

    return maxHeight;
}

async function generateWord(text, filePath) {
    try {
        const doc = new Document({
            sections: [
                {
                    children: text.split("\n").map(line => {
                        if (line.startsWith("**") && line.endsWith("**")) {
                            return new Paragraph({
                                children: [new TextRun({ text: line.replace(/\*\*/g, ""), bold: true, size: 28 })]
                            });
                        } else if (line.startsWith("- ")) {
                            return new Paragraph({ text: `• ${line.slice(2)}`, bullet: { level: 0 }, spacing: { after: 100 } });
                        } else {
                            return new Paragraph({ text: line, spacing: { after: 100 } });
                        }
                    }),
                },
            ],
        });

        const buffer = await Packer.toBuffer(doc);  // ✅ Fix Word File Saving
        fs.writeFileSync(filePath, buffer);
    } catch (error) {
        console.error("Error generating Word document:", error);
    }
}

function cleanAIResponse(text) {
    return text
        .replace(/\*\*(.*?)\*\*/g, "**$1**") 
        .replace(/^\s*- /gm, "- ") 
        .replace(/\n\s*\n/g, "\n")
        .trim();
}