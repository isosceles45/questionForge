import { useState } from "react";
import { X, ChevronDown, ChevronUp, Info, FileText } from "lucide-react";
import Modal from "react-modal";
import {MCQCard} from "./answer-cards/MCQCard.jsx";
import {FIBCard} from "./answer-cards/FIBCard.jsx";
import {LongAnswerCard} from "./answer-cards/LongAnswerCard.jsx";
import {ShortAnswerCard} from "./answer-cards/ShortAnswerCard.jsx";

Modal.setAppElement("#root");

// Main Modal Component
const ResponseModal = ({ response, onClose, type = "mcq" }) => {
    const [showJSON, setShowJSON] = useState(false);

    // Helper to transform the response format if needed
    const processResponse = () => {
        // If the response already has the expected structure, return it as is
        if ((type === "mcq" && response.mcqs) ||
            (type === "fib" && response.fibs) ||
            (type === "short" && response.short_answers) ||
            (type === "long" && response.long_answers)) {
            return response;
        }

        // If we have a questions array, transform it to the expected format
        if (response.questions) {
            const processedResponse = {};

            switch (type) {
                case "mcq":
                    processedResponse.mcqs = response.questions;
                    break;
                case "fib":
                    processedResponse.fibs = response.questions;
                    break;
                case "short":
                    processedResponse.short_answers = response.questions.map(q => ({
                        question: q.question,
                        answer: q.model_answer || q.answer,
                        model_answer: q.model_answer,
                        word_limit: q.word_limit,
                        marks: q.marks,
                        explanation: q.explanation,
                        keywords: q.keywords,
                        // Only add marking scheme if it exists
                        ...(q.marking_scheme && { marking_scheme: q.marking_scheme })
                    }));
                    break;
                case "long":
                    processedResponse.long_answers = response.questions.map(q => ({
                        question: q.question,
                        answer: q.model_answer || q.answer,
                        model_answer: q.model_answer,
                        word_limit: q.word_limit,
                        marks: q.marks,
                        explanation: q.explanation,
                        keywords: q.keywords,
                        // Only add marking scheme if it exists
                        ...(q.marking_scheme && { marking_scheme: q.marking_scheme })
                    }));
                    break;
            }

            return processedResponse;
        }

        // Return the original response if no transformation is needed
        return response;
    };

    const processedResponse = processResponse();

    const renderQuestions = () => {
        if (type === "mcq" && processedResponse.mcqs) {
            return processedResponse.mcqs.map((question, index) => (
                <MCQCard key={index} question={question} index={index} />
            ));
        } else if (type === "fib" && processedResponse.fibs) {
            return processedResponse.fibs.map((question, index) => (
                <FIBCard key={index} question={question} index={index} />
            ));
        } else if (type === "short" && processedResponse.short_answers) {
            return processedResponse.short_answers.map((question, index) => (
                <ShortAnswerCard key={index} question={question} index={index} />
            ));
        } else if (type === "long" && processedResponse.long_answers) {
            return processedResponse.long_answers.map((question, index) => (
                <LongAnswerCard key={index} question={question} index={index} />
            ));
        }
        return <p className="text-gray-500">No questions available</p>;
    };

    // Get title based on question type
    const getTitle = () => {
        switch (type) {
            case "mcq": return "Multiple Choice Questions";
            case "fib": return "Fill in the Blanks";
            case "short": return "Short Answer Questions";
            case "long": return "Long Answer Questions";
            default: return "Questions";
        }
    };

    // Get icon based on question type
    const getTitleIcon = () => {
        switch (type) {
            case "mcq": return "M";
            case "fib": return "F";
            case "short": return "S";
            case "long": return "L";
            default: return "Q";
        }
    };

    // Count questions based on type
    const getQuestionCount = () => {
        if (type === "mcq" && processedResponse.mcqs) {
            return processedResponse.mcqs.length;
        } else if (type === "fib" && processedResponse.fibs) {
            return processedResponse.fibs.length;
        } else if (type === "short" && processedResponse.short_answers) {
            return processedResponse.short_answers.length;
        } else if (type === "long" && processedResponse.long_answers) {
            return processedResponse.long_answers.length;
        } else if (response.questions) {
            return response.questions.length;
        }
        return 0;
    };

    return (
        <Modal
            isOpen={Boolean(response)}
            onRequestClose={onClose}
            className="modal-scroll max-w-6xl max-h-[90vh] overflow-y-auto mx-auto mt-10 bg-white rounded-2xl shadow-xl border border-gray-100 px-6 py-6 sm:p-8 text-gray-800"
            overlayClassName="fixed inset-0 bg-gray-800/75 backdrop-blur-sm flex items-start justify-center pt-10"
            style={{
                content: {
                    backgroundImage: 'linear-gradient(to bottom right, rgba(239, 246, 255, 0.6), rgba(255, 255, 255, 0.8), rgba(243, 232, 255, 0.6))'
                }
            }}
        >
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
                <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-3 shadow-sm">
                        {getTitleIcon()}
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
                            {getTitle()}
                        </h2>
                        <div className="flex items-center mt-1">
                            <span className="text-gray-500 flex items-center">
                                <FileText className="h-4 w-4 mr-1" />
                                {getQuestionCount()} questions generated
                            </span>
                        </div>
                    </div>
                </div>
                <button
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    onClick={onClose}
                    aria-label="Close modal"
                >
                    <X className="h-5 w-5 text-gray-500" />
                </button>
            </div>

            {/* Questions List */}
            <div className="space-y-6 pb-4">
                {renderQuestions()}
            </div>

            {/* JSON Toggle */}
            <div className="mt-6 pt-4 border-t border-gray-200">
                <button
                    className="flex items-center text-gray-600 hover:text-blue-600 transition-colors py-2 px-3 rounded-lg hover:bg-blue-50"
                    onClick={() => setShowJSON(!showJSON)}
                >
                    {showJSON ? (
                        <ChevronUp className="h-5 w-5" />
                    ) : (
                        <ChevronDown className="h-5 w-5" />
                    )}
                    <span className="ml-2 font-medium">
                        {showJSON ? "Hide" : "Show"} Raw JSON Response
                    </span>
                </button>

                {showJSON && (
                    <div className="mt-4">
                        <div className="flex items-center mb-2 text-gray-500 text-sm">
                            <Info className="h-4 w-4 mr-1" />
                            <span>Raw API response data</span>
                        </div>
                        <pre className="bg-gray-800 text-gray-200 p-4 rounded-lg overflow-x-auto text-sm whitespace-pre-wrap">
                            {JSON.stringify(response, null, 2)}
                        </pre>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default ResponseModal;