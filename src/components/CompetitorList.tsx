"use client";

import { Store } from "lucide-react";

import type { CompetitorInRadius } from "@/lib/api/types";
import { metersLabel } from "@/lib/format";
import { useAppStore } from "@/lib/store";

export function CompetitorList({ competitors }: { competitors: CompetitorInRadius[] }) {
  const hovered = useAppStore((s) => s.hoveredCompetitorId);
  const setHovered = useAppStore((s) => s.setHoveredCompetitor);
  if (!competitors.length) {
    return <p className="text-xs text-slate-400">Tidak ada kompetitor dalam radius.</p>;
  }
  return (
    <ul className="space-y-0.5">
      {competitors.map((c) => (
        <li
          key={c.place_id}
          onMouseEnter={() => setHovered(c.place_id)}
          onMouseLeave={() => setHovered(null)}
          className={`flex items-center justify-between rounded-md px-2 py-1.5 text-xs transition ${
            hovered === c.place_id ? "bg-brand/10" : "hover:bg-slate-50"
          }`}
        >
          <span className="flex min-w-0 items-center gap-1.5">
            <Store className="h-3.5 w-3.5 shrink-0 text-avoid/70" />
            <span className="truncate text-slate-700">{c.name}</span>
            {c.is_chain && (
              <span className="shrink-0 rounded bg-slate-100 px-1 text-[9px] font-medium text-slate-500">
                chain
              </span>
            )}
          </span>
          <span className="tnum shrink-0 text-slate-400">{metersLabel(c.distance_m)}</span>
        </li>
      ))}
    </ul>
  );
}
