import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { getAdminClient, isAdminEmail } from "@/lib/supabase-admin";

export const runtime = "nodejs";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // الأدمن: ألعاب لا نهائية
  if (isAdminEmail(user.email)) {
    return NextResponse.json({
      free_plays_used: 0,
      paid_plays_remaining: 9999,
      total_plays_completed: 0,
      has_free_play: true,
      has_credits: true,
      is_admin: true,
    });
  }

  try {
    const admin = getAdminClient();
    const { data, error } = await admin
      .from("user_credits")
      .select("free_plays_used, paid_plays_remaining, total_plays_completed")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) {
      console.error("credits.get db error:", error);
      throw error;
    }

    // لو ما له سطر، أنشئ واحد
    if (!data) {
      const { error: insErr } = await admin
        .from("user_credits")
        .insert({ user_id: user.id });
      if (insErr) console.error("credits.get insert error:", insErr);
      return NextResponse.json({
        free_plays_used: 0,
        paid_plays_remaining: 0,
        total_plays_completed: 0,
        has_free_play: true,
        has_credits: true,
      });
    }

    const hasFreePlay = ((data.free_plays_used as number) ?? 0) === 0;
    const paid = (data.paid_plays_remaining as number) ?? 0;
    const hasPaid = paid > 0;
    return NextResponse.json({
      free_plays_used: data.free_plays_used,
      paid_plays_remaining: paid,
      total_plays_completed: data.total_plays_completed,
      has_free_play: hasFreePlay,
      has_credits: hasFreePlay || hasPaid,
    });
  } catch (e) {
    console.error("credits.get error:", e);
    return NextResponse.json(
      { error: "تعذّر جلب الرصيد", details: String(e) },
      { status: 500 },
    );
  }
}
