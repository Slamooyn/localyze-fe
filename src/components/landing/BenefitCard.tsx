"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

export function BenefitCard({
  icon: Icon,
  title,
  body,
  tier,
  index,
}: {
  icon: LucideIcon;
  title: string;
  body: string;
  tier: "Core" | "Pro insight";
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.4, delay: (index % 3) * 0.08 }}
      whileHover={{ y: -4 }}
      className="group rounded-2xl border border-slate-200 bg-white p-5"
    >
      <div className="flex items-center justify-between">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 text-brand transition group-hover:bg-brand group-hover:text-white">
          <Icon className="h-5 w-5" />
        </span>
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
            tier === "Core" ? "bg-brand/10 text-brand" : "bg-cyan-50 text-cyan-600"
          }`}
        >
          {tier}
        </span>
      </div>
      <h3 className="mt-3 font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 text-sm leading-relaxed text-slate-500">{body}</p>
    </motion.div>
  );
}
