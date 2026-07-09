"use client";

import {
  AlertTriangle,
  BadgeCheck,
  Check,
  Gauge,
  Pencil,
  Plus,
  ShieldCheck,
  Store,
  Users,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { api, ApiError } from "@/lib/api/client";
import type { Analysis, Factor, GeoJSONFC, LatLng } from "@/lib/api/types";
import { idNum } from "@/lib/format";
import { useActiveCategory } from "@/lib/hooks";
import { useAppStore } from "@/lib/store";
import { PageHeader } from "@/components/shell/PageHeader";
import { CannibalizationCard } from "@/components/CannibalizationCard";
import { Phase2Teaser } from "@/components/Phase2Teaser";
import { VerdictBadge } from "@/components/VerdictBadge";
import { Card } from "@/components/ui/Card";
import { CompetitorTable } from "./CompetitorTable";
import { DemographicCard } from "./DemographicCard";
import { KpiCard } from "./KpiCard";
import { MapCard } from "./MapCard";
import { ScoreBreakdownCard } from "./ScoreBreakdownCard";

const EXAMPLES = [
  { label: "Tebet", lat: -6.2264, lng: 106.8531 },
  { label: "SCBD", lat: -6.2246, lng: 106.8097 },
  { label: "Kemang", lat: -6.2637, lng: 106.814 },
];

function factor(a: Analysis, pillar: "demand" | "competition", key: string): Factor | undefined {
  return a.breakdown[pillar].factors.find((f) => f.key === key);
}

export function DashboardView() {
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
  const [editing, setEditing] = useState(false);
  const [nameDraft, setNameDraft] = useState("");
  const reqId = useRef(0);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    const cat = params.get("category");
    const lat = params.get("lat");
    const lng = params.get("lng");
    if (cat) setCategory(cat);
    if (lat && lng) setTarget({ lat: Number(lat), lng: Number(lng) });
  }, [params, setCategory]);

  useEffect(() => {
    if (category) setRadius(category.default_radius_m);
  }, [category]);

  useEffect(() => {
    if (!target) return;
    const q = new URLSearchParams({
      lat: target.lat.toFixed(5),
      lng: target.lng.toFixed(5),
      category: categorySlug,
    });
    router.replace(`/app?${q.toString()}`, { scroll: false });
  }, [target, categorySlug, router]);

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

  useEffect(() => {
    if (!target || !radius) return;
    api
      .places({ lat: target.lat, lng: target.lng, radius_m: radius, place_type: "anchor" })
      .then(setAnchors)
      .catch(() => setAnchors(null));
  }, [target?.lat, target?.lng, radius]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!showOutlets) return setOutlets(null);
    api.listOutlets().then(setOutlets).catch(() => setOutlets(null));
  }, [showOutlets, analysis]);

  const pick = useCallback((lat: number, lng: number) => setTarget({ lat, lng }), []);

  const rename = async (name: string) => {
    if (!analysis) return;
    try {
      setAnalysis(await api.patchAnalysis(analysis.id, name));
    } catch {
      /* ignore */
    }
  };

  const competitors = analysis?.breakdown.competition.competitors_in_radius ?? [];
  const inCompare = analysis ? compareIds.includes(analysis.id) : false;
  const loading = phase === "loading" && !analysis;
  const s = analysis?.score;

  const density = analysis && factor(analysis, "demand", "population_density");
  const wdensity = analysis && factor(analysis, "competition", "weighted_density");

  return (
    <div className="p-5">
      <PageHeader
        title="Dashboard Analisis Lokasi"
        subtitle={
          analysis ? undefined : "Analisis kelayakan lokasi untuk kategori franchise pilihanmu."
        }
        actions={
          analysis && (
            <>
              {editing ? (
                <span className="flex items-center gap-1">
                  <input
                    autoFocus
                    value={nameDraft}
                    onChange={(e) => setNameDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        rename(nameDraft);
                        setEditing(false);
                      }
                      if (e.key === "Escape") setEditing(false);
                    }}
                    className="auth-input w-48 py-1.5"
                  />
                  <button
                    onClick={() => {
                      rename(nameDraft);
                      setEditing(false);
                    }}
                    className="rounded-lg p-2 text-prime hover:bg-slate-100"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                </span>
              ) : (
                <button
                  onClick={() => {
                    setNameDraft(analysis.name ?? "");
                    setEditing(true);
                  }}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300"
                >
                  <Pencil className="h-3.5 w-3.5" /> Ganti nama
                </button>
              )}
              <button
                onClick={() => addToCompare(analysis.id)}
                disabled={inCompare}
                className="flex items-center gap-1.5 rounded-lg bg-brand px-3 py-2 text-sm font-semibold text-white transition enabled:hover:bg-brand-bright disabled:opacity-40"
              >
                <Plus className="h-4 w-4" /> {inCompare ? "Di tray" : "Bandingkan"}
              </button>
            </>
          )
        }
      />

      {analysis && (
        <p className="-mt-3 mb-4 text-sm text-slate-500">
          {analysis.name} · {analysis.category.name}
        </p>
      )}

      {/* KPI row */}
      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
        <KpiCard
          icon={Gauge}
          label="Localyze Score"
          loading={loading}
          value={s ? s.composite.toFixed(0) : undefined}
          sub={s ? `${s.composite > 50 ? "+" : ""}${(s.composite - 50).toFixed(0)} vs rata-rata` : undefined}
        />
        <KpiCard icon={BadgeCheck} label="Verdict" loading={loading}>
          {s && <VerdictBadge verdict={s.verdict} size="md" />}
        </KpiCard>
        <KpiCard
          icon={Store}
          iconClass="bg-avoid/10 text-avoid"
          label="Kompetitor"
          loading={loading}
          value={s ? String(competitors.length) : undefined}
          sub={wdensity ? `${idNum(Number(wdensity.raw_value), 1)} efektif (decay)` : undefined}
        />
        <KpiCard
          icon={Users}
          iconClass="bg-brand/10 text-brand"
          label="Kepadatan"
          loading={loading}
          value={density ? idNum(Number(density.raw_value)) : undefined}
          sub={density ? `jiwa/km² · p${density.percentile}` : undefined}
        />
        <KpiCard
          icon={ShieldCheck}
          iconClass={s && s.confidence < 0.7 ? "bg-amber-100 text-amber-600" : "bg-slate-100 text-slate-500"}
          label="Confidence"
          loading={loading}
          value={s ? `${Math.round(s.confidence * 100)}%` : undefined}
          sub={s ? (s.confidence >= 0.85 ? "Tinggi" : s.confidence >= 0.7 ? "Sedang" : "Rendah") : undefined}
        />
        <KpiCard
          icon={AlertTriangle}
          iconClass={s && s.cannibalization_penalty > 0 ? "bg-avoid/10 text-avoid" : "bg-slate-100 text-slate-500"}
          label="Kanibalisasi"
          loading={loading}
          value={
            s ? (s.cannibalization_penalty > 0 ? `−${s.cannibalization_penalty.toFixed(1)}` : "0") : undefined
          }
          sub={s ? (s.cannibalization_penalty > 0 ? "poin dikurangi" : "Tidak ada") : undefined}
        />
      </div>

      {/* OUT_OF_COVERAGE */}
      {error?.code === "OUT_OF_COVERAGE" && (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-avoid-bg px-3 py-2 text-sm text-avoid">
          <AlertTriangle className="h-4 w-4" /> {error.message}
        </div>
      )}

      {/* main grid */}
      <div className="grid gap-4 xl:grid-cols-12">
        <div className="h-[520px] xl:col-span-7">
          <MapCard
            target={target}
            radius={radius ?? 1000}
            competitors={competitors}
            anchors={anchors}
            outlets={showOutlets ? outlets : null}
            onRadiusChange={setRadius}
            onMapClick={(lat, lng) => setTarget({ lat, lng })}
            onTargetDrag={(lat, lng) => setTarget({ lat, lng })}
            examples={EXAMPLES}
            onPickExample={pick}
          />
        </div>
        <div className="h-[520px] xl:col-span-5">
          {analysis ? (
            <ScoreBreakdownCard
              analysis={analysis}
              pillarWeights={category?.pillar_weights ?? { demand: 0.5, competition: 0.5 }}
            />
          ) : (
            <Card className="flex h-full items-center justify-center text-sm text-slate-400">
              {loading ? "Menganalisis…" : "Pilih lokasi untuk melihat rincian skor"}
            </Card>
          )}
        </div>
      </div>

      {/* bottom grid */}
      {analysis && (
        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          <div className="h-[340px]">
            <CompetitorTable competitors={competitors} />
          </div>
          <div className="h-[340px]">
            <DemographicCard regionId={analysis.region?.id ?? null} />
          </div>
          <div className="flex h-[340px] flex-col gap-4">
            {analysis.breakdown.cannibalization.penalty > 0 && (
              <CannibalizationCard canni={analysis.breakdown.cannibalization} />
            )}
            <Card className="flex-1 p-4">
              <Phase2Teaser />
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
