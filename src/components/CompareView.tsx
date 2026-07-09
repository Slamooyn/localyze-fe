"use client";

import { useQuery } from "@tanstack/react-query";
import { Loader2, Lock, Scale, Trophy } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { api } from "@/lib/api/client";
import type { Analysis } from "@/lib/api/types";
import { signed } from "@/lib/format";
import { useAppStore } from "@/lib/store";
import { VERDICT_HEX } from "@/lib/verdict";
import { VerdictBadge } from "./VerdictBadge";

const CompareMiniMap = dynamic(() => import("./CompareMiniMap").then((m) => m.CompareMiniMap), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-slate-200" />,
});

function factorKeys(a: Analysis): { key: string; label: string; pillar: "demand" | "competition" }[] {
  return [
    ...a.breakdown.demand.factors.map((f) => ({ key: f.key, label: f.label, pillar: "demand" as const })),
    ...a.breakdown.competition.factors.map((f) => ({
      key: f.key,
      label: f.label,
      pillar: "competition" as const,
    })),
  ];
}

function contributionOf(a: Analysis, key: string): number | null {
  const all = [...a.breakdown.demand.factors, ...a.breakdown.competition.factors];
  return all.find((f) => f.key === key)?.contribution ?? null;
}

export function CompareView() {
  const params = useSearchParams();
  const storeIds = useAppStore((s) => s.compareIds);
  const urlIds = params.get("ids")?.split(",").filter(Boolean);
  const ids = (urlIds && urlIds.length ? urlIds : storeIds).slice(0, 3);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["compare", ids],
    queryFn: () => api.compare(ids),
    enabled: ids.length >= 2,
  });

  if (ids.length < 2) {
    return (
      <Empty text="Tambahkan minimal 2 lokasi ke compare tray untuk membandingkan." />
    );
  }
  if (isLoading) return <Center><Loader2 className="h-6 w-6 animate-spin text-slate-300" /></Center>;
  if (isError || !data) return <Empty text="Gagal memuat perbandingan." />;

  const { analyses, deltas } = data;
  const keys = analyses.length ? factorKeys(analyses[0]) : [];
  const cols = `160px repeat(${analyses.length}, minmax(0, 1fr))`;

  return (
    <div className="flex h-full flex-col">
      <div className="h-48 shrink-0 border-b border-slate-200">
        <CompareMiniMap analyses={analyses} />
      </div>

      <div className="scroll-slim min-h-0 flex-1 overflow-auto p-4">
        <h2 className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-slate-800">
          <Scale className="h-4 w-4 text-brand" />
          Perbandingan lokasi
        </h2>

        <div className="min-w-[520px]">
          {/* Header */}
          <div className="grid items-end gap-2" style={{ gridTemplateColumns: cols }}>
            <div />
            {analyses.map((a) => {
              const best = deltas.best_composite === a.id;
              return (
                <div
                  key={a.id}
                  className={`rounded-lg border p-3 ${best ? "border-prime/40 bg-prime-bg" : "border-slate-200"}`}
                >
                  <p className="truncate text-sm font-semibold text-slate-800">{a.name}</p>
                  <p className="mb-2 truncate text-[11px] text-slate-400">{a.category.name}</p>
                  <VerdictBadge verdict={a.score.verdict} size="sm" />
                  <div className="mt-2 flex items-center gap-1.5">
                    <span
                      className="tnum text-3xl font-bold"
                      style={{ color: VERDICT_HEX[a.score.verdict] }}
                    >
                      {a.score.composite.toFixed(0)}
                    </span>
                    {best && <Trophy className="h-4 w-4 text-prime" />}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pillars */}
          <Row cols={cols} label="Demand">
            {analyses.map((a) => (
              <Cell key={a.id} value={a.score.demand.toFixed(0)} />
            ))}
          </Row>
          <Row cols={cols} label="Competition">
            {analyses.map((a) => (
              <Cell key={a.id} value={a.score.competition.toFixed(0)} />
            ))}
          </Row>
          <Row cols={cols} label="Penalti kanibalisasi">
            {analyses.map((a) => (
              <Cell
                key={a.id}
                value={a.score.cannibalization_penalty > 0 ? `−${a.score.cannibalization_penalty.toFixed(1)}` : "—"}
                muted
              />
            ))}
          </Row>

          <p className="mb-1 mt-4 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            Faktor
          </p>
          {keys.map((k) => (
            <Row cols={cols} label={k.label} key={k.key}>
              {analyses.map((a) => {
                const c = contributionOf(a, k.key);
                const winner = deltas.factor_winners[k.key] === a.id;
                return (
                  <div
                    key={a.id}
                    className={`flex items-center justify-center gap-1 rounded-md py-1.5 text-xs font-semibold ${
                      winner ? "bg-prime-bg text-prime ring-1 ring-prime/30" : "text-slate-600"
                    }`}
                  >
                    <span className="tnum">{c == null ? "—" : signed(c)}</span>
                    {winner && <Trophy className="h-3 w-3" />}
                  </div>
                );
              })}
            </Row>
          ))}
        </div>

        <div className="mt-6">
          <button
            disabled
            title="Segera hadir — export memo PDF"
            className="flex items-center gap-1.5 rounded-lg border border-dashed border-slate-300 px-3 py-1.5 text-sm text-slate-400"
          >
            <Lock className="h-3.5 w-3.5" />
            Jadikan keputusan (export memo)
          </button>
        </div>
      </div>
    </div>
  );
}

function Row({
  cols,
  label,
  children,
}: {
  cols: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="grid items-center gap-2 border-b border-slate-100 py-1.5"
      style={{ gridTemplateColumns: cols }}
    >
      <span className="text-xs text-slate-500">{label}</span>
      {children}
    </div>
  );
}

function Cell({ value, muted }: { value: string; muted?: boolean }) {
  return (
    <span className={`tnum text-center text-sm font-semibold ${muted ? "text-slate-400" : "text-slate-800"}`}>
      {value}
    </span>
  );
}

function Center({ children }: { children: React.ReactNode }) {
  return <div className="flex h-full items-center justify-center">{children}</div>;
}

function Empty({ text }: { text: string }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
      <Scale className="h-8 w-8 text-slate-300" />
      <p className="max-w-xs text-sm text-slate-400">{text}</p>
      <Link href="/app" className="text-sm font-medium text-brand hover:underline">
        Ke Analyze →
      </Link>
    </div>
  );
}
