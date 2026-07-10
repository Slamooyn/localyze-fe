"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, FileWarning, Trash2, Upload } from "lucide-react";
import { useRef, useState } from "react";

import { toast } from "sonner";

import { api } from "@/lib/api/client";
import type { OutletImportReport } from "@/lib/api/types";
import { useAppStore } from "@/lib/store";
import { PageHeader } from "@/components/shell/PageHeader";

export function OutletsView() {
  const qc = useQueryClient();
  const showOutlets = useAppStore((s) => s.showOutlets);
  const toggleOutlets = useAppStore((s) => s.toggleOutlets);
  const [report, setReport] = useState<OutletImportReport | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: outlets } = useQuery({ queryKey: ["outlets"], queryFn: () => api.listOutlets() });

  const importMut = useMutation({
    mutationFn: (file: File) => api.importOutlets(file),
    onSuccess: (r) => {
      setReport(r);
      qc.invalidateQueries({ queryKey: ["outlets"] });
      toast.success(`${r.imported} outlet diimpor`, {
        description: r.skipped.length ? `${r.skipped.length} baris dilewati` : undefined,
      });
    },
    onError: () => toast.error("Gagal mengimpor CSV"),
  });
  const deleteMut = useMutation({
    mutationFn: () => api.deleteOutlets(),
    onSuccess: () => {
      setReport(null);
      qc.invalidateQueries({ queryKey: ["outlets"] });
      toast.success("Semua outlet dihapus");
    },
  });

  const handleFile = (file?: File | null) => {
    if (file) importMut.mutate(file);
  };

  const count = outlets?.features.length ?? 0;

  return (
    <div className="p-5">
      <PageHeader
        title="Outlet Saya"
        subtitle="Import cabang existing untuk menghitung risiko kanibalisasi antar cabang."
      />
      <div className="mx-auto max-w-2xl space-y-5">

        {/* Dropzone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            handleFile(e.dataTransfer.files?.[0]);
          }}
          onClick={() => inputRef.current?.click()}
          className={`flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed p-8 text-center transition ${
            dragOver ? "border-brand bg-brand/5" : "border-slate-200 hover:border-slate-300"
          }`}
        >
          <Upload className="h-6 w-6 text-slate-400" />
          <p className="text-sm font-medium text-slate-700">
            {importMut.isPending ? "Mengunggah…" : "Tarik CSV atau klik untuk unggah"}
          </p>
          <p className="tnum text-xs text-slate-400">Format header: name,lat,lng,address</p>
          <input
            ref={inputRef}
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </div>

        {/* Report */}
        {report && (
          <div className="rounded-xl border border-slate-200 p-4">
            <p className="flex items-center gap-1.5 text-sm font-medium text-prime">
              <CheckCircle2 className="h-4 w-4" /> {report.imported} outlet diimpor
            </p>
            {report.skipped.length > 0 && (
              <div className="mt-3">
                <p className="flex items-center gap-1.5 text-xs font-medium text-conditional">
                  <FileWarning className="h-3.5 w-3.5" /> {report.skipped.length} baris dilewati
                </p>
                <ul className="mt-1 space-y-0.5">
                  {report.skipped.map((s) => (
                    <li key={s.row} className="tnum text-xs text-slate-500">
                      Baris {s.row}: {s.reason}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Toggle */}
        <label className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 p-3">
          <span className="text-sm text-slate-700">Tampilkan outlet saya di peta</span>
          <button
            type="button"
            onClick={toggleOutlets}
            className={`relative h-6 w-11 rounded-full transition ${showOutlets ? "bg-brand" : "bg-slate-300"}`}
            role="switch"
            aria-checked={showOutlets}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${
                showOutlets ? "left-[22px]" : "left-0.5"
              }`}
            />
          </button>
        </label>

        {/* Active outlets */}
        <div className="rounded-xl border border-slate-200">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-2.5">
            <span className="text-sm font-medium text-slate-700">Outlet aktif ({count})</span>
            {count > 0 && (
              <button
                onClick={() => deleteMut.mutate()}
                className="flex items-center gap-1 text-xs text-avoid hover:underline"
              >
                <Trash2 className="h-3.5 w-3.5" /> Hapus semua
              </button>
            )}
          </div>
          <ul className="divide-y divide-slate-50">
            {count === 0 && <li className="px-4 py-3 text-sm text-slate-400">Belum ada outlet.</li>}
            {outlets?.features.map((f, i) => (
              <li key={i} className="flex items-center justify-between px-4 py-2 text-sm">
                <span className="text-slate-700">{(f.properties.name as string) ?? "Outlet"}</span>
                <span className="tnum text-xs text-slate-400">
                  {f.geometry.coordinates[1].toFixed(4)}, {f.geometry.coordinates[0].toFixed(4)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
