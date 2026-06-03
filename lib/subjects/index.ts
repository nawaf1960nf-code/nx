import type { Chapter, TopicId } from "../types";
import type { Locale } from "../i18n";
import { servicesMarketing } from "./services-marketing";
import type { Subject } from "./services-marketing";
import { internationalBusiness } from "./international-business";
import { humanResourceDevelopment } from "./human-resource-development";

export type { Subject, SubjectTopic } from "./services-marketing";

/** Ordered list of all courses shown in the catalog. */
export const SUBJECTS: Subject[] = [
  servicesMarketing,
  internationalBusiness,
  humanResourceDevelopment,
];

export const DEFAULT_SUBJECT_ID = servicesMarketing.id;

export function getSubject(id: string | null | undefined): Subject {
  return SUBJECTS.find((s) => s.id === id) ?? servicesMarketing;
}

export function subjectQuestionCount(s: Subject): number {
  return s.questions.length;
}

/** Resolve a topic's label for a subject in the active locale (with fallbacks). */
export function topicLabel(s: Subject, topic: TopicId, locale: Locale): string {
  const meta = s.topics[topic];
  if (!meta) return topic;
  return meta.label[locale] ?? meta.label.en;
}

export function topicChapter(s: Subject, topic: TopicId): Chapter {
  return s.topics[topic]?.chapter ?? s.chapters[0] ?? 0;
}

export function chapterTitle(s: Subject, chapter: Chapter, locale: Locale): string {
  const title = s.chapterTitles[chapter];
  return title ? (title[locale] ?? title.en) : String(chapter);
}

/** Build a compact knowledge-base context block for the AI for given topics. */
export function buildContext(s: Subject, topics: TopicId[]): string {
  const seen = new Set<TopicId>();
  const lines: string[] = [];
  for (const t of topics) {
    if (seen.has(t)) continue;
    seen.add(t);
    if (s.knowledge[t]) lines.push(`### ${t}\n${s.knowledge[t]}`);
  }
  return lines.join("\n\n");
}
