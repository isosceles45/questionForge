import { SignIn as ClerkSignIn } from "@clerk/clerk-react";

const SignIn = () => {
    return (
        <div className="min-h-screen bg-neutral-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <ClerkSignIn
                    appearance={{
                        elements: {
                            formButtonPrimary:
                                "bg-orange-500 hover:bg-orange-600 text-white",
                            footerActionLink:
                                "text-orange-500 hover:text-orange-600",
                            card: "bg-white shadow-xl rounded-lg p-8",
                        },
                    }}
                    path="/sign-in"
                    routing="path"
                    signUpUrl="/sign-up"
                />
            </div>
        </div>
    );
};

export default SignIn;
