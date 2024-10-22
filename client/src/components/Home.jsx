import React from "react";
import { BookOpen, BarChart2, Shield, ClipboardCheck } from "lucide-react";
import heroImage from "../assets/heroImage.jpg";
import platformImage from "../assets/platform.jpg";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate("/generate");
    };

    return (
        <div className="min-h-screen bg-neutral-900 text-neutral-100">
            {/* Hero Section */}
            <div className="relative">
                <div className="absolute inset-0">
                    <img
                        src={heroImage}
                        alt="Hero Background"
                        className="w-full h-full object-cover opacity-40"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-neutral-900/60 to-neutral-900"></div>
                </div>

                <div className="relative container mx-auto px-4 pt-20 pb-24">
                    <h1 className="text-5xl md:text-6xl font-bold text-center mb-6 bg-gradient-to-r from-orange-400 to-orange-600 text-transparent bg-clip-text">
                        Welcome to Question Forge
                    </h1>
                    <p className="text-xl md:text-2xl text-center mb-8 text-neutral-200 max-w-3xl mx-auto">
                        Revolutionizing the way question papers are generated
                        using Generative AI!
                    </p>
                    <div className="flex justify-center">
                        <button
                            onClick={handleClick}
                            className="bg-orange-500 text-white px-8 py-3 rounded-lg hover:bg-orange-600 transition-all transform hover:scale-105 font-semibold text-lg shadow-xl hover:shadow-orange-500/20"
                        >
                            Get Started
                        </button>
                    </div>
                </div>
            </div>

            {/* Features Grid */}
            <div className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    {[
                        {
                            icon: (
                                <BookOpen className="w-12 h-12 text-orange-500 mb-6" />
                            ),
                            title: "Smart Generation",
                            description:
                                "Generate customized question papers in minutes, not hours! Our AI ensures a variety of question types and difficulty levels tailored to your curriculum.",
                        },
                        {
                            icon: (
                                <BarChart2 className="w-12 h-12 text-orange-500 mb-6" />
                            ),
                            title: "Market Insights",
                            description:
                                "With a projected global market growth to USD 11.47 billion by 2027, our solution is positioned to meet the demands of modern educational assessments.",
                        },
                        {
                            icon: (
                                <Shield className="w-12 h-12 text-orange-500 mb-6" />
                            ),
                            title: "Enhanced Security",
                            description:
                                "Incorporating blockchain technology and multi-factor authentication to ensure the integrity and security of question papers.",
                        },
                        {
                            icon: (
                                <ClipboardCheck className="w-12 h-12 text-orange-500 mb-6" />
                            ),
                            title: "Proven Impact",
                            description:
                                "Achieve a 45% improvement in assessment quality and a 70% reduction in paper leaks with our AI-driven solution.",
                        },
                    ].map((feature, index) => (
                        <div
                            key={index}
                            className="bg-neutral-800/50 backdrop-blur border border-neutral-700 p-8 rounded-xl shadow-xl hover:shadow-orange-500/5 transition-all hover:-translate-y-1"
                        >
                            {feature.icon}
                            <h2 className="text-2xl font-bold mb-4 text-orange-400">
                                {feature.title}
                            </h2>
                            <p className="text-neutral-300 text-lg leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Platform Preview Section */}
                <div className="mb-20">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-orange-400">
                        Transform Your Assessment Process
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div className="order-2 md:order-1">
                            <h3 className="text-2xl font-bold mb-4 text-neutral-100">
                                Streamlined Question Generation
                            </h3>
                            <p className="text-neutral-300 text-lg mb-6 leading-relaxed">
                                Our platform leverages advanced AI to create
                                high-quality, diverse question sets that align
                                perfectly with your curriculum objectives.
                            </p>
                            <ul className="space-y-4">
                                {[
                                    "Customizable difficulty levels",
                                    "Multiple question formats",
                                    "Instant generation and export",
                                    "Smart content analysis",
                                ].map((feature, index) => (
                                    <li
                                        key={index}
                                        className="flex items-center text-neutral-200"
                                    >
                                        <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="order-1 md:order-2 flex justify-center">
                            <img
                                src={platformImage}
                                alt="Platform Preview"
                                className="rounded-xl shadow-2xl border border-neutral-700 max-w-xs md:max-w-md"
                            />
                        </div>
                    </div>
                </div>

                {/* Testimonials Section */}
                <div className="mb-20">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-orange-400">
                        What Our Users Say
                    </h2>
                    <div className="flex flex-col space-y-8">
                        {[
                            {
                                name: "Dr. Alice Smith",
                                feedback:
                                    "Question Forge has transformed the way I generate assessments. The AI technology is impressive and saves me so much time!",
                            },
                            {
                                name: "Mr. John Doe",
                                feedback:
                                    "The customization options are incredible. I can easily create question papers that meet my curriculum needs.",
                            },
                            {
                                name: "Prof. Jane Doe",
                                feedback:
                                    "A must-have tool for any educator! The platform is user-friendly, and the results are always of high quality.",
                            },
                        ].map((testimonial, index) => (
                            <div
                                key={index}
                                className="bg-neutral-800 p-6 rounded-lg shadow-lg"
                            >
                                <p className="text-neutral-300 italic mb-4">
                                    "{testimonial.feedback}"
                                </p>
                                <h3 className="text-orange-400 font-bold">
                                    - {testimonial.name}
                                </h3>
                            </div>
                        ))}
                    </div>
                </div>

                {/* FAQs Section */}
                <div className="mb-20">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-orange-400">
                        Frequently Asked Questions
                    </h2>
                    <div className="space-y-6">
                        {[
                            {
                                question: "How does the AI generate questions?",
                                answer: "Our AI uses advanced algorithms and data analysis to create high-quality, diverse questions tailored to your curriculum.",
                            },
                            {
                                question: "Can I customize the questions?",
                                answer: "Yes! You can customize difficulty levels, formats, and even the subject matter to fit your needs.",
                            },
                            {
                                question: "Is my data secure?",
                                answer: "Absolutely! We use blockchain technology and multi-factor authentication to ensure the integrity and security of your data.",
                            },
                        ].map((faq, index) => (
                            <div
                                key={index}
                                className="bg-neutral-800 p-6 rounded-lg shadow-lg"
                            >
                                <h3 className="text-orange-400 font-bold mb-2">
                                    {faq.question}
                                </h3>
                                <p className="text-neutral-300">{faq.answer}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA Section */}
                <div className="text-center py-12">
                    <h2 className="text-3xl font-bold mb-6 text-neutral-100">
                        Ready to Get Started?
                    </h2>
                    <p className="text-xl text-neutral-300 mb-8 max-w-2xl mx-auto">
                        Join thousands of educators who are already transforming
                        their assessment process with Question Forge.
                    </p>
                    <button className="bg-orange-500 text-white px-8 py-3 rounded-lg hover:bg-orange-600 transition-all transform hover:scale-105 font-semibold text-lg shadow-xl hover:shadow-orange-500/20">
                        Start Now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Home;