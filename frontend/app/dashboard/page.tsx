"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }

    async function routeByRole() {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";
        const res = await fetch(`${baseUrl}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) {
          router.replace("/login");
          return;
        }

        const payload = await res.json();
        const role = payload.data?.role;

        if (role === "ADMIN") {
          router.replace("/dashboard/admin");
        } else if (role === "LANDLORD") {
          router.replace("/dashboard/landlord");
        } else {
          router.replace("/bookings");
        }
      } catch {
        router.replace("/login");
      }
    }

    routeByRole();
  }, [router]);

  return <div className="soft-card rounded-[28px] p-8 text-slate-600">Loading dashboard...</div>;
}