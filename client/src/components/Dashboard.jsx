import React, { useState } from "react";
import { Eye, Share2 } from "lucide-react";
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
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (!formData.syllabus) {
                throw new Error(
                    "Please upload a PDF file to generate questions"
                );
            }

            const endpoint =
                formData.type === "mcq" ? "/generate/mcq" : "/generate/fib";
            const response = await fetch(`http://127.0.0.1:8000${endpoint}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    num: formData.num,
                    subject: formData.subject,
                    level: formData.level,
                    syllabus: formData.syllabus,
                }),
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
        <div className="min-h-screen bg-neutral-900 text-neutral-100">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-5xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Form Section */}
                        <div className="lg:col-span-2 bg-neutral-800 rounded-lg border border-neutral-700 overflow-hidden">
                            <div className="p-6">
                                <h2 className="text-2xl font-semibold text-orange-500 mb-6">
                                    Generate Questions
                                </h2>
                                <form
                                    onSubmit={generateQuestions}
                                    className="space-y-6"
                                >
                                    {/* Question Type */}
                                    <div>
                                        <label className="block text-neutral-200 font-medium mb-2">
                                            Question Type
                                        </label>
                                        <div className="flex space-x-4">
                                            <label className="inline-flex items-center">
                                                <input
                                                    type="radio"
                                                    value="mcq"
                                                    checked={
                                                        formData.type === "mcq"
                                                    }
                                                    onChange={(e) =>
                                                        setFormData((prev) => ({
                                                            ...prev,
                                                            type: e.target
                                                                .value,
                                                        }))
                                                    }
                                                    className="text-orange-500 border-orange-500 focus:ring-orange-500"
                                                />
                                                <span className="ml-2 text-neutral-200">
                                                    Multiple Choice
                                                </span>
                                            </label>
                                            <label className="inline-flex items-center">
                                                <input
                                                    type="radio"
                                                    value="fib"
                                                    checked={
                                                        formData.type === "fib"
                                                    }
                                                    onChange={(e) =>
                                                        setFormData((prev) => ({
                                                            ...prev,
                                                            type: e.target
                                                                .value,
                                                        }))
                                                    }
                                                    className="text-orange-500 border-orange-500 focus:ring-orange-500"
                                                />
                                                <span className="ml-2 text-neutral-200">
                                                    Fill in the Blanks
                                                </span>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Number of Questions */}
                                    <div>
                                        <label className="block text-neutral-200 font-medium mb-2">
                                            Number of Questions
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="20"
                                            value={formData.num}
                                            onChange={(e) =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    num: parseInt(
                                                        e.target.value
                                                    ),
                                                }))
                                            }
                                            className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-neutral-100 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        />
                                    </div>

                                    {/* Subject */}
                                    <div>
                                        <label className="block text-neutral-200 font-medium mb-2">
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
                                            className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-neutral-100 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                            placeholder="Enter subject name"
                                        />
                                    </div>

                                    {/* Difficulty Level */}
                                    <div>
                                        <label className="block text-neutral-200 font-medium mb-2">
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
                                            className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-neutral-100 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        >
                                            <option value="beginner">
                                                Beginner
                                            </option>
                                            <option value="intermediate">
                                                Intermediate
                                            </option>
                                            <option value="advanced">
                                                Advanced
                                            </option>
                                        </select>
                                    </div>

                                    {/* Syllabus Upload */}
                                    <div>
                                        <label className="block text-neutral-200 font-medium mb-2">
                                            Upload Syllabus (PDF)
                                        </label>
                                        <div className="space-y-2">
                                            <input
                                                type="file"
                                                accept=".pdf"
                                                onChange={handleFileUpload}
                                                className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-neutral-100 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-orange-500 file:text-neutral-100 hover:file:bg-orange-600"
                                            />
                                            {extractedText && (
                                                <div className="text-sm text-green-400">
                                                    ✓ PDF processed successfully
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Button Group */}
                                    <div className="flex space-x-4">
                                        <button
                                            type="submit"
                                            disabled={loading || !extractedText}
                                            className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors disabled:bg-neutral-600 disabled:cursor-not-allowed"
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
                                                onClick={() =>
                                                    setShowQuestions(true)
                                                }
                                                className="px-2 py-2 flex flex-row gap-2 bg-neutral-700 text-white rounded-md hover:bg-neutral-600 transition-colors"
                                            >
                                                <Eye/>
                                                View Questions
                                            </button>
                                        )}
                                    </div>
                                </form>

                                {/* Error Display */}
                                {error && (
                                    <div className="mt-4 bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-md">
                                        {error}
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
                    />
                )}
            </div>
        </div>
    );
};

export default Dashboard;
