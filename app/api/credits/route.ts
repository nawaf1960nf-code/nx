import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { getAdminClient } from "@/lib/supabase-admin";

export const runtime = "nodejs";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const admin = getAdminClient();
    const { data, error } = await admin
      .from("user_credits")
      .select("free_plays_used, paid_plays_remaining, total_plays_completed")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) throw error;

    // لو ما له سطر، أنشئ واحد
    if (!data) {
      await admin
        .from("user_credits")
        .insert({ user_id: user.id });
      return NextResponse.json({
        free_plays_used: 0,
        paid_plays_remaining: 0,
        total_plays_completed: 0,
        has_free_play: true,
        has_credits: true,
      });
    }

    const hasFreePlay = (data.free_plays_used ?? 0) === 0;
    const hasPaid = (data.paid_plays_remaining ?? 0) > 0;
    return NextResponse.json({
      ...data,
      has_free_play: hasFreePlay,
      has_credits: hasFreePlay || hasPaid,
    });
  } catch (e) {
    console.error("credits.get error:", e);
    return NextResponse.json(
      { error: "تعذّر جلب الرصيد" },
      { status: 500 },
    );
  }
}
