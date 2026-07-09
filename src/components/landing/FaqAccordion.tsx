"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

const FAQS = [
  {
    q: "Apakah gratis?",
    a: "Ya — ini demo build. Cukup daftar dengan email, tanpa kartu kredit.",
  },
  {
    q: "Data dari mana?",
    a: "Snapshot Jakarta Selatan: demografi turunan BPS + estimasi (modeled), serta kompetitor & anchor POI yang terpetakan. Semua transparan dan berlabel jujur.",
  },
  {
    q: "Kota apa saja?",
    a: "Pilot saat ini Jakarta Selatan. Metodologi persentil membuat skor otomatis re-kalibrasi saat kota pilot diganti.",
  },
  {
    q: "Apakah skornya bisa dipercaya?",
    a: "Skor dihitung dari rumus terbuka (lihat bagian Metodologi), bukan black box — plus tingkat keyakinan (confidence) dari kelengkapan data.",
  },
];

export function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="mx-auto max-w-2xl divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/5">
      {FAQS.map((f, i) => (
        <div key={i}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
            aria-expanded={open === i}
          >
            <span className="font-medium text-white">{f.q}</span>
            <ChevronDown
              className={`h-4 w-4 shrink-0 text-blue-200 transition-transform ${open === i ? "rotate-180" : ""}`}
            />
          </button>
          {open === i && <p className="px-5 pb-4 text-sm leading-relaxed text-blue-100/70">{f.a}</p>}
        </div>
      ))}
    </div>
  );
}
