"use client";

import {
  Brain,
  RefreshCw,
  Target,
  BarChart3,
  GraduationCap,
  ShieldCheck,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { LevelCard } from "@/components/LevelCard";
import { LEVELS } from "@/lib/levels";
import { CHAPTERS } from "@/lib/topics";
import { useLocale } from "@/lib/locale-context";

const FEATURE_ICONS = [Brain, Target, RefreshCw, BarChart3, GraduationCap, ShieldCheck];

export default function HomePage() {
  const { t } = useLocale();

  return (
    <main className="min-h-screen pb-24">
      <Navbar />
      <Hero />

      {/* Levels */}
      <section id="levels" className="mx-auto mt-10 max-w-6xl px-4 scroll-mt-24">
        <div className="mb-10 text-center">
          <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
            {t.levelsSection.heading}
          </h2>
          <p className="mt-3 text-brand-100/60">{t.levelsSection.subtitle}</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {LEVELS.map((level, i) => (
            <LevelCard key={level.id} level={level} index={i} />
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto mt-24 max-w-6xl px-4">
        <div className="mb-10 text-center">
          <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
            {t.features.heading}
          </h2>
          <p className="mt-3 text-brand-100/60">{t.features.subtitle}</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {t.features.items.map((item, i) => {
            const Icon = FEATURE_ICONS[i] ?? Brain;
            return (
              <div
                key={item.title}
                className="glass group rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.08]"
              >
                <span className="mb-4 grid h-11 w-11 place-items-center rounded-2xl bg-brand-500/15 text-brand-300 transition-transform group-hover:scale-110">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="font-display text-lg font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-brand-100/65">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Coverage */}
      <section className="mx-auto mt-24 max-w-4xl px-4">
        <div className="glass-strong rounded-3xl p-8 sm:p-10">
          <h2 className="font-display text-2xl font-bold text-white">
            {t.coverage.heading}
          </h2>
          <p className="mt-2 text-sm text-brand-100/60">{t.coverage.subtitle}</p>
          <ul className="mt-6 space-y-3">
            {CHAPTERS.map((ch) => (
              <li key={ch} className="flex items-start gap-3">
                <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-brand-500/20 text-xs font-bold text-brand-200">
                  {ch}
                </span>
                <span className="text-sm text-brand-100/80">
                  <span className="font-semibold text-white">
                    {t.coverage.chapterWord} {ch}
                  </span>{" "}
                  · {t.chapterTitles[ch]}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
