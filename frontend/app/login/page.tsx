"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Building2, ArrowRight, Mail, Lock } from "lucide-react";
import GoogleSignInButton from "../../components/GoogleSignInButton";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Card, CardContent } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";
      const res = await fetch(`${baseUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        setError(payload.message || "Login failed");
        return;
      }

      const payload = await res.json();
      if (payload.token) {
        localStorage.setItem("token", payload.token);
      }

      router.push("/");
    } catch {
      setError("Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-[calc(100vh-12rem)] lg:grid-cols-2 gap-8 lg:gap-12 items-center">
      {/* Form Section */}
      <div className="w-full max-w-md mx-auto lg:mx-0">
        <Link href="/" className="mb-8 inline-flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Building2 className="h-5 w-5" />
          </span>
          <span className="font-display text-xl font-bold text-foreground">GNA Hostels</span>
        </Link>

        <div className="mb-8 space-y-3">
          <Badge variant="primary">Student Sign In</Badge>
          <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
            Welcome back
          </h1>
          <p className="text-muted-foreground">
            Access your saved hostels, bookings, and reviews.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
            {error}
          </div>
        )}

        <Card padding="lg">
          <CardContent className="space-y-6">
            <GoogleSignInButton />

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-card px-3 text-muted-foreground">
                  or sign in with email
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                leftIcon={<Mail className="h-4 w-4" />}
              />

              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                leftIcon={<Lock className="h-4 w-4" />}
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={loading}
                className="w-full"
              >
                Sign In
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>

            <div className="rounded-lg bg-muted p-4 text-sm">
              <p className="font-semibold text-foreground">New here?</p>
              <p className="mt-1 text-muted-foreground">
                Create an account to save hostels and book faster.
              </p>
              <Link href="/register" className="mt-4 block">
                <Button variant="outline" className="w-full">
                  Create an Account
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Hero Image Section */}
      <div className="relative hidden lg:block">
        <div className="overflow-hidden rounded-2xl shadow-soft-xl">
          <div
            className="aspect-[4/5] bg-cover bg-center"
            style={{ backgroundImage: 'url("/Scholars-Institute-building.png")' }}
          />
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-foreground/80 via-foreground/40 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-8 text-background">
            <h2 className="font-display text-2xl font-bold mb-3">
              Find your perfect hostel
            </h2>
            <p className="text-background/80 mb-6">
              Search verified hostels, compare prices, and book with confidence.
            </p>

            <div className="grid grid-cols-3 gap-4">
              {[
                { value: "500+", label: "Listings" },
                { value: "24h", label: "Support" },
                { value: "4.8", label: "Rating" }
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-lg bg-background/10 p-3 backdrop-blur-sm border border-background/10"
                >
                  <p className="text-xl font-bold text-background">{stat.value}</p>
                  <p className="text-xs text-background/70">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
