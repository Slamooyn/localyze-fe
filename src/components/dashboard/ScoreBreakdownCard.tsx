"use client";

import type { Analysis } from "@/lib/api/types";
import { VERDICT_HEX } from "@/lib/verdict";
import { FactorRow } from "@/components/FactorRow";
import { PenaltyStrip, PillarBar } from "@/components/PillarBar";
import { ScoreDial } from "@/components/ScoreDial";
import { VerdictBadge } from "@/components/VerdictBadge";
import { Card, CardHeader } from "@/components/ui/Card";

export function ScoreBreakdownCard({
  analysis,
  pillarWeights,
}: {
  analysis: Analysis;
  pillarWeights: { demand: number; competition: number };
}) {
  const { score, breakdown } = analysis;
  return (
    <Card className="flex h-full flex-col">
      <CardHeader title="Rincian Skor" subtitle="Kontribusi tiap faktor terhadap komposit" />
      <div className="scroll-slim min-h-0 flex-1 overflow-y-auto p-4">
        <div className="flex items-center gap-4">
          <ScoreDial score={score.composite} verdict={score.verdict} size={120} />
          <div className="space-y-2">
            <VerdictBadge verdict={score.verdict} size="lg" showSubtitle />
            <div className="space-y-2 pt-1">
              <PillarBar
                label="Demand"
                score={score.demand}
                weight={pillarWeights.demand}
                color={VERDICT_HEX.strong}
              />
              <PillarBar
                label="Competition"
                score={score.competition}
                weight={pillarWeights.competition}
                color={VERDICT_HEX.prime}
              />
            </div>
          </div>
        </div>
        <div className="mt-3">
          <PenaltyStrip penalty={score.cannibalization_penalty} />
        </div>

        <p className="mb-1 mt-4 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          Faktor Demand
        </p>
        {breakdown.demand.factors.map((f) => (
          <FactorRow key={f.key} factor={f} />
        ))}
        <p className="mb-1 mt-4 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          Faktor Kompetisi
        </p>
        {breakdown.competition.factors.map((f) => (
          <FactorRow key={f.key} factor={f} />
        ))}
      </div>
    </Card>
  );
}
