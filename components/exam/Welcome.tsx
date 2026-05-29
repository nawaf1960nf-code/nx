"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Play, Clock, ListChecks, ShieldAlert, Sparkles } from "lucide-react";
import type { LevelConfig } from "@/lib/levels";
import { EXAM_LENGTH } from "@/lib/exam-engine";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";

export function Welcome({
  level,
  defaultName,
  onStart,
}: {
  level: LevelConfig;
  defaultName: string;
  onStart: (name: string) => void;
}) {
  const [name, setName] = useState(defaultName);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mx-auto w-full max-w-lg"
    >
      <GlassCard strong className="p-8 text-center sm:p-10">
        <span
          className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-2xl"
          style={{ background: `${level.accent}22`, color: level.accent }}
        >
          <Sparkles className="h-8 w-8" />
        </span>

        <p
          className="text-xs font-semibold uppercase tracking-[0.25em]"
          style={{ color: level.accent }}
        >
          {level.tagline} · {level.name}
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold text-white">
          Ready to begin?
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-brand-100/70">
          {level.description}
        </p>

        <div className="mt-7 grid grid-cols-3 gap-3 text-left">
          <Info icon={ListChecks} label={`${EXAM_LENGTH} questions`} />
          <Info icon={Clock} label="Self-paced" />
          <Info icon={ShieldAlert} label="No going back" />
        </div>

        <div className="mt-7 text-left">
          <label className="mb-1.5 block text-xs font-medium text-brand-100/60">
            Your name (for your certificate)
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Sara Ahmed"
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-brand-100/30 focus:border-brand-400 focus:outline-none"
          />
        </div>

        <Button
          onClick={() => onStart(name)}
          size="lg"
          className="mt-7 w-full"
        >
          <Play className="h-4 w-4" /> Start Exam
        </Button>

        <p className="mt-4 text-xs text-brand-100/40">
          Questions are randomised and never repeat the same way twice.
        </p>
      </GlassCard>
    </motion.div>
  );
}

function Info({
  icon: Icon,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1.5 rounded-2xl bg-white/[0.04] py-3 text-center">
      <Icon className="h-4 w-4 text-brand-300" />
      <span className="text-[11px] font-medium text-brand-100/70">{label}</span>
    </div>
  );
}
