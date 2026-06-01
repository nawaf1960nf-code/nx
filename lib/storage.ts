"use client";

import type {
  AnswerRecord,
  Difficulty,
  ExamResult,
  PreparedQuestion,
  TopicId,
} from "./types";

const KEY = "smep:v2";
const PROGRESS_KEY = "smep:in-progress:v2";

interface SubjectBucket {
  results: ExamResult[];
  /** Recently served question ids, newest first (capped). */
  recentIds: string[];
}

interface StoreShape {
  studentName?: string;
  /** Per-subject data, keyed by subjectId. */
  subjects: Record<string, SubjectBucket>;
}

const EMPTY: StoreShape = { subjects: {} };

function read(): StoreShape {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as StoreShape;
    return { studentName: parsed.studentName, subjects: parsed.subjects ?? {} };
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

function bucket(data: StoreShape, subjectId: string): SubjectBucket {
  return (data.subjects[subjectId] ??= { results: [], recentIds: [] });
}

export function getStudentName(): string {
  return read().studentName ?? "";
}

export function setStudentName(name: string) {
  const data = read();
  data.studentName = name.trim();
  write(data);
}

export function getResults(subjectId: string): ExamResult[] {
  return [...(read().subjects[subjectId]?.results ?? [])].sort((a, b) => b.date - a.date);
}

export function getRecentIds(subjectId: string): string[] {
  return read().subjects[subjectId]?.recentIds ?? [];
}

export function saveResult(subjectId: string, result: ExamResult, servedIds: string[]) {
  const data = read();
  const b = bucket(data, subjectId);
  b.results = [result, ...b.results].slice(0, 100);
  b.recentIds = [...servedIds, ...b.recentIds].slice(0, 60);
  write(data);
}

export interface BestScore {
  percentage: number;
  grade: ExamResult["grade"];
  date: number;
}

export function getBestScore(subjectId: string, difficulty?: Difficulty): BestScore | null {
  const results = (read().subjects[subjectId]?.results ?? []).filter(
    (r) => !difficulty || r.difficulty === difficulty,
  );
  if (results.length === 0) return null;
  const best = results.reduce((a, b) => (b.percentage > a.percentage ? b : a));
  return { percentage: best.percentage, grade: best.grade, date: best.date };
}

export function getAttemptCount(subjectId: string, difficulty?: Difficulty): number {
  return (read().subjects[subjectId]?.results ?? []).filter(
    (r) => !difficulty || r.difficulty === difficulty,
  ).length;
}

/**
 * Question ids the learner has answered INCORRECTLY at least once and has not
 * since gotten right more recently. Powers the "My Mistakes" focused exam.
 */
export function getWrongQuestionIds(subjectId: string): string[] {
  const results = [...(read().subjects[subjectId]?.results ?? [])].sort(
    (a, b) => a.date - b.date,
  );
  // Track the latest outcome per question id across all attempts.
  const latest = new Map<string, boolean>();
  for (const r of results) {
    for (const a of r.answers) {
      latest.set(a.questionId, a.isCorrect);
    }
  }
  return [...latest.entries()].filter(([, ok]) => !ok).map(([id]) => id);
}


export function getAverageScore(subjectId: string): number {
  const results = read().subjects[subjectId]?.results ?? [];
  if (results.length === 0) return 0;
  return Math.round(results.reduce((sum, r) => sum + r.percentage, 0) / results.length);
}

export function getTopicMastery(subjectId: string): Record<string, { correct: number; total: number }> {
  const agg: Record<string, { correct: number; total: number }> = {};
  for (const r of read().subjects[subjectId]?.results ?? []) {
    for (const a of r.answers) {
      const e = (agg[a.topic] ??= { correct: 0, total: 0 });
      e.total += 1;
      if (a.isCorrect) e.correct += 1;
    }
  }
  return agg;
}

export function getWeakTopics(subjectId: string, threshold = 0.6, minSeen = 2): TopicId[] {
  const m = getTopicMastery(subjectId);
  return Object.entries(m)
    .filter(([, v]) => v.total >= minSeen && v.correct / v.total < threshold)
    .sort((a, b) => a[1].correct / a[1].total - b[1].correct / b[1].total)
    .map(([t]) => t as TopicId);
}

export function getStrongTopics(subjectId: string, threshold = 0.85, minSeen = 2): TopicId[] {
  const m = getTopicMastery(subjectId);
  return Object.entries(m)
    .filter(([, v]) => v.total >= minSeen && v.correct / v.total >= threshold)
    .map(([t]) => t as TopicId);
}

export function getImprovement(subjectId: string): number | null {
  const results = [...(read().subjects[subjectId]?.results ?? [])].sort((a, b) => a.date - b.date);
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

/** Clear all saved progress for one subject (or everything if omitted). */
export function clearAll(subjectId?: string) {
  if (typeof window === "undefined") return;
  if (!subjectId) {
    window.localStorage.removeItem(KEY);
    window.localStorage.removeItem(PROGRESS_KEY);
    return;
  }
  const data = read();
  delete data.subjects[subjectId];
  write(data);
}

// ───────────────────── In-progress exam (resume support) ─────────────────────

export interface InProgressExam {
  subjectId: string;
  difficulty: Difficulty;
  studentName: string;
  questions: PreparedQuestion[];
  selections: (number | null)[];
  index: number;
  startedAt: number;
}

export function saveInProgress(exam: InProgressExam) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(exam));
  } catch {
    /* ignore */
  }
}

export function getInProgress(): InProgressExam | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(PROGRESS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as InProgressExam;
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
