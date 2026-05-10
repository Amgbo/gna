"use client";

import React from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "../context/auth";

interface OAuthProvidersProps {
  children: React.ReactNode;
}

export default function OAuthProviders({ children }: OAuthProvidersProps) {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  // In local dev misconfiguration is common; show a clearer runtime message in the UI.
  if (!googleClientId) {
    return (
      <div style={{ padding: 16, color: "#b91c1c", fontFamily: "system-ui" }}>
        Google OAuth not configured: set NEXT_PUBLIC_GOOGLE_CLIENT_ID in frontend/.env.local
      </div>
    );
  }

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <AuthProvider>{children}</AuthProvider>
    </GoogleOAuthProvider>
  );
}

