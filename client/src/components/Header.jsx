import { useClerk, UserButton, SignedIn, SignedOut } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const Header = () => {
    const { signOut } = useClerk();
    const navigate = useNavigate();

    const handleSignOut = async () => {
        await signOut();
        navigate("/sign-in");
    };

    return (
        <header className="bg-neutral-800 shadow-lg">
            <div className="container mx-auto px-4 py-3">
                <div className="flex justify-between items-center">
                    <div className="text-2xl font-bold text-orange-600">
                        Question Forge
                    </div>
                    <div className="flex items-center space-x-4">
                        <SignedIn>
                            <nav className="flex items-center space-x-4">
                                <a
                                    href="/dashboard"
                                    className="text-neutral-100 font-bold hover:text-orange-500"
                                >
                                    Generate
                                </a>
                                <UserButton
                                    appearance={{
                                        elements: {
                                            userButtonBox: "hover:bg-orange-50",
                                            userButtonTrigger:
                                                "focus:shadow-orange-500",
                                        },
                                    }}
                                />
                            </nav>
                        </SignedIn>
                        <SignedOut>
                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={() => navigate("/sign-in")}
                                    className="px-4 py-2 font-bold text-neutral-100 hover:text-orange-500"
                                >
                                    Sign In
                                </button>
                                <button
                                    onClick={() => navigate("/sign-up")}
                                    className="px-4 py-2 font-bold bg-orange-500 text-neutral-100 rounded hover:bg-orange-600 transition-colors"
                                >
                                    Sign Up
                                </button>
                            </div>
                        </SignedOut>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
