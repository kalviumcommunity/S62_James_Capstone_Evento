import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { ClerkProvider } from "@clerk/clerk-react";
import { BrowserRouter } from 'react-router-dom';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk publishable key");
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      appearance={{ baseTheme: undefined }}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      fallbackRedirectUrl="/"     // ✅ Replaces afterSignInUrl
      forceRedirectUrl="/"        // ✅ Replaces afterSignUpUrl
    >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ClerkProvider>
  </StrictMode>
);
