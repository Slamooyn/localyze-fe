"use client";

import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api/client";
import { idNum } from "@/lib/format";
import { ModeledBadge } from "@/components/ModeledBadge";
import { Card, CardHeader } from "@/components/ui/Card";

const AGE_LABELS: Record<string, string> = {
  "0_14": "0–14",
  "15_24": "15–24",
  "25_34": "25–34",
  "35_54": "35–54",
  "55_plus": "55+",
};

export function DemographicCard({ regionId }: { regionId: number | null }) {
  const { data, isLoading } = useQuery({
    queryKey: ["demographics", regionId],
    queryFn: () => api.demographics(regionId as number),
    enabled: regionId != null,
  });

  return (
    <Card className="flex h-full flex-col">
      <CardHeader title="Profil Demografi" subtitle={data?.region.name ?? "—"} />
      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        {isLoading || !data ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-4 animate-pulse rounded bg-slate-100" />
            ))}
          </div>
        ) : (
          <>
            <div className="mb-3 grid grid-cols-2 gap-3">
              <Stat label="Populasi" value={idNum(data.population)} unit="jiwa" />
              <Stat label="Kepadatan" value={idNum(data.density_per_km2)} unit="jiwa/km²" />
              <Stat
                label="Daya beli"
                value={data.purchasing_power_index?.toFixed(2) ?? "—"}
                unit="indeks"
                badge={data.is_modeled}
              />
              <Stat label="Tahun data" value={String(data.data_year)} unit="" />
            </div>
            <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wide text-slate-400">
              Struktur usia
            </p>
            <div className="space-y-1.5">
              {Object.entries(AGE_LABELS).map(([key, label]) => {
                const pct = (data.age_distribution[key] ?? 0) * 100;
                return (
                  <div key={key} className="flex items-center gap-2">
                    <span className="tnum w-12 shrink-0 text-xs text-slate-500">{label}</span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full rounded-full bg-brand/70" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="tnum w-9 shrink-0 text-right text-[11px] text-slate-400">
                      {pct.toFixed(0)}%
                    </span>
                  </div>
                );
              })}
            </div>
            <p className="mt-3 text-[10px] text-slate-400">Sumber: {data.source}</p>
          </>
        )}
      </div>
    </Card>
  );
}

function Stat({
  label,
  value,
  unit,
  badge,
}: {
  label: string;
  value: string;
  unit: string;
  badge?: boolean;
}) {
  return (
    <div className="rounded-lg bg-slate-50 px-3 py-2">
      <p className="flex items-center gap-1 text-[11px] text-slate-400">
        {label} {badge && <ModeledBadge />}
      </p>
      <p className="tnum text-sm font-semibold text-slate-800">
        {value} <span className="text-xs font-normal text-slate-400">{unit}</span>
      </p>
    </div>
  );
}
