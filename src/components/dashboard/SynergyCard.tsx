"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Building2,
  ChevronDown,
  Cross,
  Dumbbell,
  GraduationCap,
  Home,
  Laptop,
  School,
  ShoppingBag,
  Sparkles,
  Store,
  TrainFront,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";

import type { SynergyModifier, SynergyOpportunity } from "@/lib/api/types";
import { idNum, metersLabel } from "@/lib/format";
import { dur, easeOutExpo } from "@/lib/motion";
import { UnlockReveal } from "@/components/UnlockReveal";
import { Card, CardHeader } from "@/components/ui/Card";

const TYPE_META: Record<string, { label: string; icon: LucideIcon }> = {
  office: { label: "Gedung kantor", icon: Building2 },
  coworking: { label: "Coworking space", icon: Laptop },
  campus: { label: "Kampus", icon: GraduationCap },
  station: { label: "Stasiun", icon: TrainFront },
  mall: { label: "Mall", icon: ShoppingBag },
  school: { label: "Sekolah", icon: School },
  hospital: { label: "Rumah sakit", icon: Cross },
  gym: { label: "Gym", icon: Dumbbell },
  kost: { label: "Kost", icon: Home },
  apartment: { label: "Apartemen", icon: Building2 },
  residential: { label: "Perumahan", icon: Home },
};

// Expandable row — same interaction pattern as FactorRow (chevron header,
// height-auto reveal, evidence inside).
function OpportunityRow({ opp }: { opp: SynergyOpportunity }) {
  const [open, setOpen] = useState(false);
  const meta = TYPE_META[opp.type] ?? { label: opp.type, icon: Store };
  const Icon = meta.icon;

  return (
    <div className="border-b border-slate-100 last:border-0">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-2 py-2.5 text-left"
        aria-expanded={open}
      >
        <span className="flex min-w-0 items-center gap-2">
          <ChevronDown
            className={`h-3.5 w-3.5 shrink-0 text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-prime-bg text-prime">
            <Icon className="h-4 w-4" />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm text-slate-700">{opp.opportunity}</span>
            <span className="block truncate text-[11px] text-slate-400">
              {opp.count}× {meta.label}
            </span>
          </span>
        </span>
        <span className="tnum shrink-0 rounded bg-slate-100 px-1.5 py-0.5 text-xs font-medium text-slate-600">
          {metersLabel(opp.nearest_m)}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: dur.base, ease: easeOutExpo }}
            className="overflow-hidden"
          >
            <div className="space-y-1.5 pb-3 pl-[52px] pr-1">
              <p className="text-xs leading-relaxed text-slate-500">{opp.evidence}</p>
              <p className="tnum text-[11px] text-slate-400">
                {opp.count} tempat · terdekat {metersLabel(opp.nearest_m)} · bobot sinergi{" "}
                {idNum(opp.weight_sum, 1)}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Phase 2 (2A.2): unlocked "Economic synergy" teaser. Renders the
 * `breakdown.modifiers.synergy` block (composite bonus 0..+5). Missing block
 * (pre-Phase-2 analyses) and zero-bonus both get designed empty states. */
export function SynergyCard({ synergy }: { synergy?: SynergyModifier | null }) {
  const opportunities = synergy?.opportunities ?? [];
  const hasBonus = (synergy?.bonus ?? 0) > 0 && opportunities.length > 0;

  return (
    <Card className="flex flex-col">
      <CardHeader
        title="Sinergi Ekonomi"
        subtitle="Bisnis komplementer dalam radius"
        actions={
          hasBonus ? (
            <span className="tnum shrink-0 rounded-md bg-prime-bg px-2 py-1 text-xs font-semibold text-prime">
              +{idNum(synergy!.bonus, 1)} poin
            </span>
          ) : undefined
        }
      />
      <UnlockReveal unlockKey="economic-synergy" icon={Sparkles} label="Economic synergy">
        {hasBonus ? (
          <div className="px-4 py-1.5">
            {opportunities.slice(0, 3).map((o) => (
              <OpportunityRow key={o.type} opp={o} />
            ))}
          </div>
        ) : (
          <div className="flex h-full min-h-[140px] flex-col items-center justify-center gap-2 p-6 text-center">
            <Sparkles className="h-6 w-6 text-slate-300" />
            <p className="text-sm text-slate-400">
              {synergy
                ? "Belum ada sinergi menonjol dalam radius"
                : "Data sinergi belum tersedia untuk analisis ini"}
            </p>
          </div>
        )}
      </UnlockReveal>
    </Card>
  );
}
