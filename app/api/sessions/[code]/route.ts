import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { getAdminClient } from "@/lib/supabase-admin";

export const runtime = "nodejs";

/**
 * GET /api/sessions/[code]
 * يرجع حالة الجلسة الحالية (للمشاهدين).
 */
export async function GET(
  _req: Request,
  ctx: { params: Promise<{ code: string }> },
) {
  const { code } = await ctx.params;
  if (!code) {
    return NextResponse.json({ error: "Missing code" }, { status: 400 });
  }

  try {
    const admin = getAdminClient();
    const { data, error } = await admin
      .from("game_sessions")
      .select("code, state, expires_at, updated_at")
      .eq("code", code.toUpperCase())
      .maybeSingle();

    if (error || !data) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }

    // تحقق من الانتهاء
    if (data.expires_at && new Date(data.expires_at as string) < new Date()) {
      return NextResponse.json({ error: "expired" }, { status: 410 });
    }

    return NextResponse.json(data);
  } catch (e) {
    console.error("session.get error:", e);
    return NextResponse.json({ error: "fetch_failed" }, { status: 500 });
  }
}

/**
 * PATCH /api/sessions/[code]
 * يحدّث حالة الجلسة (المضيف فقط).
 */
export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ code: string }> },
) {
  const { code } = await ctx.params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const newState = body?.state;
    if (!newState) {
      return NextResponse.json({ error: "Missing state" }, { status: 400 });
    }

    const admin = getAdminClient();
    const { error } = await admin
      .from("game_sessions")
      .update({ state: newState, updated_at: new Date().toISOString() })
      .eq("code", code.toUpperCase())
      .eq("host_user_id", user.id);

    if (error) {
      console.error("session.update error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("session.patch error:", e);
    return NextResponse.json({ error: "update_failed" }, { status: 500 });
  }
}
