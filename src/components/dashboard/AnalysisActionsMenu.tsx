"use client";

import { AnimatePresence, motion } from "framer-motion";
import { MoreHorizontal } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { api } from "@/lib/api/client";
import { memoSlug } from "@/lib/download";
import { pop } from "@/lib/motion";
import { MemoLabelSwap, useMemoExport } from "@/components/ExportMemo";

/** Dashboard header ⋯ menu (Phase 2 F4). Holds the "Export memo" action;
 * stays open while the PDF is being generated so the loading state on the
 * item remains visible, then closes on success. */
export function AnalysisActionsMenu({
  analysisId,
  analysisName,
}: {
  analysisId: string;
  analysisName: string | null;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { busy, run } = useMemoExport(
    () => api.analysisMemo(analysisId),
    `localyze-memo-${memoSlug(analysisName)}.pdf`,
  );
  const busyRef = useRef(busy);
  busyRef.current = busy;

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (busyRef.current) return; // keep the loading state visible
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Aksi analisis lainnya"
        aria-haspopup="menu"
        aria-expanded={open}
        className={`rounded-lg border p-2 transition ${
          open
            ? "border-slate-300 bg-slate-50 text-slate-700"
            : "border-slate-200 text-slate-600 hover:border-slate-300"
        }`}
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            variants={pop}
            initial="hidden"
            animate="show"
            exit="exit"
            style={{ transformOrigin: "top right" }}
            role="menu"
            className="absolute right-0 z-40 mt-1 w-56 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-lg"
          >
            <button
              role="menuitem"
              disabled={busy}
              aria-busy={busy}
              onClick={async () => {
                const ok = await run();
                if (ok) setOpen(false);
              }}
              className="flex w-full items-center px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-50 disabled:cursor-default disabled:hover:bg-white"
            >
              <MemoLabelSwap busy={busy} label="Export memo (PDF)" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
