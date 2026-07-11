"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Lock, type LucideIcon } from "lucide-react";

import { dur, easeOutExpo } from "@/lib/motion";
import { useUnlockOnce } from "@/lib/useUnlockOnce";

/** Wraps a Phase-2 card body: first visit shows the old locked teaser ghost,
 * then crossfades once into the real content (spec §4.5). Subsequent visits
 * and reduced-motion render content immediately. */
export function UnlockReveal({
  unlockKey,
  icon: Icon,
  label,
  children,
}: {
  unlockKey: string;
  icon: LucideIcon;
  label: string;
  children: React.ReactNode;
}) {
  const revealed = useUnlockOnce(unlockKey);

  return (
    <div className="min-h-0 flex-1">
      <AnimatePresence initial={false} mode="wait">
        {revealed ? (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: dur.slow, ease: easeOutExpo }}
            className="h-full"
          >
            {children}
          </motion.div>
        ) : (
          <motion.div
            key="locked"
            exit={{ opacity: 0, transition: { duration: dur.fast, ease: easeOutExpo } }}
            className="flex h-full min-h-[140px] flex-col items-center justify-center gap-1.5 p-6"
            aria-hidden
          >
            <Icon className="h-5 w-5 text-slate-400" />
            <span className="text-xs text-slate-500">{label}</span>
            <Lock className="h-3 w-3 text-slate-300" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
