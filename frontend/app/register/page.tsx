"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Building2, ArrowRight, CheckCircle2, Circle, Mail, Lock, User } from "lucide-react";
import GoogleSignInButton from "../../components/GoogleSignInButton";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Card, CardContent } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const passwordChecks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
    special: /[@$!%*?&]/.test(password)
  };

  const isPasswordValid = Object.values(passwordChecks).every(Boolean);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!isPasswordValid) {
      setError("Password does not meet security requirements");
      setLoading(false);
      return;
    }

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";
      const res = await fetch(`${baseUrl}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name })
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        setError(payload.message || "Registration failed");
        return;
      }

      const payload = await res.json();
      if (payload.token) {
        localStorage.setItem("token", payload.token);
      }

      router.push("/");
    } catch {
      setError("Registration failed");
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
          <Badge variant="secondary">Create Account</Badge>
          <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
            Join GNA Hostels
          </h1>
          <p className="text-muted-foreground">
            Save hostels, book faster, and manage everything in one place.
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
                  or register with email
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Full Name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                required
                leftIcon={<User className="h-4 w-4" />}
              />

              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                leftIcon={<Mail className="h-4 w-4" />}
              />

              <div>
                <Input
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a secure password"
                  required
                  leftIcon={<Lock className="h-4 w-4" />}
                />

                {password && (
                  <div className="mt-3 rounded-lg border border-border bg-muted p-4 space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Password Requirements
                    </p>
                    <div className="space-y-1.5">
                      <PasswordCheck met={passwordChecks.length} label="At least 8 characters" />
                      <PasswordCheck met={passwordChecks.uppercase} label="One uppercase letter (A-Z)" />
                      <PasswordCheck met={passwordChecks.number} label="One number (0-9)" />
                      <PasswordCheck met={passwordChecks.special} label="One special character (@$!%*?&)" />
                    </div>
                  </div>
                )}
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={loading}
                disabled={!isPasswordValid}
                className="w-full"
              >
                Create Account
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>

            <div className="rounded-lg bg-muted p-4 text-sm">
              <p className="font-semibold text-foreground">Already have an account?</p>
              <p className="mt-1 text-muted-foreground">
                Sign in to continue your hostel search.
              </p>
              <Link href="/login" className="mt-4 block">
                <Button variant="outline" className="w-full">
                  Sign In
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
              Your student housing journey starts here
            </h2>
            <p className="text-background/80 mb-6">
              Verified hostels, transparent pricing, and a seamless booking experience.
            </p>

            <div className="grid grid-cols-3 gap-4">
              {[
                { title: "Trust", desc: "Verified listings" },
                { title: "Speed", desc: "Fast booking" },
                { title: "Clarity", desc: "GHS pricing" }
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-lg bg-background/10 p-3 backdrop-blur-sm border border-background/10"
                >
                  <p className="text-xs uppercase tracking-wide text-background/60">{item.title}</p>
                  <p className="text-sm font-semibold text-background">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PasswordCheck({ met, label }: { met: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      {met ? (
        <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0" />
      ) : (
        <Circle className="h-4 w-4 text-border flex-shrink-0" />
      )}
      <span className={met ? "text-foreground" : ""}>{label}</span>
    </div>
  );
}
