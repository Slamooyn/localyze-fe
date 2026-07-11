"use client";

import { useEffect, useState } from "react";

/** One-time teaser→content unlock reveal (design guidelines §1.3: entrance
 * animations play once, ever). Returns true when the real content should show.
 *
 * First time a feature is seen, the locked ghost stays for `lockedMs` then
 * crossfades to content; the flag is persisted so refetches, navigation, and
 * future sessions render content immediately. `prefers-reduced-motion` skips
 * the choreography entirely (content shows at once). */
export function useUnlockOnce(key: string, lockedMs = 600): boolean {
  const storageKey = `localyze-unlocked-${key}`;
  const [revealed, setRevealed] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    try {
      if (window.localStorage.getItem(storageKey) === "1") return true;
    } catch {
      return true;
    }
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    if (revealed) {
      try {
        window.localStorage.setItem(storageKey, "1");
      } catch {
        /* ignore */
      }
      return;
    }
    const t = setTimeout(() => setRevealed(true), lockedMs);
    return () => clearTimeout(t);
  }, [revealed, storageKey, lockedMs]);

  return revealed;
}
