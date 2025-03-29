import {AlertCircle} from "lucide-react";

export const FIBCard = ({ question, index }) => {
    return (
        <div className="mb-6 bg-neutral-800/50 border border-neutral-700 rounded-lg overflow-hidden">
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

            <div className="p-4">
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

                {question.explanation && (
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
                )}

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