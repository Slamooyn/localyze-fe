"use client";

import { ArrowRight } from "lucide-react";

import type { TopLocation } from "@/lib/api/types";
import { useAppStore } from "@/lib/store";
import { VERDICT_HEX } from "@/lib/verdict";
import { VerdictBadge } from "./VerdictBadge";

export function DiscoveryList({
  items,
  onPick,
}: {
  items: TopLocation[];
  onPick: (lat: number, lng: number) => void;
}) {
  const hoveredCell = useAppStore((s) => s.hoveredCellId);
  const setHoveredCell = useAppStore((s) => s.setHoveredCell);

  return (
    <ul className="space-y-1.5">
      {items.map((t) => (
        <li key={t.cell_id}>
          <button
            onMouseEnter={() => setHoveredCell(t.cell_id)}
            onMouseLeave={() => setHoveredCell(null)}
            onClick={() => onPick(t.centroid.lat, t.centroid.lng)}
            className={`flex w-full items-center gap-3 rounded-lg border p-2.5 text-left transition ${
              hoveredCell === t.cell_id
                ? "border-brand bg-brand/5"
                : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <span
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
              style={{ background: VERDICT_HEX[t.verdict] }}
            >
              {t.rank}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-800">{t.region_name}</p>
              <div className="mt-0.5 flex items-center gap-2">
                <VerdictBadge verdict={t.verdict} size="sm" />
                <span className="tnum text-xs text-slate-400">
                  D {t.score_demand.toFixed(0)} · C {t.score_competition.toFixed(0)}
                </span>
              </div>
            </div>
            <span className="tnum shrink-0 text-lg font-bold text-slate-900">
              {t.score_composite.toFixed(0)}
            </span>
            <ArrowRight className="h-4 w-4 shrink-0 text-slate-300" />
          </button>
        </li>
      ))}
    </ul>
  );
}
