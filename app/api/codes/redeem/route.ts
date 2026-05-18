import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { getAdminClient } from "@/lib/supabase-admin";

export const runtime = "nodejs";

interface Body {
  code: string;
}

export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as Body;
  const code = body.code?.trim().toUpperCase();

  if (!code) {
    return NextResponse.json(
      { error: "اكتب الكود" },
      { status: 400 },
    );
  }

  try {
    const admin = getAdminClient();

    // ابحث عن الكود
    const { data: codeRow, error: codeErr } = await admin
      .from("access_codes")
      .select("*")
      .eq("code", code)
      .maybeSingle();

    if (codeErr) throw codeErr;

    if (!codeRow) {
      return NextResponse.json(
        { error: "الكود غير صحيح" },
        { status: 404 },
      );
    }

    if (!codeRow.is_active) {
      return NextResponse.json(
        { error: "الكود غير مفعّل" },
        { status: 410 },
      );
    }

    const usedCount = (codeRow.used_count as number) ?? 0;
    const maxUses = (codeRow.max_uses as number) ?? 1;
    if (usedCount >= maxUses) {
      return NextResponse.json(
        { error: "الكود استُخدم بالكامل" },
        { status: 410 },
      );
    }

    if (codeRow.expires_at && new Date(codeRow.expires_at as string) < new Date()) {
      return NextResponse.json(
        { error: "الكود منتهي الصلاحية" },
        { status: 410 },
      );
    }

    // تأكد إن نفس المستخدم ما استخدمه قبل
    const { data: existing } = await admin
      .from("code_redemptions")
      .select("id")
      .eq("code_id", codeRow.id)
      .eq("user_id", user.id)
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        { error: "استخدمت هذا الكود من قبل" },
        { status: 409 },
      );
    }

    const playsGranted = codeRow.plays_granted as number;

    // أضف للرصيد
    const { data: credits } = await admin
      .from("user_credits")
      .select("paid_plays_remaining")
      .eq("user_id", user.id)
      .maybeSingle();

    const currentPaid = (credits?.paid_plays_remaining as number) ?? 0;
    await admin
      .from("user_credits")
      .upsert(
        {
          user_id: user.id,
          paid_plays_remaining: currentPaid + playsGranted,
        },
        { onConflict: "user_id" },
      );

    // سجّل الاستخدام + زود العداد
    await admin.from("code_redemptions").insert({
      code_id: codeRow.id,
      user_id: user.id,
      plays_granted: playsGranted,
    });

    await admin
      .from("access_codes")
      .update({ used_count: usedCount + 1 })
      .eq("id", codeRow.id);

    return NextResponse.json({
      success: true,
      plays_granted: playsGranted,
      package_name: codeRow.package_name as string | null,
      new_total: currentPaid + playsGranted,
    });
  } catch (e) {
    console.error("code.redeem error:", e);
    return NextResponse.json(
      { error: "تعذّر استخدام الكود" },
      { status: 500 },
    );
  }
}
