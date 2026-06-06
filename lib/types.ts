/** Core domain types for the multi-course exam platform. */

export type Difficulty = "easy" | "medium" | "hard";

export type QuestionType =
  | "multiple-choice"
  | "true-false"
  | "scenario"
  | "definition"
  | "comparison";

/**
 * An open-ended (essay / short-answer) question — KSU-style. There is no single
 * correct option; the student writes a free response that the AI tutor grades
 * against `modelAnswer` and `keyPoints`.
 */
export interface EssayQuestion {
  id: string;
  difficulty: Difficulty;
  chapter: Chapter;
  topic: TopicId;
  /** "essay" (discuss/explain) or "short" (short note / brief answer). */
  kind: "essay" | "short";
  prompt: string;
  /** A concise model answer used to ground the AI grader. */
  modelAnswer: string;
  /** The key points an ideal answer should cover (drives partial credit). */
  keyPoints: string[];
}

/**
 * Topics and chapters are plain strings/numbers so every subject can define
 * its own taxonomy. Each subject ships its own topic labels and chapter titles
 * (see lib/subjects/*).
 */
export type TopicId = string;
export type Chapter = number;

export interface Question {
  id: string;
  type: QuestionType;
  difficulty: Difficulty;
  chapter: Chapter;
  topic: TopicId;
  /** The question prompt. */
  prompt: string;
  /** Answer options. For true/false this is ["True", "False"]. */
  options: string[];
  /** Index into `options` of the correct answer. */
  correctIndex: number;
  /** Concise explanation shown in review / after answering. */
  explanation: string;
}

/** A question whose options have been shuffled for a specific attempt. */
export interface PreparedQuestion extends Question {
  /** Whether this question was synthesised by the AI generator. */
  aiGenerated?: boolean;
}

export interface AnswerRecord {
  questionId: string;
  topic: TopicId;
  chapter: Chapter;
  difficulty: Difficulty;
  selectedIndex: number | null;
  correctIndex: number;
  isCorrect: boolean;
}

export interface ExamResult {
  id: string;
  difficulty: Difficulty;
  date: number;
  score: number;
  total: number;
  percentage: number;
  grade: Grade;
  answers: AnswerRecord[];
}

export type Grade = "A+" | "A" | "B+" | "B" | "C" | "D" | "F";

/** Bilingual string used throughout subject metadata. */
export interface Bilingual {
  en: string;
  ar: string;
}

export interface TopicMeta {
  id: TopicId;
  label: Bilingual;
  chapter: Chapter;
}
