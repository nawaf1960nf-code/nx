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
  Target,
  BookOpen,
  Clock,
  Zap,
  Hourglass,
} from "lucide-react";
import Link from "next/link";
import type { Analysis } from "@/lib/grading";
import { GRADE_COLORS, CERTIFICATE_THRESHOLD, PASS_THRESHOLD } from "@/lib/grading";
import type { Difficulty, TopicId } from "@/lib/types";
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
  subjectId,
  studentName,
  date,
  labelFor,
  chapterTitle,
  readiness = false,
  times,
  onReview,
  onRetake,
  onRetakeWeak,
}: {
  analysis: Analysis;
  difficulty: Difficulty;
  subjectId: string;
  studentName: string;
  date: number;
  labelFor: (topic: string) => string;
  chapterTitle?: (chapter: number) => string;
  readiness?: boolean;
  /** Seconds spent on each question (index-aligned with the exam). */
  times?: number[];
  onReview: () => void;
  onRetake: () => void;
  onRetakeWeak?: (topics: TopicId[]) => void;
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
      subjectId,
      percentage,
      grade,
      difficulty,
      topics: analysis.byTopic.map((t) => ({
        label: labelFor(t.topic),
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
  }, [percentage, grade, difficulty, analysis, subjectId, labelFor]);

  const summary = ai?.summary || analysis.summary;
  const recommendations =
    ai?.recommendations?.length ? ai.recommendations : analysis.recommendations;

  // Pace analysis: seconds spent per question (only entries actually recorded).
  const timed = (times ?? [])
    .map((seconds, index) => ({ index, seconds }))
    .filter((e) => typeof e.seconds === "number" && e.seconds > 0);
  const totalSeconds = timed.reduce((acc, e) => acc + e.seconds, 0);
  const avgSeconds = timed.length ? Math.round(totalSeconds / timed.length) : 0;
  const fastest = timed.length
    ? timed.reduce((a, b) => (b.seconds < a.seconds ? b : a))
    : null;
  const slowest = timed.length
    ? timed.reduce((a, b) => (b.seconds > a.seconds ? b : a))
    : null;

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

      {/* Exam Readiness banner (timed simulator only) */}
      {readiness && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 rounded-3xl border p-5 text-center"
          style={{ borderColor: `${color}55`, background: `${color}14` }}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color }}>
            {tr.simulator.readiness}
          </p>
          <p className="mt-2 font-display text-4xl font-extrabold text-white">{percentage}%</p>
          <p className="mt-1 text-sm text-brand-100/70">
            {percentage >= 80
              ? tr.simulator.readyHigh
              : percentage >= 60
                ? tr.simulator.readyMid
                : tr.simulator.readyLow}
          </p>
        </motion.div>
      )}

      <GlassCard className="mt-10 p-6 sm:p-8">
        <div className="mb-3 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-brand-300" />
          <h2 className="font-display text-lg font-semibold text-white">
            {tr.results.analysis}
          </h2>
          {aiLoading && !ai && (
            <span className="text-[11px] text-brand-100/60">{tr.results.analyzing}</span>
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
                <span className="text-brand-100/60">
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

      {/* Per-chapter breakdown — pinpoints which chapter is weak */}
      <GlassCard className="mt-6 p-6 sm:p-8">
        <div className="mb-4 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-brand-300" />
          <h2 className="font-display text-lg font-semibold text-white">
            {tr.results.chapterBreakdown}
          </h2>
        </div>
        <div className="space-y-3">
          {analysis.byChapter.map((c) => (
            <div key={c.chapter}>
              <div className="mb-1 flex justify-between text-xs">
                <span className="text-brand-100/80">
                  {tr.coverage.chapterWord} {c.chapter}
                  {chapterTitle ? ` · ${chapterTitle(c.chapter)}` : ""}
                </span>
                <span className="text-brand-100/60">
                  {c.correct}/{c.total} ({Math.round(c.ratio * 100)}%)
                </span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/8">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: c.ratio >= 0.7 ? "#34d399" : c.ratio >= 0.5 ? "#fbbf24" : "#fb7185",
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${c.ratio * 100}%` }}
                  transition={{ duration: 0.8 }}
                />
              </div>
            </div>
          ))}
        </div>

        {analysis.weakChapters.length > 0 && (
          <div className="mt-5 rounded-2xl bg-danger/10 p-4">
            <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-danger">
              <Target className="h-3.5 w-3.5" /> {tr.results.weakChapters}
            </p>
            <p className="text-sm text-brand-100/80">
              {analysis.weakChapters
                .map((c) =>
                  chapterTitle
                    ? `${tr.coverage.chapterWord} ${c.chapter} — ${chapterTitle(c.chapter)}`
                    : `${tr.coverage.chapterWord} ${c.chapter}`,
                )
                .join(" · ")}
            </p>
          </div>
        )}
      </GlassCard>

      {/* Pace analysis — how the student spent their time */}
      {timed.length > 0 && fastest && slowest && (
        <GlassCard className="mt-6 p-6 sm:p-8">
          <div className="mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-brand-300" />
            <h2 className="font-display text-lg font-semibold text-white">
              {tr.results.timing}
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <TimeStat
              icon={Clock}
              color="#818cf8"
              value={fmtClock(totalSeconds)}
              label={tr.results.totalTime}
            />
            <TimeStat
              icon={Hourglass}
              color="#fbbf24"
              value={tr.results.secondsShort(avgSeconds)}
              label={tr.results.avgPerQuestion}
            />
            <TimeStat
              icon={Zap}
              color="#34d399"
              value={tr.results.secondsShort(fastest.seconds)}
              label={`${tr.results.fastestAnswer} · ${tr.results.questionN(fastest.index + 1)}`}
            />
            <TimeStat
              icon={Hourglass}
              color="#fb7185"
              value={tr.results.secondsShort(slowest.seconds)}
              label={`${tr.results.slowestAnswer} · ${tr.results.questionN(slowest.index + 1)}`}
            />
          </div>
        </GlassCard>
      )}

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

      {/* Primary CTA: retake focused on the weak points from THIS attempt */}
      {onRetakeWeak && analysis.retakeTopics.length > 0 && (
        <div className="mt-8">
          <Button
            onClick={() => onRetakeWeak(analysis.retakeTopics)}
            size="lg"
            className="w-full"
          >
            <Target className="h-4 w-4" /> {tr.results.retakeWeak}
          </Button>
        </div>
      )}

      {/* Actions */}
      <div className="mt-4 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Button onClick={onReview} variant="subtle" size="lg">
          <ListChecks className="h-4 w-4" /> {tr.results.review}
        </Button>
        <Button onClick={onRetake} variant="subtle" size="lg">
          <RotateCcw className="h-4 w-4" /> {tr.results.retake}
        </Button>
        <Link href={`/dashboard?subject=${subjectId}`}>
          <Button variant="outline" size="lg">
            <Home className="h-4 w-4" /> {tr.results.dashboard}
          </Button>
        </Link>
      </div>
    </div>
  );
}

function fmtClock(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function TimeStat({
  icon: Icon,
  color,
  value,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  value: string;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-2xl bg-white/[0.04] px-3 py-4 text-center">
      <span style={{ color }}>
        <Icon className="h-4 w-4" />
      </span>
      <span className="font-display text-lg font-bold tabular-nums text-white">{value}</span>
      <span className="text-[11px] leading-tight text-brand-100/60">{label}</span>
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
      <span className="mt-0.5 text-[11px] uppercase tracking-wider text-brand-100/60">
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
        <p className="text-sm text-brand-100/60">{empty}</p>
      )}
    </div>
  );
}
