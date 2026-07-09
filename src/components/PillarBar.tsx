import { idNum } from "@/lib/format";

export function PillarBar({
  label,
  score,
  weight,
  color,
}: {
  label: string;
  score: number;
  weight: number;
  color: string;
}) {
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between text-xs">
        <span className="font-medium text-slate-600">
          {label}
          <span className="ml-1 text-slate-400">· bobot {Math.round(weight * 100)}%</span>
        </span>
        <span className="tnum font-semibold text-slate-900">{score.toFixed(0)}</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full"
          style={{ width: `${Math.max(0, Math.min(100, score))}%`, backgroundColor: color, transition: "width 500ms ease" }}
        />
      </div>
    </div>
  );
}

export function PenaltyStrip({ penalty }: { penalty: number }) {
  if (penalty <= 0) return null;
  return (
    <div className="flex items-center justify-between rounded-lg bg-avoid-bg px-3 py-1.5 text-xs">
      <span className="font-medium text-avoid">Penalti kanibalisasi</span>
      <span className="tnum font-semibold text-avoid">−{idNum(penalty, 1)}</span>
    </div>
  );
}
