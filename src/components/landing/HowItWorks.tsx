"use client";

import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { ArrowRight, BadgeCheck, Gauge, MapPin, Store, Trophy } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";

import { FactorRow } from "@/components/FactorRow";
import { ScoreDial } from "@/components/ScoreDial";
import { VerdictBadge } from "@/components/VerdictBadge";
import { KpiCard } from "@/components/dashboard/KpiCard";
import type { Factor } from "@/lib/api/types";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { SAMPLE_LOCATIONS, scoreLocation } from "@/landing/scoring-mini";
import { BrowserFrame } from "./BrowserFrame";

const STEPS = [
  { title: "Pilih kategori & titik", body: "Tentukan kategori franchise, klik lokasi di peta — pin jatuh, radius 1/2/5 km mekar." },
  { title: "Baca dashboard-nya", body: "KPI cards terisi, ScoreDial mengisi, tiap faktor muncul dengan kontribusi ± yang jelas." },
  { title: "Temukan titik terbaik", body: "Location Discovery menyalakan heatmap se-kecamatan dan menyusun 10 lokasi teratas." },
  { title: "Bandingkan & putuskan", body: "Adu dua kandidat, faktor pemenang di-highlight, verdict final sebagai stempel keputusan." },
];

const tebet = SAMPLE_LOCATIONS.find((l) => l.id === "tebet")!;
const scbd = SAMPLE_LOCATIONS.find((l) => l.id === "scbd")!;

function P0() {
  return (
    <div className="p-6">
      <div className="mb-4 flex gap-1.5">
        {["Kopi Grab-and-Go", "Laundry", "Minimarket"].map((c, i) => (
          <span
            key={c}
            className={`rounded-full px-3 py-1 text-xs font-medium ${i === 0 ? "bg-brand text-white" : "bg-slate-200 text-slate-500"}`}
          >
            {c}
          </span>
        ))}
      </div>
      <div className="relative flex h-52 items-center justify-center rounded-xl bg-white">
        {[1, 2, 3].map((i) => (
          <span key={i} className="absolute rounded-full border border-brand/30" style={{ width: i * 70, height: i * 70 }} />
        ))}
        <MapPin className="relative h-9 w-9 text-brand drop-shadow" fill="#1D4ED8" stroke="#fff" />
      </div>
    </div>
  );
}

