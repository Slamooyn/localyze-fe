"use client";

import { useState } from "react";

import { ScoreDial } from "@/components/ScoreDial";
import { VerdictBadge } from "@/components/VerdictBadge";
import { DEFAULTS, SAMPLE_LOCATIONS, scoreLocation } from "@/landing/scoring-mini";

function Slider({
  label,
  min,
  max,
  step,
  value,
  onChange,
  format,
}: {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (v: number) => void;
  format: (v: number) => string;
}) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="font-medium text-slate-600">{label}</span>
        <span className="tnum font-semibold text-slate-900">{format(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-brand"
      />
    </div>
  );
}

export function WeightPlayground() {
  const [locId, setLocId] = useState("tebet");
  const [demandWeight, setDemandWeight] = useState(DEFAULTS.demandWeight);
  const [tau, setTau] = useState(DEFAULTS.tau);
  const [penalty, setPenalty] = useState(0);

  const loc = SAMPLE_LOCATIONS.find((l) => l.id === locId)!;
  const scored = scoreLocation(loc, { demandWeight, tau, penalty });

  return (
    <div className="grid gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:grid-cols-[1fr_auto] sm:p-8">
      <div className="space-y-5">
        <div className="flex flex-wrap gap-1.5">
          {SAMPLE_LOCATIONS.map((l) => (
            <button
              key={l.id}
              onClick={() => setLocId(l.id)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                l.id === locId ? "bg-brand text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {l.name}
            </button>
          ))}
        </div>
        <Slider
          label="Bobot Demand vs Kompetisi"
          min={0.2}
          max={0.8}
          step={0.05}
          value={demandWeight}
          onChange={setDemandWeight}
          format={(v) => `${Math.round(v * 100)}% / ${Math.round((1 - v) * 100)}%`}
        />
        <Slider
          label="τ jarak (decay kompetitor)"
          min={300}
          max={1200}
          step={50}
          value={tau}
          onChange={setTau}
          format={(v) => `${v} m`}
        />
        <Slider
          label="Penalti kanibalisasi"
          min={0}
          max={15}
          step={1}
          value={penalty}
          onChange={setPenalty}
          format={(v) => `−${v}`}
        />
        <p className="text-xs leading-relaxed text-slate-400">
          Semua dihitung di browser dengan formula yang sama seperti backend. Naikkan bobot kompetisi
          di lokasi padat → skor turun. Itu poinnya: skornya transparan, bukan kotak hitam.
        </p>
      </div>

      <div className="flex flex-col items-center justify-center gap-3 border-t border-slate-100 pt-6 sm:border-l sm:border-t-0 sm:pl-8 sm:pt-0">
        <ScoreDial score={scored.composite} verdict={scored.verdict} size={148} />
        <VerdictBadge verdict={scored.verdict} size="lg" showSubtitle />
        <p className="tnum text-xs text-slate-400">
          Demand {scored.demand.toFixed(0)} · Kompetisi {scored.competition.toFixed(0)}
        </p>
      </div>
    </div>
  );
}
