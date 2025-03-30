import React, { useState } from 'react';
import { Download, Printer, Edit, Save, XCircle } from 'lucide-react';
import QuestionEditor from './QuestionEditor';

const PaperStructure = ({ shortQuestions, longQuestions, onRegenerateQuestion, onDeleteQuestion, onUpdateQuestion }) => {
    const [editing, setEditing] = useState(false);
    const [paperTitle, setPaperTitle] = useState("Midterm Examination");
    const [courseInfo, setCourseInfo] = useState("Computer Science 101");
    const [instructions, setInstructions] = useState("Answer all questions. Short questions carry 5 marks each. Long questions carry 10 marks each.");
    const [timeAllowed, setTimeAllowed] = useState("3 hours");
    const [totalMarks, setTotalMarks] = useState("50");

    const handleSaveMetadata = () => {
        setEditing(false);
    };

    const handlePrintPaper = () => {
        window.print();
    };

    const handleDownloadPaper = () => {
        // Create a text representation of the paper
        const paperContent = generatePaperContent();

        // Create a Blob with the paper content
        const blob = new Blob([paperContent], { type: 'text/plain' });

        // Create a URL for the Blob
        const url = URL.createObjectURL(blob);

        // Create a temporary anchor element
        const a = document.createElement('a');
        a.href = url;
        a.download = `${paperTitle.replace(/\s+/g, '_')}.txt`;

        // Trigger a click on the anchor to start the download
        document.body.appendChild(a);
        a.click();

        // Clean up
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const generatePaperContent = () => {
        let content = `${paperTitle}\n`;
        content += `${courseInfo}\n`;
        content += `Time Allowed: ${timeAllowed}\n`;
        content += `Total Marks: ${totalMarks}\n\n`;
        content += `Instructions: ${instructions}\n\n`;

        content += "SECTION 1: SHORT QUESTIONS (Answer any 5 out of 6) [25 marks]\n\n";
        shortQuestions.forEach((q, i) => {
            content += `Question ${i + 1}: ${q.question}\n`;
            content += `[${q.marks} marks]\n\n`;
        });

        content += "SECTION 2: LONG QUESTIONS (Answer any 2 out of 4) [20 marks]\n\n";
        longQuestions.forEach((q, i) => {
            content += `Question ${i + 1}: ${q.question}\n`;
            content += `[${q.marks} marks]\n\n`;
        });

        return content;
    };

    // If there are no questions, show a message
    if (shortQuestions.length === 0 && longQuestions.length === 0) {
        return (
            <div className="backdrop-blur-md bg-white/60 rounded-2xl border border-white/40 shadow-xl overflow-hidden p-6 md:p-8 text-center">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Paper Structure</h2>
                <p className="text-gray-600">Generate questions to see your paper structure here.</p>
            </div>
        );
    }

    return (
        <div className="backdrop-blur-md bg-white/60 rounded-2xl border border-white/40 shadow-xl overflow-hidden print:shadow-none print:border-none">
            <div className="p-6 md:p-8 print:p-4">
                {/* Paper Header */}
                <div className="mb-8 print:mb-4">
                    {editing ? (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Paper Title</label>
                                <input
                                    type="text"
                                    value={paperTitle}
                                    onChange={(e) => setPaperTitle(e.target.value)}
                                    className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Course Information</label>
                                <input
                                    type="text"
                                    value={courseInfo}
                                    onChange={(e) => setCourseInfo(e.target.value)}
                                    className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Instructions</label>
                                <textarea
                                    value={instructions}
                                    onChange={(e) => setInstructions(e.target.value)}
                                    className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg"
                                    rows={2}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">Time Allowed</label>
                                    <input
                                        type="text"
                                        value={timeAllowed}
                                        onChange={(e) => setTimeAllowed(e.target.value)}
                                        className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">Total Marks</label>
                                    <input
                                        type="text"
                                        value={totalMarks}
                                        onChange={(e) => setTotalMarks(e.target.value)}
                                        className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg"
                                    />
                                </div>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={handleSaveMetadata}
                                    className="px-4 py-2 bg-green-500 text-white rounded-lg flex items-center"
                                >
                                    <Save className="w-4 h-4 mr-2" />
                                    Save
                                </button>
                                <button
                                    onClick={() => setEditing(false)}
                                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg flex items-center"
                                >
                                    <XCircle className="w-4 h-4 mr-2" />
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center mb-6 relative print:mb-8">
                            <button
                                onClick={() => setEditing(true)}
                                className="absolute right-0 top-0 p-1 text-blue-600 hover:bg-blue-50 rounded print:hidden"
                                title="Edit paper details"
                            >
                                <Edit className="w-4 h-4" />
                            </button>
                            <h1 className="text-2xl font-bold mb-2">{paperTitle}</h1>
                            <p className="text-lg mb-2">{courseInfo}</p>
                            <div className="flex justify-center space-x-8 mb-3">
                                <p className="text-sm"><span className="font-medium">Time:</span> {timeAllowed}</p>
                                <p className="text-sm"><span className="font-medium">Total Marks:</span> {totalMarks}</p>
                            </div>
                            <p className="text-sm text-gray-700 max-w-2xl mx-auto">{instructions}</p>
                        </div>
                    )}

                    {/* Action Buttons - only visible in non-print mode */}
                    <div className="flex justify-center space-x-4 mt-6 print:hidden">
                        <button
                            onClick={handlePrintPaper}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center"
                        >
                            <Printer className="w-4 h-4 mr-2" />
                            Print Paper
                        </button>
                        <button
                            onClick={handleDownloadPaper}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center"
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Download as Text
                        </button>
                    </div>
                </div>

                {/* Short Questions Section */}
                {shortQuestions.length > 0 && (
                    <div className="mb-8 print:mb-6">
                        <h2 className="text-xl font-semibold mb-4 border-b pb-2 print:text-lg">
                            Section 1: Short Questions (Choose 5 of 6)
                        </h2>
                        <div className="space-y-4">
                            {shortQuestions.map((question, index) => (
                                <div key={`short-${index}`} className="print:mb-4">
                                    <QuestionEditor
                                        question={question}
                                        questionType="short"
                                        index={index}
                                        onSave={(updatedQuestion) => onUpdateQuestion(updatedQuestion, 'short')}
                                        onCancel={() => {}}
                                        onDelete={() => onDeleteQuestion(question, 'short')}
                                        onRegenerate={() => onRegenerateQuestion(question, 'short')}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Long Questions Section */}
                {longQuestions.length > 0 && (
                    <div>
                        <h2 className="text-xl font-semibold mb-4 border-b pb-2 print:text-lg">
                            Section 2: Long Questions (Choose 2 of 4)
                        </h2>
                        <div className="space-y-4">
                            {longQuestions.map((question, index) => (
                                <div key={`long-${index}`} className="print:mb-4">
                                    <QuestionEditor
                                        question={question}
                                        questionType="long"
                                        index={index}
                                        onSave={(updatedQuestion) => onUpdateQuestion(updatedQuestion, 'long')}
                                        onCancel={() => {}}
                                        onDelete={() => onDeleteQuestion(question, 'long')}
                                        onRegenerate={() => onRegenerateQuestion(question, 'long')}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaperStructure;