import React, { useState } from 'react';
import { Edit, Save, XCircle, RefreshCw, Trash2, AlertCircle, CheckCircle } from 'lucide-react';

const QuestionEditor = ({ question, questionType, onSave, onCancel, onDelete, onRegenerate, index }) => {
    const [editMode, setEditMode] = useState(false);
    const [editContent, setEditContent] = useState(question.question);
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState(null);

    const handleEditClick = () => {
        setEditMode(true);
        setEditContent(question.question);
    };

    const handleSaveClick = () => {
        if (editContent.trim() === '') {
            setFeedback({
                type: 'error',
                message: 'Question cannot be empty'
            });
            return;
        }

        onSave({ ...question, question: editContent });
        setEditMode(false);
        setFeedback({
            type: 'success',
            message: 'Question updated successfully'
        });

        // Clear feedback after 3 seconds
        setTimeout(() => {
            setFeedback(null);
        }, 3000);
    };

    const handleCancelClick = () => {
        setEditMode(false);
        setEditContent(question.question);
        onCancel();
    };

    const handleDeleteClick = () => {
        onDelete(question);
    };

    const handleRegenerateClick = async () => {
        setLoading(true);
        await onRegenerate(question);
        setLoading(false);
        setFeedback({
            type: 'success',
            message: 'Question regenerated successfully'
        });

        // Clear feedback after 3 seconds
        setTimeout(() => {
            setFeedback(null);
        }, 3000);
    };

    return (
        <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
            {editMode ? (
                <div className="space-y-4">
          <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-blue-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={questionType === "long" ? 6 : 4}
          />
                    <div className="flex space-x-2">
                        <button
                            onClick={handleSaveClick}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg flex items-center"
                        >
                            <Save className="w-4 h-4 mr-2" />
                            Save
                        </button>
                        <button
                            onClick={handleCancelClick}
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg flex items-center"
                        >
                            <XCircle className="w-4 h-4 mr-2" />
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    <div className="flex justify-between">
                        <h3 className="text-lg font-medium text-gray-800 mb-2">
                            Question {index + 1}
                        </h3>
                        <div className="flex space-x-2">
                            <button
                                onClick={handleEditClick}
                                className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                title="Edit question"
                            >
                                <Edit className="w-4 h-4" />
                            </button>
                            <button
                                onClick={handleRegenerateClick}
                                className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
                                disabled={loading}
                                title="Regenerate question"
                            >
                                <RefreshCw
                                    className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                                />
                            </button>
                            <button
                                onClick={handleDeleteClick}
                                className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                                title="Delete question"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                    <p className="text-gray-700">{question.question}</p>

                    {/* Display marks and word limit */}
                    <div className="flex mt-3 space-x-3 text-sm">
            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
              {question.marks} marks
            </span>
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
              Word limit: {question.word_limit}
            </span>
                    </div>
                </>
            )}

            {/* Feedback message */}
            {feedback && (
                <div className={`mt-3 px-3 py-2 rounded-lg flex items-center text-sm ${
                    feedback.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                }`}>
                    {feedback.type === 'success' ? (
                        <CheckCircle className="w-4 h-4 mr-2" />
                    ) : (
                        <AlertCircle className="w-4 h-4 mr-2" />
                    )}
                    {feedback.message}
                </div>
            )}
        </div>
    );
};

export default QuestionEditor;