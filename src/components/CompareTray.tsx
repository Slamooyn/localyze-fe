"use client";

import { Scale, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useAppStore } from "@/lib/store";

export function CompareTray() {
  const compareIds = useAppStore((s) => s.compareIds);
  const remove = useAppStore((s) => s.removeFromCompare);
  const clear = useAppStore((s) => s.clearCompare);
  const router = useRouter();

  if (compareIds.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-40 flex justify-center px-4">
      <div className="pointer-events-auto flex items-center gap-3 rounded-xl border border-slate-200 bg-white/95 px-3 py-2 shadow-lg backdrop-blur">
        <span className="flex items-center gap-1.5 text-sm font-medium text-slate-600">
          <Scale className="h-4 w-4 text-brand" />
          Compare tray
        </span>
        <div className="flex items-center gap-1.5">
          {compareIds.map((id, i) => (
            <span
              key={id}
              className="flex items-center gap-1 rounded-full bg-slate-100 py-1 pl-2.5 pr-1 text-xs font-medium text-slate-700"
            >
              Kandidat {i + 1}
              <button
                onClick={() => remove(id)}
                className="rounded-full p-0.5 hover:bg-slate-200"
                aria-label="Hapus dari compare"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
        <button
          disabled={compareIds.length < 2}
          onClick={() => router.push(`/app/compare?ids=${compareIds.join(",")}`)}
          className="rounded-lg bg-brand px-3 py-1.5 text-sm font-semibold text-white transition enabled:hover:bg-brand-dark disabled:opacity-40"
        >
          Bandingkan
        </button>
        <button onClick={clear} className="text-xs text-slate-400 hover:text-slate-600">
          Reset
        </button>
        <Link href="/app/compare" className="sr-only">
          Compare
        </Link>
      </div>
    </div>
  );
}
