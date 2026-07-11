"use client";

import { useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";

import { api } from "@/lib/api/client";
import type { GeoJSONFC, LatLng } from "@/lib/api/types";
import { useAppStore } from "@/lib/store";
import { FLOOD_RAMP_CSS } from "@/lib/riskRamp";

const AnalyzeMap = dynamic(() => import("@/components/AnalyzeMap").then((m) => m.AnalyzeMap), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-slate-100" />,
});

const RADII = [1000, 2000, 5000];

export function MapCard({
  target,
  radius,
  competitors,
  anchors,
  outlets,
  onRadiusChange,
  onMapClick,
  onTargetDrag,
  examples,
  onPickExample,
}: {
  target: LatLng | null;
  radius: number;
  competitors: { place_id: number; lat: number; lng: number; decay_weight: number; is_chain: boolean; name: string }[];
  anchors: GeoJSONFC | null;
  outlets: GeoJSONFC | null;
  onRadiusChange: (r: number) => void;
  onMapClick: (lat: number, lng: number) => void;
  onTargetDrag: (lat: number, lng: number) => void;
  examples?: { label: string; lat: number; lng: number }[];
  onPickExample?: (lat: number, lng: number) => void;
}) {
  const showOutlets = useAppStore((s) => s.showOutlets);
  const toggleOutlets = useAppStore((s) => s.toggleOutlets);
  const showFloodRisk = useAppStore((s) => s.showFloodRisk);
  const toggleFloodRisk = useAppStore((s) => s.toggleFloodRisk);

  // Fetched once and kept forever — district polygons don't change per analysis.
  const { data: floodRisk } = useQuery({
    queryKey: ["risk-choropleth", "flood"],
    queryFn: () => api.riskChoropleth("flood"),
    enabled: showFloodRisk,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-2.5">
        <h3 className="text-sm font-semibold text-slate-800">Peta Lokasi</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleFloodRisk}
            aria-pressed={showFloodRisk}
            className={`rounded-md px-2 py-1 text-xs font-medium transition ${
              showFloodRisk ? "bg-brand/10 text-brand" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
            }`}
          >
            Risiko banjir
          </button>
          <button
            onClick={toggleOutlets}
            aria-pressed={showOutlets}
            className={`rounded-md px-2 py-1 text-xs font-medium transition ${
              showOutlets ? "bg-brand/10 text-brand" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
            }`}
          >
            Outlet saya
          </button>
          <div className="flex items-center rounded-lg bg-slate-100 p-0.5">
            {RADII.map((r) => (
              <button
                key={r}
                onClick={() => onRadiusChange(r)}
                className={`tnum rounded-md px-2 py-1 text-xs font-medium transition ${
                  radius === r ? "bg-white text-brand shadow-sm" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {r / 1000} km
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="relative min-h-0 flex-1">
        <AnalyzeMap
          target={target}
          radius={radius}
          competitors={competitors}
          anchors={anchors}
          outlets={showOutlets ? outlets : null}
          floodRisk={showFloodRisk ? floodRisk ?? null : null}
          onMapClick={onMapClick}
          onTargetDrag={onTargetDrag}
        />
        {showFloodRisk && (
          <div className="pointer-events-none absolute bottom-3 left-3 z-10 rounded-lg border border-slate-200/70 bg-white/90 px-2.5 py-2 shadow-sm backdrop-blur-sm">
            <p className="text-[10px] font-semibold text-slate-600">Risiko banjir</p>
            <div className="mt-1 h-1.5 w-28 rounded-full" style={{ background: FLOOD_RAMP_CSS }} />
            <div className="mt-0.5 flex justify-between text-[9px] text-slate-500">
              <span>1 · rendah</span>
              <span>5 · tinggi</span>
            </div>
          </div>
        )}
        {!target && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-50/50">
            <span className="rounded-full bg-white/90 px-4 py-2 text-sm text-slate-500 shadow">
              Cari lokasi atau klik peta untuk mulai
            </span>
            {examples && onPickExample && (
              <div className="flex flex-wrap justify-center gap-1.5">
                {examples.map((e) => (
                  <button
                    key={e.label}
                    onClick={() => onPickExample(e.lat, e.lng)}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-sm transition hover:border-brand hover:text-brand"
                  >
                    {e.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
