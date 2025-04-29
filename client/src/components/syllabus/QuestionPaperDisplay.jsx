import React, { useState } from "react";
import { jsPDF } from "jspdf";
import { QuestionSimilarityChecker, SyllabusCoverageAnalyzer } from "./QuestionsAnalysisComponents.jsx";

const EnhancedQuestionPaperDisplay = ({ paper, onDownloadJson }) => {
    const [activeTab, setActiveTab] = useState("paper");

    if (!paper) return null;

    // Helper function to determine question type badge color
    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case "easy":
                return "bg-green-100 text-green-800";
            case "medium":
                return "bg-blue-100 text-blue-800";
            case "hard":
                return "bg-purple-100 text-purple-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    // Helper function to get cognitive level badge color
    const getCognitiveLevelColor = (level) => {
        switch (level) {
            case "remember":
                return "bg-yellow-100 text-yellow-800";
            case "understand":
                return "bg-green-100 text-green-800";
            case "apply":
                return "bg-blue-100 text-blue-800";
            case "analyze":
                return "bg-indigo-100 text-indigo-800";
            case "evaluate":
                return "bg-purple-100 text-purple-800";
            case "create":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    // Function to generate PDF from the paper data
    const generatePdf = () => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 20;
        const contentWidth = pageWidth - 2 * margin;
        let y = 20;

        // Helper function to add text with wrapping
        const addWrappedText = (text, x, yPos, maxWidth, lineHeight = 7) => {
            if (!text) return yPos;

            const lines = doc.splitTextToSize(text, maxWidth);
            doc.text(lines, x, yPos);
            return yPos + lineHeight * lines.length;
        };

        // Add title
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        y = addWrappedText(paper.title, margin, y, contentWidth);
        y += 5;

        // Add paper details
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        y = addWrappedText(`Time Duration: ${paper.time_duration}`, margin, y, contentWidth);
        y = addWrappedText(`Total Marks: ${paper.total_marks}`, margin, y, contentWidth);
        if (paper.metadata && paper.metadata.course_code) {
            y = addWrappedText(`Course: ${paper.metadata.course_code}`, margin, y, contentWidth);
        }
        y += 5;

        // Add instructions
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        y = addWrappedText("Instructions:", margin, y, contentWidth);
        y += 2;

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        paper.instructions.forEach(instruction => {
            y = addWrappedText(`• ${instruction}`, margin, y, contentWidth);
        });
        y += 10;

        // Add sections and questions
        paper.sections.forEach((section, sectionIndex) => {
            // Check if we need a new page (if less than 40 points of space left)
            if (y > doc.internal.pageSize.getHeight() - 40) {
                doc.addPage();
                y = 20;
            }

            // Section title
            doc.setFontSize(14);
            doc.setFont("helvetica", "bold");
            y = addWrappedText(`${section.title} (${section.total_marks} marks)`, margin, y, contentWidth);
            y += 3;

            // Section description if exists
            if (section.description) {
                doc.setFontSize(10);
                doc.setFont("helvetica", "italic");
                y = addWrappedText(section.description, margin, y, contentWidth);
                y += 5;
            } else {
                y += 2;
            }

            // Questions
            doc.setFontSize(11);
            doc.setFont("helvetica", "normal");

            // Get the correct question array based on JSON structure
            const questionArray = section.questions;

            questionArray.forEach((question, questionIndex) => {
                // Check if we need a new page
                if (y > doc.internal.pageSize.getHeight() - 60) {
                    doc.addPage();
                    y = 20;
                }

                // Question number
                doc.setFont("helvetica", "bold");
                const questionNum = `Q${sectionIndex + 1}.${questionIndex + 1}`;

                // Determine mark allocation from different possible fields
                const marks = question.marks_allocated || question.marks || 0;
                const marksText = `[${marks} ${marks === 1 ? 'mark' : 'marks'}]`;

                // Determine question text from different possible fields
                const questionText = question.question_text || question.question || "";

                // Combine question number, text, and marks
                doc.text(`${questionNum} ${marksText}`, margin, y);
                y += 7;

                // Question text
                doc.setFont("helvetica", "normal");
                y = addWrappedText(questionText, margin, y, contentWidth);

                // Add difficulty and cognitive level if available
                if (question.difficulty_level || question.cognitive_level) {
                    y += 3;
                    const metaText = [];
                    if (question.difficulty_level) {
                        metaText.push(`Difficulty: ${question.difficulty_level}`);
                    }
                    if (question.cognitive_level) {
                        metaText.push(`Cognitive Level: ${question.cognitive_level}`);
                    }
                    if (question.estimated_time) {
                        metaText.push(`Estimated Time: ${question.estimated_time}`);
                    }
                    doc.setFontSize(9);
                    doc.setFont("helvetica", "italic");
                    y = addWrappedText(metaText.join(' | '), margin + 5, y, contentWidth - 10);
                }

                // Multiple choice options if any
                if (question.options && Array.isArray(question.options)) {
                    y += 3;
                    question.options.forEach((option, optIndex) => {
                        const optionLetter = String.fromCharCode(65 + optIndex);
                        y = addWrappedText(`${optionLetter}. ${option}`, margin + 5, y, contentWidth - 10);
                    });
                }

                // Add answer space
                y += 5;
                doc.setDrawColor(200, 200, 200);
                doc.setLineWidth(0.1);

                // Draw a light rectangle to represent the answer space
                const spaceHeight = marks > 4 ? 40 : 20; // Higher marks get more space
                doc.rect(margin, y, contentWidth, spaceHeight);

                doc.setFontSize(8);
                doc.setTextColor(150, 150, 150);
                doc.text(marks > 4 ? "Long answer space" : "Short answer space", margin + 5, y + 5);
                doc.setTextColor(0, 0, 0);

                y += spaceHeight + 10;
            });
        });

        // Add page numbers
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(10);
            doc.text(`Page ${i} of ${pageCount}`, pageWidth - 40, doc.internal.pageSize.getHeight() - 10);
        }

        // Save the PDF
        doc.save(`${paper.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`);
    };

    // Function to collect all questions from the paper
    const getAllQuestions = () => {
        if (!paper || !paper.sections) return [];

        const allQuestions = [];
        paper.sections.forEach(section => {
            if (section.questions && Array.isArray(section.questions)) {
                section.questions.forEach(question => {
                    allQuestions.push(question);
                });
            }
        });
        return allQuestions;
    };

    return (
        <div>
            {/* Tabs for different views */}
            <div className="bg-white/40 backdrop-blur-md border border-white/40 p-1 rounded-xl mb-6 flex">
                <button
                    onClick={() => setActiveTab("paper")}
                    className={`flex-1 py-2 rounded-lg ${
                        activeTab === "paper"
                            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                            : "text-gray-700"
                    }`}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 inline-block mr-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                            clipRule="evenodd"
                        />
                    </svg>
                    Question Paper
                </button>
                <button
                    onClick={() => setActiveTab("similarity")}
                    className={`flex-1 py-2 rounded-lg ${
                        activeTab === "similarity"
                            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                            : "text-gray-700"
                    }`}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 inline-block mr-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                            clipRule="evenodd"
                        />
                    </svg>
                    Check Similarity
                </button>
                <button
                    onClick={() => setActiveTab("coverage")}
                    className={`flex-1 py-2 rounded-lg ${
                        activeTab === "coverage"
                            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                            : "text-gray-700"
                    }`}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 inline-block mr-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"
                        />
                        <path
                            fillRule="evenodd"
                            d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                            clipRule="evenodd"
                        />
                    </svg>
                    Syllabus Coverage
                </button>
            </div>

            {activeTab === "paper" && (
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    {/* Paper Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
                        <h1 className="text-2xl font-bold text-white">{paper.title}</h1>
                        <div className="flex flex-wrap gap-4 mt-2 text-white">
                            <div className="flex items-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 mr-1"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <span>{paper.time_duration}</span>
                            </div>
                            <div className="flex items-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 mr-1"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                                </svg>
                                <span>Total: {paper.total_marks} marks</span>
                            </div>
                            {paper.metadata && paper.metadata.course_code && (
                                <div className="flex items-center">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5 mr-1"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                                    </svg>
                                    <span>Course: {paper.metadata.course_code}</span>
                                </div>
                            )}
                        </div>
                    </div>
                    {/* Instructions */}
                    <div className="px-6 py-4 bg-gray-50 border-b">
                        <h2 className="text-lg font-semibold text-gray-800 mb-2">Instructions</h2>
                        <ul className="list-disc pl-5 space-y-1 text-gray-700">
                            {paper.instructions.map((instruction, index) => (
                                <li key={index}>{instruction}</li>
                            ))}
                        </ul>
                    </div>

                    {/* Paper Sections & Questions */}
                    <div className="p-6">
                        {paper.sections.map((section, sectionIndex) => (
                            <div key={sectionIndex} className="mb-8">
                                <div className="flex justify-between items-center border-b border-gray-300 pb-2 mb-4">
                                    <h2 className="text-xl font-semibold text-gray-800">
                                        {section.title}
                                    </h2>
                                    <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                                        {section.total_marks} marks
                                    </span>
                                </div>

                                {section.description && (
                                    <p className="text-gray-600 mb-4 italic">{section.description}</p>
                                )}

                                <div className="space-y-6">
                                    {section.questions.map((question, questionIndex) => {
                                        // Get the question text from different possible field names
                                        const questionText = question.question_text || question.question || "";

                                        // Get marks from different possible field names
                                        const marks = question.marks_allocated || question.marks || 0;

                                        return (
                                            <div
                                                key={questionIndex}
                                                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <h3 className="font-medium text-gray-800">
                                                        Question {sectionIndex + 1}.{questionIndex + 1}
                                                    </h3>
                                                    <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                                        {marks} {marks === 1 ? "mark" : "marks"}
                                                    </span>
                                                </div>

                                                <p className="text-gray-700 mb-3">{questionText}</p>

                                                {/* Display difficulty and cognitive level if available */}
                                                {(question.difficulty_level || question.cognitive_level) && (
                                                    <div className="flex flex-wrap gap-2 mt-3 mb-2">
                                                        {question.difficulty_level && (
                                                            <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getDifficultyColor(question.difficulty_level)}`}>
                                                                {question.difficulty_level.charAt(0).toUpperCase() + question.difficulty_level.slice(1)}
                                                            </span>
                                                        )}
                                                        {question.cognitive_level && (
                                                            <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getCognitiveLevelColor(question.cognitive_level)}`}>
                                                                {question.cognitive_level.charAt(0).toUpperCase() + question.cognitive_level.slice(1)}
                                                            </span>
                                                        )}
                                                        {question.estimated_time && (
                                                            <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-800">
                                                                {question.estimated_time}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Multiple choice questions */}
                                                {question.options && Array.isArray(question.options) && (
                                                    <div className="pl-4 space-y-2 mt-3">
                                                        {question.options.map((option, optIndex) => (
                                                            <div
                                                                key={optIndex}
                                                                className={`flex items-center space-x-2 p-2 rounded-md ${
                                                                    question.correct_answer && option === question.correct_answer
                                                                        ? "bg-green-50 border border-green-200"
                                                                        : "hover:bg-gray-50"
                                                                }`}
                                                            >
                                                                <span className="flex-shrink-0 w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-sm">
                                                                    {String.fromCharCode(65 + optIndex)}
                                                                </span>
                                                                <span className="text-gray-700">{option}</span>
                                                                {question.correct_answer && option === question.correct_answer && (
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        className="h-5 w-5 text-green-500 ml-auto"
                                                                        viewBox="0 0 20 20"
                                                                        fill="currentColor"
                                                                    >
                                                                        <path
                                                                            fillRule="evenodd"
                                                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                                            clipRule="evenodd"
                                                                        />
                                                                    </svg>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                {/* Answer space for non-multiple choice questions */}
                                                {(!question.options || !Array.isArray(question.options)) && (
                                                    <div className={`mt-3 p-3 rounded-md border border-dashed ${
                                                        marks > 4 ? "border-purple-200 bg-purple-50" : "border-blue-200 bg-blue-50"
                                                    }`}>
                                                        <div className="flex items-center text-sm text-gray-500">
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                className="h-5 w-5 mr-1"
                                                                viewBox="0 0 20 20"
                                                                fill="currentColor"
                                                            >
                                                                <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                                                                <path
                                                                    fillRule="evenodd"
                                                                    d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                                                                    clipRule="evenodd"
                                                                />
                                                            </svg>
                                                            <span>
                                                                {marks > 4 ? "Long answer space" : "Short answer space"}
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Paper Footer */}
                    <div className="px-6 py-4 bg-gray-50 border-t flex justify-between items-center">
                        <div className="text-sm text-gray-500">
                            {paper.metadata && paper.metadata.date_created && (
                                <span>Created: {paper.metadata.date_created}</span>
                            )}
                        </div>
                        <div className="flex space-x-3">
                            <button
                                onClick={onDownloadJson}
                                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4 mr-2"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                    />
                                </svg>
                                JSON
                            </button>
                            <button
                                onClick={generatePdf}
                                className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4 mr-2"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                    />
                                </svg>
                                PDF
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Question Similarity Checker Tab */}
            {activeTab === "similarity" && (
                <QuestionSimilarityChecker />
            )}

            {/* Syllabus Coverage Analyzer Tab */}
            {activeTab === "coverage" && (
                <SyllabusCoverageAnalyzer questions={getAllQuestions()} />
            )}
        </div>
    );
};

export default EnhancedQuestionPaperDisplay;