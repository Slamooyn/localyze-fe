// src/lib/motion.ts — single source of motion values (design-craft-guidelines.md §2).
import type { Transition, Variants } from "framer-motion";

export const dur = { fast: 0.15, base: 0.2, slow: 0.3, drawer: 0.4 } as const; // seconds
export const easeOutExpo = [0.32, 0.72, 0, 1] as const; // entrance & drawer (vaul curve)
export const easeInOut = [0.45, 0, 0.55, 1] as const; // position/layout moves
export const spring: Transition = { type: "spring", stiffness: 400, damping: 35 };

/** Card / panel entrance: fade + small rise. Exit 0.8× faster. */
export const rise: Variants = {
  hidden: { opacity: 0, y: 6 },
  show: { opacity: 1, y: 0, transition: { duration: dur.base, ease: easeOutExpo } },
  exit: { opacity: 0, y: 4, transition: { duration: dur.base * 0.8, ease: easeOutExpo } },
};

/** Dropdown / popover: scale from trigger origin. */
export const pop: Variants = {
  hidden: { opacity: 0, scale: 0.98 },
  show: { opacity: 1, scale: 1, transition: { duration: dur.fast, ease: easeOutExpo } },
  exit: { opacity: 0, scale: 0.98, transition: { duration: dur.fast * 0.8, ease: easeOutExpo } },
};

/** Stagger container — first 6 children only, 30ms apart. */
export const staggerParent: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.03 } },
};
