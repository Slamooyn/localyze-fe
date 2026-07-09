import { ShieldCheck } from "lucide-react";

export function ConfidenceChip({ confidence }: { confidence: number }) {
  const pct = Math.round(confidence * 100);
  const low = confidence < 0.7;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${
        low ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-500"
      }`}
      title="Confidence dari kelengkapan data"
    >
      <ShieldCheck className="h-3 w-3" />
      Keyakinan {pct}%
    </span>
  );
}
