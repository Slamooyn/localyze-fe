"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Wordmark } from "@/components/Logo";

const DEMO = "/app?lat=-6.2264&lng=106.8531&category=coffee-grab-go&analyze=1";

export function LandingNavbar() {
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        solid ? "border-b border-slate-200 bg-white/90 backdrop-blur" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Wordmark className={solid ? "text-brand-dark" : "text-white [&_span]:text-white"} />
        <nav className="flex items-center gap-1 text-sm">
          <a
            href="#how"
            className={`hidden rounded-lg px-3 py-1.5 font-medium transition sm:block ${
              solid ? "text-slate-600 hover:bg-slate-100" : "text-blue-100 hover:bg-white/10"
            }`}
          >
            Cara kerja
          </a>
          <a
            href="#features"
            className={`hidden rounded-lg px-3 py-1.5 font-medium transition sm:block ${
              solid ? "text-slate-600 hover:bg-slate-100" : "text-blue-100 hover:bg-white/10"
            }`}
          >
            Fitur
          </a>
          <Link
            href={DEMO}
            className="rounded-lg bg-brand px-3.5 py-1.5 font-semibold text-white shadow-sm transition hover:bg-blue-600"
          >
            Coba demo
          </Link>
        </nav>
      </div>
    </header>
  );
}
