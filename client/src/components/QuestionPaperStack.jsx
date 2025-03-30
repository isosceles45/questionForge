import { CheckCircle2, List, FileText, BarChart2 } from "lucide-react";

const QuestionPaperStack = () => {
    return (
        <div className="relative w-full max-w-md mx-auto perspective">
            <div className="question-stack animate-fade-in relative">
                {/* Central/Main Paper - MCQ Question Paper */}
                <div className="z-30 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-80 bg-white rounded-lg shadow-xl overflow-hidden transition-all duration-500 hover:scale-105 hover:rotate-0">
                    <div className="h-10 w-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center px-4">
                        <FileText className="h-5 w-5 text-white mr-2" />
                        <span className="text-white font-medium text-sm">Multiple Choice Questions</span>
                    </div>
                    <div className="p-4">
                        <h3 className="text-sm font-semibold text-gray-800 mb-3">Question 1</h3>
                        <p className="text-xs text-gray-700 mb-4">Which of the following is a characteristic of Big Data?</p>
                        <div className="space-y-2">
                            {["Volume", "Visibility", "Variance", "Vocality"].map((option, i) => (
                                <div key={i} className="flex items-start">
                                    <div className={`h-4 w-4 rounded-full mr-2 flex-shrink-0 border ${i === 0 ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}`}></div>
                                    <span className="text-xs text-gray-600">{option}</span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 border-t border-dashed border-gray-200 pt-3">
                            <h3 className="text-sm font-semibold text-gray-800 mb-2">Question 2</h3>
                            <p className="text-xs text-gray-700">MapReduce is primarily used for:</p>
                        </div>
                    </div>
                    <div className="absolute bottom-4 right-4 bg-blue-100 rounded-full h-8 w-8 flex items-center justify-center">
                        <span className="text-blue-600 text-xs font-bold">1/4</span>
                    </div>
                </div>

                {/* Left Paper - Fill in the Blanks */}
                <div className="z-20 absolute left-0 top-1/2 transform -translate-y-1/2 -rotate-12 w-56 h-72 bg-white/95 rounded-lg shadow-lg overflow-hidden transition-transform duration-700 hover:rotate-0 hover:-translate-x-6">
                    <div className="h-8 w-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center px-3">
                        <List className="h-4 w-4 text-white mr-2" />
                        <span className="text-white font-medium text-xs">Fill in the Blanks</span>
                    </div>
                    <div className="p-4">
                        <div className="space-y-4">
                            <p className="text-xs text-gray-700 leading-relaxed">
                                <span>_____ is a framework that allows for the distributed processing of large data sets across clusters of computers.</span>
                            </p>
                            <p className="text-xs text-gray-700 leading-relaxed">
                                <span>The _____ theorem states that a distributed database system can only guarantee two out of the three: Consistency, Availability, and Partition tolerance.</span>
                            </p>
                            <p className="text-xs text-gray-700 leading-relaxed">
                                <span>In big data, _____ refers to the speed at which new data is generated and the speed at which data moves around.</span>
                            </p>
                        </div>
                        <div className="mt-4 pt-2 border-t border-dotted border-gray-200">
                            <div className="flex items-center">
                                <div className="h-3 w-3 rounded-full bg-purple-400 mr-2"></div>
                                <div className="h-2 w-20 bg-gray-200 rounded"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Paper - Short Answer */}
                <div className="z-10 absolute right-0 top-1/2 transform -translate-y-1/2 rotate-6 w-60 h-76 bg-white/95 rounded-lg shadow-lg overflow-hidden transition-transform duration-700 hover:rotate-0 hover:translate-x-6">
                    <div className="h-8 w-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center px-3">
                        <FileText className="h-4 w-4 text-white mr-2" />
                        <span className="text-white font-medium text-xs">Short Answer Questions</span>
                    </div>
                    <div className="p-4">
                        <h3 className="text-xs font-semibold text-gray-800 mb-2">Question 1 (5 marks)</h3>
                        <p className="text-xs text-gray-700 mb-3">Explain the concept of MapReduce and its significance in Big Data processing.</p>
                        <div className="space-y-1 mb-4">
                            <div className="h-1.5 w-full bg-gray-100 rounded"></div>
                            <div className="h-1.5 w-full bg-gray-100 rounded"></div>
                            <div className="h-1.5 w-4/5 bg-gray-100 rounded"></div>
                        </div>
                        <h3 className="text-xs font-semibold text-gray-800 mb-2">Key Points:</h3>
                        <div className="space-y-2">
                            {["Distributed Processing", "Parallel Computation", "Scalability", "Fault Tolerance"].map((point, i) => (
                                <div key={i} className="flex items-center">
                                    <CheckCircle2 className="h-3 w-3 text-blue-500 mr-2" />
                                    <span className="text-xs text-gray-600">{point}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Paper - Analytics */}
                <div className="z-0 absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-10 w-72 h-24 bg-white/90 rounded-lg shadow-lg overflow-hidden transition-transform duration-700 hover:translate-y-0">
                    <div className="h-6 w-full bg-gradient-to-r from-blue-300 to-purple-400 flex items-center px-3">
                        <BarChart2 className="h-3 w-3 text-white mr-2" />
                        <span className="text-white font-medium text-xs">Assessment Analytics</span>
                    </div>
                    <div className="p-2 flex items-center justify-between">
                        <div className="flex-1">
                            <div className="flex items-end h-12 space-x-1 px-2">
                                <div className="w-3 bg-blue-200 rounded-t" style={{ height: '30%' }}></div>
                                <div className="w-3 bg-blue-300 rounded-t" style={{ height: '50%' }}></div>
                                <div className="w-3 bg-blue-400 rounded-t" style={{ height: '80%' }}></div>
                                <div className="w-3 bg-purple-300 rounded-t" style={{ height: '60%' }}></div>
                                <div className="w-3 bg-purple-400 rounded-t" style={{ height: '90%' }}></div>
                                <div className="w-3 bg-purple-500 rounded-t" style={{ height: '40%' }}></div>
                                <div className="w-3 bg-purple-600 rounded-t" style={{ height: '70%' }}></div>
                            </div>
                            <div className="h-0.5 w-full bg-gray-200"></div>
                        </div>
                        <div className="flex-1 pl-2">
                            <div className="flex justify-around items-center">
                                <div className="h-10 w-10 rounded-full border-4 border-blue-200 flex items-center justify-center">
                                    <span className="text-blue-500 text-xs font-bold">75%</span>
                                </div>
                                <div className="h-10 w-10 rounded-full border-4 border-purple-400 flex items-center justify-center">
                                    <span className="text-purple-600 text-xs font-bold">92%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-10 -left-4 w-10 h-10 bg-gradient-to-br from-blue-300 to-purple-500 rounded-full opacity-60 blur-lg"></div>
                <div className="absolute bottom-16 -right-6 w-12 h-12 bg-gradient-to-tr from-purple-400 to-blue-300 rounded-full opacity-50 blur-lg"></div>
                <div className="absolute bottom-1/3 left-1/4 w-8 h-8 bg-gradient-to-b from-blue-200 to-purple-400 rounded-full opacity-40 blur-md"></div>

                {/* Background glow */}
                <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-100/30 to-purple-50/40 rounded-full blur-3xl transform scale-150"></div>
            </div>
        </div>
    );
};

export default QuestionPaperStack;