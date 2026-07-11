import { Activity, Mountain, ShieldAlert, Waves, type LucideIcon } from "lucide-react";

import type { DisasterModifier, HazardDetail } from "@/lib/api/types";
import { idNum } from "@/lib/format";
import { UnlockReveal } from "@/components/UnlockReveal";
import { Card, CardHeader } from "@/components/ui/Card";

const HAZARD_META: Record<string, { label: string; icon: LucideIcon }> = {
  flood: { label: "Banjir", icon: Waves },
  earthquake: { label: "Gempa bumi", icon: Activity },
  landslide: { label: "Longsor", icon: Mountain },
};

// Level 1–2 green, 3 amber, 4–5 red — always paired with the level as text,
// never color alone (spec 2A.1).
function levelBadge(level: number): { cls: string; word: string } {
  if (level >= 4) return { cls: "bg-avoid-bg text-avoid ring-avoid/30", word: "Tinggi" };
  if (level === 3)
    return { cls: "bg-conditional-bg text-conditional ring-conditional/30", word: "Sedang" };
  return { cls: "bg-prime-bg text-prime ring-prime/30", word: "Rendah" };
}

function HazardRow({ hazard }: { hazard: HazardDetail }) {
  const meta = HAZARD_META[hazard.hazard] ?? { label: hazard.hazard, icon: ShieldAlert };
  const Icon = meta.icon;
  const badge = levelBadge(hazard.level);
  const showMitigation = hazard.level >= 3 && hazard.mitigation;

  return (
    <div className="border-b border-slate-100 py-2.5 last:border-0">
      <div className="flex items-center justify-between gap-2">
        <span className="flex min-w-0 items-center gap-2">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
            <Icon className="h-4 w-4" />
          </span>
          <span className="truncate text-sm font-medium text-slate-700">{meta.label}</span>
        </span>
        <span
          className={`tnum shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ${badge.cls}`}
        >
          Level {hazard.level} · {badge.word}
        </span>
      </div>
      <p className="mt-1 pl-9 text-xs leading-relaxed text-slate-500">{hazard.evidence}</p>
      {showMitigation && (
        <p
          className={`ml-9 mt-1.5 flex items-start gap-1.5 rounded-lg px-2.5 py-1.5 text-xs leading-relaxed ${
            hazard.level >= 4 ? "bg-avoid-bg text-avoid" : "bg-conditional-bg text-conditional"
          }`}
        >
          <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          {hazard.mitigation}
        </p>
      )}
    </div>
  );
}

/** Phase 2 (2A.1): unlocked "Disaster risk" teaser. Renders the
 * `breakdown.modifiers.disaster` block — a composite modifier, not a pillar.
 * Pre-Phase-2 analyses (no modifiers) fall back to the missing-data state. */
export function DisasterRiskCard({ disaster }: { disaster?: DisasterModifier | null }) {
  const hazards = [...(disaster?.hazards ?? [])].sort((a, b) => b.level - a.level);
  const hasData = hazards.length > 0;

  return (
    <Card className="flex flex-col">
      <CardHeader
        title="Risiko Bencana"
        subtitle={hasData ? `Sumber: ${disaster!.source}` : "Modifier komposit"}
        actions={
          hasData ? (
            disaster!.penalty > 0 ? (
              <span className="tnum shrink-0 rounded-md bg-avoid-bg px-2 py-1 text-xs font-semibold text-avoid">
                −{idNum(disaster!.penalty, 1)} poin
              </span>
            ) : (
              <span className="shrink-0 rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-500">
                Tanpa penalti
              </span>
            )
          ) : undefined
        }
      />
      <UnlockReveal unlockKey="disaster-risk" icon={ShieldAlert} label="Disaster risk">
        {hasData ? (
          <div className="px-4 py-1.5">
            {hazards.map((h) => (
              <HazardRow key={h.hazard} hazard={h} />
            ))}
          </div>
        ) : (
          <div className="flex h-full min-h-[140px] flex-col items-center justify-center gap-2 p-6 text-center">
            <ShieldAlert className="h-6 w-6 text-slate-300" />
            <p className="text-sm text-slate-400">Data risiko belum tersedia untuk area ini</p>
          </div>
        )}
      </UnlockReveal>
    </Card>
  );
}
