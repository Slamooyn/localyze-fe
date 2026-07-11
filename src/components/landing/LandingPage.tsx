"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  Compass,
  Gauge,
  Landmark,
  Map,
  Scale,
  ShieldAlert,
  TrendingUp,
  Users,
} from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";

import { Wordmark } from "@/components/Logo";
import { VerdictBadge } from "@/components/VerdictBadge";
import { BenefitCard } from "./BenefitCard";
import { ContainerScroll } from "./ContainerScroll";
import { DashboardPreview } from "./DashboardPreview";
import { GlowyWavesHero } from "./GlowyWavesHero";
import { FaqAccordion } from "./FaqAccordion";
import { FormulaHero } from "./FormulaHero";
import { HowItWorks } from "./HowItWorks";
import { LandingNavbar } from "./LandingNavbar";
import { DecayCurve, PercentileHisto } from "./MicroViz";
const WeightPlayground = dynamic(() => import("./WeightPlayground").then((m) => m.WeightPlayground), {
  ssr: false,
  loading: () => <div className="h-72 w-full animate-pulse rounded-2xl bg-white/10" />,
});

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5 },
};

const BENEFITS = [
  { icon: Gauge, title: "Localyze Score", body: "Skor 0–100 yang bisa dipertanggungjawabkan — bukan feeling.", tier: "Core" as const },
  { icon: Map, title: "Peta kompetitor 1/2/5 km", body: "Tekanan kompetitif berbobot jarak, bukan sekadar hitung jumlah.", tier: "Core" as const },
  { icon: Users, title: "Profil demografi area", body: "Kepadatan, struktur usia, dan daya beli per kelurahan.", tier: "Core" as const },
  { icon: Compass, title: "Location Discovery", body: "“Tunjukkan 10 titik terbaik di kecamatan ini.”", tier: "Pro insight" as const },
  { icon: Scale, title: "Perbandingan lokasi", body: "Tebet vs BSD, faktor per faktor, pemenang tiap baris.", tier: "Pro insight" as const },
  { icon: ShieldAlert, title: "Cannibalization guard", body: "Pastikan cabang baru tidak memakan cabang lama.", tier: "Pro insight" as const },
];

const PERSONAS = [
  { icon: Landmark, title: "Franchise HQ", body: "Standarkan keputusan ekspansi di semua cabang dengan satu metodologi." },
  { icon: Building2, title: "Business development", body: "Saring puluhan kandidat jadi shortlist dalam hitungan menit, bukan minggu." },
  { icon: Users, title: "Investor / VC", body: "Validasi klaim lokasi sebuah brand dengan angka independen." },
];

