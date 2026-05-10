import "./globals.css";
import type { Metadata } from "next";
import { Fraunces, Space_Grotesk } from "next/font/google";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
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
    <html lang="en" className="bg-background">
      <body className={`${spaceGrotesk.variable} ${fraunces.variable} font-sans text-foreground antialiased`}>
        <OAuthProviders>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
              {children}
            </main>
            <Footer />
          </div>
        </OAuthProviders>
      </body>
    </html>
  );
}
