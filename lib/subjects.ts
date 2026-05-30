import type { Chapter, TopicId } from "./types";
import { QUESTION_BANK } from "./questions";
import { KNOWLEDGE_BASE } from "./knowledge-base";
import { TOPICS, CHAPTER_TITLES } from "./topics";
import type { Question } from "./types";

/**
 * Subject catalog — the platform supports many courses, not just one.
 *
 * Each subject bundles its own question bank, knowledge base (for the AI),
 * topic taxonomy and chapter titles. Adding a new subject is just adding an
 * entry here (plus its question/knowledge data), and the whole UI — catalog,
 * exams, study mode, dashboard — picks it up automatically.
 */
export interface Subject {
  id: string;
  /** Display name in English and Arabic. */
  name: { en: string; ar: string };
  /** Short tagline shown on the catalog card. */
  tagline: { en: string; ar: string };
  /** Emoji/icon shown on the card. */
  icon: string;
  /** Accent color for the subject. */
  accent: string;
  glow: string;
  /** Chapters covered. */
  chapters: Chapter[];
  chapterTitles: Record<number, string>;
  /** The question bank for this subject. */
  questions: Question[];
  /** Per-topic knowledge notes used to ground the AI. */
  knowledge: Partial<Record<TopicId, string>>;
  /** Topic label + chapter metadata. */
  topics: typeof TOPICS;
  /** Whether the subject is fully available (false = "coming soon" card). */
  available: boolean;
}

export const SUBJECTS: Subject[] = [
  {
    id: "services-marketing",
    name: { en: "Services Marketing", ar: "تسويق الخدمات" },
    tagline: {
      en: "Lovelock & Wirtz · Chapters 4, 7, 8, 10 & 11",
      ar: "لوفلوك وويرتز · الفصول ٤ و٧ و٨ و١٠ و١١",
    },
    icon: "🎯",
    accent: "#818cf8",
    glow: "rgba(99, 102, 241, 0.45)",
    chapters: [4, 7, 8, 10, 11],
    chapterTitles: CHAPTER_TITLES,
    questions: QUESTION_BANK,
    knowledge: KNOWLEDGE_BASE,
    topics: TOPICS,
    available: true,
  },
];

export function getSubject(id: string): Subject | undefined {
  return SUBJECTS.find((s) => s.id === id);
}

export const DEFAULT_SUBJECT_ID = "services-marketing";

/** Total question count for a subject (used in catalog stats). */
export function subjectQuestionCount(s: Subject): number {
  return s.questions.length;
}
