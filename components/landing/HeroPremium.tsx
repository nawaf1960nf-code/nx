"use client";

import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Sparkles, ArrowRight, BookOpen } from "lucide-react";
import { AIBadge } from "@/components/AIBadge";
import { useLocale } from "@/lib/locale-context";
import { DashboardMockup } from "./DashboardMockup";

export function HeroPremium() {
  const { t } = useLocale();

  // Mouse-driven parallax for the mockup.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), { stiffness: 120, damping: 18 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-10, 10]), { stiffness: 120, damping: 18 });

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  }
  function onLeave() {
    mx.set(0);
    my.set(0);
  }

  return (
    <section className="relative overflow-hidden px-4 pt-16 sm:pt-24">
      {/* Animated grid + glow backdrop */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid mask-fade-b opacity-60 animate-grid-pan" />
        <div className="absolute left-1/2 top-0 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-brand-500/20 blur-[120px]" />
      </div>

      <div className="mx-auto max-w-3xl text-center">
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border border-brand-400/30 bg-brand-500/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-brand-200"
        >
          <Sparkles className="h-3.5 w-3.5" />
          {t.hero.badge}
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="mt-6 font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-6xl"
        >
          {t.hero.titleA} <span className="text-gradient">{t.hero.titleHighlight}</span>
          <br className="hidden sm:block" /> {t.hero.titleB}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.12 }}
          className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-brand-100/70 sm:text-lg"
        >
          {t.hero.subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.18 }}
          className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Link
            href="#catalog"
            className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-brand-500 to-accent-500 px-8 py-4 text-sm font-semibold text-white shadow-[0_20px_60px_-24px_rgba(99,102,241,0.9)] transition-all duration-300 hover:brightness-110 active:scale-[0.97]"
          >
            {t.hero.chooseLevel}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
          </Link>
          <Link
            href="/study"
            className="inline-flex items-center gap-2 rounded-2xl border border-white/15 px-8 py-4 text-sm font-semibold text-white transition-all duration-300 hover:bg-white/10 active:scale-[0.97]"
          >
            <BookOpen className="h-4 w-4" />
            {t.hero.tryStudy}
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.28 }}
          className="mt-8 flex justify-center"
        >
          <AIBadge />
        </motion.div>
      </div>

      {/* Dashboard mockup with parallax tilt */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={{ perspective: 1200 }}
        className="mx-auto mt-16 max-w-5xl"
      >
        <motion.div style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}>
          <DashboardMockup />
        </motion.div>
      </motion.div>
    </section>
  );
}
