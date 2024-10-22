import React from "react";
import { FaTwitter, FaFacebook, FaLinkedin, FaInstagram } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="bg-neutral-950 text-neutral-300 py-8 mt-5">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-4 md:mb-0">
                        <h2 className="text-2xl font-bold text-orange-500">
                            Question Forge
                        </h2>
                        <p className="text-xl">
                            Revolutionizing assessment processes with AI
                        </p>
                        <p className="text-xl my-2">
                            Join us on our journey to transform education
                            through innovative technology.
                        </p>
                    </div>
                    <ul className="flex space-x-6 mb-4 md:mb-0">
                        <li>
                            <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center text-base hover:text-orange-400 transition-colors duration-200"
                            >
                                <FaTwitter className="mr-2" />
                                Twitter
                            </a>
                        </li>
                        <li>
                            <a
                                href="https://facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center text-base hover:text-orange-400 transition-colors duration-200"
                            >
                                <FaFacebook className="mr-2" />
                                Facebook
                            </a>
                        </li>
                        <li>
                            <a
                                href="https://linkedin.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center text-base hover:text-orange-400 transition-colors duration-200"
                            >
                                <FaLinkedin className="mr-2" />
                                LinkedIn
                            </a>
                        </li>
                        <li>
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center text-base hover:text-orange-400 transition-colors duration-200"
                            >
                                <FaInstagram className="mr-2" />
                                Instagram
                            </a>
                        </li>
                    </ul>
                </div>
                <div className="text-center mt-4">
                    <p className="text-base">
                        &copy; {new Date().getFullYear()} Question Forge. All
                        rights reserved.
                    </p>
                    <p className="text-sm mt-1">
                        Created with ❤️ by the Question Forge team. For
                        inquiries, contact us at{" "}
                        <a
                            href="mailto:support@questionforge.com"
                            className="text-orange-500 hover:underline"
                        >
                            support@questionforge.com
                        </a>
                        .
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