function P1({ active }: { active: boolean }) {
  const scored = scoreLocation(tebet);
  return (
    <div className="p-4">
      <div className="mb-3 grid grid-cols-3 gap-2">
        <KpiCard icon={Gauge} label="Score" value={scored.composite.toFixed(0)} />
        <KpiCard icon={BadgeCheck} label="Verdict">
          <VerdictBadge verdict={scored.verdict} size="sm" />
        </KpiCard>
        <KpiCard icon={Store} iconClass="bg-avoid/10 text-avoid" label="Kompetitor" value="18" />
      </div>
      <div className="flex items-center gap-3 rounded-xl bg-white p-3">
        <ScoreDial score={scored.composite} verdict={scored.verdict} size={96} label="" />
        <div className="flex-1">
          {tebet.factors.slice(0, 3).map((f, i) => (
            <motion.div
              key={f.key}
              initial={{ opacity: 0, x: 8 }}
              animate={active ? { opacity: 1, x: 0 } : { opacity: 0 }}
              transition={{ delay: 0.2 + i * 0.15 }}
            >
              <FactorRow factor={f as Factor} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function P2() {
  const cells = Array.from({ length: 40 }, (_, i) => 40 + ((i * 37) % 55));
  const color = (s: number) => (s >= 80 ? "#16A34A" : s >= 65 ? "#0D9488" : s >= 50 ? "#D97706" : "#DC2626");
  return (
    <div className="grid grid-cols-2 gap-3 p-4">
      <div className="grid grid-cols-8 gap-1 rounded-xl bg-white p-3">
        {cells.map((s, i) => (
          <motion.span
            key={i}
            className="aspect-square rounded-full"
            style={{ background: color(s), opacity: 0.55 }}
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.01 }}
          />
        ))}
      </div>
      <div className="space-y-1.5 rounded-xl bg-white p-3">
        {[84, 79, 71].map((s, i) => (
          <div key={i} className="flex items-center gap-2 rounded-lg border border-slate-100 p-2">
            <span
              className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white"
              style={{ background: color(s) }}
            >
              {i + 1}
            </span>
            <span className="flex-1 text-xs text-slate-600">Kebayoran Baru</span>
            <span className="tnum text-sm font-bold text-slate-800">{s}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function P3() {
  const a = scoreLocation(scbd);
  const b = scoreLocation(tebet);
  const cards = [
    { name: scbd.name, s: a },
    { name: tebet.name, s: b },
  ];
  const bestIdx = a.composite >= b.composite ? 0 : 1;
  return (
    <div className="flex items-stretch gap-3 p-4">
      {cards.map((c, i) => (
        <div
          key={i}
          className={`flex-1 rounded-xl border p-4 text-center ${i === bestIdx ? "border-prime/40 bg-prime-bg" : "border-slate-200 bg-white"}`}
        >
          <p className="truncate text-xs font-medium text-slate-500">{c.name}</p>
          <ScoreDial score={c.s.composite} verdict={c.s.verdict} size={90} label="" />
          <div className="flex items-center justify-center gap-1">
            <VerdictBadge verdict={c.s.verdict} size="sm" />
            {i === bestIdx && <Trophy className="h-3.5 w-3.5 text-prime" />}
          </div>
        </div>
      ))}
    </div>
  );
}

function panel(step: number, motionOn: boolean) {
  if (step === 0) return <P0 />;
  if (step === 1) return <P1 active={motionOn} />;
  if (step === 2) return <P2 />;
  return <P3 />;
}

export function HowItWorks() {
  const reduce = usePrefersReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [step, setStep] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setStep(v < 0.25 ? 0 : v < 0.5 ? 1 : v < 0.75 ? 2 : 3);
  });

  const header = (
    <div className="text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-brand">Product tour</p>
      <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
        Seperti ini rasanya memakai Localyze.
      </h2>
    </div>
  );

  const cta = (
    <Link href="/register" className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline">
      Daftar & jalankan analisis pertamamu <ArrowRight className="h-4 w-4" />
    </Link>
  );

  if (reduce) {
    return (
      <section id="how" className="mx-auto max-w-5xl px-4 py-20">
        {header}
        <div className="mt-10 space-y-8">
          {STEPS.map((st, i) => (
            <div key={i} className="grid gap-4 lg:grid-cols-2 lg:items-center">
              <div>
                <p className="text-sm font-semibold text-brand">Langkah {i + 1}</p>
                <h3 className="mt-1 text-xl font-semibold text-slate-900">{st.title}</h3>
                <p className="mt-1 text-slate-500">{st.body}</p>
              </div>
              <BrowserFrame>{panel(i, true)}</BrowserFrame>
            </div>
          ))}
        </div>
        <div className="text-center">{cta}</div>
      </section>
    );
  }

  return (
    <section id="how" ref={ref} className="relative mx-auto max-w-5xl px-4" style={{ height: "320vh" }}>
      <div className="sticky top-0 flex min-h-screen flex-col justify-center py-16">
        {header}
        <div className="mt-8 grid gap-8 lg:grid-cols-2 lg:items-center">
          <div className="space-y-5">
            {STEPS.map((st, i) => (
              <div key={i} className={`transition-opacity duration-300 ${step === i ? "opacity-100" : "opacity-30"}`}>
                <p className="text-sm font-semibold text-brand">Langkah {i + 1}</p>
                <h3 className="mt-1 text-2xl font-semibold text-slate-900">{st.title}</h3>
                <p className="mt-1 text-slate-500">{st.body}</p>
              </div>
            ))}
            {cta}
          </div>
          <BrowserFrame>
            <motion.div key={step} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {panel(step, true)}
            </motion.div>
          </BrowserFrame>
        </div>
      </div>
    </section>
  );
}
