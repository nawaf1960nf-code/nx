"use client";

import { motion } from "framer-motion";
import { ArrowDown, Sparkles } from "lucide-react";
import { useLocale } from "@/lib/locale-context";

export function Hero() {
  const { t } = useLocale();
  return (
    <section className="mx-auto max-w-3xl px-4 pb-4 pt-16 text-center sm:pt-24">
      <motion.span
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-flex items-center gap-1.5 rounded-full border border-energy-500/30 bg-energy-500/10 px-3.5 py-1 text-xs font-semibold text-energy-300"
      >
        <Sparkles className="h-3.5 w-3.5" /> {t.hero.eyebrow}
      </motion.span>

      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="mt-5 font-display text-4xl font-extrabold leading-tight text-white sm:text-5xl"
      >
        {t.hero.title}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-energy-100/65"
      >
        {t.hero.subtitle}
      </motion.p>

      <motion.a
        href="#map"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-full bg-energy-500 px-6 font-semibold text-base-950 transition-transform hover:scale-[1.03]"
      >
        {t.hero.cta} <ArrowDown className="h-4 w-4" />
      </motion.a>
    </section>
  );
}
