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

// Helper function to get title based on question type
const getQuestionTypeTitle = (type) => {
    switch (type) {
        case "mcq": return "Multiple Choice Questions";
        case "fib": return "Fill in the Blanks";
        case "short": return "Short Answer Questions";
        case "long": return "Long Answer Questions";
        default: return "Questions";
    }
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
    const title = `${getQuestionTypeTitle(type)}${includeAnswers ? " (With Answers)" : ""}`;
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
                `${getQuestionTypeTitle(type)} (continued)`,
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

            // Format the metadata information
            const metadataText = `Difficulty: ${question.difficulty_level || 'N/A'} | Bloom's: ${question.blooms_taxanomy || 'N/A'} | CO: ${question.course_outcomes || 'N/A'}`;

            doc.text(
                metadataText,
                pageWidth - margin - 80,
                yPosition
            );
        }
        yPosition += 8;

        // Question text
        doc.setTextColor(...COLORS.text);
        doc.setFontSize(11);
        doc.setFont("helvetica", "normal");
        const questionLines = splitText(question.question, 11, contentWidth);
        checkAndAddPage(questionLines.length * 6 + 20);
        doc.text(questionLines, margin, yPosition);
        yPosition += questionLines.length * 6 + 5;

        // Handle different question types
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
                if (correctOption) {
                    doc.text(
                        `Correct Answer: ${correctOption.text}`,
                        margin,
                        yPosition
                    );
                }
                yPosition += 7;
            }
        } else if (type === "fib") {
            // Fill in the blank answer - only if includeAnswers is true
            if (includeAnswers) {
                checkAndAddPage(15);
                doc.setFontSize(10);
                doc.setTextColor(...COLORS.answer);
                doc.setFont("helvetica", "bold");
                doc.text(`Answer: ${question.answer}`, margin, yPosition);
                yPosition += 7;
            }
        } else if (type === "short" || type === "long") {
            // Show model answer for short/long questions - only if includeAnswers is true
            if (includeAnswers && question.model_answer) {
                checkAndAddPage(15);
                doc.setFontSize(10);
                doc.setTextColor(...COLORS.answer);
                doc.setFont("helvetica", "bold");
                doc.text("Model Answer:", margin, yPosition);
                yPosition += 7;

                doc.setFont("helvetica", "normal");
                const answerLines = splitText(question.model_answer, 10, contentWidth);
                doc.text(answerLines, margin, yPosition);
                yPosition += answerLines.length * 5 + 7;

                // Show keywords if available
                if (question.keywords && question.keywords.length > 0) {
                    doc.setFont("helvetica", "bold");
                    doc.text("Key Points:", margin, yPosition);
                    yPosition += 5;

                    doc.setFont("helvetica", "normal");
                    const keywordsText = question.keywords.join(", ");
                    const keywordLines = splitText(keywordsText, 10, contentWidth);
                    doc.text(keywordLines, margin, yPosition);
                    yPosition += keywordLines.length * 5 + 5;
                }

                // Show subtopics if available (for long questions)
                if (question.subtopics && question.subtopics.length > 0) {
                    doc.setFont("helvetica", "bold");
                    doc.text("Expected Subtopics:", margin, yPosition);
                    yPosition += 5;

                    doc.setFont("helvetica", "normal");
                    question.subtopics.forEach((subtopic, subIndex) => {
                        const subtopicText = splitText(`${subIndex + 1}. ${subtopic}`, 10, contentWidth - 5);
                        doc.text(subtopicText, margin + 5, yPosition);
                        yPosition += subtopicText.length * 5 + 3;
                    });
                    yPosition += 2;
                }
            }
        }

        // Explanation - only if includeAnswers is true
        if (includeAnswers && question.explanation) {
            checkAndAddPage(20);
            doc.setFontSize(9);
            doc.setTextColor(...COLORS.explanation);
            doc.setFont("helvetica", "italic");
            const explanationLines = splitText(
                `Explanation: ${question.explanation}`,
                9,
                contentWidth
            );
            doc.text(explanationLines, margin, yPosition);
            yPosition += explanationLines.length * 4 + 7;
        }

        // Marks and word limit for short/long questions
        if ((type === "short" || type === "long") && question.marks) {
            doc.setFontSize(9);
            doc.setTextColor(...COLORS.text);
            doc.setFont("helvetica", "bold");
            doc.text(
                `Marks: ${question.marks}${question.word_limit ? ` | Word Limit: ${question.word_limit} words` : ""}`,
                margin,
                yPosition
            );
            yPosition += 7;
        }

        // Metadata
        if (includeAnswers && question.metadata) {
            doc.setFontSize(8);
            doc.setTextColor(...COLORS.metadata);
            doc.setFont("helvetica", "normal");

            let metadataText = "";
            if (question.metadata.topic) {
                metadataText += `Topic: ${question.metadata.topic}`;
            }

            if (question.metadata.subtopic) {
                const subtopicValue = Array.isArray(question.metadata.subtopic)
                    ? question.metadata.subtopic.join(", ")
                    : question.metadata.subtopic;

                if (metadataText) metadataText += " | ";
                metadataText += `Subtopic: ${subtopicValue}`;
            }

            if (metadataText) {
                doc.text(metadataText, margin, yPosition);
                yPosition += 5;
            }
        }

        yPosition += 10;

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