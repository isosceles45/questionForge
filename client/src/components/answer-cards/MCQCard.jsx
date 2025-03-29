import { AlertCircle } from "lucide-react";

export const MCQCard = ({ question, index }) => {
    // Determine if options is an array of strings or objects with text and correct properties
    const hasStructuredOptions = question.options &&
        question.options.length > 0 &&
        typeof question.options[0] === 'object' &&
        'text' in question.options[0];

    // Find the correct answer if we have structured options
    const correctAnswer = hasStructuredOptions
        ? question.options.find(opt => opt.correct === "true")?.text
        : question.answer;

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
                </div>
            </div>

            <div className="p-4">
                <div className="space-y-3">
                    <h4 className="font-medium text-neutral-300">
                        Options:
                    </h4>
                    <div className="grid gap-2">
                        {hasStructuredOptions
                            ? question.options.map((option, idx) => (
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
                            ))
                            : question.options.map((option, idx) => (
                                <div
                                    key={idx}
                                    className={`p-3 rounded-lg border ${
                                        option === correctAnswer
                                            ? "border-green-500 bg-green-500/10"
                                            : "border-neutral-600 bg-neutral-700/50"
                                    }`}
                                >
                                    <span className="font-medium">
                                        {String.fromCharCode(65 + idx)}.{" "}
                                    </span>
                                    <span
                                        className={
                                            option === correctAnswer
                                                ? "text-green-400"
                                                : "text-neutral-300"
                                        }
                                    >
                                        {option}
                                    </span>
                                </div>
                            ))
                        }
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
            </div>
        </div>
    );
};