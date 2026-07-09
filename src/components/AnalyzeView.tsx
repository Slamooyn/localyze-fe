"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, Loader2, RotateCw } from "lucide-react";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { api, ApiError } from "@/lib/api/client";
import type { Analysis, GeoJSONFC, LatLng } from "@/lib/api/types";
import { useActiveCategory } from "@/lib/hooks";
import { useAppStore } from "@/lib/store";
import { EmptyState } from "./EmptyState";
import { LocationSearch } from "./LocationSearch";
import { ScorePanel } from "./ScorePanel";
import { SkeletonPanel } from "./SkeletonPanel";

const AnalyzeMap = dynamic(() => import("./AnalyzeMap").then((m) => m.AnalyzeMap), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-slate-200" />,
});

export function AnalyzeView() {
  const params = useSearchParams();
  const router = useRouter();

  const categorySlug = useAppStore((s) => s.categorySlug);
  const setCategory = useAppStore((s) => s.setCategory);
  const showOutlets = useAppStore((s) => s.showOutlets);
  const compareIds = useAppStore((s) => s.compareIds);
  const addToCompare = useAppStore((s) => s.addToCompare);
  const category = useActiveCategory(categorySlug);

  const [target, setTarget] = useState<LatLng | null>(null);
  const [radius, setRadius] = useState<number | null>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [phase, setPhase] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState<{ code: string; message: string } | null>(null);
  const [anchors, setAnchors] = useState<GeoJSONFC | null>(null);
  const [outlets, setOutlets] = useState<GeoJSONFC | null>(null);
  const reqId = useRef(0);
  const initialized = useRef(false);

  // --- init from URL (once) ---
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    const cat = params.get("category");
    const lat = params.get("lat");
    const lng = params.get("lng");
    if (cat) setCategory(cat);
    if (lat && lng) setTarget({ lat: Number(lat), lng: Number(lng) });
  }, [params, setCategory]);

  // --- radius follows category default ---
  useEffect(() => {
    if (category) setRadius(category.default_radius_m);
  }, [category]);

  // --- keep URL in sync (deep-linkable) ---
  useEffect(() => {
    if (!target) return;
    const q = new URLSearchParams({
      lat: target.lat.toFixed(5),
      lng: target.lng.toFixed(5),
      category: categorySlug,
    });
    router.replace(`/app?${q.toString()}`, { scroll: false });
  }, [target, categorySlug, router]);

  // --- analyze (debounced) ---
  useEffect(() => {
    if (!target || !category || !radius) return;
    const id = ++reqId.current;
    setPhase("loading");
    const t = setTimeout(async () => {
      try {
        const res = await api.analyze({
          lat: target.lat,
          lng: target.lng,
          category_slug: category.slug,
          radius_m: radius,
          include_cannibalization: true,
        });
        if (reqId.current !== id) return;
        setAnalysis(res);
        setError(null);
        setPhase("idle");
      } catch (e) {
        if (reqId.current !== id) return;
        const info =
          e instanceof ApiError
            ? { code: e.code, message: e.message }
            : { code: "ERROR", message: "Gagal menganalisis lokasi" };
        setError(info);
        setPhase("error");
        if (info.code === "OUT_OF_COVERAGE") setAnalysis(null);
      }
    }, 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target?.lat, target?.lng, category?.slug, radius]);

  // --- anchors + outlets overlay ---
  useEffect(() => {
    if (!target || !radius) return;
    api.places({ lat: target.lat, lng: target.lng, radius_m: radius, place_type: "anchor" })
      .then(setAnchors)
      .catch(() => setAnchors(null));
  }, [target?.lat, target?.lng, radius]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!showOutlets) {
      setOutlets(null);
      return;
    }
    api.listOutlets().then(setOutlets).catch(() => setOutlets(null));
  }, [showOutlets, analysis]);

  const pick = useCallback((p: { lat: number; lng: number }) => {
    setTarget({ lat: p.lat, lng: p.lng });
  }, []);

  const handleRename = async (name: string) => {
    if (!analysis) return;
    try {
      const updated = await api.patchAnalysis(analysis.id, name);
      setAnalysis(updated);
    } catch {
      /* ignore */
    }
  };

  const competitors = analysis?.breakdown.competition.competitors_in_radius ?? [];
  const inCompare = analysis ? compareIds.includes(analysis.id) : false;
  const showPanel = target !== null;

  return (
    <div className="absolute inset-0">
      <AnalyzeMap
        target={target}
        radius={radius ?? 1000}
        competitors={competitors}
        anchors={anchors}
        outlets={showOutlets ? outlets : null}
        onMapClick={(lat, lng) => setTarget({ lat, lng })}
        onTargetDrag={(lat, lng) => setTarget({ lat, lng })}
      />

      {/* Search */}
      <div className="absolute left-4 top-4 z-20 w-[min(92vw,26rem)]">
        <LocationSearch onSelect={pick} />
      </div>

      {/* Out-of-coverage toast */}
      <AnimatePresence>
        {error?.code === "OUT_OF_COVERAGE" && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute left-1/2 top-4 z-30 flex -translate-x-1/2 items-center gap-2 rounded-lg bg-avoid px-3 py-2 text-sm text-white shadow-lg"
          >
            <AlertTriangle className="h-4 w-4" />
            {error.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Right panel */}
      <AnimatePresence>
        {showPanel && (
          <motion.div
            initial={{ x: 440, opacity: 0.5 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 440, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            className="absolute right-0 top-0 z-20 flex h-full w-[min(92vw,26rem)] flex-col border-l border-slate-200 bg-white shadow-xl"
          >
            {phase === "loading" && !analysis && <SkeletonPanel />}
            {analysis && (
              <>
                {phase === "loading" && (
                  <div className="absolute left-0 right-0 top-0 z-10 h-0.5 overflow-hidden">
                    <div className="h-full w-1/3 animate-pulse bg-brand" />
                  </div>
                )}
                <ScorePanel
                  analysis={analysis}
                  pillarWeights={category?.pillar_weights ?? { demand: 0.5, competition: 0.5 }}
                  radius={radius ?? analysis.radius_m}
                  inCompare={inCompare}
                  onAddCompare={() => addToCompare(analysis.id)}
                  onRename={handleRename}
                  onRadiusChange={setRadius}
                  onClose={() => {
                    setTarget(null);
                    setAnalysis(null);
                  }}
                />
              </>
            )}
            {!analysis && phase === "error" && error?.code !== "OUT_OF_COVERAGE" && (
              <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
                <AlertTriangle className="h-8 w-8 text-avoid" />
                <p className="text-sm text-slate-600">{error?.message}</p>
                <button
                  onClick={() => setTarget(target ? { ...target } : null)}
                  className="flex items-center gap-1.5 rounded-lg bg-brand px-3 py-1.5 text-sm font-medium text-white"
                >
                  <RotateCw className="h-4 w-4" /> Coba lagi
                </button>
              </div>
            )}
            {!analysis && phase !== "loading" && phase !== "error" && (
              <EmptyState onPick={pick} />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty state when nothing selected */}
      {!showPanel && (
        <div className="absolute right-0 top-0 z-10 flex h-full w-[min(92vw,26rem)] flex-col border-l border-slate-200 bg-white/95">
          <EmptyState onPick={pick} />
        </div>
      )}

      {phase === "loading" && !analysis && !showPanel && (
        <Loader2 className="absolute right-1/4 top-1/2 h-6 w-6 animate-spin text-brand" />
      )}
    </div>
  );
}
