import type { Verdict } from "@/lib/api/types";
import { VERDICT_CLASS, VERDICT_LABEL, VERDICT_SUBTITLE } from "@/lib/verdict";

export function VerdictBadge({
  verdict,
  size = "md",
  showSubtitle = false,
}: {
  verdict: Verdict;
  size?: "sm" | "md" | "lg";
  showSubtitle?: boolean;
}) {
  const c = VERDICT_CLASS[verdict];
  const pad =
    size === "lg" ? "px-3 py-1.5 text-sm" : size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold ring-1 ${c.bg} ${c.text} ${c.ring} ${pad}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} aria-hidden />
      {VERDICT_LABEL[verdict]}
      {showSubtitle && <span className="font-normal opacity-70">· {VERDICT_SUBTITLE[verdict]}</span>}
    </span>
  );
}
