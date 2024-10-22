import React, { useState } from "react";
import { Share2 } from "lucide-react";
import QuestionActions from "./QuestionActions";
import ResponseModal from "./ResponseModal";

const Dashboard = () => {
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);
    const [extractedText, setExtractedText] = useState("");
    const [formData, setFormData] = useState({
        type: "mcq",
        num: 5,
        subject: "",
        level: "intermediate",
        syllabus: "",
    });

    // Handle file upload, extract text, and set in state
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
            // Create FormData for the PDF upload
            const formDataObj = new FormData();
            formDataObj.append("file", file);

            // First, extract text from PDF
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
                syllabus: text, // Store the extracted text in the syllabus field
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

            // Send request to generate questions using the extracted text
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
                    syllabus: formData.syllabus, // Send the extracted text
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
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-neutral-100 mb-8">
                    Question Generator
                </h1>

                {/* Question Generator Form */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <form onSubmit={generateQuestions} className="space-y-6">
                        {/* Question Type */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">
                                Question Type
                            </label>
                            <div className="flex space-x-4">
                                <label className="inline-flex items-center">
                                    <input
                                        type="radio"
                                        value="mcq"
                                        checked={formData.type === "mcq"}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                type: e.target.value,
                                            }))
                                        }
                                        className="form-radio text-orange-500"
                                    />
                                    <span className="ml-2">
                                        Multiple Choice
                                    </span>
                                </label>
                                <label className="inline-flex items-center">
                                    <input
                                        type="radio"
                                        value="fib"
                                        checked={formData.type === "fib"}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                type: e.target.value,
                                            }))
                                        }
                                        className="form-radio text-orange-500"
                                    />
                                    <span className="ml-2">
                                        Fill in the Blanks
                                    </span>
                                </label>
                            </div>
                        </div>

                        {/* Number of Questions */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">
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
                                        num: parseInt(e.target.value),
                                    }))
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
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
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                                placeholder="Enter subject name"
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
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                            >
                                <option value="beginner">Beginner</option>
                                <option value="intermediate">
                                    Intermediate
                                </option>
                                <option value="advanced">Advanced</option>
                            </select>
                        </div>

                        {/* Syllabus Upload */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">
                                Upload Syllabus (PDF)
                            </label>
                            <div className="space-y-2">
                                <input
                                    type="file"
                                    accept=".pdf"
                                    onChange={handleFileUpload}
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                                {extractedText && (
                                    <div className="text-sm text-gray-600">
                                        ✓ PDF processed successfully
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading || !extractedText}
                            className="w-full bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600 transition-colors disabled:bg-orange-300"
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
                    </form>
                </div>

                {/* Error Display */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-8">
                        {error}
                    </div>
                )}

                {/* Response Display */}
                {response && (
                    <div className="space-y-6">
                        <div className="flex gap-4 items-start">
                            <ResponseModal response={response} />
                            <QuestionActions
                                response={response}
                                type={formData.type}
                                onRegenerateClick={generateQuestions}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
