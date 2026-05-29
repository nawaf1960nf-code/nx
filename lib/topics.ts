import type { TopicId, TopicMeta, Chapter } from "./types";

/** Human-readable labels + chapter mapping for every topic in the syllabus. */
export const TOPICS: Record<TopicId, TopicMeta> = {
  "flower-of-service": { id: "flower-of-service", label: "Flower of Service", chapter: 4 },
  "facilitating-services": { id: "facilitating-services", label: "Facilitating Services", chapter: 4 },
  "enhancing-services": { id: "enhancing-services", label: "Enhancing Services", chapter: 4 },
  "branding-alternatives": { id: "branding-alternatives", label: "Branding Alternatives", chapter: 7 },
  "new-service-development": { id: "new-service-development", label: "New Service Development", chapter: 7 },
  "marketing-communications": { id: "marketing-communications", label: "Marketing Communications", chapter: 7 },
  "5ws-model": { id: "5ws-model", label: "5Ws Model", chapter: 7 },
  "word-of-mouth": { id: "word-of-mouth", label: "Word of Mouth", chapter: 7 },
  "corporate-design": { id: "corporate-design", label: "Corporate Design", chapter: 7 },
  blueprinting: { id: "blueprinting", label: "Blueprinting", chapter: 8 },
  flowcharting: { id: "flowcharting", label: "Flowcharting", chapter: 8 },
  "service-blueprint": { id: "service-blueprint", label: "Service Blueprint", chapter: 8 },
  "fail-proofing": { id: "fail-proofing", label: "Fail-Proofing", chapter: 8 },
  "service-standards": { id: "service-standards", label: "Service Standards", chapter: 8 },
  ssts: { id: "ssts", label: "Self-Service Technologies (SSTs)", chapter: 8 },
  servicescape: { id: "servicescape", label: "Servicescape", chapter: 10 },
  "ambient-conditions": { id: "ambient-conditions", label: "Ambient Conditions", chapter: 10 },
  "pleasure-arousal": { id: "pleasure-arousal", label: "Pleasure & Arousal", chapter: 10 },
  "mehrabian-russell": { id: "mehrabian-russell", label: "Mehrabian-Russell Model", chapter: 10 },
  "role-stress": { id: "role-stress", label: "Role Stress", chapter: 11 },
  "boundary-spanners": { id: "boundary-spanners", label: "Boundary Spanners", chapter: 11 },
  empowerment: { id: "empowerment", label: "Empowerment", chapter: 11 },
  "service-culture": { id: "service-culture", label: "Service Culture", chapter: 11 },
  "internal-marketing": { id: "internal-marketing", label: "Internal Marketing", chapter: 11 },
  "cycle-of-success": { id: "cycle-of-success", label: "Cycle of Success", chapter: 11 },
  "cycle-of-failure": { id: "cycle-of-failure", label: "Cycle of Failure", chapter: 11 },
  "emotional-labor": { id: "emotional-labor", label: "Emotional Labor", chapter: 11 },
};

export const CHAPTERS: Chapter[] = [4, 7, 8, 10, 11];

export const CHAPTER_TITLES: Record<Chapter, string> = {
  4: "Developing Service Products & Branding (Flower of Service)",
  7: "Promoting Services & Educating Customers",
  8: "Designing & Managing Service Processes",
  10: "Crafting the Service Environment (Servicescape)",
  11: "Managing People for Service Advantage",
};

export function topicLabel(id: TopicId): string {
  return TOPICS[id]?.label ?? id;
}

export function topicChapter(id: TopicId): Chapter {
  return TOPICS[id]?.chapter ?? 4;
}
