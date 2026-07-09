"use client";

import { Loader2, MapPin, Search, Store } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { api } from "@/lib/api/client";
import type { GeocodeResult } from "@/lib/api/types";

export function LocationSearch({
  onSelect,
}: {
  onSelect: (r: { lat: number; lng: number; label: string }) => void;
}) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<GeocodeResult[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (q.trim().length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    const t = setTimeout(async () => {
      try {
        const r = await api.geocode(q.trim());
        setResults(r);
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
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div ref={ref} className="relative w-full">
      <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 shadow-lg">
        <Search className="h-4 w-4 shrink-0 text-slate-400" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => results.length && setOpen(true)}
          placeholder="Cari lokasi di Jakarta Selatan…"
          className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
        />
        {loading && <Loader2 className="h-4 w-4 shrink-0 animate-spin text-slate-300" />}
      </div>
      {open && results.length > 0 && (
        <ul className="absolute z-30 mt-1 max-h-72 w-full overflow-auto rounded-xl border border-slate-200 bg-white py-1 shadow-xl scroll-slim">
          {results.map((r, i) => (
            <li key={`${r.type}-${r.region_id ?? i}-${i}`}>
              <button
                onClick={() => {
                  onSelect({ lat: r.lat, lng: r.lng, label: r.label });
                  setQ(r.label);
                  setOpen(false);
                }}
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
