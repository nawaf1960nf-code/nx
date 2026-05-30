"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Layers, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import type { LevelConfig } from "@/lib/levels";
import { EXAM_LENGTH } from "@/lib/exam-engine";
import { getBestScore, type BestScore } from "@/lib/storage";
import { useLocale } from "@/lib/locale-context";

export function LevelCard({ level, index }: { level: LevelConfig; index: number }) {
  const { t } = useLocale();
  const [best, setBest] = useState<BestScore | null>(null);

  useEffect(() => {
    setBest(getBestScore(level.id));
  }, [level.id]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.12 }}
      whileHover={{ y: -8 }}
      className="group relative"
    >
      <div
        className="absolute -inset-0.5 rounded-3xl opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-70"
        style={{ background: level.glow }}
        aria-hidden
      />
      <div className="glass relative flex h-full flex-col rounded-3xl p-7">
        <div className="mb-5 flex items-center justify-between">
          <span
            className="grid h-12 w-12 place-items-center rounded-2xl"
            style={{ background: `${level.accent}22`, color: level.accent }}
          >
            <Layers className="h-6 w-6" />
          </span>
          <span
            className="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider"
            style={{ background: `${level.accent}1f`, color: level.accent }}
          >
            {t.tagline[level.id]}
          </span>
        </div>

        <h3 className="font-display text-2xl font-bold text-white">
          {t.difficulty[level.id]}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-brand-100/70">
          {t.levelDesc[level.id]}
        </p>

        <div className="mt-6 flex items-center gap-4 text-sm text-brand-100/60">
          <span className="flex items-center gap-1.5">
            <span
              className="inline-block h-1.5 w-1.5 rounded-full"
              style={{ background: level.accent }}
            />
            {t.level.questions(EXAM_LENGTH)}
          </span>
          {best && (
            <span className="flex items-center gap-1.5 text-gold">
              <Trophy className="h-3.5 w-3.5" />
              {t.level.best(best.percentage)}
            </span>
          )}
        </div>

        <Link
          href={`/exam?level=${level.id}`}
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-semibold text-white transition-all duration-300 active:scale-[0.97]"
          style={{
            background: `linear-gradient(110deg, ${level.accent}, #22d3ee)`,
            boxShadow: `0 10px 30px -10px ${level.glow}`,
          }}
        >
          {t.level.start}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
        </Link>
      </div>
    </motion.div>
  );
}
