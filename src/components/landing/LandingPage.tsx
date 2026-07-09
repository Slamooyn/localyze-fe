"use client";

import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  Building2,
  ChevronDown,
  Footprints,
  Landmark,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";

import { Wordmark } from "@/components/Logo";
import { CountUpStat } from "./CountUpStat";
import { HowItWorks } from "./HowItWorks";
import { LandingNavbar } from "./LandingNavbar";
import { WeightPlayground } from "./WeightPlayground";

const MiniMap = dynamic(() => import("./MiniMap").then((m) => m.MiniMap), {
  ssr: false,
  loading: () => (
    <div className="h-[360px] w-full animate-pulse rounded-2xl bg-white/10 sm:h-[420px]" />
  ),
});

const DEMO = "/app?lat=-6.2264&lng=106.8531&category=coffee-grab-go&analyze=1";

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5 },
};

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <LandingNavbar />

      {/* S1 — Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0B1B3B] to-[#172554] pt-24 text-white">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-16 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-blue-100">
              <Sparkles className="h-3.5 w-3.5" /> Franchise Location Intelligence
            </span>
            <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
              Berhenti menebak lokasi. <span className="text-cyan-300">Mulai menghitungnya.</span>
            </h1>
            <p className="mt-4 max-w-lg text-lg text-blue-100/80">
              Localyze menganalisis kepadatan kompetitor, demografi, dan potensi pasar dalam satu
              skor yang bisa kamu pertanggungjawabkan ke siapa pun.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                href={DEMO}
                className="inline-flex items-center gap-1.5 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-brand-dark shadow-lg transition hover:bg-blue-50"
              >
                Coba demo <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#how"
                className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Lihat cara kerjanya <ChevronDown className="h-4 w-4" />
              </a>
            </div>
          </div>
          <MiniMap />
        </div>

        {/* trust strip */}
        <div className="border-t border-white/10 bg-black/10">
          <div className="mx-auto grid max-w-3xl grid-cols-3 gap-4 px-4 py-6">
            <CountUpStat value={2300} suffix="+" label="titik grid dianalisis" />
            <CountUpStat value={470} suffix="+" label="kompetitor terpetakan" />
            <CountUpStat value={3} label="kategori franchise" />
          </div>
        </div>
      </section>

      {/* S2 — Problem */}
      <section className="mx-auto max-w-5xl px-4 py-20">
        <motion.h2 {...reveal} className="text-center text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          Ekspansi franchise gagal paling sering karena satu hal:
          <br className="hidden sm:block" /> lokasi yang dipilih pakai perasaan.
        </motion.h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          <motion.div {...reveal} className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <p className="text-sm font-semibold text-avoid">Cara lama</p>
            <p className="mt-2 text-lg font-medium text-slate-800">
              2 minggu survei, keputusan tetap pakai insting.
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Data tersebar, tidak comparable antar kandidat, dan tidak ada angka yang bisa
              dipertanggungjawabkan ke atasan atau investor.
            </p>
          </motion.div>
          <motion.div
            {...reveal}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-2xl border border-brand/20 bg-brand/5 p-6"
          >
            <p className="text-sm font-semibold text-brand">Dengan Localyze</p>
            <p className="mt-2 text-lg font-medium text-slate-800">
              1 menit, keputusan dengan angka yang bisa dipertanggungjawabkan.
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Satu skor 0–100 dengan verdict dan bukti per faktor. Bandingkan kandidat berdampingan,
              temukan lokasi terbaik lewat heatmap.
            </p>
          </motion.div>
        </div>
      </section>

      {/* S3 — How it works */}
      <HowItWorks />

      {/* S4 — Feature grid */}
      <section id="features" className="bg-slate-50 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <motion.div {...reveal} className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-brand">5 lensa analisis</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Setiap keputusan lokasi, dari banyak sudut.
            </h2>
          </motion.div>
          <div className="mt-10 grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {[
              { icon: TrendingUp, label: "Market saturation", live: true },
              { icon: Users, label: "Demographics", live: true },
              { icon: ShieldAlert, label: "Disaster risk", live: false },
              { icon: Activity, label: "Economic lifecycle", live: false },
              { icon: Building2, label: "Economic synergy", live: false },
            ].map(({ icon: Icon, label, live }) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5 }}
                whileHover={{ y: -4, rotate: -0.5 }}
                className={`rounded-2xl border p-5 ${
                  live ? "border-slate-200 bg-white" : "border-dashed border-slate-200 bg-white/50 opacity-70"
                }`}
              >
                <Icon className={`h-6 w-6 ${live ? "text-brand" : "text-slate-400"}`} />
                <p className="mt-3 text-sm font-semibold text-slate-800">{label}</p>
                <span
                  className={`mt-2 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${
                    live ? "bg-prime-bg text-prime" : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {live ? "Live di MVP" : "Segera hadir"}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* S5 — Playground */}
      <section className="mx-auto max-w-5xl px-4 py-20">
        <motion.div {...reveal} className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand">Coba logikanya</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Tidak percaya skornya? Bagus. Geser sendiri bobotnya.
          </h2>
        </motion.div>
        <motion.div {...reveal} className="mt-10">
          <WeightPlayground />
        </motion.div>
      </section>

      {/* S6 — Personas */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-5xl px-4">
          <motion.h2 {...reveal} className="text-center text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Dibuat untuk yang memutuskan.
          </motion.h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {[
              { icon: Landmark, title: "Franchise HQ", body: "Standarkan keputusan ekspansi di semua cabang dengan satu metodologi." },
              { icon: Building2, title: "Business development", body: "Saring puluhan kandidat jadi shortlist dalam hitungan menit, bukan minggu." },
              { icon: Users, title: "Investor / VC", body: "Validasi klaim lokasi sebuah brand dengan angka independen." },
            ].map(({ icon: Icon, title, body }) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5 }}
                className="rounded-2xl border border-slate-200 bg-white p-6"
              >
                <Icon className="h-6 w-6 text-brand" />
                <p className="mt-3 font-semibold text-slate-900">{title}</p>
                <p className="mt-1 text-sm text-slate-500">{body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* S7 — Final CTA + footer */}
      <section className="bg-gradient-to-b from-[#172554] to-[#0B1B3B] py-20 text-center text-white">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">Lokasi berikutnya, dihitung.</h2>
          <p className="mt-4 text-blue-100/80">Coba demo — tanpa daftar, tanpa kartu kredit.</p>
          <Link
            href={DEMO}
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-brand-dark shadow-lg transition hover:bg-blue-50"
          >
            Coba demo sekarang <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-[#0B1B3B] py-8 text-blue-200/60">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 text-sm sm:flex-row">
          <Wordmark className="text-white [&_span]:text-white" />
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
