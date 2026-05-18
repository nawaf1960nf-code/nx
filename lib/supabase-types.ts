// أنواع جداول قاعدة بيانات Supabase

export interface UserCreditsRow {
  user_id: string;
  free_plays_used: number;
  paid_plays_remaining: number;
  total_plays_completed: number;
  created_at: string;
  updated_at: string;
}

export interface AccessCodeRow {
  id: string;
  code: string;
  plays_granted: number;
  package_name: string | null;
  max_uses: number;
  used_count: number;
  is_active: boolean;
  expires_at: string | null;
  notes: string | null;
  created_at: string;
}

export interface CodeRedemptionRow {
  id: string;
  code_id: string;
  user_id: string;
  plays_granted: number;
  redeemed_at: string;
}

export interface GameHistoryRow {
  id: string;
  user_id: string;
  team_a_name: string | null;
  team_b_name: string | null;
  team_a_score: number;
  team_b_score: number;
  winner: string | null;
  categories: string[] | null;
  was_free_game: boolean;
  completed_at: string;
}

export interface Database {
  public: {
    Tables: {
      user_credits: {
        Row: UserCreditsRow;
        Insert: Partial<UserCreditsRow> & { user_id: string };
        Update: Partial<UserCreditsRow>;
      };
      access_codes: {
        Row: AccessCodeRow;
        Insert: Partial<AccessCodeRow> & {
          code: string;
          plays_granted: number;
        };
        Update: Partial<AccessCodeRow>;
      };
      code_redemptions: {
        Row: CodeRedemptionRow;
        Insert: Partial<CodeRedemptionRow> & {
          code_id: string;
          user_id: string;
          plays_granted: number;
        };
        Update: Partial<CodeRedemptionRow>;
      };
      game_history: {
        Row: GameHistoryRow;
        Insert: Partial<GameHistoryRow> & { user_id: string };
        Update: Partial<GameHistoryRow>;
      };
    };
  };
}
