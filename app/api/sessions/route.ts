import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { getAdminClient } from "@/lib/supabase-admin";

export const runtime = "nodejs";

const CHARS = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

function generateCode(): string {
  return Array.from(
    { length: 5 },
    () => CHARS[Math.floor(Math.random() * CHARS.length)],
  ).join("");
}

/**
 * POST /api/sessions
 * ينشئ جلسة جديدة لمشاركة اللعبة مع المشاهدين.
 * يرجع كوداً قصيراً (5 أحرف) للمشاركة.
 */
export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const initialState = body?.state ?? {};

    const admin = getAdminClient();

    // محاولة توليد كود فريد (٥ محاولات كحد أقصى)
    let code = "";
    let sessionId = "";
    for (let attempt = 0; attempt < 5; attempt++) {
      code = generateCode();
      const { data, error } = await admin
        .from("game_sessions")
        .insert({
          code,
          host_user_id: user.id,
          state: initialState,
        })
        .select("id")
        .single();
      if (!error && data) {
        sessionId = data.id as string;
        break;
      }
    }

    if (!sessionId) {
      return NextResponse.json(
        { error: "تعذّر إنشاء الجلسة" },
        { status: 500 },
      );
    }

    return NextResponse.json({ code, sessionId });
  } catch (e) {
    console.error("session.create error:", e);
    return NextResponse.json(
      { error: "فشل إنشاء الجلسة" },
      { status: 500 },
    );
  }
}
