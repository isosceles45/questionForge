import { AlertCircle, FileText, CheckCircle, Tag } from "lucide-react";

export const FIBCard = ({ question, index }) => {
    return (
        <div className="mb-6 bg-white/90 backdrop-blur-md border border-gray-200 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <div className="p-5 border-b border-gray-100">
                <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-3">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-7 h-7 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                {index + 1}
                            </div>
                            <span className="inline-block px-3 py-1 text-xs rounded-full bg-blue-50 text-blue-700 font-medium">
                                Fill in the Blank
                            </span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800">
                            {question.question}
                        </h3>
                    </div>
                    <div className="flex flex-row sm:flex-col gap-2">
                        <span className="px-3 py-1 text-xs font-medium text-center bg-gray-100 text-gray-700 rounded-full flex items-center">
                            <FileText className="w-3 h-3 mr-1" />
                            {question.metadata.subject}
                        </span>
                        <span className={`px-3 py-1 text-xs font-medium text-center rounded-full flex items-center
                            ${question.difficulty_level.toLowerCase() === 'beginner' ? 'bg-green-50 text-green-700' :
                            question.difficulty_level.toLowerCase() === 'intermediate' ? 'bg-orange-50 text-orange-700' :
                                'bg-red-50 text-red-700'}`}
                        >
                            {question.difficulty_level}
                        </span>
                    </div>
                </div>
            </div>

            <div className="p-5">
                <div className="space-y-3">
                    <h4 className="font-medium text-gray-700 flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                        Answer:
                    </h4>
                    <div className="p-4 rounded-lg border border-green-200 bg-green-50">
                        <span className="text-green-800 font-medium">
                            {question.answer}
                        </span>
                    </div>
                </div>

                {question.explanation && (
                    <div className="mt-5 pt-4 border-t border-gray-100">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                            <div>
                                <h4 className="font-medium text-gray-800 mb-1">
                                    Explanation
                                </h4>
                                <p className="text-gray-700">
                                    {question.explanation}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Metadata */}
                <div className="mt-5 pt-4 border-t border-gray-100">
                    <div className="flex items-center mb-3">
                        <Tag className="w-4 h-4 mr-2 text-gray-500" />
                        <h4 className="text-sm font-medium text-gray-700">Question Metadata</h4>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm bg-gray-50 p-4 rounded-lg">
                        <div className="flex flex-col">
                            <span className="text-gray-500 text-xs">Topic</span>
                            <span className="text-gray-800 font-medium">
                                {question.metadata.topic}
                            </span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-gray-500 text-xs">Subtopic</span>
                            <span className="text-gray-800 font-medium">
                                {question.metadata.subtopic}
                            </span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-gray-500 text-xs">Bloom's Level</span>
                            <span className="text-gray-800 font-medium">
                                {question.blooms_taxanomy}
                            </span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-gray-500 text-xs">Course Outcome</span>
                            <span className="text-gray-800 font-medium">
                                {question.course_outcomes}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};