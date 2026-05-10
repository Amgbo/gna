"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "../../components/ui/Card";

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

  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <Card variant="elevated" padding="lg">
        <CardContent className="flex flex-col items-center gap-4 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <div>
            <p className="font-medium text-foreground">Loading Dashboard</p>
            <p className="text-sm text-muted-foreground">
              Redirecting you to the right place...
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
