import type { Difficulty } from "./types";

export interface LevelConfig {
  id: Difficulty;
  name: string;
  tagline: string;
  description: string;
  accent: string;
  glow: string;
}

export const LEVELS: LevelConfig[] = [
  {
    id: "easy",
    name: "Easy",
    tagline: "Foundations",
    description:
      "Core definitions and fundamental concepts. Perfect for building a solid base across all five chapters.",
    accent: "#34d399",
    glow: "rgba(52, 211, 153, 0.45)",
  },
  {
    id: "medium",
    name: "Medium",
    tagline: "Application",
    description:
      "Understanding, comparison and applying concepts. Connect ideas across topics and test real comprehension.",
    accent: "#fbbf24",
    glow: "rgba(251, 191, 36, 0.45)",
  },
  {
    id: "hard",
    name: "Hard",
    tagline: "Mastery",
    description:
      "Analytical scenarios and easily-confused concepts that demand focus. Built to challenge top students.",
    accent: "#fb7185",
    glow: "rgba(251, 113, 133, 0.45)",
  },
];

export function levelConfig(id: Difficulty): LevelConfig {
  return LEVELS.find((l) => l.id === id) ?? LEVELS[0];
}
