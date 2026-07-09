"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, History, MapPin, Pencil, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { api } from "@/lib/api/client";
import type { AnalysisSummary } from "@/lib/api/types";
import { useAppStore } from "@/lib/store";
import { VerdictBadge } from "./VerdictBadge";

export function HistoryView() {
  const qc = useQueryClient();
  const addToCompare = useAppStore((s) => s.addToCompare);
  const { data, isLoading } = useQuery({
    queryKey: ["analyses"],
    queryFn: () => api.listAnalyses(50),
  });

  const rename = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) => api.patchAnalysis(id, name),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["analyses"] }),
  });
  const remove = useMutation({
    mutationFn: (id: string) => api.deleteAnalysis(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["analyses"] }),
  });

  const [editId, setEditId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");

  if (isLoading) {
    return <div className="p-6 text-sm text-slate-400">Memuat riwayat…</div>;
  }
  if (!data || data.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
        <History className="h-8 w-8 text-slate-300" />
        <p className="text-sm text-slate-400">Belum ada analisis tersimpan.</p>
        <Link href="/app" className="text-sm font-medium text-brand hover:underline">
          Mulai di Analyze →
        </Link>
      </div>
    );
  }

  return (
    <div className="scroll-slim h-full overflow-auto p-4">
      <h2 className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-slate-800">
        <History className="h-4 w-4 text-brand" /> Riwayat analisis
      </h2>
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50 text-left text-xs text-slate-500">
              <th className="px-3 py-2 font-medium">Nama</th>
              <th className="px-3 py-2 font-medium">Kategori</th>
              <th className="px-3 py-2 font-medium">Verdict</th>
              <th className="px-3 py-2 text-right font-medium">Skor</th>
              <th className="px-3 py-2 font-medium">Tanggal</th>
              <th className="px-3 py-2" />
            </tr>
          </thead>
          <tbody>
            {data.map((a: AnalysisSummary) => (
              <tr key={a.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                <td className="px-3 py-2">
                  {editId === a.id ? (
                    <span className="flex items-center gap-1">
                      <input
                        autoFocus
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            rename.mutate({ id: a.id, name: draft });
                            setEditId(null);
                          }
                          if (e.key === "Escape") setEditId(null);
                        }}
                        className="w-40 rounded border border-slate-300 px-1.5 py-0.5 text-sm"
                      />
                      <button
                        onClick={() => {
                          rename.mutate({ id: a.id, name: draft });
                          setEditId(null);
                        }}
                        className="rounded p-1 text-prime hover:bg-slate-100"
                      >
                        <Check className="h-3.5 w-3.5" />
                      </button>
                    </span>
                  ) : (
                    <button
                      onClick={() => {
                        setEditId(a.id);
                        setDraft(a.name ?? "");
                      }}
                      className="group flex items-center gap-1 text-left font-medium text-slate-800"
                    >
                      {a.name ?? "Lokasi"}
                      <Pencil className="h-3 w-3 text-slate-300 group-hover:text-slate-500" />
                    </button>
                  )}
                </td>
                <td className="px-3 py-2 text-slate-500">{a.category.name}</td>
                <td className="px-3 py-2">
                  <VerdictBadge verdict={a.score.verdict} size="sm" />
                </td>
                <td className="tnum px-3 py-2 text-right font-semibold text-slate-800">
                  {a.score.composite.toFixed(0)}
                </td>
                <td className="tnum px-3 py-2 text-xs text-slate-400">
                  {new Date(a.created_at).toLocaleDateString("id-ID")}
                </td>
                <td className="px-3 py-2">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href={`/app?lat=${a.location.lat}&lng=${a.location.lng}&category=${a.category.slug}&analyze=1`}
                      className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-brand"
                      title="Buka di peta"
                    >
                      <MapPin className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => addToCompare(a.id)}
                      className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-brand"
                      title="Tambah ke compare"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => remove.mutate(a.id)}
                      className="rounded p-1.5 text-slate-400 hover:bg-avoid-bg hover:text-avoid"
                      title="Hapus"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
