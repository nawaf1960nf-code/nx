"use client";

import { motion } from "framer-motion";
import { TrendingUp, Sparkles, Trophy, Target, Lightbulb } from "lucide-react";
import { useLocale } from "@/lib/locale-context";

/** A polished, animated mock of the analytics dashboard for the hero. */
export function DashboardMockup() {
  const { t } = useLocale();
  const d = t.landing.dashboardPreview;

  const bars = [52, 64, 58, 73, 81, 78, 90];
  const topics = [
    { label: "Servicescape", v: 92 },
    { label: "SSTs", v: 86 },
    { label: "Blueprinting", v: 64 },
    { label: "Marketing Comms", v: 48 },
  ];

  return (
    <div className="relative rounded-[1.75rem] border border-white/10 bg-base-900 p-3 shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)]">
      {/* window chrome */}
      <div className="mb-3 flex items-center gap-1.5 px-3 pt-1">
        <span className="h-2.5 w-2.5 rounded-full bg-danger/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-gold/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-success/70" />
        <span className="ms-3 inline-flex items-center gap-1.5 rounded-full bg-gold/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-gold">
          <Sparkles className="h-3 w-3" /> {d.previewLabel}
        </span>
      </div>

      <div className="grid gap-3 rounded-[1.4rem] bg-base-950/60 p-3 sm:grid-cols-3">
        {/* Big chart card */}
        <div className="card-premium sm:col-span-2 p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-brand-100/60">{d.cardAnalytics}</p>
              <p className="font-display text-3xl font-bold text-white">
                87<span className="text-lg text-brand-100/60">%</span>
              </p>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2.5 py-1 text-xs font-semibold text-success">
              <TrendingUp className="h-3.5 w-3.5" /> +14%
            </span>
          </div>
          {/* animated bars */}
          <div className="flex h-28 items-end gap-2">
            {bars.map((h, i) => (
              <motion.div
                key={i}
                className="flex-1 rounded-t-md bg-gradient-to-t from-brand-600/40 to-accent-400"
                initial={{ height: 0 }}
                whileInView={{ height: `${h}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.07, ease: "easeOut" }}
              />
            ))}
          </div>
        </div>

        {/* Stat stack */}
        <div className="flex flex-col gap-3">
          <div className="card-premium flex items-center gap-3 p-4">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gold/15 text-gold">
              <Trophy className="h-4 w-4" />
            </span>
            <div>
              <p className="text-[10px] uppercase tracking-wide text-brand-100/60">{d.bestLabel}</p>
              <p className="font-display text-lg font-bold text-white">96%</p>
            </div>
          </div>
          <div className="card-premium flex items-center gap-3 p-4">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-500/15 text-brand-300">
              <Target className="h-4 w-4" />
            </span>
            <div>
              <p className="text-[10px] uppercase tracking-wide text-brand-100/60">{d.attemptsLabel}</p>
              <p className="font-display text-lg font-bold text-white">12</p>
            </div>
          </div>
        </div>

        {/* Topic mastery */}
        <div className="card-premium p-5 sm:col-span-2">
          <p className="mb-3 text-xs font-semibold text-brand-100/70">{d.cardProgress}</p>
          <div className="space-y-2.5">
            {topics.map((tp, i) => (
              <div key={tp.label}>
                <div className="mb-1 flex justify-between text-[11px]">
                  <span className="text-brand-100/70">{tp.label}</span>
                  <span className="text-brand-100/60">{tp.v}%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-white/8">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: tp.v >= 70 ? "#34d399" : tp.v >= 50 ? "#fbbf24" : "#fb7185" }}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${tp.v}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 + i * 0.1 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI insight */}
        <div className="card-premium flex flex-col gap-3 p-5">
          <div className="flex items-center gap-1.5 text-brand-300">
            <Sparkles className="h-4 w-4" />
            <span className="text-xs font-semibold">{d.cardInsight}</span>
          </div>
          <p className="text-xs leading-relaxed text-brand-100/70">{d.insightText}</p>
          <div className="mt-auto flex items-start gap-1.5 rounded-xl bg-gold/8 p-2.5">
            <Lightbulb className="h-3.5 w-3.5 shrink-0 text-gold" />
            <p className="text-[11px] leading-relaxed text-brand-100/70">{d.recommendText}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
