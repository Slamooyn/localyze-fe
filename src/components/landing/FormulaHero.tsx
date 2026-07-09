"use client";

import { useState } from "react";

const TERMS: Record<string, string> = {
  wd: "wᴅ — bobot Demand, ditentukan per kategori franchise (kopi ≠ laundry).",
  demand: "Demand — kepadatan penduduk, kecocokan demografi, daya beli, dan anchor POI di sekitar.",
  wc: "w_C — bobot Competition, pelengkap wᴅ (wᴅ + w_C = 1).",
  competition: "Competition — tekanan kompetitif berbobot jarak, di-invert (tinggi = kompetisi ringan).",
  penalty: "P — penalti kanibalisasi bila outlet-mu sendiri berdekatan (0 bila tak ada).",
};

function Term({ id, children, active, onHover }: { id: string; children: React.ReactNode; active: boolean; onHover: (id: string | null) => void }) {
  return (
    <span
      tabIndex={0}
      onMouseEnter={() => onHover(id)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(id)}
      onBlur={() => onHover(null)}
      className={`cursor-help rounded px-1 transition ${active ? "bg-cyan-400/20 text-cyan-200" : "hover:bg-white/10"}`}
    >
      {children}
    </span>
  );
}

export function FormulaHero() {
  const [active, setActive] = useState<string | null>(null);
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center sm:p-8">
      <div className="tnum flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xl font-semibold text-white sm:text-2xl">
        <Term id="wd" active={active === "wd"} onHover={setActive}>
          w<sub>D</sub>
        </Term>
        <span className="text-blue-200/50">·</span>
        <Term id="demand" active={active === "demand"} onHover={setActive}>
          Demand
        </Term>
        <span className="text-blue-200/50">+</span>
        <Term id="wc" active={active === "wc"} onHover={setActive}>
          w<sub>C</sub>
        </Term>
        <span className="text-blue-200/50">·</span>
        <Term id="competition" active={active === "competition"} onHover={setActive}>
          Competition
        </Term>
        <span className="text-blue-200/50">−</span>
        <Term id="penalty" active={active === "penalty"} onHover={setActive}>
          P
        </Term>
      </div>
      <p className="mt-2 text-xs uppercase tracking-widest text-cyan-300">= Localyze Score</p>
      <div className="mt-4 min-h-[2.5rem] text-sm text-blue-100/70">
        {active ? TERMS[active] : "Arahkan kursor / fokus ke tiap term untuk penjelasannya."}
      </div>
    </div>
  );
}
