"use client";

import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { MapPin } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { FactorRow } from "@/components/FactorRow";
import { ScoreDial } from "@/components/ScoreDial";
import { VerdictBadge } from "@/components/VerdictBadge";
import type { Factor } from "@/lib/api/types";
import { SAMPLE_LOCATIONS, scoreLocation } from "@/landing/scoring-mini";

const STEPS = [
  { title: "Pilih titik", body: "Klik lokasi di peta. Pin jatuh, radius 1/2/5 km mekar." },
  { title: "Baca skornya", body: "ScoreDial terisi, tiap faktor muncul dengan kontribusi ± yang jelas." },
  { title: "Bandingkan & putuskan", body: "Dua kandidat diadu, faktor pemenang di-highlight, verdict final." },
];

const tebet = SAMPLE_LOCATIONS.find((l) => l.id === "tebet")!;
const scbd = SAMPLE_LOCATIONS.find((l) => l.id === "scbd")!;

function usePrefersReducedMotion() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduce(m.matches);
    const on = () => setReduce(m.matches);
    m.addEventListener("change", on);
    return () => m.removeEventListener("change", on);
  }, []);
  return reduce;
}

function PhasePin() {
  return (
    <div className="relative flex h-64 items-center justify-center">
      {[1, 2, 3].map((i) => (
        <span
          key={i}
          className="absolute rounded-full border border-brand/40"
          style={{ width: i * 90, height: i * 90, opacity: 0.7 - i * 0.15 }}
        />
      ))}
      <MapPin className="relative h-10 w-10 text-brand drop-shadow" fill="#1D4ED8" stroke="#fff" />
    </div>
  );
}

function PhaseScore({ active }: { active: boolean }) {
  const scored = scoreLocation(tebet);
  const [score, setScore] = useState(0);
  useEffect(() => {
    if (!active) return;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 900);
      setScore((1 - Math.pow(1 - t, 3)) * scored.composite);
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [active, scored.composite]);
  return (
    <div className="flex flex-col items-center gap-3">
      <ScoreDial score={score} verdict={scored.verdict} size={120} />
      <div className="w-full max-w-xs">
        {tebet.factors.map((f, i) => (
          <motion.div
            key={f.key}
            initial={{ opacity: 0, y: 8 }}
            animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
            transition={{ delay: 0.2 + i * 0.15 }}
          >
            <FactorRow factor={f as Factor} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function PhaseCompare() {
  const a = scoreLocation(scbd);
  const b = scoreLocation(tebet);
  const best = a.composite >= b.composite ? "scbd" : "tebet";
  const cards = [
    { id: "scbd", name: scbd.name, s: a },
    { id: "tebet", name: tebet.name, s: b },
  ];
  return (
    <div className="flex items-stretch gap-3">
      {cards.map((c) => (
        <div
          key={c.id}
          className={`flex-1 rounded-xl border p-4 text-center ${
            best === c.id ? "border-prime/40 bg-prime-bg" : "border-slate-200 bg-white"
          }`}
        >
          <p className="truncate text-xs font-medium text-slate-500">{c.name}</p>
          <ScoreDial score={c.s.composite} verdict={c.s.verdict} size={96} label="" />
          <VerdictBadge verdict={c.s.verdict} size="sm" />
        </div>
      ))}
    </div>
  );
}

export function HowItWorks() {
  const reduce = usePrefersReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [step, setStep] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setStep(v < 0.34 ? 0 : v < 0.67 ? 1 : 2);
  });

  const panel = (s: number) =>
    s === 0 ? <PhasePin /> : s === 1 ? <PhaseScore active /> : <PhaseCompare />;

  if (reduce) {
    return (
      <section id="how" className="mx-auto max-w-5xl px-4 py-20">
        <Header />
        <div className="mt-10 space-y-8">
          {STEPS.map((st, i) => (
            <div key={i} className="grid gap-4 sm:grid-cols-2 sm:items-center">
              <div>
                <p className="text-sm font-semibold text-brand">Langkah {i + 1}</p>
                <h3 className="mt-1 text-xl font-semibold text-slate-900">{st.title}</h3>
                <p className="mt-1 text-slate-500">{st.body}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">{panel(i)}</div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section id="how" ref={ref} className="relative mx-auto max-w-5xl px-4" style={{ height: "260vh" }}>
      <div className="sticky top-0 flex min-h-screen flex-col justify-center py-16">
        <Header />
        <div className="mt-8 grid gap-8 sm:grid-cols-2 sm:items-center">
          <div className="space-y-6">
            {STEPS.map((st, i) => (
              <div
                key={i}
                className={`transition-opacity duration-300 ${step === i ? "opacity-100" : "opacity-30"}`}
              >
                <p className="text-sm font-semibold text-brand">Langkah {i + 1}</p>
                <h3 className="mt-1 text-2xl font-semibold text-slate-900">{st.title}</h3>
                <p className="mt-1 text-slate-500">{st.body}</p>
              </div>
            ))}
          </div>
          <div className="flex min-h-[320px] items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <motion.div key={step} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full">
              {panel(step)}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Header() {
  return (
    <div className="text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-brand">Cara kerja</p>
      <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
        Dari titik di peta ke keputusan — dalam tiga langkah.
      </h2>
    </div>
  );
}
