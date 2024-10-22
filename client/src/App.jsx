import { ClerkProvider, SignedIn } from "@clerk/clerk-react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Header from "./components/Header";
import SignIn from "./components/SignIn";
import Dashboard from "./components/Dashboard";
import SignUp from "./components/SignUp";

const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

function App() {
  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-100">
          <Header />
          <Routes>
            <Route
              path="/"
              element={
                <SignedIn>
                  <Navigate to="/dashboard" replace />
                </SignedIn>
              }
            />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/sign-up/verify-email-address" element={<SignUp />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </BrowserRouter>
    </ClerkProvider>
  );
}

// ProtectedRoute component
const ProtectedRoute = ({ children }) => {
  return (
    <SignedIn>
      {children}
    </SignedIn>
  );
};

export default App;