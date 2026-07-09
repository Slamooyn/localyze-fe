import { MousePointerClick } from "lucide-react";

const EXAMPLES = [
  { label: "Tebet", lat: -6.2264, lng: 106.8531 },
  { label: "SCBD / Senayan", lat: -6.2246, lng: 106.8097 },
  { label: "Kemang", lat: -6.2637, lng: 106.814 },
];

export function EmptyState({
  onPick,
}: {
  onPick: (p: { lat: number; lng: number; label: string }) => void;
}) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand/10">
        <MousePointerClick className="h-7 w-7 text-brand" />
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-700">Mulai analisis lokasi</p>
        <p className="mt-1 text-xs text-slate-400">
          Cari lokasi, klik peta, atau coba contoh di bawah.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-1.5">
        {EXAMPLES.map((e) => (
          <button
            key={e.label}
            onClick={() => onPick(e)}
            className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-sm transition hover:border-brand hover:text-brand"
          >
            {e.label}
          </button>
        ))}
      </div>
    </div>
  );
}
