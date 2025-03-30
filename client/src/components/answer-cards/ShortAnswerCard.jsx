import { AlertCircle, Award, Clock, BookOpen, ListChecks, Tag } from "lucide-react";

export const ShortAnswerCard = ({ question, index }) => {
    return (
        <div className="mb-6 bg-white/90 backdrop-blur-md border border-gray-200 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <div className="p-5 border-b border-gray-100">
                <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-3">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-7 h-7 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                {index + 1}
                            </div>
                            <span className="inline-block px-3 py-1 text-xs rounded-full bg-teal-50 text-teal-700 font-medium">
                                Short Answer
                            </span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800">
                            {question.question}
                        </h3>
                    </div>
                    <div className="flex flex-row sm:flex-col gap-2">
                        <span className="px-3 py-1 font-medium text-xs text-center bg-teal-50 text-teal-700 rounded-full flex items-center">
                            <Award size={12} className="mr-1" /> {question.marks} marks
                        </span>
                        <span className="px-3 py-1 font-medium text-xs text-center bg-blue-50 text-blue-700 rounded-full flex items-center">
                            <Clock size={12} className="mr-1" /> {question.word_limit} words
                        </span>
                    </div>
                </div>
            </div>

            <div className="p-5">
                <div className="space-y-3">
                    <h4 className="font-medium text-gray-700 flex items-center">
                        <BookOpen className="w-4 h-4 mr-2 text-teal-600" />
                        Sample Answer:
                    </h4>
                    <div className="p-4 rounded-lg border border-gray-200 bg-gray-50">
                        <p className="text-gray-700">
                            {/* Use model_answer if available, otherwise fall back to answer */}
                            {question.model_answer || question.answer}
                        </p>
                    </div>
                </div>

                {/* Show keywords if available */}
                {question.keywords && question.keywords.length > 0 && (
                    <div className="mt-5 pt-4 border-t border-gray-100">
                        <div className="flex items-start gap-3">
                            <Tag className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                            <div>
                                <h4 className="font-medium text-gray-800 mb-2">
                                    Key Concepts
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {question.keywords.map((keyword, i) => (
                                        <span key={i} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                                            {keyword}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Show marking scheme if available, otherwise explanation */}
                {(question.marking_scheme && question.marking_scheme.length > 0) ? (
                    <div className="mt-5 pt-4 border-t border-gray-100">
                        <div className="flex items-start gap-3">
                            <ListChecks className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" />
                            <div>
                                <h4 className="font-medium text-gray-800 mb-2">
                                    Marking Scheme
                                </h4>
                                <ul className="text-gray-700 space-y-2 bg-teal-50/50 p-4 rounded-lg border border-teal-100">
                                    {question.marking_scheme.map((point, i) => (
                                        <li key={i} className="flex items-start">
                                            <div className="w-5 h-5 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center text-xs font-bold mr-2 mt-0.5 flex-shrink-0">
                                                {i+1}
                                            </div>
                                            <span>{point}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                ) : question.explanation ? (
                    <div className="mt-5 pt-4 border-t border-gray-100">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                            <div>
                                <h4 className="font-medium text-gray-800 mb-1">
                                    Explanation
                                </h4>
                                <p className="text-gray-700 bg-blue-50/50 p-4 rounded-lg border border-blue-100">{question.explanation}</p>
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
};