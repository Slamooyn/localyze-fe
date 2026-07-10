"use client";

import { MotionConfig, motion, type Variants } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";
import dynamic from "next/dynamic";

import { Button } from "@/components/ui/Button";
import { dur, easeOutExpo } from "@/lib/motion";
import { CountUpStat } from "./CountUpStat";

// S1 — adapted from markdowns/reference/glowy-waves-hero-reference.tsx (spec §S1).
// The canvas is client-only (lazy); headline & CTAs stay server-rendered for LCP.
const WavesCanvas = dynamic(() => import("./WavesCanvas"), { ssr: false });

const HIGHLIGHT_PILLS = ["Skor explainable", "Snapshot Jakarta Selatan", "Tanpa kartu kredit"];

const HERO_STATS = [
  { value: 2300, suffix: "+", label: "Titik grid dianalisis" },
  { value: 400, suffix: "+", label: "Kompetitor terpetakan" },
  { value: null, display: "<1 dtk", label: "Waktu ke insight" },
] as const;

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: easeOutExpo, staggerChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: easeOutExpo } },
};

const statsVariants: Variants = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: dur.slow, ease: easeOutExpo, staggerChildren: 0.08 },
  },
};

export function GlowyWavesHero() {
  return (
    <section
      className="relative isolate flex min-h-[100svh] w-full items-center justify-center overflow-hidden bg-gradient-to-b from-white to-slate-100"
      aria-label="Localyze — franchise location intelligence"
    >
      <WavesCanvas />

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center px-4 pb-16 pt-28 text-center sm:px-6 sm:pb-20">
        {/* reducedMotion="user": transform animations drop to a plain fade for
            prefers-reduced-motion, with identical server/client initial HTML. */}
        <MotionConfig reducedMotion="user">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full"
        >
          <motion.div
            variants={itemVariants}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600 backdrop-blur"
          >
            <MapPin className="h-4 w-4 text-brand" aria-hidden="true" />
            Franchise location intelligence
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="mb-6 text-4xl font-semibold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl"
          >
            Berhenti menebak lokasi.{" "}
            <span className="bg-gradient-to-r from-brand via-brand/60 to-slate-900/80 bg-clip-text text-transparent">
              Mulai menghitungnya.
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mx-auto mb-10 max-w-3xl text-lg leading-relaxed text-slate-600 sm:text-xl"
          >
            <span className="font-semibold text-slate-900">Localyze</span> menganalisis kompetitor,
            demografi, dan potensi pasar di titik mana pun — jadi satu skor yang bisa kamu
            pertanggungjawabkan.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="mb-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Button href="/register" size="lg" className="group">
              Coba demo gratis
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Button>
            <Button href="/login" variant="outline" size="lg">
              Masuk
            </Button>
          </motion.div>

          <motion.ul
            variants={itemVariants}
            className="mb-12 flex flex-wrap items-center justify-center gap-2.5 text-xs font-medium text-slate-600"
          >
            {HIGHLIGHT_PILLS.map((pill) => (
              <li
                key={pill}
                className="rounded-full border border-slate-200 bg-white/70 px-4 py-2 backdrop-blur"
              >
                {pill}
              </li>
            ))}
          </motion.ul>

          <motion.div
            variants={statsVariants}
            className="mx-auto grid max-w-3xl gap-6 rounded-2xl border border-slate-200/80 bg-white/70 p-6 backdrop-blur-sm sm:grid-cols-3"
          >
            {HERO_STATS.map((stat) => (
              <motion.div key={stat.label} variants={itemVariants}>
                {stat.value !== null ? (
                  <CountUpStat
                    value={stat.value}
                    suffix={stat.suffix}
                    label={stat.label}
                    valueClassName="text-slate-900"
                    labelClassName="text-slate-500"
                  />
                ) : (
                  <div className="text-center">
                    <div className="tnum text-2xl font-bold text-slate-900 sm:text-3xl">
                      {stat.display}
                    </div>
                    <div className="mt-1 text-xs text-slate-500">{stat.label}</div>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
        </MotionConfig>
      </div>
    </section>
  );
}
