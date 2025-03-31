import { ClerkProvider, SignedIn } from "@clerk/clerk-react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import SignIn from "./components/SignIn";
import Dashboard from "./components/generate/Dashboard.jsx";
import SignUp from "./components/SignUp";
import Home from "./components/Home";
import Footer from "./components/Footer";
import MidtermPaperGenerator from "./components/mid-term/MidtermPaperGenerator.jsx";
import Syllabus from "./components/syllabus/Syllabus.jsx";

const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

function App() {
    return (
        <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
            <BrowserRouter>
                <div className="min-h-screen bg-neutral-900">
                    <Header />
                    <Routes>
                        <Route path="/sign-in" element={<SignIn />} />
                        <Route path="/sign-in/factor-one" element={<SignIn />} />
                        <Route path="/sign-up" element={<SignUp />} />
                        <Route
                            path="/sign-up/verify-email-address"
                            element={<SignUp />}
                        />
                        <Route
                            path="/generate"
                            element={
                                <ProtectedRoute>
                                    <Dashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/generate/mid-term"
                            element={
                                <ProtectedRoute>
                                    <MidtermPaperGenerator />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/syllabus"
                            element={
                                <ProtectedRoute>
                                    <Syllabus />
                                </ProtectedRoute>
                            }
                        />
                        <Route path="/" element={<Home />} />
                    </Routes>
                    <Footer/>
                </div>
            </BrowserRouter>
        </ClerkProvider>
    );
}

// ProtectedRoute component
const ProtectedRoute = ({ children }) => {
    return <SignedIn>{children}</SignedIn>;
};

export default App;
