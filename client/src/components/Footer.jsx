import { Heart } from "lucide-react";

const Footer = () => {
    return (
        <footer className="bg-gradient-to-br from-white to-purple-50 text-gray-800 overflow-hidden py-16">
            <div className="container mx-auto px-4 z-10">
                <div className="text-center backdrop-blur-md bg-white/60 border border-white/40 p-6 md:p-8 rounded-xl shadow-md hover:shadow-blue-100/50 transition-all">
                    <div className="mb-6 opacity-60">
                        <div className="w-16 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full"></div>
                    </div>

                    <p className="text-gray-700 mb-3 font-medium">
                        &copy; {new Date().getFullYear()} Question Forge. All rights reserved.
                    </p>

                    <p className="text-sm text-gray-600 flex items-center justify-center gap-1">
                        Created with
                        <Heart size={14} className="text-red-500 fill-red-500 inline mx-1" />
                        by the Question Forge team. For inquiries, contact us at{" "}
                        <a
                            href="mailto:atharvasardal06@gmail.com"
                            className="bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text hover:underline font-medium ml-1"
                        >
                            atharvasardal06@gmail.com
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;