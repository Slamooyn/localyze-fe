"use client";

import { useQuery } from "@tanstack/react-query";
import { Compass, Loader2 } from "lucide-react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { api } from "@/lib/api/client";
import { useDistricts } from "@/lib/hooks";
import { useAppStore } from "@/lib/store";
import { DiscoveryList } from "./DiscoveryList";

const DiscoveryMap = dynamic(() => import("./DiscoveryMap").then((m) => m.DiscoveryMap), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-slate-200" />,
});

export function DiscoveryView() {
  const router = useRouter();
  const categorySlug = useAppStore((s) => s.categorySlug);
  const { data: districts } = useDistricts();
  const [regionId, setRegionId] = useState<number | null>(null);

  // default to Kebayoran Baru (or first district)
  useEffect(() => {
    if (regionId == null && districts?.length) {
      const kb = districts.find((d) => d.name === "Kebayoran Baru");
      setRegionId(kb?.id ?? districts[0].id);
    }
  }, [districts, regionId]);

  const { data, isFetching, isError } = useQuery({
    queryKey: ["discovery", categorySlug, regionId],
    queryFn: () => api.discovery(categorySlug, regionId as number, 10),
    enabled: regionId != null,
  });

  const pick = (lat: number, lng: number) => {
    router.push(`/app?lat=${lat.toFixed(5)}&lng=${lng.toFixed(5)}&category=${categorySlug}&analyze=1`);
  };

  return (
    <div className="flex h-full">
      <div className="relative h-full w-[62%]">
        <DiscoveryMap data={data} onPick={pick} />
        {isFetching && (
          <div className="absolute left-4 top-4 z-10 flex items-center gap-2 rounded-lg bg-white/90 px-3 py-1.5 text-xs text-slate-500 shadow">
            <Loader2 className="h-3.5 w-3.5 animate-spin" /> Menghitung grid…
          </div>
        )}
      </div>

      <aside className="flex h-full w-[38%] flex-col border-l border-slate-200 bg-white">
        <div className="border-b border-slate-100 px-4 py-3">
          <h2 className="flex items-center gap-1.5 text-sm font-semibold text-slate-800">
            <Compass className="h-4 w-4 text-brand" />
            Location Discovery
          </h2>
          <p className="mt-0.5 text-xs text-slate-400">
            Di mana outlet berikutnya sebaiknya dibuka?
          </p>
          <div className="mt-3">
            <label className="mb-1 block text-[11px] font-medium text-slate-500">Kecamatan</label>
            <select
              value={regionId ?? ""}
              onChange={(e) => setRegionId(Number(e.target.value))}
              className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm outline-none focus:border-brand"
            >
              {districts?.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="scroll-slim min-h-0 flex-1 overflow-y-auto px-4 py-3">
          {isError ? (
            <p className="text-sm text-slate-400">Gagal memuat data discovery.</p>
          ) : data ? (
            <DiscoveryList items={data.top_locations} onPick={pick} />
          ) : (
            <div className="flex h-40 items-center justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-slate-300" />
            </div>
          )}
        </div>

        {data && (
          <div className="border-t border-slate-100 px-4 py-2.5">
            <p className="tnum text-[11px] text-slate-400">
              Skor grid dihitung {new Date(data.computed_at).toLocaleDateString("id-ID")} · klik sel
              untuk analisis penuh
            </p>
          </div>
        )}
      </aside>
    </div>
  );
}
