"use client";

import { motion } from "framer-motion";
import { BadgeCheck, LogIn, MapPin, Store } from "lucide-react";
import Link from "next/link";

import { ScoreDial } from "@/components/ScoreDial";
import { dur, easeOutExpo } from "@/lib/motion";

// Static hero — the final version for mobile & prefers-reduced-motion, and the
// L1 stand-in until the GSAP CinematicHero lands (spec §S1 fallback). Shares the
// cinematic card identity (#162C6D → #0A101D) without pinning or GSAP.

const CARD_GRADIENT = "linear-gradient(145deg, #162C6D 0%, #0A101D 100%)";

const GRID_BG = {
  backgroundSize: "60px 60px",
  backgroundImage:
    "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px)," +
    "linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)",
  maskImage: "radial-gradient(ellipse at center, black 0%, transparent 70%)",
  WebkitMaskImage: "radial-gradient(ellipse at center, black 0%, transparent 70%)",
} as const;

function MiniFactor({
  label,
  value,
  color,
  bg,
}: {
  label: string;
  value: number;
  color: string;
  bg: string;
}) {
  return (
    <div className="rounded-lg border border-slate-100 bg-white p-2.5">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-slate-600">{label}</span>
        <span className="tnum text-xs font-bold" style={{ color }}>
          {value}
        </span>
      </div>
      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full" style={{ background: bg }}>
        <div className="h-full rounded-full" style={{ width: `${value}%`, background: color }} />
      </div>
    </div>
  );
}

function GlassBadge({
  icon: Icon,
  iconClass,
  title,
  subtitle,
  className,
}: {
  icon: typeof BadgeCheck;
  iconClass: string;
  title: string;
  subtitle: string;
  className: string;
}) {
  return (
    <div
      className={`absolute z-20 hidden items-center gap-3 rounded-2xl border border-white/10 bg-white/10 p-3 shadow-xl shadow-black/40 backdrop-blur-md sm:flex ${className}`}
    >
      <span
        className={`flex h-9 w-9 items-center justify-center rounded-full border shadow-inner ${iconClass}`}
      >
        <Icon className="h-4 w-4" />
      </span>
      <span>
        <span className="block text-xs font-bold tracking-tight text-white">{title}</span>
        <span className="block text-[11px] font-medium text-blue-200/60">{subtitle}</span>
      </span>
    </div>
  );
}

// The mini dashboard shown inside the browser window — same content the GSAP
// hero renders in its card phase, so both variants tell one story.
function HeroMockup() {
  return (
    <div className="relative">
      <div
        className="rounded-[28px] p-4 shadow-2xl shadow-black/50 ring-1 ring-white/10 sm:p-7"
        style={{ background: CARD_GRADIENT }}
      >
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl shadow-black/40">
          <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-3 py-2">
            <span className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
              <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
              <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
            </span>
            <span className="ml-2 flex-1 truncate rounded-md bg-white px-3 py-1 text-center text-[11px] text-slate-400">
              localyze.app
            </span>
          </div>
          <div className="bg-slate-50 p-4 sm:p-5">
            <div className="flex items-center justify-between gap-2">
              <p className="truncate text-xs font-semibold text-slate-700 sm:text-sm">
                Analisis · Tebet, Jakarta Selatan
              </p>
              <span className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wide text-slate-400">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-strong" aria-hidden />
                Live
              </span>
            </div>
            <div className="mt-4 flex items-center gap-4 sm:gap-6">
              <div className="flex flex-col items-center gap-1.5">
                <ScoreDial score={72} verdict="strong" size={116} label="" />
                <span className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                  Localyze Score
                </span>
              </div>
              <div className="min-w-0 flex-1 space-y-2.5">
                <MiniFactor label="Demand" value={68} color="#2563EB" bg="#DBEAFE" />
                <MiniFactor label="Kompetisi" value={41} color="#D97706" bg="#FEF3C7" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <GlassBadge
        icon={BadgeCheck}
        iconClass="border-teal-400/30 bg-teal-500/15 text-teal-300"
        title="Verdict: Strong"
        subtitle="Skor 72 dari 100"
        className="-top-6 -left-3 lg:-left-10"
      />
      <GlassBadge
        icon={Store}
        iconClass="border-blue-400/30 bg-blue-500/15 text-blue-300"
        title="8 kompetitor dalam 1 km"
        subtitle="Tekanan berbobot jarak"
        className="-bottom-5 -right-3 lg:-right-8"
      />
    </div>
  );
}

export function CinematicHeroStatic() {
  return (
    <div className="relative isolate overflow-hidden bg-gradient-to-b from-[#0B1B3B] to-[#172554] pt-28 text-white sm:pt-32">
      <div className="absolute inset-0 -z-10" style={GRID_BG} aria-hidden />

      <div className="mx-auto grid max-w-6xl items-center gap-14 px-4 pb-20 lg:grid-cols-2 lg:gap-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: dur.slow, ease: easeOutExpo }}
        >
          <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-[2.85rem]">
            Berhenti menebak lokasi.
            <span className="block text-cyan-300">Mulai menghitungnya.</span>
          </h1>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-blue-100/80">
            <span className="font-semibold text-white">Localyze</span> menganalisis kompetitor,
            demografi, dan potensi pasar di titik mana pun — lalu merangkumnya jadi satu skor yang
            bisa kamu pertanggungjawabkan ke siapa pun.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-brand-dark shadow-lg transition hover:bg-blue-50"
            >
              <MapPin className="h-4 w-4" /> Coba demo gratis
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              <LogIn className="h-4 w-4" /> Masuk
            </Link>
          </div>
          <p className="mt-4 text-sm text-blue-200/60">Cukup daftar, tanpa kartu kredit.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: dur.slow, ease: easeOutExpo, delay: 0.1 }}
          className="mx-auto w-full max-w-md lg:max-w-none"
        >
          <HeroMockup />
        </motion.div>
      </div>
    </div>
  );
}
