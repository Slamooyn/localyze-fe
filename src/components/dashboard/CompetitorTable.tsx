"use client";

import type { CompetitorInRadius } from "@/lib/api/types";
import { metersLabel } from "@/lib/format";
import { useAppStore } from "@/lib/store";
import { Card, CardHeader } from "@/components/ui/Card";

export function CompetitorTable({ competitors }: { competitors: CompetitorInRadius[] }) {
  const hovered = useAppStore((s) => s.hoveredCompetitorId);
  const setHovered = useAppStore((s) => s.setHoveredCompetitor);

  return (
    <Card className="flex h-full flex-col">
      <CardHeader title="Kompetitor dalam radius" subtitle={`${competitors.length} lokasi`} />
      <div className="scroll-slim min-h-0 flex-1 overflow-y-auto">
        {competitors.length === 0 ? (
          <p className="p-4 text-xs text-slate-400">Tidak ada kompetitor dalam radius.</p>
        ) : (
          <table className="w-full text-xs">
            <thead className="sticky top-0 bg-white">
              <tr className="border-b border-slate-100 text-left text-slate-400">
                <th className="px-4 py-2 font-medium">Nama</th>
                <th className="px-2 py-2 text-right font-medium">Jarak</th>
                <th className="px-4 py-2 text-right font-medium">Bobot</th>
              </tr>
            </thead>
            <tbody>
              {competitors.map((c) => (
                <tr
                  key={c.place_id}
                  onMouseEnter={() => setHovered(c.place_id)}
                  onMouseLeave={() => setHovered(null)}
                  className={`border-b border-slate-50 transition ${
                    hovered === c.place_id ? "bg-brand/5" : "hover:bg-slate-50"
                  }`}
                >
                  <td className="px-4 py-2">
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 shrink-0 rounded-full bg-avoid" />
                      <span className="truncate text-slate-700">{c.name}</span>
                      {c.is_chain && (
                        <span className="shrink-0 rounded bg-slate-100 px-1 text-[9px] font-medium text-slate-500">
                          chain
                        </span>
                      )}
                    </span>
                  </td>
                  <td className="tnum px-2 py-2 text-right text-slate-500">
                    {metersLabel(c.distance_m)}
                  </td>
                  <td className="tnum px-4 py-2 text-right text-slate-500">
                    {c.decay_weight.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Card>
  );
}
