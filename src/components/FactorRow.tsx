"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

import type { Factor } from "@/lib/api/types";
import { idNum, signed } from "@/lib/format";
import { ModeledBadge } from "./ModeledBadge";
import { PercentileBar } from "./PercentileBar";

export function FactorRow({ factor, defaultOpen = false }: { factor: Factor; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const positive = factor.contribution >= 0;

  return (
    <div className="border-b border-slate-100 last:border-0">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-2 py-2 text-left"
        aria-expanded={open}
      >
        <span className="flex min-w-0 items-center gap-1.5">
          <ChevronDown
            className={`h-3.5 w-3.5 shrink-0 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}
          />
          <span className="truncate text-sm text-slate-700">{factor.label}</span>
          {factor.is_modeled && <ModeledBadge />}
        </span>
        <span
          className={`tnum shrink-0 rounded px-1.5 py-0.5 text-xs font-semibold ${
            positive ? "bg-prime-bg text-prime" : "bg-avoid-bg text-avoid"
          }`}
        >
          {signed(factor.contribution)}
        </span>
      </button>
      {open && (
        <div className="space-y-2 pb-3 pl-5 pr-1">
          <p className="text-xs leading-relaxed text-slate-500">{factor.evidence}</p>
          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            {factor.raw_value != null && (
              <span className="tnum">
                Nilai: <span className="text-slate-600">{idNum(factor.raw_value, factor.raw_value % 1 ? 2 : 0)}</span>{" "}
                {factor.unit}
              </span>
            )}
            <span>bobot {Math.round(factor.weight * 100)}%</span>
          </div>
          <PercentileBar percentile={factor.percentile} />
        </div>
      )}
    </div>
  );
}
