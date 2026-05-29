"use client";

import { motion } from "framer-motion";
import { Award, BadgeCheck } from "lucide-react";
import type { Grade } from "@/lib/types";

export function Certificate({
  name,
  percentage,
  grade,
  difficulty,
  date,
}: {
  name: string;
  percentage: number;
  grade: Grade;
  difficulty: string;
  date: number;
}) {
  const displayName = name?.trim() || "Star Student";
  const dateStr = new Date(date).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, rotateX: -8 }}
      animate={{ opacity: 1, scale: 1, rotateX: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 16 }}
      className="relative overflow-hidden rounded-3xl border border-gold/30 p-8 text-center"
      style={{
        background:
          "linear-gradient(135deg, rgba(251,191,36,0.12), rgba(99,102,241,0.1) 60%, rgba(6,182,212,0.1))",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(circle at 50% 0%, rgba(251,191,36,0.3), transparent 60%)",
        }}
        aria-hidden
      />
      <div className="relative">
        <span className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-gold/15 text-gold">
          <Award className="h-8 w-8" />
        </span>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold/80">
          Certificate of Achievement
        </p>
        <h3 className="mt-4 font-display text-3xl font-bold text-white">
          {displayName}
        </h3>
        <p className="mx-auto mt-3 max-w-md text-sm text-brand-100/70">
          has successfully completed the{" "}
          <span className="font-semibold capitalize text-white">{difficulty}</span>{" "}
          Services Marketing examination with a score of{" "}
          <span className="font-semibold text-gold">{percentage}%</span>.
        </p>

        <div className="mt-6 flex items-center justify-center gap-6">
          <div className="text-center">
            <p className="font-display text-2xl font-bold text-white">{grade}</p>
            <p className="text-[11px] uppercase tracking-wider text-brand-100/50">
              Grade
            </p>
          </div>
          <div className="h-10 w-px bg-white/15" />
          <div className="text-center">
            <p className="flex items-center gap-1.5 font-display text-lg font-semibold text-success">
              <BadgeCheck className="h-5 w-5" /> Passed
            </p>
            <p className="text-[11px] uppercase tracking-wider text-brand-100/50">
              {dateStr}
            </p>
          </div>
        </div>

        <p className="mt-6 text-[11px] tracking-wider text-brand-100/40">
          Services Marketing Exam Platform · Chapters 4 · 7 · 8 · 10 · 11
        </p>
      </div>
    </motion.div>
  );
}
