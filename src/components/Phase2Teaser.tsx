import { Activity, Footprints, Lock } from "lucide-react";

// "Disaster risk" & "Economic synergy" unlocked in Phase 2 Wave 2A — the rest
// stays locked until it has real data (phase2-feature-spec.md §4.4).
const CARDS = [
  { icon: Activity, label: "Economic lifecycle" },
  { icon: Footprints, label: "Foot traffic" },
];

export function Phase2Teaser() {
  return (
    <div>
      <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-slate-400">
        Lensa analisis berikutnya
      </p>
      <div className="grid grid-cols-2 gap-2">
        {CARDS.map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="flex flex-col items-center gap-1 rounded-lg border border-dashed border-slate-200 bg-slate-50/50 p-2 opacity-60"
            title="Segera hadir"
          >
            <Icon className="h-4 w-4 text-slate-400" />
            <span className="text-center text-[10px] leading-tight text-slate-500">{label}</span>
            <Lock className="h-2.5 w-2.5 text-slate-300" />
          </div>
        ))}
      </div>
    </div>
  );
}
