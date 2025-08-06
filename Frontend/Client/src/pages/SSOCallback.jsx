// src/SSOCallback.jsx
import { useEffect } from "react";
import { useClerk } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const SSOCallback = () => {
  const { handleRedirectCallback } = useClerk();
  const navigate = useNavigate();

  useEffect(() => {
    async function finalizeAuth() {
      try {
        await handleRedirectCallback();
        navigate("/"); // 👈 after successful login
      } catch (err) {
        console.error("Error during SSO callback:", err);
      }
    }

    finalizeAuth();
  }, []);

  return <p>Signing you in...</p>;
};

export default SSOCallback;
