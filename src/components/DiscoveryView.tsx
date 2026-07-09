"use client";

import { useQuery } from "@tanstack/react-query";
import { Award, Compass, Grid3x3, Loader2, Sparkles, TrendingUp } from "lucide-react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { api } from "@/lib/api/client";
import { useDistricts } from "@/lib/hooks";
import { useAppStore } from "@/lib/store";
import { PageHeader } from "@/components/shell/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { DiscoveryList } from "./DiscoveryList";

const DiscoveryMap = dynamic(() => import("./DiscoveryMap").then((m) => m.DiscoveryMap), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-slate-100" />,
});

export function DiscoveryView() {
  const router = useRouter();
  const categorySlug = useAppStore((s) => s.categorySlug);
  const { data: districts } = useDistricts();
  const [regionId, setRegionId] = useState<number | null>(null);

  useEffect(() => {
    if (regionId == null && districts?.length) {
      const kb = districts.find((d) => d.name === "Kebayoran Baru");
      setRegionId(kb?.id ?? districts[0].id);
    }
  }, [districts, regionId]);

  const { data, isFetching } = useQuery({
    queryKey: ["discovery", categorySlug, regionId],
    queryFn: () => api.discovery(categorySlug, regionId as number, 10),
    enabled: regionId != null,
  });

  const kpi = useMemo(() => {
    const cells = data?.heatmap.features ?? [];
    const scores = cells.map((c) => Number(c.properties.score));
    return {
      count: cells.length,
      max: scores.length ? Math.max(...scores) : 0,
      avg: scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0,
      prime: scores.filter((s) => s >= 80).length,
    };
  }, [data]);

  const pick = (lat: number, lng: number) =>
    router.push(`/app?lat=${lat.toFixed(5)}&lng=${lng.toFixed(5)}&category=${categorySlug}&analyze=1`);

  return (
    <div className="p-5">
      <PageHeader
        title="Location Discovery"
        subtitle="Titik terbaik untuk outlet berikutnya di kecamatan pilihanmu."
        actions={
          <select
            value={regionId ?? ""}
            onChange={(e) => setRegionId(Number(e.target.value))}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand"
          >
            {districts?.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        }
      />

      <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCard icon={Grid3x3} label="Sel dianalisis" value={kpi.count || undefined} loading={isFetching && !data} />
        <KpiCard
          icon={Award}
          iconClass="bg-prime-bg text-prime"
          label="Skor tertinggi"
          value={data ? kpi.max.toFixed(0) : undefined}
          loading={isFetching && !data}
        />
        <KpiCard
          icon={TrendingUp}
          label="Rata-rata kecamatan"
          value={data ? kpi.avg.toFixed(0) : undefined}
          loading={isFetching && !data}
        />
        <KpiCard
          icon={Sparkles}
          iconClass="bg-prime-bg text-prime"
          label="Sel prime"
          value={data ? kpi.prime : undefined}
          loading={isFetching && !data}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-12">
        <Card className="relative h-[560px] overflow-hidden xl:col-span-8">
          <DiscoveryMap data={data} onPick={pick} />
          {isFetching && (
            <div className="absolute left-4 top-4 z-10 flex items-center gap-2 rounded-lg bg-white/90 px-3 py-1.5 text-xs text-slate-500 shadow">
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> Menghitung grid…
            </div>
          )}
        </Card>

        <Card className="flex h-[560px] flex-col xl:col-span-4">
          <CardHeader
            title="Top 10 Lokasi"
            subtitle={
              <span className="flex items-center gap-1">
                <Compass className="h-3 w-3" /> Klik untuk analisis penuh
              </span>
            }
          />
          <div className="scroll-slim min-h-0 flex-1 overflow-y-auto p-3">
            {data ? (
              <DiscoveryList items={data.top_locations} onPick={pick} />
            ) : (
              <div className="flex h-40 items-center justify-center">
                <Loader2 className="h-5 w-5 animate-spin text-slate-300" />
              </div>
            )}
          </div>
          {data && (
            <div className="border-t border-slate-100 px-4 py-2">
              <p className="tnum text-[11px] text-slate-400">
                Grid dihitung {new Date(data.computed_at).toLocaleDateString("id-ID")}
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
