"use client";

/** Bodyweight tracking — one entry per calendar day, stored in localStorage. */

const KEY = "club:weights";

export interface WeightEntry {
  /** Start-of-day timestamp. */
  day: number;
  kg: number;
}

function startOfDay(ts: number): number {
  const d = new Date(ts);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

export function getWeights(): WeightEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw) as WeightEntry[];
    return Array.isArray(arr) ? arr.sort((a, b) => a.day - b.day) : [];
  } catch {
    return [];
  }
}

/** Add or replace today's weight entry. */
export function addWeight(kg: number): void {
  if (!kg || kg <= 0) return;
  const today = startOfDay(Date.now());
  const list = getWeights().filter((e) => e.day !== today);
  list.push({ day: today, kg });
  list.sort((a, b) => a.day - b.day);
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    /* ignore */
  }
}

export interface WeightSummary {
  latest: number | null;
  start: number | null;
  change: number | null;
  count: number;
}

export function getWeightSummary(): WeightSummary {
  const list = getWeights();
  if (!list.length) return { latest: null, start: null, change: null, count: 0 };
  const latest = list[list.length - 1].kg;
  const start = list[0].kg;
  return { latest, start, change: Math.round((latest - start) * 10) / 10, count: list.length };
}

/** Estimated one-rep max (Epley formula). */
export function epley1RM(weight: number, reps: number): number {
  if (weight <= 0 || reps <= 0) return 0;
  if (reps === 1) return Math.round(weight);
  return Math.round(weight * (1 + reps / 30));
}
