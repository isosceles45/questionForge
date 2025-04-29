import React, { useState } from "react";
import ReactMarkdown from "react-markdown";

export const QuestionSimilarityChecker = () => {
    const [question, setQuestion] = useState("");
    const [similarityResult, setSimilarityResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const checkSimilarity = async () => {
        if (!question.trim()) {
            setError("Please enter a question to check");
            return;
        }

        setLoading(true);
        setError("");
        setSimilarityResult(null);

        try {
            const response = await fetch("http://localhost:8000/check/question_similarity", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    question: question,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to check question similarity");
            }

            const data = await response.json();
            setSimilarityResult(data);
        } catch (err) {
            setError(err.message || "Error checking similarity");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
            <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600">
                <h3 className="text-lg font-semibold text-white">
                    Question Similarity Checker
                </h3>
            </div>
            <div className="p-6">
                <div className="mb-4">
                    <label
                        htmlFor="question-input"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Enter a question to check similarity with past papers
                    </label>
                    <textarea
                        id="question-input"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="e.g., Explain the concept of temporal-difference learning in reinforcement learning."
                        rows={3}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white/70"
                    />
                </div>

                <button
                    onClick={checkSimilarity}
                    disabled={loading || !question.trim()}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center disabled:opacity-50"
                >
                    {loading ? (
                        <>
                            <svg
                                className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                            Checking...
                        </>
                    ) : (
                        "Check Similarity"
                    )}
                </button>

                {error && (
                    <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg">
                        <p className="font-medium">Error</p>
                        <p>{error}</p>
                    </div>
                )}

                {similarityResult && (
                    <div className="mt-4">
                        <div className={`p-4 rounded-lg ${
                            similarityResult.result.includes("SIMILAR")
                                ? "bg-yellow-50 border border-yellow-200"
                                : "bg-green-50 border border-green-200"
                        }`}>
                            <div className="flex items-center">
                <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full mr-3 ${
                    similarityResult.result.includes("SIMILAR")
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                }`}>
                  {similarityResult.result.includes("SIMILAR") ? "!" : "✓"}
                </span>
                                <span className="font-medium">
                  {similarityResult.result.includes("SIMILAR")
                      ? "Similar to existing questions"
                      : "Unique question"}
                </span>
                            </div>
                            <div className="mt-3 prose prose-sm max-w-none">
                                <ReactMarkdown>{similarityResult.result}</ReactMarkdown>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export const SyllabusCoverageAnalyzer = ({ questions = [] }) => {
    const [coverageResult, setCoverageResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const analyzeCoverage = async () => {
        if (!questions.length) {
            setError("No questions available to analyze");
            return;
        }

        setLoading(true);
        setError("");
        setCoverageResult(null);

        try {
            // Extract question text from different possible formats
            const questionTexts = questions.map(q => {
                if (typeof q === 'string') return q;
                return q.question_text || q.question || "";
            }).filter(q => q.trim());

            const response = await fetch("http://localhost:8000/analyze/syllabus_coverage", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    questions: questionTexts,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to analyze syllabus coverage");
            }

            const data = await response.json();
            setCoverageResult(data);
        } catch (err) {
            setError(err.message || "Error analyzing coverage");
        } finally {
            setLoading(false);
        }
    };

    // Extract percentage from coverage analysis text
    const extractCoveragePercentage = (text) => {
        if (!text) return null;
        const match = text.match(/(\d+)%/);
        return match ? parseInt(match[1]) : null;
    };

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
            <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600">
                <h3 className="text-lg font-semibold text-white">
                    Syllabus Coverage Analysis
                </h3>
            </div>
            <div className="p-6">
                <div className="mb-4">
                    <p className="text-gray-700">
                        Analyze how well the current set of questions covers the course syllabus.
                    </p>
                    <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-800">
                            <span className="font-medium">Questions to analyze:</span> {questions.length}
                        </p>
                    </div>
                </div>

                <button
                    onClick={analyzeCoverage}
                    disabled={loading || !questions.length}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center disabled:opacity-50"
                >
                    {loading ? (
                        <>
                            <svg
                                className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                            Analyzing...
                        </>
                    ) : (
                        "Analyze Coverage"
                    )}
                </button>

                {error && (
                    <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg">
                        <p className="font-medium">Error</p>
                        <p>{error}</p>
                    </div>
                )}

                {coverageResult && (
                    <div className="mt-6">
                        <div className="mb-4">
                            <h4 className="font-medium text-gray-800 mb-2">Coverage Summary</h4>

                            {/* Coverage percentage indicator */}
                            {(() => {
                                const percentage = extractCoveragePercentage(coverageResult.coverage_analysis);
                                const getColorClass = (pct) => {
                                    if (pct >= 80) return "bg-green-500";
                                    if (pct >= 60) return "bg-yellow-500";
                                    return "bg-red-500";
                                };

                                return percentage ? (
                                    <div className="mb-4">
                                        <div className="flex justify-between mb-1">
                                            <span className="text-sm font-medium text-gray-700">Syllabus Coverage</span>
                                            <span className="text-sm font-medium text-gray-700">{percentage}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                                            <div
                                                className={`h-2.5 rounded-full ${getColorClass(percentage)}`}
                                                style={{ width: `${percentage}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ) : null;
                            })()}

                            {/* Analysis Sections */}
                            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                                <div className="divide-y divide-gray-200">
                                    <details className="group">
                                        <summary className="flex items-center justify-between p-4 cursor-pointer bg-gray-50 hover:bg-gray-100">
                                            <h5 className="font-medium text-gray-900">
                                                Detailed Analysis
                                            </h5>
                                            <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </summary>
                                        <div className="p-4 prose prose-sm max-w-none">
                                            <ReactMarkdown>{coverageResult.coverage_analysis}</ReactMarkdown>
                                        </div>
                                    </details>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default { QuestionSimilarityChecker, SyllabusCoverageAnalyzer };