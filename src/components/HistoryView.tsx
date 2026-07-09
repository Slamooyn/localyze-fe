"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, History, MapPin, Pencil, Plus, Search, Trash2 } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { api } from "@/lib/api/client";
import type { AnalysisSummary, Verdict } from "@/lib/api/types";
import { useAppStore } from "@/lib/store";
import { PageHeader } from "@/components/shell/PageHeader";
import { VerdictBadge } from "@/components/VerdictBadge";
import { Card } from "@/components/ui/Card";

const VERDICTS: (Verdict | "all")[] = ["all", "prime", "strong", "conditional", "avoid"];

export function HistoryView() {
  const qc = useQueryClient();
  const addToCompare = useAppStore((s) => s.addToCompare);
  const { data, isLoading } = useQuery({ queryKey: ["analyses"], queryFn: () => api.listAnalyses(50) });

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
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Verdict | "all">("all");

  const rows = useMemo(() => {
    let r = data ?? [];
    if (filter !== "all") r = r.filter((a) => a.score.verdict === filter);
    if (query.trim())
      r = r.filter((a) => (a.name ?? "").toLowerCase().includes(query.trim().toLowerCase()));
    return r;
  }, [data, filter, query]);

  return (
    <div className="p-5">
      <PageHeader title="Riwayat Analisis" subtitle="Semua analisis lokasi yang kamu simpan." />

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari nama…"
            className="w-40 bg-transparent text-sm outline-none placeholder:text-slate-400"
          />
        </div>
        <div className="flex items-center gap-1">
          {VERDICTS.map((v) => (
            <button
              key={v}
              onClick={() => setFilter(v)}
              className={`rounded-lg px-2.5 py-1.5 text-xs font-medium capitalize transition ${
                filter === v ? "bg-brand text-white" : "bg-white text-slate-500 hover:bg-slate-100"
              }`}
            >
              {v === "all" ? "Semua" : v}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <Card className="p-6 text-sm text-slate-400">Memuat riwayat…</Card>
      ) : !data || data.length === 0 ? (
        <Card className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <History className="h-8 w-8 text-slate-300" />
          <p className="text-sm text-slate-400">Belum ada analisis tersimpan.</p>
          <Link href="/app" className="text-sm font-medium text-brand hover:underline">
            Mulai di Dashboard →
          </Link>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-left text-xs text-slate-500">
                <th className="px-4 py-2.5 font-medium">Nama</th>
                <th className="px-4 py-2.5 font-medium">Kategori</th>
                <th className="px-4 py-2.5 font-medium">Verdict</th>
                <th className="px-4 py-2.5 text-right font-medium">Skor</th>
                <th className="px-4 py-2.5 font-medium">Tanggal</th>
                <th className="px-4 py-2.5" />
              </tr>
            </thead>
            <tbody>
              {rows.map((a: AnalysisSummary) => (
                <tr key={a.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                  <td className="px-4 py-2.5">
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
                          className="auth-input w-40 py-1"
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
                  <td className="px-4 py-2.5 text-slate-500">{a.category.name}</td>
                  <td className="px-4 py-2.5">
                    <VerdictBadge verdict={a.score.verdict} size="sm" />
                  </td>
                  <td className="tnum px-4 py-2.5 text-right font-semibold text-slate-800">
                    {a.score.composite.toFixed(0)}
                  </td>
                  <td className="tnum px-4 py-2.5 text-xs text-slate-400">
                    {new Date(a.created_at).toLocaleDateString("id-ID")}
                  </td>
                  <td className="px-4 py-2.5">
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
        </Card>
      )}
    </div>
  );
}
