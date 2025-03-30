import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

const CustomQuestionForm = ({ onAddQuestion }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [questionType, setQuestionType] = useState('short');
    const [questionText, setQuestionText] = useState('');
    const [wordLimit, setWordLimit] = useState(questionType === 'short' ? 150 : 500);
    const [marks, setMarks] = useState(questionType === 'short' ? 5 : 10);
    const [error, setError] = useState(null);

    const handleOpen = () => {
        setIsOpen(true);
        setError(null);
    };

    const handleClose = () => {
        setIsOpen(false);
        resetForm();
    };

    const resetForm = () => {
        setQuestionText('');
        setQuestionType('short');
        setWordLimit(150);
        setMarks(5);
        setError(null);
    };

    const handleTypeChange = (e) => {
        const type = e.target.value;
        setQuestionType(type);
        // Update default values based on type
        if (type === 'short') {
            setWordLimit(150);
            setMarks(5);
        } else {
            setWordLimit(500);
            setMarks(10);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!questionText.trim()) {
            setError('Question text is required');
            return;
        }

        // Create a question object that matches the API response structure
        const newQuestion = {
            question: questionText,
            word_limit: wordLimit,
            marks: marks,
            model_answer: '',
            keywords: [],
            explanation: '',
            course_outcomes: 1,
            blooms_taxanomy: questionType === 'short' ? 'Understanding' : 'Evaluating',
            difficulty_level: 'medium',
            difficulty_rating: 3,
            metadata: {
                subject: '',
                topic: '',
                subtopic: ''
            }
        };

        // For long questions, add subtopics property
        if (questionType === 'long') {
            newQuestion.subtopics = [];
        }

        onAddQuestion(newQuestion, questionType);
        handleClose();
    };

    return (
        <div className="mb-6">
            {!isOpen ? (
                <button
                    onClick={handleOpen}
                    className="flex items-center justify-center w-full px-4 py-3 bg-blue-50 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Add Custom Question
                </button>
            ) : (
                <div className="bg-white border border-blue-200 rounded-xl p-5 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Add Custom Question</h3>
                        <button
                            onClick={handleClose}
                            className="p-1 text-gray-500 hover:bg-gray-100 rounded-full"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Question Type */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">
                                Question Type
                            </label>
                            <div className="flex space-x-4">
                                <label className={`flex items-center px-4 py-2 rounded-full cursor-pointer transition-all ${
                                    questionType === 'short'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-700'
                                }`}>
                                    <input
                                        type="radio"
                                        value="short"
                                        checked={questionType === 'short'}
                                        onChange={handleTypeChange}
                                        className="sr-only"
                                    />
                                    <span>Short Answer (5 marks)</span>
                                </label>
                                <label className={`flex items-center px-4 py-2 rounded-full cursor-pointer transition-all ${
                                    questionType === 'long'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-700'
                                }`}>
                                    <input
                                        type="radio"
                                        value="long"
                                        checked={questionType === 'long'}
                                        onChange={handleTypeChange}
                                        className="sr-only"
                                    />
                                    <span>Long Answer (10 marks)</span>
                                </label>
                            </div>
                        </div>

                        {/* Question Text */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">
                                Question Text
                            </label>
                            <textarea
                                value={questionText}
                                onChange={(e) => setQuestionText(e.target.value)}
                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                rows={4}
                                placeholder="Enter your question here..."
                            />
                        </div>

                        {/* Word Limit */}
                        <div className="flex space-x-4">
                            <div className="flex-1">
                                <label className="block text-gray-700 font-medium mb-2">
                                    Word Limit
                                </label>
                                <input
                                    type="number"
                                    value={wordLimit}
                                    onChange={(e) => setWordLimit(parseInt(e.target.value) || 0)}
                                    min={50}
                                    max={1000}
                                    className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    {questionType === 'short' ? 'Recommended: 100-250 words' : 'Recommended: 350-800 words'}
                                </p>
                            </div>

                            <div className="flex-1">
                                <label className="block text-gray-700 font-medium mb-2">
                                    Marks
                                </label>
                                <input
                                    type="number"
                                    value={marks}
                                    onChange={(e) => setMarks(parseInt(e.target.value) || 0)}
                                    min={1}
                                    max={20}
                                    className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    {questionType === 'short' ? 'Recommended: 3-7 marks' : 'Recommended: 8-15 marks'}
                                </p>
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        {/* Submit Button */}
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Add Question
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default CustomQuestionForm;