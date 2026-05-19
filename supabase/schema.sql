-- ============================================
-- نون عين - مخطط قاعدة البيانات
-- يُنفّذ مرة واحدة في Supabase SQL Editor
-- ============================================

-- ===== جدول رصيد المستخدمين =====
CREATE TABLE IF NOT EXISTS public.user_credits (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  free_plays_used INT NOT NULL DEFAULT 0,           -- 0 = ما لعب لعبته المجانية بعد
  paid_plays_remaining INT NOT NULL DEFAULT 0,      -- الألعاب المدفوعة المتبقية
  total_plays_completed INT NOT NULL DEFAULT 0,     -- الإجمالي عبر الزمن
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ===== جدول الأكواد =====
CREATE TABLE IF NOT EXISTS public.access_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  plays_granted INT NOT NULL CHECK (plays_granted > 0),
  package_name TEXT,                                -- مثل: "حزمة العائلة"
  max_uses INT NOT NULL DEFAULT 1,                  -- 1 = استخدام واحد
  used_count INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  expires_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_access_codes_code ON public.access_codes(code);
CREATE INDEX IF NOT EXISTS idx_access_codes_active ON public.access_codes(is_active) WHERE is_active = TRUE;

-- ===== سجل الاستخدامات =====
CREATE TABLE IF NOT EXISTS public.code_redemptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code_id UUID NOT NULL REFERENCES public.access_codes(id),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  plays_granted INT NOT NULL,
  redeemed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (code_id, user_id) -- المستخدم ما يقدر يستخدم نفس الكود مرتين
);

-- ===== سجل الألعاب المكتملة =====
CREATE TABLE IF NOT EXISTS public.game_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  team_a_name TEXT,
  team_b_name TEXT,
  team_a_score INT NOT NULL DEFAULT 0,
  team_b_score INT NOT NULL DEFAULT 0,
  winner TEXT, -- 'team_a' / 'team_b' / 'tie'
  categories TEXT[],
  was_free_game BOOLEAN NOT NULL DEFAULT FALSE,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ===== جلسات المشاركة المباشرة =====
CREATE TABLE IF NOT EXISTS public.game_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  host_user_id UUID REFERENCES auth.users(id),
  state JSONB NOT NULL DEFAULT '{}'::jsonb,
  watcher_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + interval '6 hours')
);

CREATE INDEX IF NOT EXISTS idx_game_sessions_code ON public.game_sessions(code);
CREATE INDEX IF NOT EXISTS idx_game_sessions_expires ON public.game_sessions(expires_at);

-- ============================================
-- Triggers
-- ============================================

-- إنشاء سطر رصيد تلقائي عند تسجيل مستخدم جديد
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_credits (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- تحديث updated_at تلقائياً
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS touch_user_credits ON public.user_credits;
CREATE TRIGGER touch_user_credits
  BEFORE UPDATE ON public.user_credits
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ============================================
-- Row Level Security (RLS)
-- ============================================
ALTER TABLE public.user_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.access_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.code_redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_history ENABLE ROW LEVEL SECURITY;

-- المستخدمون يقرؤون رصيدهم فقط
DROP POLICY IF EXISTS "Users read own credits" ON public.user_credits;
CREATE POLICY "Users read own credits" ON public.user_credits
  FOR SELECT USING (auth.uid() = user_id);

-- المستخدمون يشوفون سجل استخداماتهم
DROP POLICY IF EXISTS "Users read own redemptions" ON public.code_redemptions;
CREATE POLICY "Users read own redemptions" ON public.code_redemptions
  FOR SELECT USING (auth.uid() = user_id);

-- المستخدمون يشوفون سجل ألعابهم
DROP POLICY IF EXISTS "Users read own games" ON public.game_history;
CREATE POLICY "Users read own games" ON public.game_history
  FOR SELECT USING (auth.uid() = user_id);

-- جلسات اللعب (قراءة عامة، تعديل عبر service_role فقط)
DROP POLICY IF EXISTS "Anyone can read sessions" ON public.game_sessions;
CREATE POLICY "Anyone can read sessions" ON public.game_sessions
  FOR SELECT USING (TRUE);

-- لا يوجد وصول مباشر للأكواد من العميل (السيرفر فقط)
-- (لا نضيف policy → بدون policy = ممنوع كل شي عبر anon key)

-- ============================================
-- إنشاء سطور رصيد للمستخدمين الموجودين أصلاً
-- ============================================
INSERT INTO public.user_credits (user_id)
SELECT id FROM auth.users
WHERE id NOT IN (SELECT user_id FROM public.user_credits)
ON CONFLICT (user_id) DO NOTHING;
