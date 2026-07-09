export function PercentileBar({ percentile }: { percentile: number }) {
  const p = Math.max(0, Math.min(100, percentile));
  return (
    <div className="flex items-center gap-2">
      <div className="relative h-1.5 flex-1 rounded-full bg-slate-100">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-brand/70"
          style={{ width: `${p}%` }}
        />
      </div>
      <span className="tnum w-14 shrink-0 text-right text-[11px] text-slate-500">
        p{Math.round(p)}
      </span>
    </div>
  );
}
