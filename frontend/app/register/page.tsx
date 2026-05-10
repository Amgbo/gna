"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Building2, ArrowRight, CheckCircle2, Circle } from "lucide-react";
import GoogleSignInButton from "../../components/GoogleSignInButton";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Password validation checklist
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
    } catch (err) {
      setError("Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-[calc(100vh-7rem)] overflow-hidden rounded-[36px] border border-white/70 bg-white/85 shadow-[0_30px_90px_rgba(15,23,42,0.12)] lg:grid-cols-[0.95fr_1.05fr]">
      <div className="flex flex-col justify-center px-6 py-12 sm:px-10 lg:px-14">
        <div className="mx-auto w-full max-w-md lg:mx-0">
          <Link href="/" className="mb-10 inline-flex items-center gap-3 text-2xl font-bold text-slate-950">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white">
              <Building2 className="h-5 w-5" />
            </span>
            <span>GNA Hostels</span>
          </Link>

          <div className="mb-8 space-y-3">
            <p className="inline-flex rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-amber-900">
              Student registration
            </p>
            <h1 className="text-3xl font-bold text-slate-950 sm:text-4xl">Create your account.</h1>
            <p className="max-w-sm text-slate-600">Save hostels, book faster, and keep your payments, reviews, and notifications in one place.</p>
          </div>

          {error && (
            <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="soft-card rounded-[28px] p-5">
            <GoogleSignInButton />

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="rounded-full bg-white px-3 text-slate-500">or register with email</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Full name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Pius Seth"
                  required
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-950 placeholder-slate-400 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-50"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-950 placeholder-slate-400 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-50"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-950 placeholder-slate-400 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-50"
                />

                {password && (
                  <div className="mt-3 space-y-2 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="text-xs font-semibold uppercase tracking-wide text-slate-600">Password requirements</div>
                    <div className="space-y-1.5">
                      <PasswordCheck met={passwordChecks.length} label="At least 8 characters" />
                      <PasswordCheck met={passwordChecks.uppercase} label="One uppercase letter (A-Z)" />
                      <PasswordCheck met={passwordChecks.number} label="One number (0-9)" />
                      <PasswordCheck met={passwordChecks.special} label="One special character (@$!%*?&)" />
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || !isPasswordValid}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3.5 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Creating account..." : "Create account"}
                {!loading && <ArrowRight className="h-4 w-4" />}
              </button>
            </form>

            <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
              <p className="font-semibold text-slate-900">Already have an account?</p>
              <p className="mt-1">Sign in to continue your hostel search.</p>
              <Link
                href="/login"
                className="mt-4 inline-flex w-full items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-950 transition hover:border-slate-300 hover:bg-slate-50"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="relative hidden overflow-hidden lg:block">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url("/Scholars-Institute-building.png")' }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/88 via-slate-950/62 to-slate-900/40" />
        <div className="relative flex h-full flex-col justify-between p-12 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
                <Building2 className="h-6 w-6" />
              </span>
              <span className="text-xl font-bold">GNA Hostels</span>
            </div>
            <div className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm backdrop-blur-sm">
              Verified housing marketplace
            </div>
          </div>

          <div className="max-w-xl space-y-6">
            <h2 className="text-4xl font-bold leading-tight">Everything your hostel life needs in one place.</h2>
            <p className="max-w-lg text-lg text-white/75">
              Search verified hostels, compare room and bed spaces, and manage bookings with a cleaner student-first workflow.
            </p>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                ["Trust", "Verified listings"],
                ["Speed", "Fast booking flow"],
                ["Clarity", "Clear pricing in GHS"]
              ].map(([value, label]) => (
                <div key={label} className="rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
                  <p className="text-sm uppercase tracking-[0.18em] text-white/55">{value}</p>
                  <p className="mt-1 text-lg font-semibold">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 rounded-[28px] border border-white/10 bg-white/10 p-4 backdrop-blur-sm sm:grid-cols-[0.9fr_1.1fr]">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/55">Why students stay here</p>
              <p className="text-sm text-white/70">Close to campus, better trust signals, and simple booking.</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-sm font-semibold">Account perks</p>
              <p className="mt-1 text-sm text-white/70">Favorites, notifications, reviews, and faster checkout.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PasswordCheck({ met, label }: { met: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2 text-xs text-slate-600">
      {met ? (
        <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
      ) : (
        <Circle className="h-4 w-4 text-slate-300 flex-shrink-0" />
      )}
      <span>{label}</span>
    </div>
  );
}
