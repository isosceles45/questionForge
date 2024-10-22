// server.js
import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import multer from "multer";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" }));

// Configure multer for memory storage
const upload = multer({ storage: multer.memoryStorage() });

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

app.post("/api/send-email", upload.array("pdfs", 2), async (req, res) => {
    try {
        const { to, subject, text } = req.body;
        const files = req.files;

        if (!to || !subject || !text || !files || files.length !== 2) {
            return res.status(400).json({
                error: "Missing required fields or invalid number of PDF files",
            });
        }

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            text,
            attachments: files.map((file, index) => ({
                filename: file.originalname,
                content: file.buffer,
                contentType: "application/pdf",
            })),
        };

        const info = await transporter.sendMail(mailOptions);

        res.json({
            message: "Email sent successfully",
            messageId: info.messageId,
        });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({
            error: "Failed to send email",
            details: error.message,
        });
    }
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: "Something broke!",
        details: err.message,
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
