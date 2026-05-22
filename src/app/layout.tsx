import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import { DatabaseZap } from "lucide-react";
import "./globals.css";
import { AppNavbar } from "@/components/app-navbar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter"
});

export const metadata: Metadata = {
  title: "Querix - Belajar SQL dari Nol",
  description:
    "Platform belajar SQL interaktif berbahasa Indonesia untuk calon Data Analyst."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${inter.variable} min-h-screen font-sans`}>
        <AppNavbar />
        {children}
        <footer className="border-t bg-querix-paper">
          <div className="container flex flex-col gap-6 py-8 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between lg:py-9 lg:text-base">
            <div className="space-y-3">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-lg font-bold text-primary"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
                  <DatabaseZap className="h-5 w-5" aria-hidden="true" />
                </span>
                Querix
              </Link>
              <p>Belajar SQL dari Nol, Langsung Praktik.</p>
            </div>

            <div className="flex flex-col gap-4 md:items-end">
              <nav className="flex flex-wrap gap-x-5 gap-y-2 font-semibold text-primary">
                <Link className="hover:text-secondary" href="/learn">
                  Belajar
                </Link>
                <Link className="hover:text-secondary" href="/challenges">
                  Tantangan
                </Link>
                <Link className="hover:text-secondary" href="/playground">
                  Playground
                </Link>
                <Link className="hover:text-secondary" href="/dashboard">
                  Dashboard
                </Link>
              </nav>
              <p>Made by Kgs M Luthfi Khailani</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
