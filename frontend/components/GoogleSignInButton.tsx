"use client";

import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface GoogleSignInButtonProps {
  onSuccess?: (user: { id: string; email: string; name: string }) => void;
  isLoading?: boolean;
}

export default function GoogleSignInButton({ onSuccess, isLoading }: GoogleSignInButtonProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    setLoading(true);
    setError(null);

    try {
      // TEMP DEBUG: decode ID token and log claims to help diagnose clock issues
      try {
        const idToken = credentialResponse.credential;
        if (idToken) {
          const parts = idToken.split('.');
          if (parts.length >= 2) {
            const payload = JSON.parse(atob(parts[1]));
            console.info('Google ID token claims (frontend):', payload);
          }
        }
      } catch (decodeErr) {
        console.warn('Failed to decode Google ID token on client:', decodeErr);
      }

      const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";
      const res = await fetch(`${baseUrl}/api/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: credentialResponse.credential })
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        setError(payload.message || "Google sign-in failed");
        return;
      }

      const payload = await res.json();
      if (payload.token) {
        localStorage.setItem("token", payload.token);
      }

      if (onSuccess) {
        onSuccess(payload.user);
      } else {
        router.push("/");
      }
    } catch (err) {
      setError("Google sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  const handleError = () => {
    setError("Failed to initialize Google Sign-In");
  };

  return (
    <div className="space-y-2">
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}
      <div className="flex justify-center rounded-2xl border border-slate-200 bg-white p-3">
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={handleError}
          locale="en"
          theme="outline"
        />
      </div>
    </div>
  );
}