export function LandingPage({ hasScreenshot = false }: { hasScreenshot?: boolean }) {
  return (
    <div className="min-h-screen bg-white">
      <LandingNavbar />

      {/* S1 — Hero: glowy waves canvas */}
      <GlowyWavesHero />

      {/* S2 — Dashboard reveal */}
      <section
        id="preview"
        aria-label="Pratinjau dashboard"
        className="bg-gradient-to-b from-slate-100 to-white"
      >
        <ContainerScroll
          titleComponent={
            <div className="mb-6">
              <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                Seperti ini dashboard-nya.
              </h2>
              <p className="mt-2 text-slate-500">Peta, skor, dan bukti — dalam satu layar.</p>
            </div>
          }
        >
          <DashboardPreview hasScreenshot={hasScreenshot} />
        </ContainerScroll>
      </section>

      {/* S3 — What you get */}
      <section id="features" className="mx-auto max-w-6xl px-4 py-20">
        <motion.div {...reveal} className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand">Apa yang kamu dapat</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Satu dashboard, semua yang kamu butuhkan sebelum tanda tangan sewa.
          </h2>
        </motion.div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {BENEFITS.map((b, i) => (
            <BenefitCard key={b.title} index={i} {...b} />
          ))}
        </div>
      </section>

      {/* S4 — Product tour */}
      <div className="bg-slate-50">
        <HowItWorks />
      </div>

      {/* S5 — Methodology */}
      <section id="method" className="bg-gradient-to-b from-[#0B1B3B] to-[#172554] py-20 text-white">
        <div className="mx-auto max-w-5xl px-4">
          <motion.div {...reveal} className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-cyan-300">Metodologi</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              Skor kami bukan black box. Ini rumusnya.
            </h2>
          </motion.div>

          <div className="mt-8">
            <FormulaHero />
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <MethodCard title="Distance decay" formula="bobot = e^(−d/τ)">
              <DecayCurve />
              <p className="mt-2 text-xs text-slate-500">
                Kami tidak menghitung kompetitor. Kami menghitung tekanan kompetitif.
              </p>
            </MethodCard>
            <MethodCard title="Normalisasi persentil">
              <PercentileHisto />
              <p className="mt-2 text-xs text-slate-500">
                8 kompetitor itu sepi di Sudirman, jenuh di area residensial — semua dibandingkan dengan distribusi kotanya.
              </p>
            </MethodCard>
            <MethodCard title="Verdict + confidence">
              <div className="flex flex-wrap gap-1.5 py-2">
                <VerdictBadge verdict="prime" size="sm" />
                <VerdictBadge verdict="strong" size="sm" />
                <VerdictBadge verdict="conditional" size="sm" />
                <VerdictBadge verdict="avoid" size="sm" />
              </div>
              <p className="mt-2 text-xs text-slate-500">
                72 vs 74 itu noise. Kami kasih verdict, bukan presisi palsu — plus tingkat keyakinan data.
              </p>
            </MethodCard>
          </div>

          <div className="mt-8">
            <p className="mb-3 text-center text-sm text-blue-100/70">
              Tidak percaya skornya? Bagus. Geser sendiri bobotnya.
            </p>
            <WeightPlayground />
          </div>

          <p className="mt-6 text-center text-xs text-blue-200/50">
            Data demo: snapshot Jakarta Selatan · demografi BPS + modeled · metodologi terbuka.
          </p>
        </div>
      </section>

      {/* S6 — Personas */}
      <section className="mx-auto max-w-5xl px-4 py-20">
        <motion.h2 {...reveal} className="text-center text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          Dibuat untuk yang memutuskan.
        </motion.h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {PERSONAS.map((p) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5 }}
              className="rounded-2xl border border-slate-200 bg-white p-6"
            >
              <p.icon className="h-6 w-6 text-brand" />
              <p className="mt-3 font-semibold text-slate-900">{p.title}</p>
              <p className="mt-1 text-sm text-slate-500">{p.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* S7 — CTA + FAQ + footer */}
      <section className="bg-gradient-to-b from-[#172554] to-[#0B1B3B] py-20 text-white">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <TrendingUp className="mx-auto mb-3 h-8 w-8 text-cyan-300" />
          <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">Lokasi berikutnya, dihitung.</h2>
          <p className="mt-4 text-blue-100/80">Coba demo gratis — cukup daftar, tanpa kartu kredit.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-brand-dark shadow-lg transition hover:bg-blue-50"
            >
              Coba demo gratis <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center rounded-xl border border-white/20 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Masuk
            </Link>
          </div>
          <div className="mt-12">
            <FaqAccordion />
          </div>
        </div>
      </section>

      <footer className="bg-[#0B1B3B] py-8 text-blue-200/60">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 text-sm sm:flex-row">
          <Wordmark onNavy />
          <p>Dibuat oleh Moym · portfolio piece</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white">GitHub</a>
            <a href="#" className="hover:text-white">LinkedIn</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function MethodCard({
  title,
  formula,
  children,
}: {
  title: string;
  formula?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-white p-4 text-slate-700">
      <div className="mb-1 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
        {formula && <code className="tnum rounded bg-slate-100 px-1.5 py-0.5 text-[11px] text-brand">{formula}</code>}
      </div>
      {children}
    </div>
  );
}
