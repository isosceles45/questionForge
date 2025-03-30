import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { UICard01, UICard02, UICard03 } from "../utils/constant.jsx";
import QuestionPaperStack from "../components/QuestionPaperStack";

const Home = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate("/generate");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 text-gray-800">
            {/* Enhanced Hero Section with QuestionPaperStack */}
            {/* Enhanced Hero Section with QuestionPaperStack */}
            <div className="relative overflow-hidden">
                {/* Background gradient instead of image */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100/70 to-purple-100/70"></div>

                {/* Refined decorative elements */}
                <div className="absolute top-20 left-10 w-64 h-64 bg-blue-300/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-300/20 rounded-full blur-3xl"></div>
                <div className="absolute top-40 right-1/4 w-40 h-40 bg-blue-200/30 rounded-full blur-2xl"></div>

                <div className="relative container mx-auto px-4 py-16 md:py-24">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
                        {/* Left side: Text content with improved readability */}
                        <div className="md:w-1/2 p-4">
                            {/* Added a subtle effect to make the heading pop */}
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text leading-tight">
                                Generate Mumbai University Question Papers with Ease
                            </h1>

                            {/* Simplified text with improved spacing and fixed typos */}
                            <div className="space-y-4 mb-8">
                                <p className="text-lg md:text-xl text-gray-700 max-w-xl leading-relaxed">
                                    Create mid-term question papers and continuous assessment quizzes in one go!
                                </p>
                                <p className="text-lg md:text-xl text-gray-700 max-w-xl leading-relaxed">
                                    Store syllabus and PYQs in a GRAPH database for precise question generation and comprehensive knowledge mapping.
                                </p>
                            </div>

                            {/* Enhanced button with better accessibility */}
                            <button
                                onClick={handleClick}
                                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full hover:shadow-lg hover:shadow-blue-300/50 transition-all transform hover:-translate-y-1 font-semibold text-lg flex items-center"
                                aria-label="Get Started with Question Paper Generator"
                            >
                                Get Started
                                <ChevronRight className="ml-2 h-5 w-5" />
                            </button>
                        </div>

                        {/* Right side: Question Paper Stack with improved container */}
                        <div className="md:w-1/2 flex justify-center">
                            <div className="w-full max-w-md filter drop-shadow-xl">
                                <QuestionPaperStack />
                            </div>
                        </div>
                    </div>

                    {/* Added a quick features highlight section */}
                    <div className="hidden md:flex justify-center mt-12 pt-6 border-t border-blue-100">
                        <div className="flex flex-wrap justify-center gap-6">
                            <div className="flex items-center bg-white/60 px-4 py-2 rounded-full shadow-sm">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                                <span className="text-sm font-medium text-gray-700">AI-Powered Generation</span>
                            </div>
                            <div className="flex items-center bg-white/60 px-4 py-2 rounded-full shadow-sm">
                                <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                                <span className="text-sm font-medium text-gray-700">MU Guidelines Compliant</span>
                            </div>
                            <div className="flex items-center bg-white/60 px-4 py-2 rounded-full shadow-sm">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                                <span className="text-sm font-medium text-gray-700">Customizable Templates</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Features Grid with Glassmorphism Cards */}
            <div className="container mx-auto px-4 py-20">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-800">
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
                        Intelligent Assessment Solutions
                    </span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
                    {UICard01.map((feature, index) => (
                        <div
                            key={index}
                            className="backdrop-blur-md bg-white/60 border border-white/40 p-6 rounded-2xl shadow-xl hover:shadow-blue-200/50 transition-all hover:-translate-y-1"
                        >
                            <div className="bg-blue-50/70 p-4 rounded-full inline-block mb-4">
                                {feature.icon}
                            </div>
                            <h2 className="text-xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
                                {feature.title}
                            </h2>
                            <p className="text-gray-700 leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Testimonials Section with Improved Layout */}
                <div className="mb-24">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-800">
                        <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
                            What Educators Are Saying
                        </span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {UICard02.map((testimonial, index) => (
                            <div
                                key={index}
                                className="backdrop-blur-md bg-white/60 p-8 rounded-2xl shadow-xl border border-white/40 hover:shadow-blue-200/50 transition-all"
                            >
                                <div className="mb-6 text-blue-600">
                                    {"★".repeat(5)}
                                </div>
                                <p className="text-gray-700 italic mb-8 text-lg leading-relaxed">
                                    "{testimonial.feedback}"
                                </p>
                                <div className="flex items-center">
                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full mr-3 flex items-center justify-center text-white font-bold">
                                        {testimonial.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="text-gray-900 font-bold">
                                            {testimonial.name}
                                        </h3>
                                        <p className="text-gray-600">{testimonial.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* FAQs Section with Improved Glassmorphism */}
                <div className=" backdrop-blur-md bg-white/30 border border-white/40 p-10 rounded-2xl shadow-xl">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-800">
                        <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
                            Frequently Asked Questions
                        </span>
                    </h2>
                    <div className="space-y-6 max-w-4xl mx-auto">
                        {UICard03.map((faq, index) => (
                            <div
                                key={index}
                                className="bg-white/70 p-6 rounded-xl shadow-md border border-white/20 hover:shadow-blue-100 transition-all"
                            >
                                <h3 className="text-gray-900 font-bold text-xl mb-3 flex items-center">
                                    <span className="w-8 h-8 inline-flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full mr-3 text-sm">
                                        {index + 1}
                                    </span>
                                    {faq.question}
                                </h3>
                                <p className="text-gray-700 leading-relaxed pl-11">{faq.answer}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;