"use client";

import { motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";

import { dur, easeOutExpo } from "@/lib/motion";

export function DeltaChip({ value, unit = "" }: { value: number; unit?: string }) {
  if (value === 0) return null;
  const up = value > 0;
  return (
    <span
      className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[11px] font-semibold ${
        up ? "bg-prime-bg text-prime" : "bg-avoid-bg text-avoid"
      }`}
    >
      {up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
      {up ? "+" : ""}
      {value.toFixed(0)}
      {unit}
    </span>
  );
}

export function KpiCard({
  icon: Icon,
  iconClass = "bg-brand/10 text-brand",
  label,
  value,
  sub,
  hint,
  loading = false,
  index = 0,
  children,
}: {
  icon: LucideIcon;
  iconClass?: string;
  label: string;
  value?: React.ReactNode;
  sub?: React.ReactNode;
  /** Native tooltip with extra breakdown (e.g. combined penalty split). */
  hint?: string;
  loading?: boolean;
  index?: number;
  children?: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: dur.base, ease: easeOutExpo, delay: Math.min(index, 6) * 0.03 }}
      title={hint}
      className="rounded-2xl border border-slate-200/70 bg-white p-3.5 shadow-sm"
    >
      <div className="flex items-start gap-3">
        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${iconClass}`}>
          <Icon className="h-[18px] w-[18px]" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[11px] font-medium uppercase tracking-wide text-slate-400">
            {label}
          </p>
          {loading ? (
            <div className="mt-1.5 h-6 w-16 animate-pulse rounded bg-slate-100" />
          ) : (
            <div className="tnum mt-0.5 text-xl font-bold leading-tight text-slate-900">
              {value ?? <span className="text-slate-300">—</span>}
            </div>
          )}
          {!loading && sub && <div className="mt-0.5 text-xs text-slate-400">{sub}</div>}
          {!loading && children}
        </div>
      </div>
    </motion.div>
  );
}
