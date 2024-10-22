// utils/pdfGenerator.js
import { jsPDF } from "jspdf";

// Define consistent colors
const COLORS = {
    primary: [52, 58, 64], // Header background
    white: [255, 255, 255], // White text
    text: [51, 51, 51], // Main text
    answer: [46, 125, 50], // Answers
    explanation: [69, 90, 100], // Explanations
    metadata: [128, 128, 128], // Metadata and footer
};

export const generateQuestionsPDF = (
    questions,
    type,
    includeAnswers = true
) => {
    const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
    });

    doc.setFont("helvetica");
    const pageWidth = doc.internal.pageSize.width;
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;
    let yPosition = margin;

    // Add header
    doc.setFillColor(...COLORS.primary);
    doc.rect(0, 0, pageWidth, 25, "F");
    doc.setTextColor(...COLORS.white);
    doc.setFontSize(16);
    const title = `${
        type === "mcq" ? "Multiple Choice Questions" : "Fill in the Blanks"
    }${includeAnswers ? "" : " (Question Paper)"}`;
    doc.text(title, margin, 15);

    // Reset text color and move position below header
    doc.setTextColor(...COLORS.text);
    yPosition = 40;

    const splitText = (text, fontSize, maxWidth) => {
        doc.setFontSize(fontSize);
        return doc.splitTextToSize(text, maxWidth);
    };

    const checkAndAddPage = (requiredSpace) => {
        if (yPosition + requiredSpace > doc.internal.pageSize.height - margin) {
            doc.addPage();
            doc.setFillColor(...COLORS.primary);
            doc.rect(0, 0, pageWidth, 15, "F");
            doc.setTextColor(...COLORS.white);
            doc.setFontSize(12);
            doc.text(
                `${type === "mcq" ? "MCQ" : "Fill in the Blanks"} (continued)`,
                margin,
                10
            );
            doc.setTextColor(...COLORS.text);
            yPosition = 25;
            return true;
        }
        return false;
    };

    questions.forEach((question, index) => {
        // Question number
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...COLORS.text);
        doc.text(`Question ${index + 1}`, margin, yPosition);

        // Only show metadata if answers are included
        if (includeAnswers) {
            doc.setFont("helvetica", "normal");
            doc.setFontSize(8);
            doc.setTextColor(...COLORS.metadata);
            doc.text(
                `Difficulty: ${question.difficulty_level} | Bloom's: ${question.blooms_taxanomy} | CO: ${question.course_outcomes}`,
                pageWidth - margin - 70,
                yPosition
            );
        }
        yPosition += 8;

        // Question text
        doc.setTextColor(...COLORS.text);
        doc.setFontSize(11);
        const questionLines = splitText(question.question, 11, contentWidth);
        checkAndAddPage(questionLines.length * 6 + 20);
        doc.text(questionLines, margin, yPosition);
        yPosition += questionLines.length * 6 + 5;

        if (type === "mcq") {
            // Options
            doc.setFontSize(10);
            doc.setTextColor(...COLORS.text);
            question.options.forEach((option, optIndex) => {
                checkAndAddPage(8);
                const optionLetter = String.fromCharCode(
                    97 + optIndex
                ).toUpperCase();
                const optionText = splitText(
                    `${optionLetter}) ${option.text}`,
                    10,
                    contentWidth - 10
                );
                doc.text(optionText, margin + 5, yPosition);
                yPosition += optionText.length * 5 + 3;
            });

            // Correct Answer - only if includeAnswers is true
            if (includeAnswers) {
                checkAndAddPage(15);
                doc.setFontSize(10);
                doc.setTextColor(...COLORS.answer);
                doc.setFont("helvetica", "bold");
                const correctOption = question.options.find(
                    (opt) => opt.correct === "true"
                );
                doc.text(
                    `Correct Answer: ${correctOption.text}`,
                    margin,
                    yPosition
                );
                yPosition += 7;
            }
        } else {
            // Fill in the blank answer - only if includeAnswers is true
            if (includeAnswers) {
                checkAndAddPage(15);
                doc.setFontSize(10);
                doc.setTextColor(...COLORS.answer);
                doc.setFont("helvetica", "bold");
                doc.text(`Answer: ${question.answer}`, margin, yPosition);
                yPosition += 7;
            }
        }

        // Explanation - only if includeAnswers is true
        if (includeAnswers) {
            checkAndAddPage(20);
            doc.setFontSize(9);
            doc.setTextColor(...COLORS.explanation);
            const explanationLines = splitText(
                `Explanation: ${question.explanation}`,
                9,
                contentWidth
            );
            doc.text(explanationLines, margin, yPosition);
            yPosition += explanationLines.length * 4 + 7;

            // Metadata
            doc.setFontSize(8);
            doc.setTextColor(...COLORS.metadata);
            doc.text(
                `Topic: ${question.metadata.topic} | Subtopic: ${question.metadata.subtopic}`,
                margin,
                yPosition
            );
        }
        yPosition += 15;

        // Add separator line
        if (index < questions.length - 1) {
            checkAndAddPage(10);
            doc.setDrawColor(...COLORS.metadata);
            doc.line(margin, yPosition - 7, pageWidth - margin, yPosition - 7);
        }
    });

    // Add footer with date and page numbers
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(...COLORS.metadata);
        const date = new Date().toLocaleDateString();
        doc.text(
            `Generated on: ${date}`,
            margin,
            doc.internal.pageSize.height - 10
        );
        doc.text(
            `Page ${i} of ${totalPages}`,
            pageWidth - margin - 20,
            doc.internal.pageSize.height - 10
        );
    }

    return doc;
};
