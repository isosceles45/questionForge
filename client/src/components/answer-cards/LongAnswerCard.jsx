// Long Answer Card
import {AlertCircle, Award, Clock} from "lucide-react";
import {useState} from "react";

export const LongAnswerCard = ({ question, index }) => {
    const [showFullAnswer, setShowFullAnswer] = useState(false);

    // For long answers, show a preview with option to expand
    const answerText = question.model_answer || question.answer;
    const answerPreview = answerText.length > 250 && !showFullAnswer
        ? answerText.substring(0, 250) + "..."
        : answerText;

    return (
        <div className="mb-6 bg-neutral-800/50 border border-neutral-700 rounded-lg overflow-hidden">
            <div className="p-4 border-b border-neutral-700">
                <div className="flex justify-between items-start">
                    <div>
                        <span className="inline-block px-2 py-1 text-xs rounded-full border border-orange-500 text-orange-500 mb-2">
                            Question {index + 1}
                        </span>
                        <h3 className="text-lg font-semibold text-neutral-100">
                            {question.question}
                        </h3>
                    </div>
                    <div className="flex flex-col gap-2">
                        <span className="px-3 py-1 font-medium text-xs text-center bg-orange-500/20 text-orange-400 rounded-full flex items-center">
                            <Award size={12} className="mr-1" /> {question.marks} marks
                        </span>
                        <span className="px-3 py-1 font-medium text-xs text-center bg-neutral-600/40 text-neutral-300 rounded-full flex items-center">
                            <Clock size={12} className="mr-1" /> {question.word_limit} words
                        </span>
                    </div>
                </div>
            </div>

            <div className="p-4">
                <div className="space-y-3">
                    <h4 className="font-medium text-neutral-300">
                        Model Answer:
                    </h4>
                    <div className="p-3 rounded-lg border border-neutral-600 bg-neutral-700/30">
                        <p className="text-neutral-300 whitespace-pre-line">
                            {answerPreview}
                        </p>
                        {answerText.length > 250 && (
                            <button
                                onClick={() => setShowFullAnswer(!showFullAnswer)}
                                className="mt-2 text-sm text-orange-400 hover:text-orange-300"
                            >
                                {showFullAnswer ? "Show less" : "Show full answer"}
                            </button>
                        )}
                    </div>
                </div>

                {/* Show keywords if available */}
                {question.keywords && question.keywords.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-neutral-700">
                        <div className="flex items-start gap-2">
                            <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5" />
                            <div>
                                <h4 className="font-medium text-orange-500 mb-1">
                                    Key Concepts
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {question.keywords.map((keyword, i) => (
                                        <span key={i} className="px-2 py-1 bg-neutral-700 rounded-full text-xs text-neutral-300">
                                            {keyword}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Show marking scheme if available, otherwise explanation */}
                {(question.marking_scheme && question.marking_scheme.length > 0) ? (
                    <div className="mt-4 pt-4 border-t border-neutral-700">
                        <div className="flex items-start gap-2">
                            <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5" />
                            <div>
                                <h4 className="font-medium text-orange-500 mb-1">
                                    Marking Scheme
                                </h4>
                                <ul className="text-neutral-300 list-disc ml-4">
                                    {question.marking_scheme.map((point, i) => (
                                        <li key={i} className="mt-1">{point}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                ) : question.explanation ? (
                    <div className="mt-4 pt-4 border-t border-neutral-700">
                        <div className="flex items-start gap-2">
                            <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5" />
                            <div>
                                <h4 className="font-medium text-orange-500 mb-1">
                                    Explanation
                                </h4>
                                <p className="text-neutral-300">{question.explanation}</p>
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
};