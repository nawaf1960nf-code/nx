/** Core domain types for the Services Marketing Exam Platform. */

export type Difficulty = "easy" | "medium" | "hard";

export type QuestionType =
  | "multiple-choice"
  | "true-false"
  | "scenario"
  | "definition"
  | "comparison";

export type Chapter = 4 | 7 | 8 | 10 | 11;

/** Canonical topic identifiers — every question is tagged with exactly one. */
export type TopicId =
  | "flower-of-service"
  | "facilitating-services"
  | "enhancing-services"
  | "branding-alternatives"
  | "new-service-development"
  | "marketing-communications"
  | "5ws-model"
  | "word-of-mouth"
  | "corporate-design"
  | "blueprinting"
  | "flowcharting"
  | "service-blueprint"
  | "fail-proofing"
  | "service-standards"
  | "ssts"
  | "servicescape"
  | "ambient-conditions"
  | "pleasure-arousal"
  | "mehrabian-russell"
  | "role-stress"
  | "boundary-spanners"
  | "empowerment"
  | "service-culture"
  | "internal-marketing"
  | "cycle-of-success"
  | "cycle-of-failure"
  | "emotional-labor";

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

export interface TopicMeta {
  id: TopicId;
  label: string;
  chapter: Chapter;
}
