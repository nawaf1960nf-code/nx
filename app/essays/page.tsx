"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  PenLine,
  Sparkles,
  Loader2,
  Check,
  X,
  Eye,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { getSubject, topicLabel } from "@/lib/subjects";
import { gradeEssay, type EssayGrade } from "@/lib/ai-client";
import { shuffle } from "@/lib/utils";
import type { EssayQuestion } from "@/lib/types";
import { useLocale } from "@/lib/locale-context";

function EssayInner() {
  const { t, locale } = useLocale();
  const params = useSearchParams();
  const subject = getSubject(params.get("subject"));

  const deck = useMemo<EssayQuestion[]>(
    () => shuffle(subject.essays ?? []),
    [subject],
  );

  const [pos, setPos] = useState(0);
  const [answer, setAnswer] = useState("");
  const [grading, setGrading] = useState(false);
  const [grade, setGrade] = useState<EssayGrade | null>(null);
  const [showModel, setShowModel] = useState(false);
  const [aiUnavailable, setAiUnavailable] = useState(false);

  const q = deck[pos];

  function reset() {
    setAnswer("");
    setGrade(null);
    setShowModel(false);
    setAiUnavailable(false);
    setGrading(false);
  }

  function next() {
    reset();
    setPos((p) => (p + 1) % Math.max(deck.length, 1));
  }

  async function submit() {
    if (!q || !answer.trim() || grading) return;
    setGrading(true);
    setAiUnavailable(false);
    const result = await gradeEssay({
      subjectId: subject.id,
      topic: q.topic,
      prompt: q.prompt,
      modelAnswer: q.modelAnswer,
      keyPoints: q.keyPoints,
      answer: answer.trim(),
      locale,
    });
    setGrading(false);
    if (result) {
      setGrade(result);
    } else {
      // No API key / failure → fall back to self-assessment against model answer.
      setAiUnavailable(true);
      setShowModel(true);
    }
  }

  const e = t.essays;

  if (!q) {
    return (
      <main className="min-h-screen pb-20">
        <Navbar />
        <div className="mx-auto max-w-2xl px-4 pt-16 text-center">
          <p className="text-brand-100/70">{e.none}</p>
          <Link href={`/course/${subject.id}`} className="mt-6 inline-block">
            <Button>{t.hub.backToCourses}</Button>
          </Link>
        </div>
      </main>
    );
  }

  const scoreColor =
    grade && grade.score >= 75 ? "#34d399" : grade && grade.score >= 50 ? "#fbbf24" : "#fb7185";

  return (
    <main className="min-h-screen pb-20">
      <Navbar />
      <div className="mx-auto max-w-2xl px-4 pt-10">
        <Link
          href={`/course/${subject.id}`}
          className="inline-flex items-center gap-1.5 text-sm text-brand-100/60 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4 rtl:rotate-180" /> {t.hub.backToCourses}
        </Link>

        <div className="mt-6 mb-6 text-center">
          <span className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-gold/15 text-gold">
            <PenLine className="h-7 w-7" />
          </span>
          <h1 className="font-display text-3xl font-bold text-white">{e.title}</h1>
          <p className="mt-2 text-sm text-brand-100/60">{e.subtitle}</p>
          <p className="mt-3 text-xs text-brand-100/60">
            {pos + 1} / {deck.length}
          </p>
        </div>

        <GlassCard strong className="p-6 sm:p-8">
          <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-brand-200/70">
            <span>{topicLabel(subject, q.topic, locale)} · {t.exam.chShort} {q.chapter}</span>
            <span className="rounded-full bg-gold/15 px-2 py-0.5 text-gold">
              {q.kind === "short" ? e.shortNote : e.essay}
            </span>
          </div>
          <h2 className="font-display text-lg font-semibold leading-snug text-white sm:text-xl">
            {q.prompt}
          </h2>

          {/* Answer box */}
          <textarea
            value={answer}
            onChange={(ev) => setAnswer(ev.target.value)}
            disabled={!!grade || grading}
            rows={6}
            placeholder={e.placeholder}
            className="mt-5 w-full resize-y rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-relaxed text-white placeholder:text-brand-100/45 focus:border-brand-400 focus:outline-none disabled:opacity-70"
          />

          {/* Actions */}
          {!grade && !showModel && (
            <div className="mt-4 flex flex-wrap gap-2">
              <Button onClick={submit} size="md" disabled={!answer.trim() || grading}>
                {grading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> {e.grading}
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" /> {e.submit}
                  </>
                )}
              </Button>
              <Button onClick={() => setShowModel(true)} variant="subtle" size="md">
                <Eye className="h-4 w-4" /> {e.showModel}
              </Button>
            </div>
          )}

          {/* AI grade */}
          <AnimatePresence>
            {grade && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-5 rounded-2xl border p-4"
                style={{ borderColor: `${scoreColor}55`, background: `${scoreColor}12` }}
              >
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-300">
                    <Sparkles className="h-3.5 w-3.5" /> {e.aiGrade}
                  </span>
                  <span className="font-display text-2xl font-bold" style={{ color: scoreColor }}>
                    {grade.score}
                    <span className="text-sm text-brand-100/50">/100</span>
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-brand-100/85">{grade.feedback}</p>

                {grade.covered.length > 0 && (
                  <div className="mt-3">
                    <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-success">
                      {e.covered}
                    </p>
                    <ul className="space-y-1">
                      {grade.covered.map((c, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-xs text-brand-100/80">
                          <Check className="mt-0.5 h-3 w-3 shrink-0 text-success" /> {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {grade.missing.length > 0 && (
                  <div className="mt-3">
                    <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-danger">
                      {e.missing}
                    </p>
                    <ul className="space-y-1">
                      {grade.missing.map((c, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-xs text-brand-100/80">
                          <X className="mt-0.5 h-3 w-3 shrink-0 text-danger" /> {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Model answer (self-assess fallback, or revealed) */}
          {showModel && (
            <div className="mt-5 rounded-2xl bg-brand-500/8 p-4">
              {aiUnavailable && (
                <p className="mb-2 text-xs text-brand-100/60">{e.offline}</p>
              )}
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-brand-300">
                {e.modelAnswer}
              </p>
              <p className="text-sm leading-relaxed text-brand-100/85">{q.modelAnswer}</p>
              <p className="mb-1 mt-3 text-[11px] font-semibold uppercase tracking-wide text-brand-300">
                {e.keyPoints}
              </p>
              <ul className="space-y-1">
                {q.keyPoints.map((k, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-xs text-brand-100/80">
                    <Check className="mt-0.5 h-3 w-3 shrink-0 text-brand-300" /> {k}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {(grade || showModel) && (
            <div className="mt-6 text-center">
              <Button onClick={next} size="lg">
                {e.next} <ArrowRight className="h-4 w-4 rtl:rotate-180" />
              </Button>
            </div>
          )}
        </GlassCard>
      </div>
    </main>
  );
}

export default function EssaysPage() {
  return (
    <Suspense
      fallback={
        <div className="grid min-h-screen place-items-center">
          <Loader2 className="h-10 w-10 animate-spin text-brand-300" />
        </div>
      }
    >
      <EssayInner />
    </Suspense>
  );
}
