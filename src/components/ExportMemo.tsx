"use client";

import { FileDown, Loader2 } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { ApiError } from "@/lib/api/client";
import { downloadBlob } from "@/lib/download";

/** Shared export-memo flow (Dashboard ⋯ menu & Compare): fetch PDF blob,
 * download it under the Content-Disposition filename (fallback provided by
 * the caller), toast on error. `busy` drives the button loading state. */
export function useMemoExport(
  fetcher: () => Promise<{ blob: Blob; filename: string | null }>,
  fallbackFilename: string,
) {
  const [busy, setBusy] = useState(false);
  const inflight = useRef(false);

  const run = async (): Promise<boolean> => {
    if (inflight.current) return false;
    inflight.current = true;
    setBusy(true);
    try {
      const { blob, filename } = await fetcher();
      downloadBlob(blob, filename ?? fallbackFilename);
      return true;
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : "Gagal membuat memo PDF");
      return false;
    } finally {
      inflight.current = false;
      setBusy(false);
    }
  };

  return { busy, run };
}

/** Label ⇄ spinner crossfade with the width locked to the widest state
 * (both stacked in one grid cell — no layout shift, guidelines §4 Button). */
export function MemoLabelSwap({
  busy,
  label = "Export memo",
  busyLabel = "Menyiapkan…",
}: {
  busy: boolean;
  label?: string;
  busyLabel?: string;
}) {
  return (
    <span className="grid">
      <span
        aria-hidden={busy}
        className={`col-start-1 row-start-1 flex items-center gap-1.5 transition-opacity duration-150 ${
          busy ? "opacity-0" : "opacity-100"
        }`}
      >
        <FileDown className="h-4 w-4 shrink-0" />
        {label}
      </span>
      <span
        aria-hidden={!busy}
        className={`col-start-1 row-start-1 flex items-center gap-1.5 transition-opacity duration-150 ${
          busy ? "opacity-100" : "opacity-0"
        }`}
      >
        <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
        {busyLabel}
      </span>
    </span>
  );
}
