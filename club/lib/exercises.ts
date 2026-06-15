import type { Bilingual } from "./i18n";
import type { MuscleId } from "./muscles";
import { EXERCISES } from "./exercises-data";

export type Level = "beginner" | "intermediate" | "advanced";

/**
 * A single exercise. Names and instructions come from the open free-exercise-db
 * dataset (English); muscle and equipment labels are localized in the UI.
 * `images` holds demonstration frames (start → end of the movement) served
 * from a CDN; the UI animates between them.
 */
export interface Exercise {
  id: string;
  name: Bilingual;
  /** Primary muscle the exercise targets. */
  primary: MuscleId;
  /** Secondary muscles worked. */
  secondary: MuscleId[];
  equipment: Bilingual;
  level: Level;
  /** Demonstration image URLs (usually 2: start and end position). */
  images?: string[];
  /** Step-by-step form cues. */
  steps: { en: string[]; ar: string[] };
}

export { EXERCISES };

/** All exercises that train the given muscle (as primary or secondary). */
export function exercisesForMuscle(muscle: MuscleId): Exercise[] {
  const primary = EXERCISES.filter((e) => e.primary === muscle);
  const secondary = EXERCISES.filter((e) => e.primary !== muscle && e.secondary.includes(muscle));
  return [...primary, ...secondary];
}
