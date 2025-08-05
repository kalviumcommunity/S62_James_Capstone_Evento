import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { ClerkProvider } from "@clerk/clerk-react"
import { Routes, Route, useNavigate } from "react-router-dom";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk publishable key");
}

// 👇 Custom component to use useNavigate safely
function ClerkWithNavigateProvider() {
  const navigate = useNavigate();

  return (
    <ClerkProvider
  publishableKey={PUBLISHABLE_KEY}
  navigate={(to) => navigate(to)}
  appearance={{ baseTheme: undefined }}
  signInUrl="/sign-in"
  signUpUrl="/sign-up"
  fallbackRedirectUrl="/"     // ✅ Replaces afterSignInUrl
  forceRedirectUrl="/"        // ✅ Replaces afterSignUpUrl
>
  <App />
</ClerkProvider>

  );
}

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ClerkWithNavigateProvider />
  </BrowserRouter>
);
