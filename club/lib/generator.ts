import type { Bilingual } from "./i18n";
import { EXERCISES, type Exercise, type Level } from "./exercises";
import type { MuscleId } from "./muscles";

export type Goal = "muscle" | "fatloss" | "strength" | "general";
export type Env = "gym" | "home";
export type SplitKey = "push" | "pull" | "legs" | "upper" | "lower" | "fullbody";

/** Equipment that needs no gym — used to filter for home training. */
const HOME_OK = new Set(["Bodyweight", "Dumbbells", "Plate", "Pull-up Bar"]);
function isHomeFriendly(e: Exercise): boolean {
  return HOME_OK.has(e.equipment.en);
}

/** Which muscle groups each training day targets, in priority order. */
const DAY_MUSCLES: Record<SplitKey, MuscleId[]> = {
  push: ["chest", "shoulders", "triceps"],
  pull: ["lats", "traps", "biceps", "forearms"],
  legs: ["quads", "hamstrings", "glutes", "calves"],
  upper: ["chest", "lats", "shoulders", "biceps", "triceps"],
  lower: ["quads", "hamstrings", "glutes", "calves"],
  fullbody: ["chest", "lats", "quads", "shoulders", "hamstrings"],
};

/** Weekly splits keyed by training days per week. */
const SPLITS: Record<number, SplitKey[]> = {
  3: ["push", "pull", "legs"],
  4: ["upper", "lower", "upper", "lower"],
  5: ["push", "pull", "legs", "upper", "lower"],
  6: ["push", "pull", "legs", "push", "pull", "legs"],
};

/** Sets/reps prescription per goal. */
const SCHEME: Record<Goal, { sets: number; reps: string }> = {
  strength: { sets: 5, reps: "5" },
  muscle: { sets: 4, reps: "8–12" },
  fatloss: { sets: 3, reps: "12–15" },
  general: { sets: 3, reps: "10–12" },
};

export interface PlanExercise {
  id: string;
  name: Bilingual;
  muscle: MuscleId;
  equipment: Bilingual;
  sets: number;
  reps: string;
  /** Demonstration image URLs, carried so the session player can show them. */
  images?: string[];
}

export interface PlanDay {
  key: SplitKey;
  muscles: MuscleId[];
  exercises: PlanExercise[];
}

export interface WorkoutPlan {
  perWeek: number;
  goal: Goal;
  env: Env;
  level: Level;
  days: PlanDay[];
  createdAt: number;
}

export interface GenerateOptions {
  perWeek: number;
  goal: Goal;
  env: Env;
  level: Level;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** How many exercises a day should contain — fewer when training more often. */
function exercisesPerDay(perWeek: number): number {
  if (perWeek >= 6) return 4;
  if (perWeek >= 4) return 5;
  return 6;
}

/** Order exercises so the chosen level comes first, but never exclude entirely. */
function byLevel(level: Level): (a: Exercise, b: Exercise) => number {
  const order: Record<Level, number> = { beginner: 0, intermediate: 1, advanced: 2 };
  const target = order[level];
  return (a, b) => Math.abs(order[a.level] - target) - Math.abs(order[b.level] - target);
}

function toPlanExercise(e: Exercise, goal: Goal): PlanExercise {
  return {
    id: e.id,
    name: e.name,
    muscle: e.primary,
    equipment: e.equipment,
    sets: SCHEME[goal].sets,
    reps: SCHEME[goal].reps,
    images: e.images,
  };
}

function pickForDay(key: SplitKey, opts: GenerateOptions, count: number): PlanExercise[] {
  const muscles = DAY_MUSCLES[key];
  const used = new Set<string>();
  const out: PlanExercise[] = [];

  const pools: Record<string, Exercise[]> = {};
  for (const m of muscles) {
    let cands = EXERCISES.filter((e) => e.primary === m);
    if (opts.env === "home") cands = cands.filter(isHomeFriendly);
    pools[m] = shuffle(cands).sort(byLevel(opts.level));
  }

  // Round-robin across the day's muscles for balanced coverage.
  let added = true;
  while (out.length < count && added) {
    added = false;
    for (const m of muscles) {
      if (out.length >= count) break;
      const next = pools[m].find((e) => !used.has(e.id));
      if (next) {
        used.add(next.id);
        out.push(toPlanExercise(next, opts.goal));
        added = true;
      }
    }
  }

  // Fallback: fill remaining slots from secondary-target exercises.
  if (out.length < count) {
    let extra = EXERCISES.filter(
      (e) => !used.has(e.id) && e.secondary.some((s) => muscles.includes(s)),
    );
    if (opts.env === "home") extra = extra.filter(isHomeFriendly);
    for (const e of shuffle(extra)) {
      if (out.length >= count) break;
      used.add(e.id);
      out.push(toPlanExercise(e, opts.goal));
    }
  }

  return out;
}

/** Build a full weekly workout plan. */
export function generatePlan(opts: GenerateOptions): WorkoutPlan {
  const perWeek = Math.min(6, Math.max(3, Math.round(opts.perWeek)));
  const split = SPLITS[perWeek] ?? SPLITS[3];
  const count = exercisesPerDay(perWeek);

  const days: PlanDay[] = split.map((key) => ({
    key,
    muscles: DAY_MUSCLES[key],
    exercises: pickForDay(key, { ...opts, perWeek }, count),
  }));

  return { perWeek, goal: opts.goal, env: opts.env, level: opts.level, days, createdAt: Date.now() };
}
