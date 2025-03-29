import { RefreshCw, FileText, FileCheck } from "lucide-react";
import { generateQuestionsPDF } from "../utils/pdfGenerator";

const QuestionActions = ({ response, type, onRegenerateClick }) => {
    // Handle PDF download with or without answers
    const handleDownload = (includeAnswers) => {
        if (!response) return;

        // Determine which data to use based on question type
        let questions;
        if (type === "mcq" && response.mcqs) {
            // Map MCQs to the expected format for PDF generator
            questions = response.mcqs.map((mcq, index) => ({
                question: mcq.question,
                options: mcq.options.map(option => ({
                    text: option,
                    correct: option === mcq.answer ? "true" : "false"
                })),
                answer: mcq.answer,
                explanation: mcq.explanation,
                metadata: {
                    subject: type,
                    topic: "Topic",
                    subtopic: "Subtopic"
                },
                difficulty_level: "Medium",
                blooms_taxanomy: "Understanding",
                course_outcomes: "CO1"
            }));
        } else if (type === "fib" && response.fibs) {
            // Map FIBs to the expected format for PDF generator
            questions = response.fibs.map((fib, index) => ({
                question: fib.sentence,
                answer: fib.answer,
                explanation: fib.explanation,
                metadata: {
                    subject: type,
                    topic: "Topic",
                    subtopic: "Subtopic"
                },
                difficulty_level: "Medium",
                blooms_taxanomy: "Understanding",
                course_outcomes: "CO1"
            }));
        } else if (type === "short" && response.short_answers) {
            // Map short answers to the expected format for PDF generator
            questions = response.short_answers.map((item, index) => ({
                question: `${item.question} [${item.marks} marks, Word limit: ${item.word_limit} words]`,
                answer: item.answer,
                explanation: item.marking_scheme ? `Marking Scheme: ${item.marking_scheme.join(", ")}` : "",
                metadata: {
                    subject: type,
                    topic: "Topic",
                    subtopic: "Subtopic"
                },
                difficulty_level: "Medium",
                blooms_taxanomy: "Understanding",
                course_outcomes: "CO1"
            }));
        } else if (type === "long" && response.long_answers) {
            // Map long answers to the expected format for PDF generator
            questions = response.long_answers.map((item, index) => ({
                question: `${item.question} [${item.marks} marks, Word limit: ${item.word_limit} words]`,
                answer: item.answer,
                explanation: item.marking_scheme ? `Marking Scheme: ${item.marking_scheme.join(", ")}` : "",
                metadata: {
                    subject: type,
                    topic: "Topic",
                    subtopic: "Subtopic"
                },
                difficulty_level: "Medium",
                blooms_taxanomy: "Understanding",
                course_outcomes: "CO1"
            }));
        } else {
            // Fallback for any other response format
            return;
        }

        // Create a questions wrapper object to match the expected format
        const formattedResponse = { questions };

        const doc = generateQuestionsPDF(
            formattedResponse.questions,
            type,
            includeAnswers
        );

        const fileName = `${type}_questions_${
            includeAnswers ? "with_answers_" : ""
        }${new Date().toISOString().split("T")[0]}.pdf`;

        doc.save(fileName);
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
        </div>
    );
};

export default QuestionActions;