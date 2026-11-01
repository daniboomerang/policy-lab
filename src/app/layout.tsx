import type { Metadata } from "next";
import { Geist, JetBrains_Mono } from "next/font/google";
import type { ReactNode } from "react";
import "@/styles/app.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains-mono", display: "swap" });

export const metadata: Metadata = {
  title: "Policy Lab",
  description: "Draft, simulate and publish spending policies for AI agents. Demo on sample data.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-dvh antialiased">
        <header className="flex flex-wrap items-center gap-3 border-b px-4 py-3 sm:px-8">
          <span className="text-sm font-semibold">Policy Lab</span>
          {/* The honesty badge: on every page, never dismissible, copy fixed. */}
          <span className="rounded-sm bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
            Demo · sample data · not connected to Saifuro
          </span>
        </header>
        {children}
      </body>
    </html>
  );
}
