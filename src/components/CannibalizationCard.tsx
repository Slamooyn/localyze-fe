import { AlertTriangle } from "lucide-react";

import type { Breakdown } from "@/lib/api/types";
import { idNum, metersLabel } from "@/lib/format";

export function CannibalizationCard({ canni }: { canni: Breakdown["cannibalization"] }) {
  if (canni.penalty <= 0) return null;
  return (
    <div className="rounded-lg border border-avoid/20 bg-avoid-bg p-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-xs font-semibold text-avoid">
          <AlertTriangle className="h-4 w-4" />
          Risiko kanibalisasi
        </span>
        <span className="tnum text-xs font-semibold text-avoid">−{idNum(canni.penalty, 1)} poin</span>
      </div>
      <ul className="space-y-1">
        {canni.affected_outlets.map((o, i) => (
          <li key={o.outlet_id ?? i} className="flex items-center justify-between text-xs text-slate-600">
            <span className="truncate">{o.name ?? "Outlet"}</span>
            <span className="tnum text-slate-400">
              {metersLabel(o.distance_m)} · overlap {o.overlap_pct}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
