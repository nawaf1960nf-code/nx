"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, X, Clock, Timer, AlertTriangle } from "lucide-react";

import { buildExam, shuffleOptions, EXAM_LENGTH } from "@/lib/exam-engine";
import { gradeAttempt, analyze, type Analysis, type LabelResolver } from "@/lib/grading";
import { levelConfig } from "@/lib/levels";
import { getSubject, topicLabel, topicChapter } from "@/lib/subjects";
import { shuffle } from "@/lib/utils";
import type { Difficulty, PreparedQuestion, TopicId } from "@/lib/types";
import {
  buildResult,
  clearInProgress,
  getInProgress,
  getRecentIds,
  getStrongTopics,
  getStudentName,
  getWeakTopics,
  getWrongQuestionIds,
  saveInProgress,
  saveResult,
  setStudentName,
} from "@/lib/storage";
import { aiGenerateQuestions } from "@/lib/ai-client";
import { useLocale } from "@/lib/locale-context";
import { Button } from "@/components/ui/Button";

import { Welcome } from "./Welcome";
import { QuestionView } from "./QuestionView";
import { ResultsView } from "./ResultsView";
import { ReviewView } from "./ReviewView";

type Phase = "welcome" | "loading" | "exam" | "results" | "review";
type Mode = "normal" | "timed" | "mistakes";

/** Seconds allotted in the timed simulator (1 minute per question). */
const TIMED_SECONDS = EXAM_LENGTH * 60;

function parseLevel(value: string | null): Difficulty {
  return value === "easy" || value === "hard" ? value : "medium";
}

function parseMode(value: string | null): Mode {
  return value === "timed" || value === "mistakes" ? value : "normal";
}

