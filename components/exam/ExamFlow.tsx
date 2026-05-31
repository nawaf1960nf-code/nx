"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, X } from "lucide-react";

import { buildExam } from "@/lib/exam-engine";
import { gradeAttempt, analyze, type Analysis, type LabelResolver } from "@/lib/grading";
import { levelConfig } from "@/lib/levels";
import { getSubject, topicLabel, topicChapter } from "@/lib/subjects";
import type { Difficulty, PreparedQuestion, TopicId } from "@/lib/types";
import {
  buildResult,
  clearInProgress,
  getInProgress,
  getRecentIds,
  getStrongTopics,
  getStudentName,
  getWeakTopics,
  saveInProgress,
  saveResult,
  setStudentName,
} from "@/lib/storage";
import { aiGenerateQuestions } from "@/lib/ai-client";
import { useLocale } from "@/lib/locale-context";

import { Welcome } from "./Welcome";
import { QuestionView } from "./QuestionView";
import { ResultsView } from "./ResultsView";
import { ReviewView } from "./ReviewView";

type Phase = "welcome" | "loading" | "exam" | "results" | "review";

function parseLevel(value: string | null): Difficulty {
  return value === "easy" || value === "hard" ? value : "medium";
}

export function ExamFlow() {
  const params = useSearchParams();
  const { t, locale } = useLocale();
  const difficulty = parseLevel(params.get("level"));
  const subject = getSubject(params.get("subject"));
  const level = levelConfig(difficulty);

  // Localized topic-label resolver, used for analysis text and per-topic labels.
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
  const advancing = useRef(false);

  // Restore a saved name and resume an in-progress exam for THIS subject+level.
  useEffect(() => {
    setName(getStudentName());
    const saved = getInProgress();
    if (saved && saved.subjectId === subject.id && saved.difficulty === difficulty) {
      setQuestions(saved.questions);
      setSelections(saved.selections);
      setIndex(saved.index);
      setName(saved.studentName || getStudentName());
      advancing.current = false;
      setPhase("exam");
    }
  }, [difficulty, subject.id]);

  const start = useCallback(
    async (name: string) => {
      setName(name);
      setStudentName(name);
      setPhase("loading");

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
        if (ai.source === "ai") {
          extra = ai.questions.map((q) => ({ ...q, aiGenerated: true }));
        }
      }

      const exam = buildExam({
        pool: subject.questions,
        difficulty,
        weakTopics,
        strongTopics,
        recentIds,
        extra,
      });
      const freshSelections = Array(exam.length).fill(null) as (number | null)[];
      setQuestions(exam);
      setSelections(freshSelections);
      setIndex(0);
      advancing.current = false;
      saveInProgress({
        subjectId: subject.id,
        difficulty,
        studentName: name,
        questions: exam,
        selections: freshSelections,
        index: 0,
        startedAt: Date.now(),
      });
      setPhase("exam");
    },
    [difficulty, subject],
  );

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

  const handleSelect = useCallback(
    (choice: number) => {
      if (advancing.current) return;
      advancing.current = true;
      const next = [...selections];
      next[index] = choice;
      setSelections(next);

      const isLast = index + 1 >= questions.length;
      if (!isLast) {
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
    [selections, index, questions, finish, difficulty, studentName, subject.id],
  );

  const retake = useCallback(() => {
    setAnalysis(null);
    start(studentName);
  }, [start, studentName]);

  function renderContent() {
    switch (phase) {
      case "welcome":
        return <Welcome level={level} defaultName={studentName} onStart={start} />;
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
            onBack={() => setPhase("results")}
          />
        );
    }
  }

  return (
    <main className="min-h-screen px-4 py-8">
      <div className="mx-auto mb-6 flex max-w-3xl items-center justify-between">
        <Link
          href={`/course/${subject.id}`}
          className="flex items-center gap-2 text-sm text-brand-100/60 transition-colors hover:text-white"
        >
          <X className="h-4 w-4" /> {t.exam.exit}
        </Link>
        {phase === "exam" && (
          <span className="text-sm font-medium text-brand-100/70">
            {t.exam.levelSuffix(t.difficulty[difficulty])}
          </span>
        )}
      </div>

      <motion.div className="flex items-center justify-center pt-4">{renderContent()}</motion.div>
    </main>
  );
}
