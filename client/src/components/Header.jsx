import { useClerk, UserButton, SignedIn, SignedOut } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown, ChevronUp } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const Header = () => {
    const { signOut } = useClerk();
    const navigate = useNavigate();
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [generateDropdownOpen, setGenerateDropdownOpen] = useState(false);
    const generateDropdownRef = useRef(null);

    // Track scroll position for header styling
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (generateDropdownRef.current && !generateDropdownRef.current.contains(event.target)) {
                setGenerateDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSignOut = async () => {
        await signOut();
        navigate("/sign-in");
    };

    const handleClick = () => {
        navigate("/");
    };

    const toggleGenerateDropdown = () => {
        setGenerateDropdownOpen(!generateDropdownOpen);
    };

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                isScrolled
                    ? "bg-white/80 backdrop-blur-md shadow-lg py-3"
                    : "bg-transparent py-5"
            }`}
        >
            <div className="container mx-auto flex justify-between items-center px-6">
                <h1
                    onClick={handleClick}
                    className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text cursor-pointer transition-transform transform hover:scale-105"
                >
                    Question Forge
                </h1>

                {/* Mobile menu button */}
                <button
                    className="md:hidden text-gray-800"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-6">
                    {/* Generate button with dropdown */}
                    <div className="relative" ref={generateDropdownRef}>
                        <button
                            onClick={toggleGenerateDropdown}
                            className="px-4 py-2 font-semibold text-gray-700 hover:text-blue-600 transition-colors flex items-center"
                        >
                            Generate
                            {generateDropdownOpen ? (
                                <ChevronUp size={16} className="ml-1" />
                            ) : (
                                <ChevronDown size={16} className="ml-1" />
                            )}
                        </button>

                        {/* Generate dropdown */}
                        {generateDropdownOpen && (
                            <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-100 w-64 overflow-hidden z-50">
                                <button
                                    onClick={() => {
                                        navigate("/generate");
                                        setGenerateDropdownOpen(false);
                                    }}
                                    className="w-full text-left px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                >
                                    All Types of Questions
                                </button>
                                <button
                                    onClick={() => {
                                        navigate("/generate/mid-term");
                                        setGenerateDropdownOpen(false);
                                    }}
                                    className="w-full text-left px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                >
                                    Mid-Term Questions
                                </button>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => navigate("/syllabus")}
                        className="px-4 py-2 font-semibold text-gray-700 hover:text-blue-600 transition-colors"
                    >
                        Syllabus
                    </button>
                    <SignedOut>
                        <button
                            onClick={() => navigate("/sign-in")}
                            className="px-4 py-2 font-semibold text-gray-700 hover:text-blue-600 transition-colors"
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => navigate("/sign-up")}
                            className="px-4 py-2 font-semibold bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full hover:shadow-lg hover:shadow-blue-300/50 transition-all transform hover:-translate-y-1"
                        >
                            Sign Up
                        </button>
                    </SignedOut>
                    <SignedIn>
                            <UserButton
                                afterSignOut={handleSignOut}
                            />
                    </SignedIn>
                </nav>
            </div>

            {/* Mobile Navigation - Slide down menu */}
            <div
                className={`md:hidden absolute top-full left-0 right-0 bg-white/90 backdrop-blur-md shadow-lg transition-all duration-300 overflow-hidden ${
                    mobileMenuOpen ? "max-h-screen" : "max-h-0"
                }`}
            >
                <div className="container mx-auto px-6 py-4 flex flex-col space-y-4">
                    {/* Mobile Generate dropdown */}
                    <div className="flex flex-col">
                        <button
                            onClick={toggleGenerateDropdown}
                            className="px-4 py-3 font-semibold text-gray-700 hover:text-blue-600 border-b border-gray-100 flex justify-between items-center"
                        >
                            Generate
                            {generateDropdownOpen ? (
                                <ChevronUp size={16} />
                            ) : (
                                <ChevronDown size={16} />
                            )}
                        </button>

                        {generateDropdownOpen && (
                            <div className="bg-gray-50 rounded-md mx-2">
                                <button
                                    onClick={() => {
                                        navigate("/generate");
                                        setMobileMenuOpen(false);
                                    }}
                                    className="w-full text-left px-6 py-3 text-gray-700 hover:text-blue-600 border-b border-gray-100"
                                >
                                    All Types of Questions
                                </button>
                                <button
                                    onClick={() => {
                                        navigate("/generate/mid-term");
                                        setMobileMenuOpen(false);
                                    }}
                                    className="w-full text-left px-6 py-3 text-gray-700 hover:text-blue-600"
                                >
                                    Mid-Term Questions
                                </button>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => {
                            navigate("/syllabus");
                            setMobileMenuOpen(false);
                        }}
                        className="px-4 py-3 font-semibold text-gray-700 hover:text-blue-600 border-b border-gray-100"
                    >
                        Syllabus
                    </button>
                    <SignedOut>
                        <button
                            onClick={() => {
                                navigate("/sign-in");
                                setMobileMenuOpen(false);
                            }}
                            className="px-4 py-3 font-semibold text-gray-700 hover:text-blue-600 border-b border-gray-100"
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => {
                                navigate("/sign-up");
                                setMobileMenuOpen(false);
                            }}
                            className="px-4 py-3 font-semibold bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full"
                        >
                            Sign Up
                        </button>
                    </SignedOut>
                    <SignedIn>
                        <UserButton afterSignOut={handleSignOut} />
                    </SignedIn>
                </div>
            </div>
        </header>
    );
};

export default Header;