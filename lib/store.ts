import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  GameState,
  Team,
  HookId,
  Question,
  JudgingMode,
  PreloadedQuestions,
} from "./types";
import { TEAM_COLORS, TEAM_AVATARS, TEAM_NAME_PRESETS } from "./utils";

const makeEmptyTeam = (id: "team_a" | "team_b", color: string, avatar: string, defaultName: string): Team => ({
  id,
  name: defaultName,
  color,
  avatar,
  playersCount: 2,
  score: 0,
  hooks: [],
  usedHooks: [],
  selectedCategories: [],
});

const INITIAL_STATE: GameState = {
  phase: "landing",
  teamA: makeEmptyTeam("team_a", TEAM_COLORS[0].id, TEAM_AVATARS[0], TEAM_NAME_PRESETS[0]),
  teamB: makeEmptyTeam("team_b", TEAM_COLORS[1].id, TEAM_AVATARS[1], TEAM_NAME_PRESETS[2]),
  settings: {
    judgingMode: "ai",
    language: "ar",
    enableDailyBonus: true,
    personality: "fun",
  },
  currentTurn: "team_a",
  currentQuestion: null,
  answeredQuestions: [],
  selectedCellId: null,
  preloadedQuestions: {},
};

interface GameStore extends GameState {
  // أكشنات التهيئة
  resetGame: () => void;
  setPhase: (phase: GameState["phase"]) => void;

  // إعدادات الفرق
  setTeamName: (team: "team_a" | "team_b", name: string) => void;
  setTeamColor: (team: "team_a" | "team_b", color: string) => void;
  setTeamAvatar: (team: "team_a" | "team_b", avatar: string) => void;
  setTeamPlayersCount: (team: "team_a" | "team_b", count: number) => void;

  // إعدادات اللعبة
  setJudgingMode: (mode: JudgingMode) => void;
  setPersonality: (p: "fun" | "casual" | "strict" | "prince") => void;

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

  // تحميل مسبق
  setPreloadedQuestions: (questions: PreloadedQuestions) => void;
  clearPreloadedQuestions: () => void;
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

      setTeamAvatar: (team, avatar) =>
        set((s) => ({
          [team === "team_a" ? "teamA" : "teamB"]: {
            ...(team === "team_a" ? s.teamA : s.teamB),
            avatar,
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

      setPersonality: (p) =>
        set((s) => ({ settings: { ...s.settings, personality: p } })),

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

      setPreloadedQuestions: (questions) =>
        set({ preloadedQuestions: questions }),

      clearPreloadedQuestions: () => set({ preloadedQuestions: {} }),
    }),
    {
      name: "noonaeen-game",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
