"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, BookOpen } from "lucide-react";
import { AIBadge } from "./AIBadge";

export function Hero() {
  return (
    <section className="relative mx-auto max-w-5xl px-4 pt-20 pb-10 text-center sm:pt-28">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center"
      >
        <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-400/30 bg-brand-500/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-brand-200">
          <Sparkles className="h-3.5 w-3.5" />
          AI-Powered Learning · Chapters 4 · 7 · 8 · 10 · 11
        </span>

        <h1 className="font-display text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-6xl">
          Master{" "}
          <span className="text-gradient">Services Marketing</span>
          <br className="hidden sm:block" /> with intelligent exams
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-relaxed text-brand-100/70 sm:text-lg">
          An interactive, AI-driven platform that generates fresh exams every
          attempt, explains every answer, and adapts to exactly where you need to
          improve — from the Flower of Service to the Cycle of Success.
        </p>

        <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
          <Link
            href="#levels"
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-brand-500 to-accent-500 px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-brand-600/40 transition-all duration-300 hover:brightness-110 active:scale-[0.97]"
          >
            Choose your level
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/study"
            className="inline-flex items-center gap-2 rounded-2xl border border-white/15 px-8 py-4 text-sm font-semibold text-white transition-all duration-300 hover:bg-white/10 active:scale-[0.97]"
          >
            <BookOpen className="h-4 w-4" />
            Try Study Mode
          </Link>
        </div>

        <div className="mt-8">
          <AIBadge />
        </div>
      </motion.div>
    </section>
  );
}
