import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { getAdminClient } from "@/lib/supabase-admin";

export const runtime = "nodejs";

/**
 * يستخدم رصيد لعبة واحدة من المستخدم.
 * - إذا ما لعب لعبته المجانية بعد، يحسبها كمجانية.
 * - وإلا ينقص من paid_plays_remaining.
 * - يرفض الطلب إذا ما عنده رصيد.
 */
export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const admin = getAdminClient();

    const { data: credits, error: getErr } = await admin
      .from("user_credits")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (getErr) throw getErr;

    const row =
      credits ??
      (await admin
        .from("user_credits")
        .insert({ user_id: user.id })
        .select("*")
        .single()
        .then((r) => r.data));

    if (!row) {
      return NextResponse.json(
        { error: "تعذّر إنشاء الرصيد" },
        { status: 500 },
      );
    }

    const freePlaysUsed = (row.free_plays_used as number) ?? 0;
    const paidRemaining = (row.paid_plays_remaining as number) ?? 0;
    const wasFreeGame = freePlaysUsed === 0;

    if (!wasFreeGame && paidRemaining <= 0) {
      return NextResponse.json(
        { error: "no_credits", message: "ما عندك ألعاب متبقية" },
        { status: 402 },
      );
    }

    // اخصم من الرصيد المناسب
    if (wasFreeGame) {
      await admin
        .from("user_credits")
        .update({ free_plays_used: 1 })
        .eq("user_id", user.id);
    } else {
      await admin
        .from("user_credits")
        .update({ paid_plays_remaining: paidRemaining - 1 })
        .eq("user_id", user.id);
    }

    return NextResponse.json({
      success: true,
      was_free_game: wasFreeGame,
      remaining: wasFreeGame ? paidRemaining : paidRemaining - 1,
    });
  } catch (e) {
    console.error("credits.consume error:", e);
    return NextResponse.json(
      { error: "تعذّر استهلاك الرصيد" },
      { status: 500 },
    );
  }
}
