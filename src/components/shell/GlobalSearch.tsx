"use client";

import { Loader2, MapPin, Search, Store } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { api } from "@/lib/api/client";
import type { GeocodeResult } from "@/lib/api/types";
import { useAppStore } from "@/lib/store";

export function GlobalSearch() {
  const router = useRouter();
  const categorySlug = useAppStore((s) => s.categorySlug);
  const [q, setQ] = useState("");
  const [results, setResults] = useState<GeocodeResult[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (q.trim().length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    const t = setTimeout(async () => {
      try {
        setResults(await api.geocode(q.trim()));
        setOpen(true);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [q]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const select = (r: GeocodeResult) => {
    setQ("");
    setOpen(false);
    router.push(
      `/app?lat=${r.lat.toFixed(5)}&lng=${r.lng.toFixed(5)}&category=${categorySlug}&analyze=1`,
    );
  };

  return (
    <div ref={boxRef} className="relative w-full max-w-md">
      <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 focus-within:border-brand focus-within:bg-white">
        <Search className="h-4 w-4 shrink-0 text-slate-400" />
        <input
          ref={inputRef}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => results.length && setOpen(true)}
          placeholder="Cari lokasi…"
          className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
        />
        {loading ? (
          <Loader2 className="h-4 w-4 shrink-0 animate-spin text-slate-300" />
        ) : (
          <kbd className="hidden shrink-0 rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-slate-400 sm:block">
            ⌘K
          </kbd>
        )}
      </div>
      {open && results.length > 0 && (
        <ul className="absolute z-40 mt-1 max-h-72 w-full overflow-auto rounded-lg border border-slate-200 bg-white py-1 shadow-xl scroll-slim">
          {results.map((r, i) => (
            <li key={`${r.type}-${i}`}>
              <button
                onClick={() => select(r)}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-slate-50"
              >
                {r.type === "region" ? (
                  <MapPin className="h-4 w-4 shrink-0 text-brand" />
                ) : (
                  <Store className="h-4 w-4 shrink-0 text-slate-400" />
                )}
                <span className="truncate text-slate-700">{r.label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
