import { AlertCircle, CheckCircle, HelpCircle, List } from "lucide-react";

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
        <div className="mb-6 bg-white/90 backdrop-blur-md border border-gray-200 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <div className="p-5 border-b border-gray-100">
                <div className="flex items-start">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-7 h-7 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                {index + 1}
                            </div>
                            <span className="inline-block px-3 py-1 text-xs rounded-full bg-indigo-50 text-indigo-700 font-medium">
                                Multiple Choice
                            </span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800">
                            {question.question}
                        </h3>
                    </div>
                </div>
            </div>

            <div className="p-5">
                <div className="space-y-4">
                    <h4 className="font-medium text-gray-700 flex items-center">
                        <List className="w-4 h-4 mr-2 text-indigo-600" />
                        Options:
                    </h4>
                    <div className="grid gap-3">
                        {hasStructuredOptions
                            ? question.options.map((option, idx) => (
                                <div
                                    key={idx}
                                    className={`p-4 rounded-lg border flex items-start ${
                                        option.correct === "true"
                                            ? "border-green-300 bg-green-50"
                                            : "border-gray-200 bg-gray-50"
                                    }`}
                                >
                                    <div className={`w-6 h-6 rounded-full mr-3 flex items-center justify-center flex-shrink-0 ${
                                        option.correct === "true"
                                            ? "bg-green-100 text-green-600 border border-green-300"
                                            : "bg-gray-100 text-gray-500 border border-gray-300"
                                    }`}>
                                        {String.fromCharCode(65 + idx)}
                                    </div>
                                    <div className="flex-1">
                                        <span
                                            className={
                                                option.correct === "true"
                                                    ? "text-green-800 font-medium"
                                                    : "text-gray-700"
                                            }
                                        >
                                            {option.text}
                                        </span>
                                        {option.correct === "true" && (
                                            <div className="flex items-center mt-2 text-green-600 text-sm">
                                                <CheckCircle className="w-4 h-4 mr-1.5" />
                                                Correct answer
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                            : question.options.map((option, idx) => (
                                <div
                                    key={idx}
                                    className={`p-4 rounded-lg border flex items-start ${
                                        option === correctAnswer
                                            ? "border-green-300 bg-green-50"
                                            : "border-gray-200 bg-gray-50"
                                    }`}
                                >
                                    <div className={`w-6 h-6 rounded-full mr-3 flex items-center justify-center flex-shrink-0 ${
                                        option === correctAnswer
                                            ? "bg-green-100 text-green-600 border border-green-300"
                                            : "bg-gray-100 text-gray-500 border border-gray-300"
                                    }`}>
                                        {String.fromCharCode(65 + idx)}
                                    </div>
                                    <div className="flex-1">
                                        <span
                                            className={
                                                option === correctAnswer
                                                    ? "text-green-800 font-medium"
                                                    : "text-gray-700"
                                            }
                                        >
                                            {option}
                                        </span>
                                        {option === correctAnswer && (
                                            <div className="flex items-center mt-2 text-green-600 text-sm">
                                                <CheckCircle className="w-4 h-4 mr-1.5" />
                                                Correct answer
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>

                {question.explanation && (
                    <div className="mt-5 pt-4 border-t border-gray-100">
                        <div className="flex items-start gap-3">
                            <HelpCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                            <div>
                                <h4 className="font-medium text-gray-800 mb-2">
                                    Explanation
                                </h4>
                                <p className="text-gray-700 bg-blue-50/50 p-4 rounded-lg border border-blue-100">
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