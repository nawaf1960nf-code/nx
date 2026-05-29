import type {
  AnswerRecord,
  Difficulty,
  Grade,
  PreparedQuestion,
  TopicId,
} from "./types";
import { topicLabel, topicChapter } from "./topics";

export function toGrade(percentage: number): Grade {
  if (percentage >= 95) return "A+";
  if (percentage >= 88) return "A";
  if (percentage >= 80) return "B+";
  if (percentage >= 72) return "B";
  if (percentage >= 60) return "C";
  if (percentage >= 50) return "D";
  return "F";
}

export const GRADE_COLORS: Record<Grade, string> = {
  "A+": "#34d399",
  A: "#4ade80",
  "B+": "#22d3ee",
  B: "#38bdf8",
  C: "#fbbf24",
  D: "#fb923c",
  F: "#f43f5e",
};

export interface TopicScore {
  topic: TopicId;
  label: string;
  correct: number;
  total: number;
  ratio: number;
}

export interface Analysis {
  score: number;
  total: number;
  percentage: number;
  grade: Grade;
  byTopic: TopicScore[];
  strongTopics: TopicScore[];
  weakTopics: TopicScore[];
  recommendations: string[];
  summary: string;
}

/** Build the answer records for an attempt. */
export function gradeAttempt(
  questions: PreparedQuestion[],
  selections: (number | null)[],
): AnswerRecord[] {
  return questions.map((q, i) => {
    const selectedIndex = selections[i] ?? null;
    return {
      questionId: q.id,
      topic: q.topic,
      chapter: q.chapter,
      difficulty: q.difficulty,
      selectedIndex,
      correctIndex: q.correctIndex,
      isCorrect: selectedIndex === q.correctIndex,
    };
  });
}

/** Produce a rich, deterministic performance analysis from answer records. */
export function analyze(answers: AnswerRecord[]): Analysis {
  const total = answers.length;
  const score = answers.filter((a) => a.isCorrect).length;
  const percentage = total === 0 ? 0 : Math.round((score / total) * 100);
  const grade = toGrade(percentage);

  const map = new Map<TopicId, TopicScore>();
  for (const a of answers) {
    const entry =
      map.get(a.topic) ??
      { topic: a.topic, label: topicLabel(a.topic), correct: 0, total: 0, ratio: 0 };
    entry.total += 1;
    if (a.isCorrect) entry.correct += 1;
    map.set(a.topic, entry);
  }

  const byTopic = [...map.values()].map((t) => ({
    ...t,
    ratio: t.total === 0 ? 0 : t.correct / t.total,
  }));

  const sorted = [...byTopic].sort((a, b) => b.ratio - a.ratio);
  const strongTopics = sorted.filter((t) => t.ratio >= 0.7).slice(0, 4);
  const weakTopics = [...byTopic]
    .filter((t) => t.ratio < 0.6)
    .sort((a, b) => a.ratio - b.ratio)
    .slice(0, 4);

  const recommendations: string[] = [];
  for (const t of weakTopics) {
    recommendations.push(
      `Review ${t.label} (Chapter ${topicChapter(t.topic)}) — you scored ${t.correct}/${t.total} here.`,
    );
  }
  if (recommendations.length === 0) {
    recommendations.push(
      "Strong all-round performance — keep reinforcing concepts with Study Mode to stay sharp.",
    );
  }

  const summary = buildSummary(percentage, strongTopics, weakTopics);

  return {
    score,
    total,
    percentage,
    grade,
    byTopic: sorted,
    strongTopics,
    weakTopics,
    recommendations,
    summary,
  };
}

function buildSummary(
  percentage: number,
  strong: TopicScore[],
  weak: TopicScore[],
): string {
  const parts: string[] = [];
  if (percentage >= 90) parts.push("Outstanding mastery of the material.");
  else if (percentage >= 75) parts.push("Solid, confident understanding overall.");
  else if (percentage >= 60) parts.push("A reasonable grasp with clear room to grow.");
  else parts.push("The fundamentals need more review before the exam.");

  if (strong.length) {
    parts.push(
      `Excellent understanding of ${strong.map((t) => t.label).slice(0, 2).join(" and ")}.`,
    );
  }
  if (weak.length) {
    parts.push(
      `Needs improvement in ${weak.map((t) => t.label).slice(0, 2).join(" and ")}.`,
    );
  }
  return parts.join(" ");
}

export const PASS_THRESHOLD = 60;
export const CERTIFICATE_THRESHOLD = 90;
