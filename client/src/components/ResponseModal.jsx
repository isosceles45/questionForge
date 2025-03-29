import { useState } from "react";
import { X, ChevronDown, ChevronUp } from "lucide-react";
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
        return <p className="text-neutral-400">No questions available</p>;
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
            className="modal-scroll max-w-6xl max-h-[90vh] overflow-y-auto mx-auto mt-10 bg-neutral-900 rounded-lg shadow-lg pl-12 pr-12 pt-8 pb-8 text-neutral-100"
            overlayClassName="fixed inset-0 bg-black bg-opacity-75 flex items-start justify-center pt-10"
        >
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-semibold text-orange-500">
                        {getTitle()}
                    </h2>
                    <p className="text-neutral-400 mt-1">
                        {getQuestionCount()} questions generated
                    </p>
                </div>
                <button
                    className="p-2 hover:bg-neutral-800 rounded-full transition-colors"
                    onClick={onClose}
                >
                    <X className="h-5 w-5 text-neutral-400" />
                </button>
            </div>

            {/* Questions List */}
            <div className="space-y-6">
                {renderQuestions()}
            </div>

            {/* JSON Toggle */}
            <div className="mt-6 pt-6 border-t border-neutral-700">
                <button
                    className="flex items-center text-orange-500 hover:text-orange-400 transition-colors"
                    onClick={() => setShowJSON(!showJSON)}
                >
                    {showJSON ? (
                        <ChevronUp className="h-5 w-5" />
                    ) : (
                        <ChevronDown className="h-5 w-5" />
                    )}
                    <span className="ml-2">
                        {showJSON ? "Hide" : "Show"} Raw JSON Response
                    </span>
                </button>

                {showJSON && (
                    <div className="mt-4">
                        <pre className="bg-neutral-800 text-neutral-300 p-4 rounded-lg overflow-x-auto text-sm">
                            {JSON.stringify(response, null, 2)}
                        </pre>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default ResponseModal;