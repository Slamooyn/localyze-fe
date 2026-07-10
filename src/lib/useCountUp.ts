"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/** Animates a number to `target` once whenever it changes. Compares against the
 * currently displayed value so a refetch to the same number does not re-pulse.
 * Respects prefers-reduced-motion (jumps straight to the value). */
export function useCountUp(target: number, duration = 500): number {
  const reduce = useReducedMotion();
  const [value, setValue] = useState(0);
  const valueRef = useRef(0);
  const raf = useRef<number | null>(null);

  // keep a ref of the latest displayed value (for the next animation's start)
  useEffect(() => {
    valueRef.current = value;
  });

  useEffect(() => {
    if (reduce) {
      valueRef.current = target;
      setValue(target);
      return;
    }
    const from = valueRef.current;
    if (Math.abs(from - target) < 0.01) return;
    const start = performance.now();
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      const v = from + (target - from) * eased;
      valueRef.current = v;
      setValue(v);
      if (p < 1) raf.current = requestAnimationFrame(step);
    };
    if (raf.current) cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(step);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, reduce]);

  return value;
}
