import { clsx, type ClassValue } from "clsx";
// (font stacks live in globals.css; no remote font fetching to keep builds offline-safe)
import { twMerge } from "tailwind-merge";

/** Merge Tailwind class names safely. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Fisher–Yates shuffle (returns a new array, does not mutate input). */
export function shuffle<T>(input: readonly T[]): T[] {
  const arr = [...input];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** Pick `count` random elements from an array without repetition. */
export function sample<T>(input: readonly T[], count: number): T[] {
  return shuffle(input).slice(0, Math.min(count, input.length));
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}
