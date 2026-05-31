import { shuffle, sample } from "./utils";
import type { Difficulty, PreparedQuestion, Question, TopicId } from "./types";

export const EXAM_LENGTH = 30;

export interface BuildExamOptions {
  /** The full question pool for the active subject. */
  pool: Question[];
  difficulty: Difficulty;
  /** Topics the learner has historically struggled with (adaptive learning). */
  weakTopics?: TopicId[];
  /** Topics the learner has mastered — sampled less often. */
  strongTopics?: TopicId[];
  /** Question ids served very recently — avoided to reduce repetition. */
  recentIds?: string[];
  /** Extra AI-generated questions to fold into the pool. */
  extra?: Question[];
  /** How many questions to include (defaults to 30). */
  length?: number;
}

/**
 * Shuffle a single question's options while keeping the correct answer tracked.
 * True/False keep True-then-False order for readability; everything else gets a
 * randomised answer position so the correct choice isn't always in slot A.
 */
export function shuffleOptions(q: Question): PreparedQuestion {
  if (q.type === "true-false") return { ...q };
  const indices = shuffle(q.options.map((_, i) => i));
  const options = indices.map((i) => q.options[i]);
  const correctIndex = indices.indexOf(q.correctIndex);
  return { ...q, options, correctIndex };
}

/**
 * Build a fresh exam: 30 questions for the chosen difficulty, randomised on
 * every attempt. Adaptive weighting over-samples weak topics and avoids
 * recently-served questions for a no-repetition feel.
 */
export function buildExam(opts: BuildExamOptions): PreparedQuestion[] {
  const {
    pool: fullPool,
    difficulty,
    weakTopics = [],
    strongTopics = [],
    recentIds = [],
    extra = [],
    length = EXAM_LENGTH,
  } = opts;

  const weak = new Set(weakTopics);
  const strong = new Set(strongTopics);
  const recent = new Set(recentIds);

  const pool = [...fullPool, ...extra].filter((q) => q.difficulty === difficulty);

  // Prefer questions not seen recently; fall back to the full pool if needed.
  const fresh = pool.filter((q) => !recent.has(q.id));
  const working = fresh.length >= length ? fresh : pool;

  // Adaptive weighting: weak topics counted multiple times, strong ones less.
  const weighted: Question[] = [];
  for (const q of working) {
    let weight = 1;
    if (weak.has(q.topic)) weight = 3;
    else if (strong.has(q.topic)) weight = 0.5;
    const copies = weight >= 1 ? Math.round(weight) : Math.random() < weight ? 1 : 0;
    for (let i = 0; i < copies; i++) weighted.push(q);
  }

  // De-duplicate while drawing, so weighting affects ordering, not repeats.
  const picked: Question[] = [];
  const seen = new Set<string>();
  for (const q of shuffle(weighted)) {
    if (seen.has(q.id)) continue;
    seen.add(q.id);
    picked.push(q);
    if (picked.length >= length) break;
  }

  // Top up from the remaining pool if weighting under-filled the exam.
  if (picked.length < length) {
    const remaining = working.filter((q) => !seen.has(q.id));
    for (const q of sample(remaining, length - picked.length)) {
      seen.add(q.id);
      picked.push(q);
    }
  }

  return shuffle(picked).slice(0, length).map(shuffleOptions);
}

/** Count of available questions per difficulty in a pool (for the UI). */
export function poolSize(pool: Question[], difficulty: Difficulty): number {
  return pool.filter((q) => q.difficulty === difficulty).length;
}
