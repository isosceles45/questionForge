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
        <div
            className={`flex flex-col items-center transition-all duration-300 ${
                response ? "w-40" : "w-12"
            }`}
        >
            <button
                onClick={onRegenerateClick}
                className={`flex flex-col items-center justify-center px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors w-full mb-4 ${
                    response ? "block" : "hidden"
                }`}
            >
                <RefreshCw className="w-6 h-6" />
                {response && (
                    <span className="mt-2 text-xs">Generate Again</span>
                )}
            </button>

            <button
                onClick={() => handleDownload(false)}
                className="flex flex-col items-center justify-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors w-full mb-4"
            >
                <FileText className="w-6 h-6" />
                {response && (
                    <span className="mt-2 text-xs">Question Paper</span>
                )}
            </button>

            <button
                onClick={() => handleDownload(true)}
                className="flex flex-col items-center justify-center px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors w-full mb-4"
            >
                <FileCheck className="w-6 h-6" />
                {response && <span className="mt-2 text-xs">With Answers</span>}
            </button>

            <button className="flex flex-col items-center justify-center px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors w-full mb-4">
                <Mail className="w-6 h-6" />
                {response && (
                    <span className="mt-2 text-xs">Get via Email</span>
                )}
            </button>
        </div>
    );
};

export default QuestionActions;
