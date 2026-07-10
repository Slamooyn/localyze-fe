"use client";

import { useEffect, useRef, useState } from "react";

export function CountUpStat({
  value,
  suffix = "",
  label,
  duration = 1400,
  valueClassName = "text-white",
  labelClassName = "text-blue-200/70",
}: {
  value: number;
  suffix?: string;
  label: string;
  duration?: number;
  valueClassName?: string;
  labelClassName?: string;
}) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started.current) {
          started.current = true;
          if (reduce) {
            setDisplay(value);
            return;
          }
          const start = performance.now();
          const tick = (now: number) => {
            const t = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - t, 3);
            setDisplay(Math.round(eased * value));
            if (t < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.5 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [value, duration]);

  return (
    <div ref={ref} className="text-center">
      <div className={`tnum text-2xl font-bold sm:text-3xl ${valueClassName}`}>
        {display.toLocaleString("id-ID")}
        {suffix}
      </div>
      <div className={`mt-1 text-xs ${labelClassName}`}>{label}</div>
    </div>
  );
}
