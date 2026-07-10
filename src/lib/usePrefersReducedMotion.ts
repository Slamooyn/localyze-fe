"use client";

import { useEffect, useState } from "react";

/** SSR-safe prefers-reduced-motion: first client render matches the server
 * (false), then flips after mount — avoids hydration mismatches when the
 * reduced variant renders different DOM. */
export function usePrefersReducedMotion(): boolean {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduce(m.matches);
    const on = () => setReduce(m.matches);
    m.addEventListener("change", on);
    return () => m.removeEventListener("change", on);
  }, []);
  return reduce;
}
