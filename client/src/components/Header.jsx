import { useClerk, UserButton, SignedIn, SignedOut } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const Header = () => {
    const { signOut } = useClerk();
    const navigate = useNavigate();

    const handleSignOut = async () => {
        await signOut();
        navigate("/sign-in");
    };

    const handleClick = () => {
        navigate("/");
    };

    return (
        <header className="bg-neutral-800 shadow-lg">
            <div className="container mx-auto flex justify-between items-center py-6 px-6">
                <h1
                    onClick={handleClick}
                    className="text-3xl font-extrabold text-orange-500 cursor-pointer transition-transform transform hover:scale-105"
                >
                    Question Forge
                </h1>
                <nav className="flex items-center space-x-6">
                    <button
                        onClick={() => navigate("/generate")}
                        className="px-4 py-2 font-bold text-neutral-100 hover:text-orange-500 transition-colors"
                    >
                        Generate
                    </button>
                    <button
                        onClick={() => navigate("/repository")}
                        className="px-4 py-2 font-bold text-neutral-100 hover:text-orange-500 transition-colors"
                    >
                        Repository
                    </button>
                    <SignedOut>
                        <button
                            onClick={() => navigate("/sign-in")}
                            className="px-4 py-2 font-bold text-neutral-100 hover:text-orange-500 transition-colors"
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => navigate("/sign-up")}
                            className="px-4 py-2 font-bold bg-orange-500 text-neutral-100 rounded hover:bg-orange-600 transition-colors"
                        >
                            Sign Up
                        </button>
                    </SignedOut>
                    <SignedIn>
                        <UserButton
                            afterSignOut={handleSignOut}
                            className="text-neutral-100 hover:text-orange-500 transition-colors"
                        />
                    </SignedIn>
                </nav>
            </div>
        </header>
    );
};

export default Header;
