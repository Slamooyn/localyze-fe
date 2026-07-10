"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Wordmark } from "@/components/Logo";

export function LandingNavbar() {
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Hero is light (canvas waves on white) — the transparent state uses dark text too.
  const linkClass = "text-slate-600 hover:bg-slate-900/5";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        solid ? "border-b border-slate-200 bg-white/90 backdrop-blur" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Wordmark />
        <nav className="flex items-center gap-1 text-sm">
          <a href="#how" className={`hidden rounded-lg px-3 py-1.5 font-medium transition sm:block ${linkClass}`}>
            Cara kerja
          </a>
          <a href="#features" className={`hidden rounded-lg px-3 py-1.5 font-medium transition sm:block ${linkClass}`}>
            Fitur
          </a>
          <a href="#method" className={`hidden rounded-lg px-3 py-1.5 font-medium transition sm:block ${linkClass}`}>
            Metodologi
          </a>
          <Link
            href="/login"
            className={`rounded-lg px-3 py-1.5 font-medium transition ${linkClass}`}
          >
            Masuk
          </Link>
          <Link
            href="/register"
            className="rounded-lg bg-brand px-3.5 py-1.5 font-semibold text-white shadow-sm transition hover:bg-brand-bright"
          >
            Coba demo
          </Link>
        </nav>
      </div>
    </header>
  );
}
