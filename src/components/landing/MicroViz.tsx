"use client";

import { motion } from "framer-motion";

/** e^(-d/τ) decay curve with two labelled sample points. */
export function DecayCurve() {
  const w = 240;
  const h = 110;
  const tau = 600;
  const maxD = 2500;
  const pts = Array.from({ length: 60 }, (_, i) => {
    const d = (i / 59) * maxD;
    const y = Math.exp(-d / tau);
    return [10 + (d / maxD) * (w - 20), h - 15 - y * (h - 30)];
  });
  const path = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  const at = (d: number) => [10 + (d / maxD) * (w - 20), h - 15 - Math.exp(-d / tau) * (h - 30)];
  const p200 = at(200);
  const p2k = at(2000);
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full">
      <line x1="10" y1={h - 15} x2={w - 10} y2={h - 15} stroke="#e2e8f0" />
      <motion.path
        d={path}
        fill="none"
        stroke="#2563EB"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      />
      <circle cx={p200[0]} cy={p200[1]} r="3.5" fill="#16A34A" />
      <text x={p200[0] + 5} y={p200[1] - 4} className="fill-slate-500 text-[9px]">200m ≈ 0.72</text>
      <circle cx={p2k[0]} cy={p2k[1]} r="3.5" fill="#DC2626" />
      <text x={p2k[0] - 20} y={p2k[1] - 6} className="fill-slate-500 text-[9px]">2km ≈ 0.04</text>
    </svg>
  );
}

/** Mini histogram of a city-wide distribution with a highlighted bar. */
export function PercentileHisto() {
  const bars = [3, 7, 12, 18, 22, 25, 21, 15, 9, 5];
  const max = Math.max(...bars);
  const highlight = 6;
  return (
    <svg viewBox="0 0 240 110" className="w-full">
      {bars.map((b, i) => {
        const bh = (b / max) * 80;
        return (
          <motion.rect
            key={i}
            x={12 + i * 22}
            width="16"
            rx="2"
            fill={i === highlight ? "#2563EB" : "#cbd5e1"}
            initial={{ height: 0, y: 95 }}
            whileInView={{ height: bh, y: 95 - bh }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.04, duration: 0.4 }}
          />
        );
      })}
      <text x="12" y="107" className="fill-slate-400 text-[9px]">sepi</text>
      <text x="205" y="107" className="fill-slate-400 text-[9px]">jenuh</text>
    </svg>
  );
}
