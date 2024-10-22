import { SignUp as ClerkSignUp } from "@clerk/clerk-react";

const SignUp = () => {
    return (
        <div className="min-h-screen bg-neutral-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <ClerkSignUp
                    appearance={{
                        elements: {
                            formButtonPrimary:
                                "bg-orange-500 hover:bg-orange-600 text-white",
                            footerActionLink:
                                "text-orange-500 hover:text-orange-600",
                            card: "bg-white shadow-xl rounded-lg p-8",
                        },
                    }}
                    path="/sign-up"
                    routing="path"
                    signInUrl="/sign-in"
                />
            </div>
        </div>
    );
};

export default SignUp;

