"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, LogOut, Menu, X, UserRound } from "lucide-react";
import { useAuth } from "../context/auth";
import { Button } from "./ui/Button";

type NavLink = {
  href: string;
  label: string;
};

export default function Navbar(): JSX.Element {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { isLoading, user, logout } = useAuth();

  const isAuthenticated = Boolean(user);
  const isReady = !isLoading;

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

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
    { href: "/listings", label: "Hostels" },
    { href: "/discover", label: "Discover" },
    { href: "/contact", label: "Contact" }
  ];

  function handleLogout() {
    logout();
    setIsMobileMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-soft-sm">
            <Building2 className="h-5 w-5" />
          </span>
          <span className="font-display text-xl font-bold text-foreground tracking-tight">
            GNA
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav
          className="hidden items-center gap-1 md:flex"
          role="navigation"
          aria-label="Main navigation"
        >
          {navigation.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`
                  rounded-lg px-4 py-2 text-sm font-medium transition-colors
                  ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }
                `}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 md:flex">
          {isReady && isAuthenticated ? (
            <>
              <Link href="/bookings">
                <Button variant="outline" size="sm">
                  <UserRound className="h-4 w-4" />
                  My Bookings
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </>
          ) : isReady ? (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="primary" size="sm">
                  Get Started
                </Button>
              </Link>
            </>
          ) : null}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen((current) => !current)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:hidden"
          aria-label="Toggle menu"
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-menu"
        >
          {isMobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          id="mobile-menu"
          className="border-t border-border bg-card px-4 py-4 shadow-soft-lg md:hidden"
        >
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-4">
            <nav className="flex flex-col gap-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-current={isActive ? "page" : undefined}
                    className={`
                      rounded-lg px-4 py-3 text-sm font-medium transition-colors
                      ${
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-foreground hover:bg-muted"
                      }
                    `}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="flex flex-col gap-2 border-t border-border pt-4">
              {isReady && isAuthenticated ? (
                <>
                  <Link
                    href="/bookings"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="rounded-lg border border-border bg-card px-4 py-3 text-center text-sm font-medium text-foreground transition-colors hover:bg-muted"
                  >
                    My Bookings
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="rounded-lg bg-muted px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted/80"
                  >
                    Logout
                  </button>
                </>
              ) : isReady ? (
                <>
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="rounded-lg border border-border bg-card px-4 py-3 text-center text-sm font-medium text-foreground transition-colors hover:bg-muted"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="rounded-lg bg-primary px-4 py-3 text-center text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    Get Started
                  </Link>
                </>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
