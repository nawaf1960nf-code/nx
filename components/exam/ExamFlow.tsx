"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, X } from "lucide-react";

import { buildExam } from "@/lib/exam-engine";
import { gradeAttempt, analyze, type Analysis } from "@/lib/grading";
import { levelConfig } from "@/lib/levels";
import type { Difficulty, PreparedQuestion } from "@/lib/types";
import {
  buildResult,
  getRecentIds,
  getStrongTopics,
  getStudentName,
  getWeakTopics,
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
  return value === "easy" || value === "hard" ? value : value === "medium" ? "medium" : "medium";
}

export function ExamFlow() {
  const params = useSearchParams();
  const { t } = useLocale();
  const difficulty = parseLevel(params.get("level"));
  const level = levelConfig(difficulty);

  const [phase, setPhase] = useState<Phase>("welcome");
  const [questions, setQuestions] = useState<PreparedQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [selections, setSelections] = useState<(number | null)[]>([]);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [resultDate, setResultDate] = useState(Date.now());
  const [studentName, setName] = useState("");
  const advancing = useRef(false);

  useEffect(() => {
    setName(getStudentName());
  }, []);

  const start = useCallback(
    async (name: string) => {
      setName(name);
      setStudentName(name);
      setPhase("loading");

      const weakTopics = getWeakTopics();
      const strongTopics = getStrongTopics();
      const recentIds = getRecentIds();

      // Try to enrich the pool with fresh AI questions targeting weak topics.
      let extra: PreparedQuestion[] = [];
      const focus = weakTopics.length
        ? weakTopics.slice(0, 4)
        : [];
      if (focus.length) {
        const ai = await aiGenerateQuestions({
          difficulty,
          topics: focus,
          count: 6,
        });
        if (ai.source === "ai") {
          extra = ai.questions.map((q) => ({ ...q, aiGenerated: true }));
        }
      }

      const exam = buildExam({
        difficulty,
        weakTopics,
        strongTopics,
        recentIds,
        extra,
      });
      setQuestions(exam);
      setSelections(Array(exam.length).fill(null));
      setIndex(0);
      advancing.current = false;
      setPhase("exam");
    },
    [difficulty],
  );

  const finish = useCallback(
    (finalSelections: (number | null)[]) => {
      const records = gradeAttempt(questions, finalSelections);
      const a = analyze(records);
      const result = buildResult(
        difficulty,
        records,
        a.score,
        a.percentage,
        a.grade,
      );
      saveResult(result, questions.map((q) => q.id));
      setAnalysis(a);
      setResultDate(result.date);
      setPhase("results");
    },
    [questions, difficulty],
  );

  const handleSelect = useCallback(
    (choice: number) => {
      if (advancing.current) return;
      advancing.current = true;
      const next = [...selections];
      next[index] = choice;
      setSelections(next);

      // Auto-advance shortly after answering; block going back.
      window.setTimeout(() => {
        if (index + 1 >= questions.length) {
          finish(next);
        } else {
          setIndex((i) => i + 1);
          advancing.current = false;
        }
      }, 420);
    },
    [selections, index, questions.length, finish],
  );

  const retake = useCallback(() => {
    setAnalysis(null);
    start(studentName);
  }, [start, studentName]);

  function renderContent() {
    switch (phase) {
      case "welcome":
        return (
          <Welcome level={level} defaultName={studentName} onStart={start} />
        );
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
            />
          </AnimatePresence>
        );
      case "results":
        return analysis ? (
          <ResultsView
            analysis={analysis}
            difficulty={difficulty}
            studentName={studentName}
            date={resultDate}
            onReview={() => setPhase("review")}
            onRetake={retake}
          />
        ) : null;
      case "review":
        return (
          <ReviewView
            questions={questions}
            selections={selections}
            onBack={() => setPhase("results")}
          />
        );
    }
  }

  return (
    <main className="min-h-screen px-4 py-8">
      <div className="mx-auto mb-6 flex max-w-3xl items-center justify-between">
        <Link
          href="/"
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
