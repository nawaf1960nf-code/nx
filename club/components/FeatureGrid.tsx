"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Activity, BrainCircuit, CalendarRange, Flame } from "lucide-react";
import { useLocale } from "@/lib/locale-context";

export function FeatureGrid() {
  const { t } = useLocale();
  const items = [
    { key: "map", icon: Activity, color: "#34d399", ready: true, href: "/#map" },
    { key: "generator", icon: CalendarRange, color: "#22d3ee", ready: true, href: "/workout" },
    { key: "calories", icon: Flame, color: "#fb923c", ready: true, href: "/calories" },
    { key: "consultant", icon: BrainCircuit, color: "#a3e635", ready: false, href: "" },
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
          const inner = (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className={`card-premium relative h-full p-5 ${
                it.ready ? "transition-colors hover:border-energy-400/30" : ""
              }`}
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
          return it.ready && it.href ? (
            <Link key={it.key} href={it.href} className="block">
              {inner}
            </Link>
          ) : (
            <div key={it.key}>{inner}</div>
          );
        })}
      </div>
    </section>
  );
}
