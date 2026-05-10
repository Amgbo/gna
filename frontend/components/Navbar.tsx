"use client";

import { useEffect, useState } from "react";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowUpRight, Building2, LogOut, Menu, Sparkles, UserRound } from "lucide-react";
import { useAuth } from "../context/auth";

type NavLink = {

  href: string;
  label: string;
};

export default function Navbar(): JSX.Element {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { isLoading, user, logout } = useAuth();

  const isAuthenticated = Boolean(user);
  const isReady = !isLoading;



  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Close mobile menu on Escape and prevent body scroll while open
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setIsMobileMenuOpen(false);
    }

    if (isMobileMenuOpen) {
      document.addEventListener("keydown", onKeyDown);
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.removeEventListener("keydown", onKeyDown);
        document.body.style.overflow = prev;
      };
    }

    return () => {};
  }, [isMobileMenuOpen]);

  const navigation: NavLink[] = [
    { href: "/", label: "Home" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/listings", label: "Listings" },
    { href: "/discover", label: "Discover" },
    { href: "/contact", label: "Contact" }
  ];

  function handleLogout() {
    logout();
    setIsMobileMenuOpen(false);
  }



  return (
    <header className="sticky top-0 z-50 border-b border-white/70 bg-white/72 backdrop-blur-2xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3 text-lg font-semibold text-slate-950">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-slate-950/15 ring-1 ring-white/40">
            <Building2 className="h-5 w-5" />
          </span>
          <span className="tracking-tight">GNA Hostels</span>
        </Link>

        <nav className="hidden items-center gap-2 text-sm font-medium text-slate-600 md:flex" role="navigation" aria-label="Main navigation">
          {navigation.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`rounded-full px-4 py-2 transition hover:bg-white hover:text-slate-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${isActive ? "bg-white text-slate-950 shadow-sm" : ""}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          {isReady && isAuthenticated ? (
            <>
              <Link
                href="/bookings"
                className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 sm:inline-flex"
              >
                <UserRound className="h-4 w-4" />
                My bookings
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="hidden items-center gap-2 rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 sm:inline-flex"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </>
          ) : isReady ? (
            <>
              <Link
                href="/login"
                className="hidden rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 sm:inline-flex"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="hidden items-center gap-2 rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 sm:inline-flex"
              >
                Get started
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </>
          ) : null}

          <Link
            href="/listings"
            className="hidden items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-5 py-2.5 text-sm font-semibold text-amber-900 transition hover:-translate-y-0.5 hover:bg-amber-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 md:inline-flex"
          >
            <Sparkles className="h-4 w-4" />
            Browse hostels
          </Link>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((current) => !current)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-slate-300 hover:text-slate-950 md:hidden"
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div id="mobile-menu" className="border-t border-white/70 bg-white/90 px-4 py-4 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur-2xl md:hidden sm:px-6 lg:px-8">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-3">
            <nav className="grid gap-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-current={isActive ? "page" : undefined}
                    className={`rounded-2xl border px-4 py-3 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${isActive ? "border-slate-300 bg-slate-950 text-white" : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:text-slate-950"}`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="grid gap-2 pt-2">
              {isReady && isAuthenticated ? (
                <>
                  <Link
                    href="/bookings"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-950 transition hover:border-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                  >
                    My bookings
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                  >
                    Logout
                  </button>
                </>
              ) : isReady ? (
                <>
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-950 transition hover:border-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                  >
                    Get started
                  </Link>
                </>
              ) : null}

              <Link
                href="/listings"
                onClick={() => setIsMobileMenuOpen(false)}
                className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900 transition hover:bg-amber-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              >
                Browse hostels
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
