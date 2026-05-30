"use client";

import { useLocale } from "@/lib/locale-context";
import { Reveal } from "@/components/ui/Reveal";

export function StatsSection() {
  const { t } = useLocale();
  return (
    <section className="mx-auto max-w-5xl px-4 py-16">
      <Reveal>
        <div className="card-premium grid grid-cols-2 gap-6 p-8 sm:grid-cols-4 sm:p-10">
          {t.landing.stats.items.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-display text-3xl font-extrabold text-gradient sm:text-4xl">
                {s.value}
              </p>
              <p className="mt-1 text-xs text-brand-100/55 sm:text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
