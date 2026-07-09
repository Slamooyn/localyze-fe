import type { Metadata } from "next";

import { LandingPage } from "@/components/landing/LandingPage";

export const metadata: Metadata = {
  title: "Localyze — Berhenti menebak lokasi. Mulai menghitungnya.",
  description:
    "Localyze menganalisis kepadatan kompetitor, demografi, dan potensi pasar franchise dalam satu skor yang bisa dipertanggungjawabkan.",
  openGraph: {
    title: "Localyze — Franchise Location Intelligence",
    description:
      "Satu skor lokasi 0–100 dengan verdict dan bukti per faktor. Coba demo tanpa daftar.",
    type: "website",
  },
};

export default function Home() {
  return <LandingPage />;
}
