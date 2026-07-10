"use client";

import type { Verdict } from "@/lib/api/types";
import { useCountUp } from "@/lib/useCountUp";
import { VERDICT_HEX } from "@/lib/verdict";

// Donut 0-100 with the four verdict bands as a faint track and the score as a
// colored arc. The arc + number count up together, once per new value.
export function ScoreDial({
  score,
  verdict,
  size = 132,
  label = "Localyze Score",
  animate = true,
}: {
  score: number;
  verdict: Verdict;
  size?: number;
  label?: string;
  animate?: boolean;
}) {
  const animated = useCountUp(score, 600);
  const shown = animate ? animated : score;

  const stroke = size * 0.1;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, shown)) / 100;
  const color = VERDICT_HEX[verdict];

  const bands = [
    { from: 0, to: 50, col: VERDICT_HEX.avoid },
    { from: 50, to: 65, col: VERDICT_HEX.conditional },
    { from: 65, to: 80, col: VERDICT_HEX.strong },
    { from: 80, to: 100, col: VERDICT_HEX.prime },
  ];

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#eef2f7" strokeWidth={stroke} />
        {bands.map((b) => (
          <circle
            key={b.from}
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={b.col}
            strokeOpacity={0.16}
            strokeWidth={stroke}
            strokeDasharray={`${(c * (b.to - b.from)) / 100} ${c}`}
            strokeDashoffset={-(c * b.from) / 100}
          />
        ))}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${c * pct} ${c}`}
          style={{ transition: "stroke 300ms" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="tnum text-3xl font-bold" style={{ color }}>
          {shown.toFixed(0)}
        </span>
        {label && (
          <span className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
            {label}
          </span>
        )}
      </div>
    </div>
  );
}
