import React, { useState } from "react";
import { X, ChevronDown, ChevronUp, AlertCircle } from "lucide-react";
import Modal from "react-modal";

Modal.setAppElement("#root");

const QuestionCard = ({ question, index }) => {
    const isMCQ = Boolean(question.options);

    return (
        <div className="mb-6 bg-neutral-800/50 border border-neutral-700 rounded-lg overflow-hidden">
            {/* Question Header */}
            <div className="p-4 border-b border-neutral-700">
                <div className="flex justify-between items-start">
                    <div>
                        <span className="inline-block px-2 py-1 text-xs rounded-full border border-orange-500 text-orange-500 mb-2">
                            Question {index + 1}
                        </span>
                        <h3 className="text-lg font-semibold text-neutral-100">
                            {question.question}
                        </h3>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="px-3 py-2 mb-2 font-medium text-xs text-center bg-neutral-600 rounded-full">
                            {question.metadata.subject}
                        </span>
                        <span className="px-3 py-2 font-medium text-xs text-center bg-neutral-700 rounded-full">
                            {question.difficulty_level}
                        </span>
                    </div>
                </div>
            </div>

            {/* Question Content */}
            <div className="p-4">
                {isMCQ ? (
                    // MCQ Options
                    <div className="space-y-3">
                        <h4 className="font-medium text-neutral-300">
                            Options:
                        </h4>
                        <div className="grid gap-2">
                            {question.options.map((option, idx) => (
                                <div
                                    key={idx}
                                    className={`p-3 rounded-lg border ${
                                        option.correct === "true"
                                            ? "border-green-500 bg-green-500/10"
                                            : "border-neutral-600 bg-neutral-700/50"
                                    }`}
                                >
                                    <span className="font-medium">
                                        {String.fromCharCode(65 + idx)}.{" "}
                                    </span>
                                    <span
                                        className={
                                            option.correct === "true"
                                                ? "text-green-400"
                                                : "text-neutral-300"
                                        }
                                    >
                                        {option.text}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    // Fill in the blanks
                    <div className="space-y-3">
                        <h4 className="font-medium text-neutral-300">
                            Answer:
                        </h4>
                        <div className="p-3 rounded-lg border border-green-500 bg-green-500/10">
                            <span className="text-green-400">
                                {question.answer}
                            </span>
                        </div>
                    </div>
                )}

                {/* Explanation */}
                <div className="mt-4 pt-4 border-t border-neutral-700">
                    <div className="flex items-start gap-2">
                        <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5" />
                        <div>
                            <h4 className="font-medium text-orange-500 mb-1">
                                Explanation
                            </h4>
                            <p className="text-neutral-300">
                                {question.explanation}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Metadata */}
                <div className="mt-4 pt-4 border-t border-neutral-700">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="text-neutral-500">Topic:</span>{" "}
                            <span className="text-neutral-300">
                                {question.metadata.topic}
                            </span>
                        </div>
                        <div>
                            <span className="text-neutral-500">Subtopic:</span>{" "}
                            <span className="text-neutral-300">
                                {question.metadata.subtopic}
                            </span>
                        </div>
                        <div>
                            <span className="text-neutral-500">
                                Bloom's Level:
                            </span>{" "}
                            <span className="text-neutral-300">
                                {question.blooms_taxanomy}
                            </span>
                        </div>
                        <div>
                            <span className="text-neutral-500">
                                Course Outcome:
                            </span>{" "}
                            <span className="text-neutral-300">
                                {question.course_outcomes}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ResponseModal = ({ response, onClose }) => {
    const [showJSON, setShowJSON] = useState(false);

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
                        Generated Questions
                    </h2>
                    <p className="text-neutral-400 mt-1">
                        {response?.questions?.length || 0} questions generated
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
                {response?.questions?.map((question, index) => (
                    <QuestionCard
                        key={index}
                        question={question}
                        index={index}
                    />
                ))}
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
