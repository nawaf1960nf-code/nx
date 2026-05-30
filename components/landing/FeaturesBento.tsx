"use client";

import { Brain, RefreshCw, Target, BarChart3, GraduationCap, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { useLocale } from "@/lib/locale-context";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

const ICONS = [Brain, Target, RefreshCw, BarChart3, GraduationCap, ShieldCheck];

// Bento spans — first and fourth items are wider for visual rhythm.
const SPANS = [
  "sm:col-span-2",
  "",
  "",
  "",
  "sm:col-span-2",
  "",
];

export function FeaturesBento() {
  const { t } = useLocale();

  return (
    <section className="mx-auto max-w-6xl px-4 py-24">
      <Reveal className="mb-12 text-center">
        <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
          {t.features.heading}
        </h2>
        <p className="mt-3 text-brand-100/60">{t.features.subtitle}</p>
      </Reveal>

      <div className="grid auto-rows-fr gap-4 sm:grid-cols-3">
        {t.features.items.map((item, i) => {
          const Icon = ICONS[i] ?? Brain;
          return (
            <Reveal key={item.title} delay={i * 0.06} className={cn(SPANS[i])}>
              <motion.div
                whileHover={{ y: -4 }}
                className="card-premium group relative h-full overflow-hidden p-6"
              >
                <div
                  className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-brand-500/15 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
                  aria-hidden
                />
                <span className="mb-4 grid h-11 w-11 place-items-center rounded-2xl bg-brand-500/15 text-brand-300 transition-transform duration-300 group-hover:scale-110">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="font-display text-lg font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-brand-100/65">{item.desc}</p>
              </motion.div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
