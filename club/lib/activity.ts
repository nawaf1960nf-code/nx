"use client";

/**
 * Lightweight client-side activity tracking that powers streaks and the
 * "come back to the gym" motivational nudge. Persisted in localStorage now;
 * the same shape moves to Supabase per-user when accounts land — at which
 * point reminders can be delivered as real push/email from the server.
 */

const KEY = "club:activity";
const DAY = 24 * 60 * 60 * 1000;

interface ActivityState {
  firstVisit: number;
  lastVisit: number;
  /** Timestamps of logged workouts (one per calendar day). */
  workouts: number[];
}

function load(): ActivityState {
  if (typeof window === "undefined") return { firstVisit: Date.now(), lastVisit: Date.now(), workouts: [] };
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<ActivityState>;
      return {
        firstVisit: parsed.firstVisit ?? Date.now(),
        lastVisit: parsed.lastVisit ?? Date.now(),
        workouts: Array.isArray(parsed.workouts) ? parsed.workouts : [],
      };
    }
  } catch {
    /* ignore */
  }
  return { firstVisit: Date.now(), lastVisit: Date.now(), workouts: [] };
}

function save(state: ActivityState): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

function startOfDay(ts: number): number {
  const d = new Date(ts);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

/**
 * Record that the user opened the app. Returns how many full days passed
 * since their previous visit (0 on the very first visit), so the UI can
 * decide whether to show a comeback nudge.
 */
export function recordVisit(): { daysAway: number } {
  const state = load();
  const prev = state.lastVisit;
  const now = Date.now();
  const isFirst = !localStorage.getItem(KEY);
  const daysAway = isFirst ? 0 : Math.floor((startOfDay(now) - startOfDay(prev)) / DAY);
  state.lastVisit = now;
  save(state);
  return { daysAway: Math.max(0, daysAway) };
}

/** Log a completed workout for today (deduplicated to one per calendar day). */
export function logWorkout(): void {
  const state = load();
  const today = startOfDay(Date.now());
  const already = state.workouts.some((w) => startOfDay(w) === today);
  if (!already) {
    state.workouts.push(Date.now());
    save(state);
  }
}

/** Distinct calendar days (start-of-day timestamps) that have a logged workout. */
export function getWorkoutDays(): number[] {
  const { workouts } = load();
  return Array.from(new Set(workouts.map(startOfDay))).sort((a, b) => a - b);
}

export interface ActivityStats {
  total: number;
  thisWeek: number;
  dayStreak: number;
  lastWorkout: number | null;
}

export function getStats(): ActivityStats {
  const { workouts } = load();
  const now = Date.now();
  const total = workouts.length;
  const thisWeek = workouts.filter((w) => now - w <= 7 * DAY).length;

  // Distinct workout days, newest first.
  const days = Array.from(new Set(workouts.map(startOfDay))).sort((a, b) => b - a);
  let dayStreak = 0;
  if (days.length) {
    const today = startOfDay(now);
    // Streak counts if the most recent workout was today or yesterday.
    if (today - days[0] <= DAY) {
      dayStreak = 1;
      for (let i = 1; i < days.length; i++) {
        if (days[i - 1] - days[i] === DAY) dayStreak++;
        else break;
      }
    }
  }

  return { total, thisWeek, dayStreak, lastWorkout: days[0] ?? null };
}
