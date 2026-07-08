import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Localyze — Franchise Location Intelligence",
  description:
    "Analisis kepadatan kompetitor, demografi, dan potensi pasar dalam satu skor yang bisa dipertanggungjawabkan.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        {/* Inter loaded at runtime (non-blocking); degrades to system-ui offline. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans">{children}</body>
    </html>
  );
}
