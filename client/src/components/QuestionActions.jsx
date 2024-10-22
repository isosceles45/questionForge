import React from "react";
import { Mail, RefreshCw, FileText, FileCheck } from "lucide-react";
import { generateQuestionsPDF } from "../utils/pdfGenerator";

const QuestionActions = ({ response, type, onRegenerateClick }) => {
    const handleDownload = (includeAnswers) => {
        if (!response || !response.questions) return;

        const doc = generateQuestionsPDF(
            response.questions,
            type,
            includeAnswers
        );
        const fileName = `${type}_questions_${
            includeAnswers ? "with_answers_" : ""
        }${new Date().toISOString().split("T")[0]}.pdf`;
        doc.save(fileName);
    };

    return (
        <div className="flex flex-col items-center gap-3">
            <button
                onClick={onRegenerateClick}
                disabled={!response}
                className={`flex items-center justify-center px-4 py-3 rounded w-full mb-4 
                    ${
                        response
                            ? "bg-orange-500 hover:bg-orange-600 text-white"
                            : "bg-orange-900  cursor-not-allowed"
                    }`}
            >
                <RefreshCw className="w-5 h-5 mr-2" />
                <span className="text-md font-bold">Generate Again</span>
            </button>

            <button
                onClick={() => handleDownload(false)}
                disabled={!response}
                className={`flex items-center justify-center px-4 py-3 rounded w-full mb-4 
                    ${
                        response
                            ? "bg-blue-500 hover:bg-blue-600 text-white"
                            : "bg-blue-900 cursor-not-allowed"
                    }`}
            >
                <FileText className="w-5 h-5 mr-2" />
                <span className="text-md font-bold">Question Paper</span>
            </button>

            <button
                onClick={() => handleDownload(true)}
                disabled={!response}
                className={`flex items-center justify-center px-4 py-3 rounded w-full mb-4 
                    ${
                        response
                            ? "bg-green-500 hover:bg-green-600 text-white"
                            : "bg-green-900 cursor-not-allowed"
                    }`}
            >
                <FileCheck className="w-5 h-5 mr-2" />
                <span className="text-md font-bold">With Answers</span>
            </button>

            <button
                disabled={!response}
                className={`flex items-center justify-center px-4 py-3 rounded w-full mb-4 
                    ${
                        response
                            ? "bg-purple-500 hover:bg-purple-600 text-white"
                            : "bg-purple-900  cursor-not-allowed"
                    }`}
            >
                <Mail className="w-5 h-5 mr-2" />
                <span className="text-md font-bold">Get via Email</span>
            </button>
        </div>
    );
};

export default QuestionActions;
