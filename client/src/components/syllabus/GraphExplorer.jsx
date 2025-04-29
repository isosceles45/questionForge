import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import QuestionPaperDisplay from "./QuestionPaperDisplay";

const GraphExplorer = () => {
  const [query, setQuery] = useState("");
  const [queryResult, setQueryResult] = useState("");
  const [totalMarks, setTotalMarks] = useState(60);
  const [numSections, setNumSections] = useState(3);
  const [sectionDistribution, setSectionDistribution] = useState([]);
  const [totalQuestions, setTotalQuestions] = useState(null);
  const [paperResult, setPaperResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paperLoading, setPaperLoading] = useState(false);
  const [error, setError] = useState("");
  const [mode, setMode] = useState("global");
  const [activeTab, setActiveTab] = useState("visualize");
  const [customDistribution, setCustomDistribution] = useState(false);
  const iframeRef = useRef(null);

  // Initialize section distribution when total marks or num sections change
  useEffect(() => {
    if (!customDistribution) {
      const baseMarks = Math.floor(totalMarks / numSections);
      const remainder = totalMarks % numSections;

      const newDistribution = Array(numSections).fill(baseMarks);

      // Distribute the remainder
      for (let i = 0; i < remainder; i++) {
        newDistribution[i] += 1;
      }

      setSectionDistribution(newDistribution);
    }
  }, [totalMarks, numSections, customDistribution]);

  useEffect(() => {
    // If the iframe is refreshed, we need to make sure it's pointing to the correct URL
    if (iframeRef.current) {
      iframeRef.current.src = "http://localhost:11236/graph_visualization.html";
    }
  }, []);

  const handleQuery = async () => {
    if (!query.trim()) {
      setError("Please enter a query");
      return;
    }

    setLoading(true);
    setError("");
    setQueryResult("");

    try {
      const response = await fetch("http://localhost:8000/graph/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: query,
          mode: mode,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to process query");
      }

      const data = await response.json();
      setQueryResult(data.result);
    } catch (err) {
      setError(err.message || "Error processing query");
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePaper = async () => {
    setPaperLoading(true);
    setError("");
    setPaperResult(null);

    try {
      // Validate section distribution
      if (customDistribution && sectionDistribution.reduce((sum, marks) => sum + marks, 0) !== totalMarks) {
        throw new Error("Section marks must add up to total marks");
      }

      const response = await fetch("http://localhost:8000/generate/paper", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          total_marks: totalMarks,
          num_sections: numSections,
          section_distribution: sectionDistribution,
          total_questions: totalQuestions || undefined
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to generate paper");
      }

      const data = await response.json();
      setPaperResult(data);
    } catch (err) {
      setError(err.message || "Error generating paper");
    } finally {
      setPaperLoading(false);
    }
  };

  const handleSectionMarkChange = (index, value) => {
    const newDistribution = [...sectionDistribution];
    newDistribution[index] = parseInt(value, 10) || 0;
    setSectionDistribution(newDistribution);
  };

  const handleDownloadJson = () => {
    if (!paperResult) return;

    const blob = new Blob([JSON.stringify(paperResult, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `QuestionPaper_${totalMarks}Marks.json`;
    a.click();
  };

  const handleDownloadPdf = () => {
    // In a real app, you would generate a PDF here
    // For now, we'll just alert the user
    alert("PDF generation would be implemented here in production.");
  };

  const SampleQueries = [
    {
      title: "Main Topics",
      query: "What are the main topics covered in the syllabus?",
    },
    {
      title: "Concept Explanation",
      query:
          "Explain the concept of reinforcement learning and its importance.",
    },
    {
      title: "Question Suggestion",
      query:
          "Suggest a challenging question about algorithms that would be suitable for a mid-term exam.",
    },
    {
      title: "Paper Analysis",
      query: "What types of questions were asked in previous exams?",
    },
  ];

  return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 text-gray-800 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Knowledge Graph Explorer
          </h1>

          <div className="bg-white/40 backdrop-blur-md border border-white/40 p-1 rounded-xl mb-6 flex max-w-4xl mx-auto">
            <button
                onClick={() => setActiveTab("visualize")}
                className={`flex-1 py-3 rounded-lg ${
                    activeTab === "visualize"
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                        : "text-gray-700"
                }`}
            >
              <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 inline-block mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
              >
                <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z" />
                <path d="M9 13h2v5a1 1 0 11-2 0v-5z" />
              </svg>
              Visualize Graph
            </button>
            <button
                onClick={() => setActiveTab("query")}
                className={`flex-1 py-3 rounded-lg ${
                    activeTab === "query"
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                        : "text-gray-700"
                }`}
            >
              <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 inline-block mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
              >
                <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                />
              </svg>
              Query Graph
            </button>
            <button
                onClick={() => setActiveTab("paper")}
                className={`flex-1 py-3 rounded-lg ${
                    activeTab === "paper"
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                        : "text-gray-700"
                }`}
            >
              <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 inline-block mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
              >
                <path
                    fillRule="evenodd"
                    d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                    clipRule="evenodd"
                />
              </svg>
              Generate Paper
            </button>
          </div>

          <div className="max-w-6xl mx-auto">
            {activeTab === "visualize" && (
                <div className="bg-white/60 backdrop-blur-md border border-white/40 rounded-2xl shadow-xl p-6">
                  <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Knowledge Graph Visualization
                  </h2>
                  <div
                      className="w-full bg-gray-100 rounded-xl overflow-hidden shadow-inner"
                      style={{ height: "600px" }}
                  >
                    <iframe
                        ref={iframeRef}
                        src="http://localhost:11236/graph_visualization.html"
                        title="Knowledge Graph Visualization"
                        className="w-full h-full border-0"
                    />
                  </div>
                  <div className="mt-4 text-gray-600 text-sm italic">
                    <p>
                      This visualization shows the relationships between topics,
                      concepts, and questions in your knowledge graph.
                    </p>
                  </div>
                </div>
            )}

            {activeTab === "query" && (
                <div className="bg-white/60 backdrop-blur-md border border-white/40 rounded-2xl shadow-xl p-6">
                  <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Query Knowledge Graph
                  </h2>

                  <div className="mb-8">
                    <h3 className="text-lg font-medium text-gray-700 mb-2">
                      Sample Queries
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {SampleQueries.map((sampleQuery, index) => (
                          <button
                              key={index}
                              onClick={() => setQuery(sampleQuery.query)}
                              className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-sm transition-colors"
                          >
                            {sampleQuery.title}
                          </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Search Mode
                      </label>
                      <div className="flex space-x-4">
                        <label className="inline-flex items-center">
                          <input
                              type="radio"
                              className="form-radio text-blue-600"
                              name="searchMode"
                              value="global"
                              checked={mode === "global"}
                              onChange={() => setMode("global")}
                          />
                          <span className="ml-2">Global (broad search)</span>
                        </label>
                        <label className="inline-flex items-center">
                          <input
                              type="radio"
                              className="form-radio text-blue-600"
                              name="searchMode"
                              value="local"
                              checked={mode === "local"}
                              onChange={() => setMode("local")}
                          />
                          <span className="ml-2">Local (precise search)</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label
                          htmlFor="query"
                          className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Your Query
                      </label>
                      <textarea
                          id="query"
                          value={query}
                          onChange={(e) => setQuery(e.target.value)}
                          placeholder="Enter your query here (e.g., What are the main topics in the syllabus?)"
                          rows={3}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white/70"
                      />
                    </div>

                    <div className="flex justify-end">
                      <button
                          onClick={handleQuery}
                          disabled={loading || !query.trim()}
                          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg flex items-center disabled:opacity-50"
                      >
                        {loading ? (
                            <>
                              <svg
                                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                              Processing...
                            </>
                        ) : (
                            <>
                              <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4 mr-2"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                              >
                                <path
                                    fillRule="evenodd"
                                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                    clipRule="evenodd"
                                />
                              </svg>
                              Query Graph
                            </>
                        )}
                      </button>
                    </div>
                  </div>

                  {error && (
                      <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg">
                        <p className="font-medium">Error</p>
                        <p>{error}</p>
                      </div>
                  )}

                  {queryResult && (
                      <div className="mt-6">
                        <h3 className="font-medium text-gray-700 mb-2">Results</h3>
                        <div className="p-4 bg-white/80 border border-gray-200 rounded-lg overflow-auto prose prose-blue max-w-none">
                          <ReactMarkdown>{queryResult}</ReactMarkdown>
                        </div>
                      </div>
                  )}
                </div>
            )}

            {activeTab === "paper" && (
                <div className="bg-white/60 backdrop-blur-md border border-white/40 rounded-2xl shadow-xl p-6">
                  <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Generate Question Paper
                  </h2>

                  {/* Paper Generation Form */}
                  {!paperResult && (
                      <div className="space-y-6 max-w-xl mx-auto">
                        <div>
                          <label
                              htmlFor="total-marks"
                              className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Total Marks
                          </label>
                          <div className="flex items-center space-x-4">
                            <input
                                id="total-marks"
                                type="range"
                                min="20"
                                max="100"
                                step="5"
                                value={totalMarks}
                                onChange={(e) => setTotalMarks(parseInt(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                            />
                            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-lg font-medium">
                        {totalMarks} Marks
                      </span>
                          </div>
                        </div>

                        <div>
                          <label
                              htmlFor="num-sections"
                              className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Number of Sections
                          </label>
                          <div className="flex items-center space-x-4">
                            <button
                                onClick={() => setNumSections(Math.max(1, numSections - 1))}
                                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-1 px-3 rounded-l"
                            >
                              -
                            </button>
                            <span className="bg-blue-100 text-blue-800 px-4 py-1 rounded-lg font-medium">
                        {numSections}
                      </span>
                            <button
                                onClick={() => setNumSections(Math.min(5, numSections + 1))}
                                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-1 px-3 rounded-r"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-medium text-gray-700">
                              Section Distribution
                            </label>
                            <label className="inline-flex items-center">
                              <input
                                  type="checkbox"
                                  className="form-checkbox text-blue-600 rounded"
                                  checked={customDistribution}
                                  onChange={() => setCustomDistribution(!customDistribution)}
                              />
                              <span className="ml-2 text-sm text-gray-600">Custom distribution</span>
                            </label>
                          </div>

                          <div className="space-y-3 bg-white/70 p-3 rounded-lg border border-gray-200">
                            {Array.from({ length: numSections }).map((_, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                  <span className="w-24 text-sm text-gray-600">Section {index + 1}:</span>
                                  <input
                                      type="number"
                                      min="1"
                                      max={totalMarks}
                                      value={sectionDistribution[index] || 0}
                                      onChange={(e) => handleSectionMarkChange(index, e.target.value)}
                                      disabled={!customDistribution}
                                      className={`w-16 p-1 text-center border rounded ${
                                          customDistribution ? 'border-blue-300' : 'border-gray-200 bg-gray-50'
                                      }`}
                                  />
                                  <span className="text-sm text-gray-600">marks</span>
                                </div>
                            ))}

                            <div className="flex justify-between text-sm pt-2 border-t border-gray-200">
                              <span>Total:</span>
                              <span className={
                                customDistribution && sectionDistribution.reduce((sum, marks) => sum + marks, 0) !== totalMarks
                                    ? 'text-red-600 font-bold'
                                    : 'text-green-600 font-bold'
                              }>
                          {sectionDistribution.reduce((sum, marks) => sum + marks, 0)} / {totalMarks} marks
                        </span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <label
                              htmlFor="total-questions"
                              className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Total Questions (optional)
                          </label>
                          <div className="flex items-center space-x-2">
                            <input
                                id="total-questions"
                                type="number"
                                min="0"
                                value={totalQuestions === null ? "" : totalQuestions}
                                onChange={(e) => {
                                  const val = e.target.value === "" ? null : parseInt(e.target.value);
                                  setTotalQuestions(val);
                                }}
                                className="w-20 p-2 border border-gray-300 rounded text-center"
                                placeholder="Auto"
                            />
                            <span className="text-sm text-gray-500">Leave empty for automatic calculation</span>
                          </div>
                        </div>

                        <div className="pt-4">
                          <button
                              onClick={handleGeneratePaper}
                              disabled={paperLoading || (customDistribution && sectionDistribution.reduce((sum, marks) => sum + marks, 0) !== totalMarks)}
                              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 rounded-lg flex items-center justify-center disabled:opacity-50"
                          >
                            {paperLoading ? (
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
                                  Generating Paper...
                                </>
                            ) : (
                                <>
                                  <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-5 w-5 mr-2"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                  >
                                    <path
                                        fillRule="evenodd"
                                        d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                                        clipRule="evenodd"
                                    />
                                  </svg>
                                  Generate Question Paper
                                </>
                            )}
                          </button>
                        </div>
                      </div>
                  )}

                  {error && (
                      <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg">
                        <p className="font-medium">Error</p>
                        <p>{error}</p>
                      </div>
                  )}

                  {/* Display generated paper */}
                  {paperResult && (
                      <div className="mt-4">
                        <div className="flex justify-between items-center mb-6">
                          <h3 className="text-xl font-bold text-gray-800">
                            Generated Question Paper
                          </h3>
                          <button
                              onClick={() => setPaperResult(null)}
                              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded-md text-sm flex items-center"
                          >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 mr-1"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                              <path
                                  fillRule="evenodd"
                                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                  clipRule="evenodd"
                              />
                            </svg>
                            Back to Form
                          </button>
                        </div>

                        <QuestionPaperDisplay
                            paper={paperResult}
                            onDownloadJson={handleDownloadJson}
                            onDownloadPdf={handleDownloadPdf}
                        />
                      </div>
                  )}
                </div>
            )}
          </div>
        </div>
      </div>
  );
};

export default GraphExplorer;