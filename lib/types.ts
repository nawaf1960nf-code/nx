// أنواع البيانات الأساسية للعبة نون عين

export type HookId =
  | "trap"
  | "rest"
  | "call_friend"
  | "pit"
  | "double_answer"
  | "lock"
  | "steal"
  | "ai_hint"
  | "double_challenge"
  | "multiplier"
  | "switch";

export type HookTiming = "before_question" | "after_question";

export interface Hook {
  id: HookId;
  name: string;
  description: string;
  icon: string;
  timing: HookTiming;
  color: string;
}

export type CategoryGroup =
  | "movies_shows"
  | "anime_manga"
  | "video_games"
  | "sports"
  | "cars"
  | "general_culture"
  | "audio_visual"
  | "party_games"
  | "special_daily";

export type GameMode = "trivia" | "charades";

export interface Category {
  id: string;
  name: string;
  nameEn?: string;
  group: CategoryGroup;
  icon: string;
  description: string;
  hasImages: boolean;
  hasAudio: boolean;
  featured?: boolean;
  gameMode?: GameMode;
  gradient: string;
  wikiTitle?: string;        // اسم المقال بالضبط على ويكيبيديا الإنجليزية
  wikiTitleAr?: string;      // اسم المقال بالضبط على ويكيبيديا العربية
  coverImage?: string;       // رابط صورة محدد (يتجاوز ويكي)
  imageQuery?: string;       // استعلام بحث احتياطي
}

export interface Team {
  id: "team_a" | "team_b";
  name: string;
  color: string;
  avatar: string;
  playersCount: number;
  score: number;
  hooks: HookId[];
  usedHooks: HookId[];
  selectedCategories: string[];
}

export type JudgingMode = "ai" | "manual" | "mixed";

export interface GameSettings {
  judgingMode: JudgingMode;
  language: "ar" | "en";
  enableDailyBonus: boolean;
}

export type QuestionDifficulty = 200 | 400 | 600;

export interface Question {
  id: string;
  categoryId: string;
  difficulty: QuestionDifficulty;
  text: string;
  answer: string;
  acceptableAnswers?: string[];
  imageUrl?: string;
  audioUrl?: string;
  hint?: string;
  isDailyBonus?: boolean;
}

export interface GameState {
  phase:
    | "landing"
    | "setup"
    | "categories_a"
    | "categories_b"
    | "hooks_a"
    | "hooks_b"
    | "board"
    | "question"
    | "results";
  teamA: Team;
  teamB: Team;
  settings: GameSettings;
  currentTurn: "team_a" | "team_b";
  currentQuestion: Question | null;
  answeredQuestions: string[];
  selectedCellId: string | null;
}
