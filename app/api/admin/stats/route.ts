import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { getAdminClient, isAdminEmail } from "@/lib/supabase-admin";

export const runtime = "nodejs";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !isAdminEmail(user.email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const admin = getAdminClient();

  const [
    { count: totalUsers },
    { count: totalCodes },
    { count: redemptionsCount },
    { data: codes },
  ] = await Promise.all([
    admin.from("user_credits").select("*", { count: "exact", head: true }),
    admin.from("access_codes").select("*", { count: "exact", head: true }),
    admin
      .from("code_redemptions")
      .select("*", { count: "exact", head: true }),
    admin.from("access_codes").select("plays_granted, used_count, max_uses"),
  ]);

  const totalPlaysSold =
    codes?.reduce(
      (s, c) =>
        s +
        Math.min((c.used_count as number) ?? 0, (c.max_uses as number) ?? 1) *
          ((c.plays_granted as number) ?? 0),
      0,
    ) ?? 0;

  return NextResponse.json({
    total_users: totalUsers ?? 0,
    total_codes: totalCodes ?? 0,
    total_redemptions: redemptionsCount ?? 0,
    total_plays_sold: totalPlaysSold,
  });
}
