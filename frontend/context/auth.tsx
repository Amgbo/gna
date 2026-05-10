"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch, getApiBaseUrl } from "../lib/api";

type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  refresh: () => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  async function refresh() {
    const nextToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    setToken(nextToken);

    if (!nextToken) {
      setUser(null);
      return;
    }

    try {
      const data = await apiFetch<AuthUser>("/api/auth/me", { token: nextToken });
      setUser(data as unknown as AuthUser);
    } catch {
      // invalid/expired token
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
    }
  }

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        await refresh();
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isLoading,
      refresh,
      logout: () => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
        router.push("/");
        router.refresh();
      }
    }),
    [router, token, user, isLoading]
  );


  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

