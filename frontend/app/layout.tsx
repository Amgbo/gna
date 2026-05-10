import "./globals.css";
import type { Metadata } from "next";
import { Fraunces, Space_Grotesk } from "next/font/google";
import Navbar from "../components/Navbar";
import OAuthProviders from "./providers";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-body"
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display"
});

export const metadata: Metadata = {
  title: "GNA Hostels | Verified Student Accommodation",
  description: "Find, compare, and book verified student hostels with secure payments, reviews, and availability tracking."
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>): JSX.Element {
  return (
    <html lang="en">
      <body className={`${spaceGrotesk.variable} ${fraunces.variable} text-slate-950 antialiased`}>
        <OAuthProviders>
          <Navbar />
          <main className="page-shell mx-auto w-full max-w-7xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">{children}</main>
        </OAuthProviders>
      </body>
    </html>
  );
}
