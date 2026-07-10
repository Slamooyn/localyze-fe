import Image from "next/image";

import { LogoBadge } from "@/components/Logo";

// Interior of the S2 reveal card. Uses the real dashboard screenshot when
// public/screenshots/dashboard.png exists (post-build note in the prompt);
// until then a navy placeholder with the logo.
export function DashboardPreview({ hasScreenshot }: { hasScreenshot: boolean }) {
  if (hasScreenshot) {
    return (
      <Image
        src="/screenshots/dashboard.png"
        alt="Dashboard Localyze — analisis Tebet, Jakarta Selatan: peta kompetitor, Localyze Score, dan rincian faktor"
        fill
        sizes="(max-width: 768px) 100vw, 1024px"
        className="object-cover object-top"
      />
    );
  }
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-gradient-to-b from-[#0B1B3B] to-[#172554]">
      <LogoBadge size={40} />
      <p className="text-sm font-medium tracking-wide text-blue-200/70">Dashboard preview</p>
    </div>
  );
}
