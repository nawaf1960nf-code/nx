import type { Chapter, TopicId } from "./types";
import type { Subject } from "./subjects";
import type { Locale } from "./i18n";

export interface Flashcard {
  topic: TopicId;
  chapter: Chapter;
  /** Front of the card — the concept name. */
  term: string;
  /** Back of the card — the concise explanation. */
  definition: string;
}

/**
 * Build flashcards for a subject: one card per topic, term = the localized
 * topic label, definition = the knowledge-base note (the same grounded text
 * used everywhere else). Cards with no note are skipped.
 */
export function buildFlashcards(subject: Subject, locale: Locale): Flashcard[] {
  return Object.values(subject.topics)
    .filter((t) => subject.knowledge[t.id])
    .map((t) => ({
      topic: t.id,
      chapter: t.chapter,
      term: t.label[locale] ?? t.label.en,
      definition: subject.knowledge[t.id]!,
    }));
}

export interface ChapterSummary {
  chapter: Chapter;
  title: string;
  points: { term: string; definition: string }[];
}

/** Group a subject's topics by chapter into readable summary sections. */
export function buildChapterSummaries(subject: Subject, locale: Locale): ChapterSummary[] {
  return subject.chapters.map((chapter) => {
    const points = Object.values(subject.topics)
      .filter((t) => t.chapter === chapter && subject.knowledge[t.id])
      .map((t) => ({
        term: t.label[locale] ?? t.label.en,
        definition: subject.knowledge[t.id]!,
      }));
    return {
      chapter,
      title: subject.chapterTitles[chapter]?.[locale] ?? String(chapter),
      points,
    };
  });
}
