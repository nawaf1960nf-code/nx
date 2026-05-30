"use client";

import { LevelCard } from "@/components/LevelCard";
import { LEVELS } from "@/lib/levels";
import { useLocale } from "@/lib/locale-context";
import { Reveal } from "@/components/ui/Reveal";

export function LevelsSection() {
  const { t } = useLocale();
  return (
    <section id="levels" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-12">
      <Reveal className="mb-10 text-center">
        <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
          {t.levelsSection.heading}
        </h2>
        <p className="mt-3 text-brand-100/60">{t.levelsSection.subtitle}</p>
      </Reveal>
      <div className="grid gap-6 md:grid-cols-3">
        {LEVELS.map((level, i) => (
          <LevelCard key={level.id} level={level} index={i} />
        ))}
      </div>
    </section>
  );
}
