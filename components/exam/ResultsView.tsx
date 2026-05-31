"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Lightbulb,
  RotateCcw,
  ListChecks,
  Home,
} from "lucide-react";
import Link from "next/link";
import type { Analysis } from "@/lib/grading";
import { GRADE_COLORS, CERTIFICATE_THRESHOLD, PASS_THRESHOLD } from "@/lib/grading";
import type { Difficulty } from "@/lib/types";
import { ScoreRing } from "./ScoreRing";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Confetti } from "@/components/Confetti";
import { Certificate } from "@/components/Certificate";
import { aiAnalyze } from "@/lib/ai-client";
import { useLocale } from "@/lib/locale-context";

export function ResultsView({
  analysis,
  difficulty,
  studentName,
  date,
  onReview,
  onRetake,
}: {
  analysis: Analysis;
  difficulty: Difficulty;
  studentName: string;
  date: number;
  onReview: () => void;
  onRetake: () => void;
}) {
  const { t: tr } = useLocale();
  const { score, total, percentage, grade } = analysis;
  const passed = percentage >= PASS_THRESHOLD;
  const earnedCert = percentage >= CERTIFICATE_THRESHOLD;
  const color = GRADE_COLORS[grade];

  const [ai, setAi] = useState<{
    summary: string;
    strongAreas: string[];
    weakAreas: string[];
    recommendations: string[];
  } | null>(null);
  const [aiLoading, setAiLoading] = useState(true);

  useEffect(() => {
    let active = true;
    aiAnalyze({
      percentage,
      grade,
      difficulty,
      topics: analysis.byTopic.map((t) => ({
        label: t.label,
        topicId: t.topic,
        correct: t.correct,
        total: t.total,
      })),
    })
      .then((res) => {
        if (active && res && res.source === "ai") setAi(res);
      })
      .finally(() => active && setAiLoading(false));
    return () => {
      active = false;
    };
  }, [percentage, grade, difficulty, analysis]);

  const summary = ai?.summary || analysis.summary;
  const recommendations =
    ai?.recommendations?.length ? ai.recommendations : analysis.recommendations;

  return (
    <div className="mx-auto w-full max-w-3xl pb-16">
      {passed && <Confetti />}

      {/* Hero score */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">
          {percentage >= 90
            ? tr.results.exceptional
            : passed
              ? tr.results.wellDone
              : tr.results.keepGoing}
        </h1>
        <p className="mt-2 text-brand-100/60">
          {tr.results.complete(tr.difficulty[difficulty])}
        </p>
      </motion.div>

      <div className="mt-8 flex flex-col items-center gap-6">
        <ScoreRing percentage={percentage} color={color} label={grade} />
        <div className="flex items-center gap-4">
          <Stat icon={CheckCircle2} value={score} label={tr.results.correct} color="#34d399" />
          <Stat icon={XCircle} value={total - score} label={tr.results.wrong} color="#f43f5e" />
          <Stat
            value={`${score}/${total}`}
            label={tr.results.finalScore}
            color="#818cf8"
          />
        </div>
      </div>

      {/* Performance analysis */}
      <GlassCard className="mt-10 p-6 sm:p-8">
        <div className="mb-3 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-brand-300" />
          <h2 className="font-display text-lg font-semibold text-white">
            {tr.results.analysis}
          </h2>
          {aiLoading && !ai && (
            <span className="text-[11px] text-brand-100/40">{tr.results.analyzing}</span>
          )}
        </div>
        <p className="text-sm leading-relaxed text-brand-100/80">{summary}</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <AreaList
            title={tr.results.strongAreas}
            icon={TrendingUp}
            color="#34d399"
            items={
              ai?.strongAreas?.length
                ? ai.strongAreas
                : analysis.strongTopics.map((t) => `${labelFor(t.topic)} (${t.correct}/${t.total})`)
            }
            empty={tr.results.strongEmpty}
          />
          <AreaList
            title={tr.results.weakAreas}
            icon={TrendingDown}
            color="#fb7185"
            items={
              ai?.weakAreas?.length
                ? ai.weakAreas
                : analysis.weakTopics.map((t) => `${labelFor(t.topic)} (${t.correct}/${t.total})`)
            }
            empty={tr.results.weakEmpty}
          />
        </div>

        <div className="mt-6">
          <div className="mb-2 flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-gold" />
            <h3 className="text-sm font-semibold text-white">{tr.results.recommendations}</h3>
          </div>
          <ul className="space-y-2">
            {recommendations.map((r, i) => (
              <li
                key={i}
                className="flex gap-2 text-sm text-brand-100/75"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                {r}
              </li>
            ))}
          </ul>
        </div>
      </GlassCard>

      {/* Topic breakdown bars */}
      <GlassCard className="mt-6 p-6 sm:p-8">
        <h2 className="mb-4 font-display text-lg font-semibold text-white">
          {tr.results.breakdown}
        </h2>
        <div className="space-y-3">
          {analysis.byTopic.map((t) => (
            <div key={t.topic}>
              <div className="mb-1 flex justify-between text-xs">
                <span className="text-brand-100/80">{labelFor(t.topic)}</span>
                <span className="text-brand-100/50">
                  {t.correct}/{t.total}
                </span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/8">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background:
                      t.ratio >= 0.7 ? "#34d399" : t.ratio >= 0.5 ? "#fbbf24" : "#fb7185",
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${t.ratio * 100}%` }}
                  transition={{ duration: 0.8 }}
                />
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Certificate */}
      {earnedCert && (
        <div className="mt-8">
          <Certificate
            name={studentName}
            percentage={percentage}
            grade={grade}
            difficulty={difficulty}
            date={date}
          />
        </div>
      )}

      {/* Actions */}
      <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Button onClick={onReview} variant="subtle" size="lg">
          <ListChecks className="h-4 w-4" /> {tr.results.review}
        </Button>
        <Button onClick={onRetake} size="lg">
          <RotateCcw className="h-4 w-4" /> {tr.results.retake}
        </Button>
        <Link href="/dashboard">
          <Button variant="outline" size="lg">
            <Home className="h-4 w-4" /> {tr.results.dashboard}
          </Button>
        </Link>
      </div>
    </div>
  );
}

function Stat({
  icon: Icon,
  value,
  label,
  color,
}: {
  icon?: React.ComponentType<{ className?: string }>;
  value: React.ReactNode;
  label: string;
  color: string;
}) {
  return (
    <div className="glass flex min-w-[88px] flex-col items-center rounded-2xl px-4 py-3">
      <div className="flex items-center gap-1.5">
        {Icon && (
          <span style={{ color }}>
            <Icon className="h-4 w-4" />
          </span>
        )}
        <span className="font-display text-xl font-bold text-white">{value}</span>
      </div>
      <span className="mt-0.5 text-[11px] uppercase tracking-wider text-brand-100/50">
        {label}
      </span>
    </div>
  );
}

function AreaList({
  title,
  icon: Icon,
  color,
  items,
  empty,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  items: string[];
  empty: string;
}) {
  return (
    <div className="rounded-2xl bg-white/[0.03] p-4">
      <div className="mb-2 flex items-center gap-2" style={{ color }}>
        <Icon className="h-4 w-4" />
        <h3 className="text-sm font-semibold text-white">{title}</h3>
      </div>
      {items.length ? (
        <ul className="space-y-1.5">
          {items.map((it, i) => (
            <li key={i} className="text-sm text-brand-100/75">
              {it}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-brand-100/40">{empty}</p>
      )}
    </div>
  );
}
