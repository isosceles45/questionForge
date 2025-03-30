import { useState } from "react";
import { Share2, FileText, Eye, ArrowLeft, Plus } from "lucide-react";
import PaperStructure from "./PaperStructure";
import CustomQuestionForm from "./CustomQuestionForm";

const MidtermPaperGenerator = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [extractedText, setExtractedText] = useState("");
    const [formData, setFormData] = useState({
        subject: "",
        level: "intermediate",
        syllabus: "",
    });

    // Paper structure
    const [shortQuestions, setShortQuestions] = useState([]);
    const [longQuestions, setLongQuestions] = useState([]);
    const [generatingSection, setGeneratingSection] = useState(null);

    // View state - controls the paper preview mode
    const [showPaperPreview, setShowPaperPreview] = useState(false);

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.type !== "application/pdf") {
            setError("Please upload a PDF file");
            return;
        }

        setError(null);
        setLoading(true);

        try {
            const formDataObj = new FormData();
            formDataObj.append("file", file);

            const uploadResponse = await fetch(
                "http://127.0.0.1:8000/upload/pdf",
                {
                    method: "POST",
                    body: formDataObj,
                }
            );

            if (!uploadResponse.ok) {
                throw new Error(`HTTP error! status: ${uploadResponse.status}`);
            }

            const { text } = await uploadResponse.json();
            setExtractedText(text);
            setFormData((prev) => ({
                ...prev,
                syllabus: text,
            }));
        } catch (error) {
            console.error("Error processing PDF:", error);
            setError(error.message || "Failed to process PDF");
        } finally {
            setLoading(false);
        }
    };

    const generateShortQuestions = async () => {
        if (!formData.syllabus) {
            setError("Please upload a PDF file to generate questions");
            return;
        }

        setGeneratingSection("short");
        setLoading(true);
        setError(null);

        try {
            const requestBody = {
                num: 6, // 6 short questions as specified
                subject: formData.subject,
                level: formData.level,
                syllabus: formData.syllabus,
            };

            const response = await fetch(
                "http://127.0.0.1:8000/generate/short?word_limit=150&marks=5",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(requestBody),
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setShortQuestions(data.questions);
        } catch (error) {
            console.error("Error generating short questions:", error);
            setError(error.message || "Failed to generate short questions");
        } finally {
            setLoading(false);
            setGeneratingSection(null);
        }
    };

    const generateLongQuestions = async () => {
        if (!formData.syllabus) {
            setError("Please upload a PDF file to generate questions");
            return;
        }

        setGeneratingSection("long");
        setLoading(true);
        setError(null);

        try {
            const requestBody = {
                num: 4, // 4 long questions as specified
                subject: formData.subject,
                level: formData.level,
                syllabus: formData.syllabus,
            };

            const response = await fetch(
                "http://127.0.0.1:8000/generate/long?word_limit=500&marks=10",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(requestBody),
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setLongQuestions(data.questions);
        } catch (error) {
            console.error("Error generating long questions:", error);
            setError(error.message || "Failed to generate long questions");
        } finally {
            setLoading(false);
            setGeneratingSection(null);
        }
    };

    // Function to regenerate a specific question
    const regenerateQuestion = async (question, type) => {
        setLoading(true);
        setError(null);

        try {
            const requestBody = {
                num: 1,
                subject: formData.subject,
                level: formData.level,
                syllabus: formData.syllabus,
            };

            const endpoint = type === "short"
                ? "http://127.0.0.1:8000/generate/short?word_limit=150&marks=5"
                : "http://127.0.0.1:8000/generate/long?word_limit=500&marks=10";

            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const newQuestion = data.questions[0];

            if (type === "short") {
                setShortQuestions((prev) =>
                    prev.map((q) => (q === question ? newQuestion : q))
                );
            } else {
                setLongQuestions((prev) =>
                    prev.map((q) => (q === question ? newQuestion : q))
                );
            }
        } catch (error) {
            console.error(`Error regenerating ${type} question:`, error);
            setError(error.message || `Failed to regenerate ${type} question`);
        } finally {
            setLoading(false);
        }
    };

    const generateFullPaper = async () => {
        if (!formData.syllabus) {
            setError("Please upload a PDF file to generate questions");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await generateShortQuestions();
            await generateLongQuestions();
            // After successfully generating both types of questions, show the paper preview
            setShowPaperPreview(true);
        } catch (error) {
            console.error("Error generating full paper:", error);
            setError(error.message || "Failed to generate full paper");
        } finally {
            setLoading(false);
        }
    };

    // Handler for adding custom questions
    const handleAddCustomQuestion = (newQuestion, type) => {
        if (type === 'short') {
            setShortQuestions(prev => [...prev, newQuestion]);
        } else {
            setLongQuestions(prev => [...prev, newQuestion]);
        }
    };

    // Handler for updating questions
    const handleUpdateQuestion = (updatedQuestion, type) => {
        if (type === 'short') {
            setShortQuestions(prev =>
                prev.map(q => q === updatedQuestion ? updatedQuestion : q)
            );
        } else {
            setLongQuestions(prev =>
                prev.map(q => q === updatedQuestion ? updatedQuestion : q)
            );
        }
    };

    // Handler for deleting questions
    const handleDeleteQuestion = (question, type) => {
        if (type === 'short') {
            setShortQuestions(prev => prev.filter(q => q !== question));
        } else {
            setLongQuestions(prev => prev.filter(q => q !== question));
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 text-gray-800 pt-24 pb-16">
            <div className="container mx-auto px-4">
                <div className="max-w-5xl mx-auto">
                    <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
                        Midterm Paper Generator
                    </h1>

                    {showPaperPreview ? (
                        /* Paper Preview Mode */
                        <>
                            <div className="mb-6 flex justify-between">
                                <button
                                    onClick={() => setShowPaperPreview(false)}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center"
                                >
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Back to Editor
                                </button>

                                <button
                                    onClick={() => window.print()}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                                >
                                    <Eye className="w-4 h-4 mr-2" />
                                    Print Preview
                                </button>
                            </div>

                            {/* Paper Structure Component */}
                            <PaperStructure
                                shortQuestions={shortQuestions}
                                longQuestions={longQuestions}
                                onRegenerateQuestion={regenerateQuestion}
                                onDeleteQuestion={handleDeleteQuestion}
                                onUpdateQuestion={handleUpdateQuestion}
                            />
                        </>
                    ) : (
                        /* Question Generation Mode */
                        <>
                            {/* Form Section */}
                            <div className="backdrop-blur-md bg-white/60 rounded-2xl border border-white/40 shadow-xl overflow-hidden mb-8">
                                <div className="p-6 md:p-8">
                                    <h2 className="text-2xl font-semibold mb-6 text-gray-800">
                                        Paper Configuration
                                    </h2>
                                    <form className="space-y-6">
                                        {/* Subject */}
                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2">
                                                Subject
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.subject}
                                                onChange={(e) =>
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        subject: e.target.value,
                                                    }))
                                                }
                                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="E.g., Computer Science, Mathematics, etc."
                                            />
                                        </div>

                                        {/* Difficulty Level */}
                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2">
                                                Difficulty Level
                                            </label>
                                            <select
                                                value={formData.level}
                                                onChange={(e) =>
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        level: e.target.value,
                                                    }))
                                                }
                                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-no-repeat bg-right pr-10"
                                                style={{
                                                    backgroundImage:
                                                        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E\")",
                                                    backgroundSize: "1.5em 1.5em",
                                                }}
                                            >
                                                <option value="beginner">Beginner</option>
                                                <option value="intermediate">Intermediate</option>
                                                <option value="advanced">Advanced</option>
                                            </select>
                                        </div>

                                        {/* Syllabus Upload */}
                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2">
                                                Upload Syllabus (PDF)
                                            </label>
                                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-white/50 transition-all hover:bg-blue-50/30">
                                                <div className="text-center">
                                                    <FileText className="mx-auto h-12 w-12 text-gray-400" />
                                                    <div className="mt-2">
                                                        <label
                                                            htmlFor="file-upload"
                                                            className="cursor-pointer"
                                                        >
                                                          <span className="mt-2 block text-sm font-medium text-gray-700">
                                                            Drop your PDF here, or{" "}
                                                              <span className="text-blue-600 hover:text-blue-500">
                                                              browse
                                                            </span>
                                                          </span>
                                                            <input
                                                                id="file-upload"
                                                                type="file"
                                                                accept=".pdf"
                                                                onChange={handleFileUpload}
                                                                className="sr-only"
                                                            />
                                                        </label>
                                                    </div>
                                                    <p className="text-xs text-gray-500">PDF up to 10MB</p>
                                                </div>
                                                {extractedText && (
                                                    <div className="mt-4 text-sm text-green-600 flex items-center justify-center">
                                                        <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center mr-2">
                                                            <span className="text-white text-xs">✓</span>
                                                        </div>
                                                        PDF processed successfully
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Generate Buttons */}
                                        <div className="flex flex-wrap gap-4 pt-2">
                                            <button
                                                type="button"
                                                onClick={generateFullPaper}
                                                disabled={loading || !extractedText}
                                                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full hover:shadow-lg hover:shadow-blue-300/50 transition-all transform hover:-translate-y-1 font-semibold disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:transform-none disabled:hover:shadow-none"
                                            >
                                                {loading ? (
                                                    <span className="flex items-center justify-center">
                                                        <Share2 className="animate-spin mr-2" />
                                                        Generating Full Paper...
                                                    </span>
                                                ) : (
                                                    "Generate Full Paper"
                                                )}
                                            </button>

                                            <button
                                                type="button"
                                                onClick={generateShortQuestions}
                                                disabled={loading || !extractedText}
                                                className="px-6 py-3 bg-white border border-blue-300 text-blue-600 rounded-full hover:bg-blue-50 transition-colors hover:shadow-md font-medium"
                                            >
                                                {generatingSection === "short" ? (
                                                    <span className="flex items-center justify-center">
                                                        <Share2 className="animate-spin mr-2" />
                                                        Generating...
                                                    </span>
                                                ) : (
                                                    "Generate Short Questions"
                                                )}
                                            </button>

                                            <button
                                                type="button"
                                                onClick={generateLongQuestions}
                                                disabled={loading || !extractedText}
                                                className="px-6 py-3 bg-white border border-blue-300 text-blue-600 rounded-full hover:bg-blue-50 transition-colors hover:shadow-md font-medium"
                                            >
                                                {generatingSection === "long" ? (
                                                    <span className="flex items-center justify-center">
                                                        <Share2 className="animate-spin mr-2" />
                                                        Generating...
                                                    </span>
                                                ) : (
                                                    "Generate Long Questions"
                                                )}
                                            </button>
                                        </div>

                                        {/* Error Display */}
                                        {error && (
                                            <div className="mt-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-start">
                                                <svg
                                                    className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <circle cx="12" cy="12" r="10" strokeWidth="2" />
                                                    <line x1="12" y1="8" x2="12" y2="12" strokeWidth="2" />
                                                    <line x1="12" y1="16" x2="12" y2="16" strokeWidth="2" />
                                                </svg>
                                                <span>{error}</span>
                                            </div>
                                        )}
                                    </form>
                                </div>
                            </div>

                            {/* Add custom questions section */}
                            {(shortQuestions.length > 0 || longQuestions.length > 0) && (
                                <CustomQuestionForm onAddQuestion={handleAddCustomQuestion} />
                            )}

                            {/* View Paper Button - only visible if questions exist */}
                            {(shortQuestions.length > 0 || longQuestions.length > 0) && (
                                <div className="mb-8 flex justify-center">
                                    <button
                                        onClick={() => setShowPaperPreview(true)}
                                        className="px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-full hover:shadow-lg hover:shadow-green-300/50 transition-all font-semibold flex items-center"
                                    >
                                        <Eye className="w-5 h-5 mr-2" />
                                        View Complete Paper
                                    </button>
                                </div>
                            )}

                            {/* Short Questions Section */}
                            {shortQuestions.length > 0 && (
                                <div className="backdrop-blur-md bg-white/60 rounded-2xl border border-white/40 shadow-xl overflow-hidden mb-8">
                                    <div className="p-6 md:p-8">
                                        <div className="flex justify-between items-center mb-6">
                                            <h2 className="text-2xl font-semibold text-gray-800">
                                                Section 1: Short Questions (Choose 5 of 6)
                                            </h2>
                                            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                                5 marks each
                                            </span>
                                        </div>

                                        <div className="space-y-6">
                                            {shortQuestions.map((question, index) => (
                                                <div key={`short-${index}`}>
                                                    <div className="flex justify-between items-center">
                                                        <h3 className="text-lg font-medium text-gray-800 mb-2">
                                                            Question {index + 1}
                                                        </h3>
                                                    </div>
                                                    <p className="text-gray-700 mb-3">{question.question}</p>
                                                    <div className="flex justify-end space-x-2">
                                                        <button
                                                            onClick={() => regenerateQuestion(question, "short")}
                                                            className="px-3 py-1 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors text-sm font-medium flex items-center"
                                                            disabled={loading}
                                                        >
                                                            Regenerate
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteQuestion(question, "short")}
                                                            className="px-3 py-1 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors text-sm font-medium"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}

                                            {/* Add more short questions */}
                                            <button
                                                onClick={() => generateShortQuestions()}
                                                className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center justify-center"
                                                disabled={loading}
                                            >
                                                <Plus className="w-4 h-4 mr-2" />
                                                Add More Short Questions
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Long Questions Section */}
                            {longQuestions.length > 0 && (
                                <div className="backdrop-blur-md bg-white/60 rounded-2xl border border-white/40 shadow-xl overflow-hidden">
                                    <div className="p-6 md:p-8">
                                        <div className="flex justify-between items-center mb-6">
                                            <h2 className="text-2xl font-semibold text-gray-800">
                                                Section 2: Long Questions (Choose 2 of 4)
                                            </h2>
                                            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                                                10 marks each
                                            </span>
                                        </div>

                                        <div className="space-y-6">
                                            {longQuestions.map((question, index) => (
                                                <div key={`long-${index}`}>
                                                    <div className="flex justify-between items-center">
                                                        <h3 className="text-lg font-medium text-gray-800 mb-2">
                                                            Question {index + 1}
                                                        </h3>
                                                    </div>
                                                    <p className="text-gray-700 mb-3">{question.question}</p>
                                                    <div className="flex justify-end space-x-2">
                                                        <button
                                                            onClick={() => regenerateQuestion(question, "long")}
                                                            className="px-3 py-1 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors text-sm font-medium flex items-center"
                                                            disabled={loading}
                                                        >
                                                            Regenerate
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteQuestion(question, "long")}
                                                            className="px-3 py-1 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors text-sm font-medium"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}

                                            {/* Add more long questions */}
                                            <button
                                                onClick={() => generateLongQuestions()}
                                                className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center justify-center"
                                                disabled={loading}
                                            >
                                                <Plus className="w-4 h-4 mr-2" />
                                                Add More Long Questions
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MidtermPaperGenerator;