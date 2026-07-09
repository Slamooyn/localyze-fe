"use client";

import { AlertTriangle, Check, Pencil, Plus, X } from "lucide-react";
import { useState } from "react";

import type { Analysis } from "@/lib/api/types";
import { VERDICT_HEX } from "@/lib/verdict";
import { CannibalizationCard } from "./CannibalizationCard";
import { CompetitorList } from "./CompetitorList";
import { ConfidenceChip } from "./ConfidenceChip";
import { FactorRow } from "./FactorRow";
import { Phase2Teaser } from "./Phase2Teaser";
import { PenaltyStrip, PillarBar } from "./PillarBar";
import { ScoreDial } from "./ScoreDial";
import { VerdictBadge } from "./VerdictBadge";

interface Props {
  analysis: Analysis;
  pillarWeights: { demand: number; competition: number };
  radius: number;
  inCompare: boolean;
  onAddCompare: () => void;
  onRename: (name: string) => void;
  onRadiusChange: (r: number) => void;
  onClose?: () => void;
}

const RADII = [1000, 2000, 5000];

function Section({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="px-4 py-3">
      {title && (
        <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}

export function ScorePanel({
  analysis,
  pillarWeights,
  radius,
  inCompare,
  onAddCompare,
  onRename,
  onRadiusChange,
  onClose,
}: Props) {
  const { score, breakdown } = analysis;
  const [editing, setEditing] = useState(false);
  const [nameDraft, setNameDraft] = useState(analysis.name ?? "");

  const lowConfidence = score.confidence < 0.7;

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-slate-100 px-4 pb-3 pt-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            {editing ? (
              <div className="flex items-center gap-1">
                <input
                  autoFocus
                  value={nameDraft}
                  onChange={(e) => setNameDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      onRename(nameDraft);
                      setEditing(false);
                    }
                    if (e.key === "Escape") setEditing(false);
                  }}
                  className="w-full rounded border border-slate-300 px-1.5 py-0.5 text-sm"
                />
                <button
                  onClick={() => {
                    onRename(nameDraft);
                    setEditing(false);
                  }}
                  className="rounded p-1 text-prime hover:bg-slate-100"
                >
                  <Check className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setNameDraft(analysis.name ?? "");
                  setEditing(true);
                }}
                className="group flex items-center gap-1 text-left"
              >
                <span className="truncate text-sm font-semibold text-slate-900">
                  {analysis.name ?? "Lokasi"}
                </span>
                <Pencil className="h-3 w-3 shrink-0 text-slate-300 group-hover:text-slate-500" />
              </button>
            )}
            <p className="truncate text-xs text-slate-400">{analysis.category.name}</p>
          </div>
          {onClose && (
            <button onClick={onClose} className="rounded p-1 text-slate-400 hover:bg-slate-100">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="scroll-slim min-h-0 flex-1 overflow-y-auto">
        {/* Verdict + dial */}
        <Section>
          <div className="flex items-center gap-4">
            <ScoreDial score={score.composite} verdict={score.verdict} />
            <div className="space-y-2">
              <VerdictBadge verdict={score.verdict} size="lg" showSubtitle />
              <div className="flex flex-wrap items-center gap-1.5">
                <ConfidenceChip confidence={score.confidence} />
              </div>
            </div>
          </div>
          {lowConfidence && (
            <div className="mt-3 flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              Data terbatas di area ini — perlakukan skor sebagai indikatif.
            </div>
          )}
        </Section>

        {/* Pillars */}
        <Section title="Pilar">
          <div className="space-y-3">
            <PillarBar
              label="Demand"
              score={score.demand}
              weight={pillarWeights.demand}
              color={VERDICT_HEX.strong}
            />
            <PillarBar
              label="Competition (ringan = tinggi)"
              score={score.competition}
              weight={pillarWeights.competition}
              color={VERDICT_HEX.prime}
            />
            <PenaltyStrip penalty={score.cannibalization_penalty} />
          </div>
        </Section>

        {/* Factor breakdown */}
        <Section title="Faktor Demand">
          {breakdown.demand.factors.map((f) => (
            <FactorRow key={f.key} factor={f} />
          ))}
        </Section>
        <Section title="Faktor Kompetisi">
          {breakdown.competition.factors.map((f) => (
            <FactorRow key={f.key} factor={f} />
          ))}
        </Section>

        {/* Competitors */}
        <Section title={`Kompetitor dalam radius (${breakdown.competition.competitors_in_radius.length})`}>
          <CompetitorList competitors={breakdown.competition.competitors_in_radius} />
        </Section>

        {/* Cannibalization */}
        {breakdown.cannibalization.penalty > 0 && (
          <Section title="Kanibalisasi">
            <CannibalizationCard canni={breakdown.cannibalization} />
          </Section>
        )}

        {/* Phase 2 teaser */}
        <Section>
          <Phase2Teaser />
        </Section>
      </div>

      {/* Action bar */}
      <div className="border-t border-slate-100 bg-white px-4 py-3">
        <div className="mb-2 flex items-center gap-1">
          <span className="mr-1 text-[11px] text-slate-400">Radius</span>
          {RADII.map((r) => (
            <button
              key={r}
              onClick={() => onRadiusChange(r)}
              className={`tnum rounded-md px-2 py-1 text-xs font-medium transition ${
                radius === r
                  ? "bg-brand text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {r / 1000} km
            </button>
          ))}
        </div>
        <button
          onClick={onAddCompare}
          disabled={inCompare}
          className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-brand py-2 text-sm font-semibold text-white transition enabled:hover:bg-brand-dark disabled:opacity-40"
        >
          <Plus className="h-4 w-4" />
          {inCompare ? "Sudah di compare tray" : "Tambah ke compare"}
        </button>
        <p className="mt-2 tnum text-center text-[10px] text-slate-400">
          Snapshot kompetitor {breakdown.data_completeness.competitor_snapshot_date} · skor relatif
          se-Jakarta Selatan
        </p>
      </div>
    </div>
  );
}
