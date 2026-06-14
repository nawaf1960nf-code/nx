"use client";

import { motion } from "framer-motion";
import { Activity, BrainCircuit, CalendarRange, Flame } from "lucide-react";
import { useLocale } from "@/lib/locale-context";

export function FeatureGrid() {
  const { t } = useLocale();
  const items = [
    { key: "map", icon: Activity, color: "#34d399", ready: true },
    { key: "generator", icon: CalendarRange, color: "#22d3ee", ready: false },
    { key: "consultant", icon: BrainCircuit, color: "#a3e635", ready: false },
    { key: "calories", icon: Flame, color: "#fb923c", ready: false },
  ] as const;

  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <div className="mb-10 text-center">
        <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">{t.features.title}</h2>
        <p className="mt-2 text-energy-100/60">{t.features.subtitle}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((it, i) => {
          const f = t.features.items[it.key];
          const Icon = it.icon;
          return (
            <motion.div
              key={it.key}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="card-premium relative p-5"
            >
              {!it.ready && (
                <span className="absolute end-4 top-4 rounded-full bg-white/8 px-2 py-0.5 text-[10px] font-semibold text-energy-100/60">
                  {t.features.soon}
                </span>
              )}
              <span
                className="grid h-11 w-11 place-items-center rounded-2xl"
                style={{ background: `${it.color}22`, color: it.color }}
              >
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold text-white">{f.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-energy-100/65">{f.desc}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
