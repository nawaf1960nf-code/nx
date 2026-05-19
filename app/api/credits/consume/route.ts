import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { getAdminClient, isAdminEmail } from "@/lib/supabase-admin";

export const runtime = "nodejs";

/**
 * يستخدم رصيد لعبة واحدة من المستخدم.
 * - الأدمن: لا ينقص (تجاوز)
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

  // الأدمن: تجاوز كامل
  if (isAdminEmail(user.email)) {
    return NextResponse.json({
      success: true,
      was_free_game: false,
      remaining: 9999,
      admin_bypass: true,
    });
  }

  try {
    const admin = getAdminClient();

    const { data: credits, error: getErr } = await admin
      .from("user_credits")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (getErr) {
      console.error("credits.consume get error:", getErr);
      throw getErr;
    }

    let row = credits;

    // أنشئ السطر إن لم يكن موجوداً
    if (!row) {
      const { data: created, error: insErr } = await admin
        .from("user_credits")
        .insert({ user_id: user.id })
        .select("*")
        .single();
      if (insErr) {
        console.error("credits.consume insert error:", insErr);
        return NextResponse.json(
          { error: "تعذّر إنشاء الرصيد", details: insErr.message },
          { status: 500 },
        );
      }
      row = created;
    }

    if (!row) {
      return NextResponse.json(
        { error: "تعذّر تجهيز الرصيد" },
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
      const { error: updErr } = await admin
        .from("user_credits")
        .update({ free_plays_used: 1 })
        .eq("user_id", user.id);
      if (updErr) {
        console.error("credits.consume update free error:", updErr);
        throw updErr;
      }
    } else {
      const { error: updErr } = await admin
        .from("user_credits")
        .update({ paid_plays_remaining: paidRemaining - 1 })
        .eq("user_id", user.id);
      if (updErr) {
        console.error("credits.consume update paid error:", updErr);
        throw updErr;
      }
    }

    return NextResponse.json({
      success: true,
      was_free_game: wasFreeGame,
      remaining: wasFreeGame ? paidRemaining : paidRemaining - 1,
    });
  } catch (e) {
    console.error("credits.consume error:", e);
    return NextResponse.json(
      { error: "تعذّر استهلاك الرصيد", details: String(e) },
      { status: 500 },
    );
  }
}
