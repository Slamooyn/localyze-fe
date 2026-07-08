"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { useCategories } from "@/lib/hooks";
import { useAppStore } from "@/lib/store";

export function CategorySwitcher() {
  const { data: categories } = useCategories();
  const categorySlug = useAppStore((s) => s.categorySlug);
  const setCategory = useAppStore((s) => s.setCategory);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const active = categories?.find((c) => c.slug === categorySlug);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300"
      >
        <span className="text-slate-400">Kategori</span>
        <span className="text-slate-900">{active?.name ?? "…"}</span>
        <ChevronDown className="h-4 w-4 text-slate-400" />
      </button>
      {open && categories && (
        <div className="absolute right-0 z-30 mt-1 w-56 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
          {categories.map((c) => (
            <button
              key={c.slug}
              onClick={() => {
                setCategory(c.slug);
                setOpen(false);
              }}
              className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm transition hover:bg-slate-50 ${
                c.slug === categorySlug ? "font-semibold text-brand" : "text-slate-700"
              }`}
            >
              {c.name}
              <span className="text-xs text-slate-400">{c.default_radius_m} m</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
