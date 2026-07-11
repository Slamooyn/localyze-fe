import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";

// Self-hosted via next/font: no render-blocking stylesheet request,
// swap display, and the same --font-inter var tailwind already maps to.
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Localyze — Franchise Location Intelligence",
  description:
    "Analisis kepadatan kompetitor, demografi, dan potensi pasar dalam satu skor yang bisa dipertanggungjawabkan.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={inter.variable}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
