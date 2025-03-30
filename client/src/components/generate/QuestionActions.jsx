import { RefreshCw, FileText, FileCheck, ArrowRight } from "lucide-react";
import { generateQuestionsPDF } from "../../utils/pdfGenerator.js";

const QuestionActions = ({ response, type, onRegenerateClick }) => {
    // Handle PDF download with or without answers
    const handleDownload = (includeAnswers) => {
        if (!response) return;

        // Extract the questions array based on the question type
        let questions = [];

        if (response.questions) {
            // Direct questions array provided (new format)
            questions = response.questions;
        } else {
            // Legacy format handling
            switch (type) {
                case "mcq":
                    if (response.mcqs) {
                        questions = response.mcqs.map((mcq) => ({
                            question: mcq.question,
                            options: mcq.options.map((option) => ({
                                text: option,
                                correct: option === mcq.answer ? "true" : "false",
                            })),
                            answer: mcq.answer,
                            explanation: mcq.explanation,
                            metadata: mcq.metadata || {
                                subject: type,
                                topic: "Topic",
                                subtopic: "Subtopic",
                            },
                            difficulty_level: mcq.difficulty_level || "Medium",
                            blooms_taxanomy: mcq.blooms_taxanomy || "Understanding",
                            course_outcomes: mcq.course_outcomes || "CO1",
                        }));
                    }
                    break;
                case "fib":
                    if (response.fibs) {
                        questions = response.fibs.map((fib) => ({
                            question: fib.sentence,
                            answer: fib.answer,
                            explanation: fib.explanation,
                            metadata: fib.metadata || {
                                subject: type,
                                topic: "Topic",
                                subtopic: "Subtopic",
                            },
                            difficulty_level: fib.difficulty_level || "Medium",
                            blooms_taxanomy: fib.blooms_taxanomy || "Understanding",
                            course_outcomes: fib.course_outcomes || "CO1",
                        }));
                    }
                    break;
                case "short":
                    if (response.short_answers) {
                        questions = response.short_answers.map((item) => ({
                            question: `${item.question}`,
                            model_answer: item.model_answer || item.answer,
                            keywords: item.keywords || [],
                            word_limit: item.word_limit,
                            explanation: item.explanation,
                            marks: item.marks,
                            metadata: item.metadata || {
                                subject: type,
                                topic: "Topic",
                                subtopic: "Subtopic",
                            },
                            difficulty_level: item.difficulty_level || "Medium",
                            blooms_taxanomy: item.blooms_taxanomy || "Understanding",
                            course_outcomes: item.course_outcomes || "CO1",
                        }));
                    }
                    break;
                case "long":
                    if (response.long_answers) {
                        questions = response.long_answers.map((item) => ({
                            question: `${item.question}`,
                            model_answer: item.model_answer || item.answer,
                            subtopics: item.subtopics || [],
                            word_limit: item.word_limit,
                            explanation: item.explanation,
                            marks: item.marks,
                            metadata: item.metadata || {
                                subject: type,
                                topic: "Topic",
                                subtopic: item.metadata?.subtopic || "Subtopic",
                            },
                            difficulty_level: item.difficulty_level || "Medium",
                            blooms_taxanomy: item.blooms_taxanomy || "Understanding",
                            course_outcomes: item.course_outcomes || "CO1",
                        }));
                    }
                    break;
                default:
                    // Default fallback if no question format matches
                    console.error("Unknown question type or no questions found in response");
                    return;
            }
        }

        // Check if we have valid questions to process
        if (!questions || questions.length === 0) {
            console.error("No valid questions found to generate PDF");
            return;
        }

        // Generate the PDF document
        const doc = generateQuestionsPDF(questions, type, includeAnswers);

        // Save the PDF with appropriate filename
        const fileName = `${type}_questions_${
            includeAnswers ? "with_answers_" : ""
        }${new Date().toISOString().split("T")[0]}.pdf`;

        doc.save(fileName);
    };

    return (
        <div className="backdrop-blur-md bg-white/60 rounded-2xl border border-white/40 shadow-xl p-6 md:p-8 h-full flex flex-col">
            <h3 className="text-xl font-semibold mb-6 text-gray-800">Question Paper Actions</h3>

            {!response ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-blue-50/50 rounded-xl border border-blue-100">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                        <FileText className="w-8 h-8 text-blue-500" />
                    </div>
                    <h4 className="text-lg font-medium text-gray-700 mb-2">No Questions Generated Yet</h4>
                    <p className="text-gray-600 mb-4">Complete the form and generate questions to enable these actions</p>
                    <ArrowRight className="w-5 h-5 text-blue-500 animate-bounce" />
                </div>
            ) : (
                <div className="space-y-4 flex-1 flex flex-col">
                    <div className="text-center mb-4 pb-4 border-b border-gray-100">
                        <div className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-2">
                            Ready for Download
                        </div>
                        <p className="text-gray-600 text-sm">
                            {type === "mcq" ? "Multiple Choice Questions" :
                                type === "fib" ? "Fill in the Blanks" :
                                    type === "short" ? "Short Answer Questions" :
                                        "Long Answer Questions"} generated successfully
                        </p>
                    </div>

                    <button
                        onClick={onRegenerateClick}
                        className="relative overflow-hidden group bg-white border border-gray-200 hover:border-blue-300 text-gray-700 hover:text-blue-600 px-4 py-3 rounded-xl transition-all duration-200 flex items-center justify-center shadow-sm hover:shadow-md"
                    >
                        <span className="absolute inset-0 w-0 bg-blue-50 transition-all duration-300 ease-out group-hover:w-full"></span>
                        <RefreshCw className="w-5 h-5 mr-2 relative z-10 group-hover:rotate-180 transition-transform duration-500" />
                        <span className="font-medium relative z-10">Regenerate Questions</span>
                    </button>

                    <div className="flex-1 mt-4">
                        <div className="text-gray-700 text-sm font-medium mb-2">Download Options:</div>

                        <button
                            onClick={() => handleDownload(false)}
                            className="w-full flex items-center justify-between px-5 py-4 mb-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-blue-200/50 hover:-translate-y-0.5 group"
                        >
                            <div className="flex items-center">
                                <FileText className="w-5 h-5 mr-3" />
                                <span className="text-md font-semibold">Question Paper Only</span>
                            </div>
                            <div className="bg-white/20 rounded-full p-1 group-hover:bg-white/30 transition-all">
                                <ArrowRight className="w-4 h-4" />
                            </div>
                        </button>

                        <button
                            onClick={() => handleDownload(true)}
                            className="w-full flex items-center justify-between px-5 py-4 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-purple-200/50 hover:-translate-y-0.5 group"
                        >
                            <div className="flex items-center">
                                <FileCheck className="w-5 h-5 mr-3" />
                                <span className="text-md font-semibold">With Answer Key</span>
                            </div>
                            <div className="bg-white/20 rounded-full p-1 group-hover:bg-white/30 transition-all">
                                <ArrowRight className="w-4 h-4" />
                            </div>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuestionActions;