"use client";

import type {
  AnswerRecord,
  Difficulty,
  ExamResult,
  PreparedQuestion,
  TopicId,
} from "./types";

const KEY = "smep:v1";
const PROGRESS_KEY = "smep:in-progress:v1";

interface StoreShape {
  results: ExamResult[];
  /** Recently served question ids, newest last (capped). */
  recentIds: string[];
  studentName?: string;
}

const EMPTY: StoreShape = { results: [], recentIds: [] };

function read(): StoreShape {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as StoreShape;
    return { ...EMPTY, ...parsed };
  } catch {
    return EMPTY;
  }
}

function write(data: StoreShape) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    /* storage full or unavailable — fail silently */
  }
}

export function getStudentName(): string {
  return read().studentName ?? "";
}

export function setStudentName(name: string) {
  const data = read();
  data.studentName = name.trim();
  write(data);
}

export function getResults(): ExamResult[] {
  return read().results.sort((a, b) => b.date - a.date);
}

export function getRecentIds(): string[] {
  return read().recentIds;
}

export function saveResult(result: ExamResult, servedIds: string[]) {
  const data = read();
  data.results = [result, ...data.results].slice(0, 100);
  // Track recent ids to reduce repetition next attempt (cap at 60).
  data.recentIds = [...servedIds, ...data.recentIds].slice(0, 60);
  write(data);
}

export interface BestScore {
  percentage: number;
  grade: ExamResult["grade"];
  date: number;
}

export function getBestScore(difficulty?: Difficulty): BestScore | null {
  const results = read().results.filter(
    (r) => !difficulty || r.difficulty === difficulty,
  );
  if (results.length === 0) return null;
  const best = results.reduce((a, b) => (b.percentage > a.percentage ? b : a));
  return { percentage: best.percentage, grade: best.grade, date: best.date };
}

export function getAttemptCount(difficulty?: Difficulty): number {
  return read().results.filter(
    (r) => !difficulty || r.difficulty === difficulty,
  ).length;
}

export function getAverageScore(): number {
  const results = read().results;
  if (results.length === 0) return 0;
  return Math.round(
    results.reduce((sum, r) => sum + r.percentage, 0) / results.length,
  );
}

/** Aggregate per-topic mastery across all attempts for adaptive learning. */
export function getTopicMastery(): Record<string, { correct: number; total: number }> {
  const agg: Record<string, { correct: number; total: number }> = {};
  for (const r of read().results) {
    for (const a of r.answers) {
      const e = (agg[a.topic] ??= { correct: 0, total: 0 });
      e.total += 1;
      if (a.isCorrect) e.correct += 1;
    }
  }
  return agg;
}

export function getWeakTopics(threshold = 0.6, minSeen = 2): TopicId[] {
  const m = getTopicMastery();
  return Object.entries(m)
    .filter(([, v]) => v.total >= minSeen && v.correct / v.total < threshold)
    .sort((a, b) => a[1].correct / a[1].total - b[1].correct / b[1].total)
    .map(([t]) => t as TopicId);
}

export function getStrongTopics(threshold = 0.85, minSeen = 2): TopicId[] {
  const m = getTopicMastery();
  return Object.entries(m)
    .filter(([, v]) => v.total >= minSeen && v.correct / v.total >= threshold)
    .map(([t]) => t as TopicId);
}

/** Improvement = latest percentage minus first percentage recorded. */
export function getImprovement(): number | null {
  const results = read().results.slice().sort((a, b) => a.date - b.date);
  if (results.length < 2) return null;
  return results[results.length - 1].percentage - results[0].percentage;
}

export function buildResult(
  difficulty: Difficulty,
  answers: AnswerRecord[],
  score: number,
  percentage: number,
  grade: ExamResult["grade"],
): ExamResult {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    difficulty,
    date: Date.now(),
    score,
    total: answers.length,
    percentage,
    grade,
    answers,
  };
}

export function clearAll() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
  window.localStorage.removeItem(PROGRESS_KEY);
}

// ───────────────────── In-progress exam (resume support) ─────────────────────

/**
 * A snapshot of an exam that is currently being taken. Persisted on every
 * answer so that a refresh, accidental tab close, or browser crash never makes
 * the student start over — they resume from exactly where they left off.
 */
export interface InProgressExam {
  difficulty: Difficulty;
  studentName: string;
  /** The exact questions (with shuffled options) being served this attempt. */
  questions: PreparedQuestion[];
  /** One entry per question; null = not yet answered. */
  selections: (number | null)[];
  /** Index of the question currently shown. */
  index: number;
  /** When the attempt started (ms). */
  startedAt: number;
}

export function saveInProgress(exam: InProgressExam) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(exam));
  } catch {
    /* storage full or unavailable — fail silently */
  }
}

export function getInProgress(): InProgressExam | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(PROGRESS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as InProgressExam;
    // Basic integrity check.
    if (
      !parsed ||
      !Array.isArray(parsed.questions) ||
      parsed.questions.length === 0 ||
      !Array.isArray(parsed.selections)
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function clearInProgress() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(PROGRESS_KEY);
}
