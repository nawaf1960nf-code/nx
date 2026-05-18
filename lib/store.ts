import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { GameState, Team, HookId, Question, JudgingMode } from "./types";
import { TEAM_COLORS } from "./utils";

const makeEmptyTeam = (id: "team_a" | "team_b", color: string): Team => ({
  id,
  name: id === "team_a" ? "الفريق الأول" : "الفريق الثاني",
  color,
  playersCount: 2,
  score: 0,
  hooks: [],
  usedHooks: [],
  selectedCategories: [],
});

const INITIAL_STATE: GameState = {
  phase: "landing",
  teamA: makeEmptyTeam("team_a", TEAM_COLORS[0].id),
  teamB: makeEmptyTeam("team_b", TEAM_COLORS[1].id),
  settings: {
    judgingMode: "ai",
    language: "ar",
    enableDailyBonus: true,
  },
  currentTurn: "team_a",
  currentQuestion: null,
  answeredQuestions: [],
  selectedCellId: null,
};

interface GameStore extends GameState {
  // أكشنات التهيئة
  resetGame: () => void;
  setPhase: (phase: GameState["phase"]) => void;

  // إعدادات الفرق
  setTeamName: (team: "team_a" | "team_b", name: string) => void;
  setTeamColor: (team: "team_a" | "team_b", color: string) => void;
  setTeamPlayersCount: (team: "team_a" | "team_b", count: number) => void;

  // إعدادات اللعبة
  setJudgingMode: (mode: JudgingMode) => void;

  // اختيار التصنيفات
  toggleCategory: (team: "team_a" | "team_b", categoryId: string) => void;

  // اختيار الهوكات
  toggleHook: (team: "team_a" | "team_b", hookId: HookId) => void;

  // اللعب
  setCurrentTurn: (team: "team_a" | "team_b") => void;
  setCurrentQuestion: (question: Question | null) => void;
  setSelectedCell: (cellId: string | null) => void;
  markQuestionAnswered: (cellId: string) => void;
  addScore: (team: "team_a" | "team_b", points: number) => void;
  subtractScore: (team: "team_a" | "team_b", points: number) => void;
  useHook: (team: "team_a" | "team_b", hookId: HookId) => void;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set) => ({
      ...INITIAL_STATE,

      resetGame: () => set(INITIAL_STATE),
      setPhase: (phase) => set({ phase }),

      setTeamName: (team, name) =>
        set((s) => ({
          [team === "team_a" ? "teamA" : "teamB"]: {
            ...(team === "team_a" ? s.teamA : s.teamB),
            name,
          },
        })),

      setTeamColor: (team, color) =>
        set((s) => ({
          [team === "team_a" ? "teamA" : "teamB"]: {
            ...(team === "team_a" ? s.teamA : s.teamB),
            color,
          },
        })),

      setTeamPlayersCount: (team, count) =>
        set((s) => ({
          [team === "team_a" ? "teamA" : "teamB"]: {
            ...(team === "team_a" ? s.teamA : s.teamB),
            playersCount: count,
          },
        })),

      setJudgingMode: (mode) =>
        set((s) => ({ settings: { ...s.settings, judgingMode: mode } })),

      toggleCategory: (team, categoryId) =>
        set((s) => {
          const t = team === "team_a" ? s.teamA : s.teamB;
          const has = t.selectedCategories.includes(categoryId);
          const next = has
            ? t.selectedCategories.filter((c) => c !== categoryId)
            : [...t.selectedCategories, categoryId];
          return {
            [team === "team_a" ? "teamA" : "teamB"]: {
              ...t,
              selectedCategories: next,
            },
          };
        }),

      toggleHook: (team, hookId) =>
        set((s) => {
          const t = team === "team_a" ? s.teamA : s.teamB;
          const has = t.hooks.includes(hookId);
          const next = has
            ? t.hooks.filter((h) => h !== hookId)
            : [...t.hooks, hookId];
          return {
            [team === "team_a" ? "teamA" : "teamB"]: { ...t, hooks: next },
          };
        }),

      setCurrentTurn: (team) => set({ currentTurn: team }),
      setCurrentQuestion: (question) => set({ currentQuestion: question }),
      setSelectedCell: (cellId) => set({ selectedCellId: cellId }),
      markQuestionAnswered: (cellId) =>
        set((s) => ({
          answeredQuestions: [...s.answeredQuestions, cellId],
        })),

      addScore: (team, points) =>
        set((s) => ({
          [team === "team_a" ? "teamA" : "teamB"]: {
            ...(team === "team_a" ? s.teamA : s.teamB),
            score: (team === "team_a" ? s.teamA : s.teamB).score + points,
          },
        })),

      subtractScore: (team, points) =>
        set((s) => ({
          [team === "team_a" ? "teamA" : "teamB"]: {
            ...(team === "team_a" ? s.teamA : s.teamB),
            score: Math.max(
              0,
              (team === "team_a" ? s.teamA : s.teamB).score - points,
            ),
          },
        })),

      useHook: (team, hookId) =>
        set((s) => {
          const t = team === "team_a" ? s.teamA : s.teamB;
          return {
            [team === "team_a" ? "teamA" : "teamB"]: {
              ...t,
              usedHooks: [...t.usedHooks, hookId],
            },
          };
        }),
    }),
    {
      name: "noonaeen-game",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
