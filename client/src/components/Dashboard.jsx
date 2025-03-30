import { useState } from "react";
import { Share2, Eye, FileText, Upload, AlertCircle } from "lucide-react";
import QuestionActions from "./QuestionActions";
import ResponseModal from "./ResponseModal";

const Dashboard = () => {
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);
    const [showQuestions, setShowQuestions] = useState(false);
    const [extractedText, setExtractedText] = useState("");
    const [formData, setFormData] = useState({
        type: "mcq",
        num: 5,
        subject: "",
        level: "intermediate",
        syllabus: "",
        word_limit: 150,  // Default for short answers
        marks: 5          // Default for short answers
    });

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

    const generateQuestions = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (!formData.syllabus) {
                throw new Error(
                    "Please upload a PDF file to generate questions"
                );
            }

            // Determine the correct endpoint based on question type
            let endpoint;
            let requestBody = {
                num: formData.num,
                subject: formData.subject,
                level: formData.level,
                syllabus: formData.syllabus,
            };

            switch (formData.type) {
                case "mcq":
                    endpoint = "/generate/mcq";
                    break;
                case "fib":
                    endpoint = "/generate/fib";
                    break;
                case "short":
                    endpoint = `/generate/short?word_limit=${formData.word_limit}&marks=${formData.marks}`;
                    break;
                case "long":
                    endpoint = `/generate/long?word_limit=${formData.word_limit}&marks=${formData.marks}`;
                    break;
                default:
                    throw new Error("Invalid question type");
            }

            const response = await fetch(`http://127.0.0.1:8000${endpoint}`, {
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
            setResponse(data);
        } catch (error) {
            console.error("Error generating questions:", error);
            setError(error.message || "Failed to generate questions");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 text-gray-800 pt-24 pb-16">
            <div className="container mx-auto px-4">
                <div className="max-w-5xl mx-auto">
                    <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
                        Question Paper Generator
                    </h1>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Form Section */}
                        <div className="lg:col-span-2 backdrop-blur-md bg-white/60 rounded-2xl border border-white/40 shadow-xl overflow-hidden">
                            <div className="p-6 md:p-8">
                                <h2 className="text-2xl font-semibold mb-6 text-gray-800">
                                    Generate Questions
                                </h2>
                                <form
                                    onSubmit={generateQuestions}
                                    className="space-y-6"
                                >
                                    {/* Question Type */}
                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">
                                            Question Type
                                        </label>
                                        <div className="flex flex-wrap gap-4">
                                            {[
                                                { value: "mcq", label: "Multiple Choice" },
                                                { value: "fib", label: "Fill in the Blanks" },
                                                { value: "short", label: "Short Answer" },
                                                { value: "long", label: "Long Answer" }
                                            ].map(option => (
                                                <label
                                                    key={option.value}
                                                    className={`flex items-center px-4 py-2 rounded-full transition-all ${
                                                        formData.type === option.value
                                                            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                                                            : "bg-white/80 border border-gray-200 text-gray-700 hover:border-blue-300"
                                                    }`}
                                                >
                                                    <input
                                                        type="radio"
                                                        value={option.value}
                                                        checked={formData.type === option.value}
                                                        onChange={(e) =>
                                                            setFormData((prev) => ({
                                                                ...prev,
                                                                type: e.target.value,
                                                                ...(e.target.value === "short" && { word_limit: 150, marks: 5 }),
                                                                ...(e.target.value === "long" && { word_limit: 500, marks: 10 })
                                                            }))
                                                        }
                                                        className="sr-only" // Hide the actual radio button
                                                    />
                                                    <span>{option.label}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Number of Questions */}
                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">
                                            Number of Questions
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                min="1"
                                                max="20"
                                                value={formData.num}
                                                onChange={(e) =>
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        num: parseInt(e.target.value),
                                                    }))
                                                }
                                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                                                questions
                                            </div>
                                        </div>
                                    </div>

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
                                                backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E\")",
                                                backgroundSize: "1.5em 1.5em"
                                            }}
                                        >
                                            <option value="beginner">Beginner</option>
                                            <option value="intermediate">Intermediate</option>
                                            <option value="advanced">Advanced</option>
                                        </select>
                                    </div>

                                    {/* Advanced Parameters for Short and Long Answers */}
                                    {(formData.type === "short" || formData.type === "long") && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-blue-50/80 rounded-xl">
                                            <div>
                                                <label className="block text-gray-700 font-medium mb-2">
                                                    Word Limit
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type="number"
                                                        min="50"
                                                        max={formData.type === "short" ? 250 : 1000}
                                                        value={formData.word_limit}
                                                        onChange={(e) =>
                                                            setFormData((prev) => ({
                                                                ...prev,
                                                                word_limit: parseInt(e.target.value),
                                                            }))
                                                        }
                                                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    />
                                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                                                        words
                                                    </div>
                                                </div>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    {formData.type === "short" ? "Recommended: 100-250 words" : "Recommended: 350-800 words"}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="block text-gray-700 font-medium mb-2">
                                                    Marks per Question
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        max="20"
                                                        value={formData.marks}
                                                        onChange={(e) =>
                                                            setFormData((prev) => ({
                                                                ...prev,
                                                                marks: parseInt(e.target.value),
                                                            }))
                                                        }
                                                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    />
                                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                                                        marks
                                                    </div>
                                                </div>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    {formData.type === "short" ? "Recommended: 3-7 marks" : "Recommended: 8-15 marks"}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Syllabus Upload */}
                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">
                                            Upload Syllabus (PDF)
                                        </label>
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-white/50 transition-all hover:bg-blue-50/30">
                                            <div className="text-center">
                                                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                                                <div className="mt-2">
                                                    <label htmlFor="file-upload" className="cursor-pointer">
                                                        <span className="mt-2 block text-sm font-medium text-gray-700">
                                                            Drop your PDF here, or{" "}
                                                            <span className="text-blue-600 hover:text-blue-500">browse</span>
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

                                    {/* Button Group */}
                                    <div className="flex flex-wrap gap-4 pt-2">
                                        <button
                                            type="submit"
                                            disabled={loading || !extractedText}
                                            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full hover:shadow-lg hover:shadow-blue-300/50 transition-all transform hover:-translate-y-1 font-semibold text-lg disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:transform-none disabled:hover:shadow-none"
                                        >
                                            {loading ? (
                                                <span className="flex items-center justify-center">
                                                    <Share2 className="animate-spin mr-2" />
                                                    {extractedText
                                                        ? "Generating..."
                                                        : "Processing PDF..."}
                                                </span>
                                            ) : (
                                                "Generate Questions"
                                            )}
                                        </button>

                                        {response && (
                                            <button
                                                type="button"
                                                onClick={() => setShowQuestions(true)}
                                                className="px-6 py-3 flex items-center justify-center bg-white border border-blue-300 text-blue-600 rounded-full hover:bg-blue-50 transition-colors hover:shadow-md font-medium"
                                            >
                                                <Eye className="mr-2" />
                                                View Questions
                                            </button>
                                        )}
                                    </div>
                                </form>

                                {/* Error Display */}
                                {error && (
                                    <div className="mt-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-start">
                                        <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                                        <span>{error}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Question Actions Section */}
                        <div className="lg:col-span-1">
                            <QuestionActions
                                response={response}
                                type={formData.type}
                                onRegenerateClick={generateQuestions}
                            />
                        </div>
                    </div>
                </div>

                {/* View Questions Modal */}
                {showQuestions && (
                    <ResponseModal
                        response={response}
                        onClose={() => setShowQuestions(false)}
                        type={formData.type}
                    />
                )}
            </div>
        </div>
    );
};

export default Dashboard;