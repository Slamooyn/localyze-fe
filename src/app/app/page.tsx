"use client";

import dynamic from "next/dynamic";

const MapCanvas = dynamic(() => import("@/components/MapCanvas"), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-slate-200" />,
});

export default function AnalyzePage() {
  return (
    <div className="absolute inset-0">
      <MapCanvas />
      <div className="pointer-events-none absolute left-1/2 top-6 -translate-x-1/2 rounded-full bg-white/90 px-4 py-2 text-sm text-slate-500 shadow">
        Peta Jakarta Selatan — cari lokasi atau klik peta untuk mulai
      </div>
    </div>
  );
}