function fmt(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function ExamFlow() {
  const params = useSearchParams();
  const { t, locale } = useLocale();
  const difficulty = parseLevel(params.get("level"));
  const mode = parseMode(params.get("mode"));
  const subject = getSubject(params.get("subject"));
  const level = levelConfig(difficulty);

  const labelFor = useCallback(
    (topic: TopicId) => topicLabel(subject, topic, locale),
    [subject, locale],
  );

  const resolver = useMemo<LabelResolver>(
    () => ({
      label: labelFor,
      chapter: (topic: TopicId) => topicChapter(subject, topic),
      phrases: t.analysis,
    }),
    [labelFor, subject, t],
  );

  const [phase, setPhase] = useState<Phase>("welcome");
  const [questions, setQuestions] = useState<PreparedQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [selections, setSelections] = useState<(number | null)[]>([]);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [resultDate, setResultDate] = useState(Date.now());
  const [studentName, setName] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(TIMED_SECONDS);
  const advancing = useRef(false);
  const finishRef = useRef<(s: (number | null)[]) => void>(() => {});

  // For mistakes mode: how many wrong questions are available.
  const mistakeCount = useMemo(
    () => (mode === "mistakes" ? getWrongQuestionIds(subject.id).length : 0),
    [mode, subject.id],
  );

  // Resume only applies to a normal exam (timed/mistakes are fresh each time).
  useEffect(() => {
    setName(getStudentName());
    if (mode !== "normal") return;
    const saved = getInProgress();
    if (saved && saved.subjectId === subject.id && saved.difficulty === difficulty) {
      setQuestions(saved.questions);
      setSelections(saved.selections);
      setIndex(saved.index);
      setName(saved.studentName || getStudentName());
      advancing.current = false;
      setPhase("exam");
    }
  }, [difficulty, subject.id, mode]);

  const finish = useCallback(
    (finalSelections: (number | null)[]) => {
      const records = gradeAttempt(questions, finalSelections);
      const a = analyze(records, resolver);
      const result = buildResult(difficulty, records, a.score, a.percentage, a.grade);
      saveResult(subject.id, result, questions.map((q) => q.id));
      clearInProgress();
      setAnalysis(a);
      setResultDate(result.date);
      setPhase("results");
    },
    [questions, difficulty, subject.id, resolver],
  );
  finishRef.current = finish;

  const start = useCallback(
    async (name: string) => {
      setName(name);
      setStudentName(name);
      setPhase("loading");

      let exam: PreparedQuestion[];

      if (mode === "mistakes") {
        // Pool = only questions previously answered wrong.
        const wrong = new Set(getWrongQuestionIds(subject.id));
        const pool = subject.questions.filter((q) => wrong.has(q.id));
        exam = shuffle(pool).slice(0, EXAM_LENGTH).map(shuffleOptions);
      } else {
        const weakTopics = getWeakTopics(subject.id);
        const strongTopics = getStrongTopics(subject.id);
        const recentIds = getRecentIds(subject.id);

        // Optionally enrich the pool with fresh questions targeting weak topics.
        let extra: PreparedQuestion[] = [];
        const focus = weakTopics.length ? weakTopics.slice(0, 4) : [];
        if (focus.length) {
          const ai = await aiGenerateQuestions({
            subjectId: subject.id,
            difficulty,
            topics: focus,
            count: 6,
          });
          if (ai.source === "ai") extra = ai.questions.map((q) => ({ ...q, aiGenerated: true }));
        }

        exam = buildExam({
          pool: subject.questions,
          difficulty,
          weakTopics,
          strongTopics,
          recentIds,
          extra,
        });
      }

      const freshSelections = Array(exam.length).fill(null) as (number | null)[];
      setQuestions(exam);
      setSelections(freshSelections);
      setIndex(0);
      setSecondsLeft(TIMED_SECONDS);
      advancing.current = false;
      if (mode === "normal") {
        saveInProgress({
          subjectId: subject.id,
          difficulty,
          studentName: name,
          questions: exam,
          selections: freshSelections,
          index: 0,
          startedAt: Date.now(),
        });
      }
      setPhase("exam");
    },
    [difficulty, subject, mode],
  );

  // Countdown for the timed simulator — auto-submits at zero.
  useEffect(() => {
    if (mode !== "timed" || phase !== "exam") return;
    if (secondsLeft <= 0) {
      finishRef.current(selections);
      return;
    }
    const id = window.setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => window.clearTimeout(id);
  }, [mode, phase, secondsLeft, selections]);

  const handleSelect = useCallback(
    (choice: number) => {
      if (advancing.current) return;
      advancing.current = true;
      const next = [...selections];
      next[index] = choice;
      setSelections(next);

      const isLast = index + 1 >= questions.length;
      if (!isLast && mode === "normal") {
        saveInProgress({
          subjectId: subject.id,
          difficulty,
          studentName,
          questions,
          selections: next,
          index: index + 1,
          startedAt: Date.now(),
        });
      }

      window.setTimeout(() => {
        if (isLast) {
          finish(next);
        } else {
          setIndex((i) => i + 1);
          advancing.current = false;
        }
      }, 420);
    },
    [selections, index, questions, finish, difficulty, studentName, subject.id, mode],
  );

  const retake = useCallback(() => {
    setAnalysis(null);
    start(studentName);
  }, [start, studentName]);

  function renderWelcome() {
    if (mode === "timed") {
      return (
        <SimIntro
          accent={level.accent}
          onStart={() => start(getStudentName())}
        />
      );
    }
    if (mode === "mistakes") {
      if (mistakeCount === 0) {
        return (
          <div className="card-premium mx-auto max-w-md p-8 text-center">
            <span className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-success/15 text-success">
              <AlertTriangle className="h-7 w-7" />
            </span>
            <h2 className="font-display text-xl font-semibold text-white">{t.mistakes.none}</h2>
            <p className="mt-2 text-sm text-brand-100/60">{t.mistakes.noneDesc}</p>
            <Link href={`/course/${subject.id}`} className="mt-6 inline-block">
              <Button>{t.hub.backToCourses}</Button>
            </Link>
          </div>
        );
      }
      return (
        <div className="card-premium mx-auto max-w-md p-8 text-center">
          <span className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-danger/15 text-danger">
            <Timer className="h-7 w-7" />
          </span>
          <h2 className="font-display text-2xl font-bold text-white">{t.mistakes.title}</h2>
          <p className="mt-2 text-sm text-brand-100/60">{t.mistakes.count(Math.min(mistakeCount, EXAM_LENGTH))}</p>
          <Button onClick={() => start(getStudentName())} size="lg" className="mt-6 w-full">
            {t.mistakes.start}
          </Button>
        </div>
      );
    }
    return <Welcome level={level} defaultName={studentName} onStart={start} />;
  }

  function renderContent() {
    switch (phase) {
      case "welcome":
        return renderWelcome();
      case "loading":
        return (
          <div className="flex flex-col items-center gap-4 text-center">
            <Loader2 className="h-10 w-10 animate-spin text-brand-300" />
            <p className="text-brand-100/70">{t.exam.building}</p>
          </div>
        );
      case "exam":
        return (
          <AnimatePresence mode="wait">
            <QuestionView
              key={questions[index]?.id}
              question={questions[index]}
              index={index}
              total={questions.length}
              selected={selections[index]}
              onSelect={handleSelect}
              labelFor={labelFor}
            />
          </AnimatePresence>
        );
      case "results":
        return analysis ? (
          <ResultsView
            analysis={analysis}
            difficulty={difficulty}
            subjectId={subject.id}
            studentName={studentName}
            date={resultDate}
            labelFor={labelFor}
            readiness={mode === "timed"}
            onReview={() => setPhase("review")}
            onRetake={retake}
          />
        ) : null;
      case "review":
        return (
          <ReviewView
            questions={questions}
            selections={selections}
            labelFor={labelFor}
            subjectId={subject.id}
            onBack={() => setPhase("results")}
          />
        );
    }
  }

  const lowTime = secondsLeft <= 60;

  return (
    <main className="min-h-screen px-4 py-8">
      <div className="mx-auto mb-6 flex max-w-3xl items-center justify-between">
        <Link
          href={`/course/${subject.id}`}
          className="flex items-center gap-2 text-sm text-brand-100/60 transition-colors hover:text-white"
        >
          <X className="h-4 w-4" /> {t.exam.exit}
        </Link>

        {phase === "exam" && mode === "timed" && (
          <span
            className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-bold tabular-nums ${
              lowTime ? "bg-danger/20 text-danger" : "bg-white/8 text-white"
            }`}
          >
            <Clock className="h-4 w-4" /> {fmt(Math.max(0, secondsLeft))}
          </span>
        )}
        {phase === "exam" && mode === "mistakes" && (
          <span className="text-sm font-medium text-danger">{t.mistakes.title}</span>
        )}
        {phase === "exam" && mode === "normal" && (
          <span className="text-sm font-medium text-brand-100/70">
            {t.exam.levelSuffix(t.difficulty[difficulty])}
          </span>
        )}
      </div>

      <motion.div className="flex items-center justify-center pt-4">{renderContent()}</motion.div>
    </main>
  );
}

/** Intro screen for the timed Exam Simulator. */
function SimIntro({ accent, onStart }: { accent: string; onStart: () => void }) {
  const { t } = useLocale();
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-premium mx-auto w-full max-w-lg p-8 text-center sm:p-10"
    >
      <span
        className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-2xl"
        style={{ background: `${accent}22`, color: accent }}
      >
        <Clock className="h-8 w-8" />
      </span>
      <p className="text-xs font-semibold uppercase tracking-[0.25em]" style={{ color: accent }}>
        {t.simulator.intro}
      </p>
      <h1 className="mt-2 font-display text-3xl font-bold text-white">{t.simulator.title}</h1>
      <p className="mt-3 text-sm leading-relaxed text-brand-100/70">{t.simulator.introDesc}</p>

      <div className="mt-7 grid grid-cols-3 gap-3 text-center">
        <Info label={t.simulator.questions} />
        <Info label={t.simulator.minutes(EXAM_LENGTH)} />
        <Info label={t.simulator.timed} />
      </div>

      <Button onClick={onStart} size="lg" className="mt-7 w-full">
        {t.simulator.begin}
      </Button>
    </motion.div>
  );
}

function Info({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5 rounded-2xl bg-white/[0.04] py-3">
      <span className="text-xs font-medium text-brand-100/70">{label}</span>
    </div>
  );
}
