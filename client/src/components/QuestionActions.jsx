// QuestionActions.jsx
import React from "react";
import { Mail, RefreshCw, FileText, FileCheck } from "lucide-react";
import { generateQuestionsPDF } from "../utils/pdfGenerator";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";

const QuestionActions = ({ response, type, onRegenerateClick }) => {
    const { user } = useUser();

    const handleDownload = (includeAnswers) => {
        if (!response || !response.questions) return;

        const doc = generateQuestionsPDF(
            response.questions,
            type,
            includeAnswers
        );
        const fileName = `${type}_questions_${
            includeAnswers ? "with_answers_" : ""
        }${new Date().toISOString().split("T")[0]}.pdf`;
        doc.save(fileName);
    };

    const handleSendEmail = async () => {
        if (!response || !response.questions) return;

        // Generate both PDFs
        const questionsDoc = generateQuestionsPDF(
            response.questions,
            type,
            false
        );
        const answersDoc = generateQuestionsPDF(response.questions, type, true);

        // Convert both PDFs to blobs
        const questionsPdfBlob = questionsDoc.output("blob");
        const answersPdfBlob = answersDoc.output("blob");

        const formData = new FormData();
        formData.append("to", user.primaryEmailAddress.emailAddress);
        formData.append(
            "subject",
            `Your ${type} Question Set from Question Forge`
        );

        const emailText = `
Dear ${user.firstName || "User"},

Thank you for using Question Forge! Your generated question set is ready.

Attached to this email, you'll find:
1. A question paper (${type})
2. An answer key with detailed solutions

Note: These questions were generated using artificial intelligence and should be reviewed before use in any formal setting. While we strive for accuracy and quality, we recommend checking the content for appropriateness and accuracy for your specific needs.

If you found Question Forge helpful, feel free to share it with your colleagues!

Best regards,
The Question Forge Team

---
This is an automated message. Please do not reply to this email.
For support, visit our help center at [Your Support URL].
        `.trim();

        formData.append("text", emailText);

        // Append both PDFs with unique names
        formData.append("pdfs", questionsPdfBlob, `${type}_questions.pdf`);
        formData.append("pdfs", answersPdfBlob, `${type}_answers.pdf`);

        try {
            const response = await axios.post(
                "http://localhost:3000/api/send-email",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            if (response.status === 200) {
                alert("Email sent successfully! Please check your inbox.");
            }
        } catch (error) {
            console.error("Error sending email:", error);
            alert("Failed to send email. Please try again later.");
        }
    };

    return (
        <div className="flex flex-col items-center gap-3">
            <button
                onClick={onRegenerateClick}
                disabled={!response}
                className={`flex items-center justify-center px-4 py-3 rounded w-full mb-4 
                    ${
                        response
                            ? "bg-orange-500 hover:bg-orange-600 text-white"
                            : "bg-orange-900 cursor-not-allowed"
                    }`}
            >
                <RefreshCw className="w-5 h-5 mr-2" />
                <span className="text-md font-bold">Generate Again</span>
            </button>

            <button
                onClick={() => handleDownload(false)}
                disabled={!response}
                className={`flex items-center justify-center px-4 py-3 rounded w-full mb-4 
                    ${
                        response
                            ? "bg-blue-500 hover:bg-blue-600 text-white"
                            : "bg-blue-900 cursor-not-allowed"
                    }`}
            >
                <FileText className="w-5 h-5 mr-2" />
                <span className="text-md font-bold">Question Paper</span>
            </button>

            <button
                onClick={() => handleDownload(true)}
                disabled={!response}
                className={`flex items-center justify-center px-4 py-3 rounded w-full mb-4 
                    ${
                        response
                            ? "bg-green-500 hover:bg-green-600 text-white"
                            : "bg-green-900 cursor-not-allowed"
                    }`}
            >
                <FileCheck className="w-5 h-5 mr-2" />
                <span className="text-md font-bold">With Answers</span>
            </button>

            <button
                onClick={handleSendEmail}
                disabled={!response}
                className={`flex items-center justify-center px-4 py-3 rounded w-full mb-4 
                    ${
                        response
                            ? "bg-purple-500 hover:bg-purple-600 text-white"
                            : "bg-purple-900 cursor-not-allowed"
                    }`}
            >
                <Mail className="w-5 h-5 mr-2" />
                <span className="text-md font-bold">Get via Email</span>
            </button>
        </div>
    );
};

export default QuestionActions;
