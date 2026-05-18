import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { getAdminClient, isAdminEmail } from "@/lib/supabase-admin";

export const runtime = "nodejs";

interface CreateBody {
  plays_granted: number;
  package_name?: string;
  count?: number; // عدد الأكواد المطلوب إنشاؤها مرة واحدة
  expires_at?: string | null;
  notes?: string;
}

const CHARS = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

function generateCode(): string {
  // التنسيق: NN-XXXX-NN  مثل NN-A7K9-2P
  const seg = (n: number) =>
    Array.from(
      { length: n },
      () => CHARS[Math.floor(Math.random() * CHARS.length)],
    ).join("");
  return `NN-${seg(4)}-${seg(2)}`;
}

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !isAdminEmail(user.email)) return null;
  return user;
}

// قائمة الأكواد
export async function GET() {
  const user = await requireAdmin();
  if (!user) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const admin = getAdminClient();
  const { data, error } = await admin
    .from("access_codes")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(500);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ codes: data ?? [] });
}

// إنشاء كود جديد (أو دفعة أكواد)
export async function POST(req: Request) {
  const user = await requireAdmin();
  if (!user) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = (await req.json()) as CreateBody;
  const {
    plays_granted,
    package_name,
    count = 1,
    expires_at,
    notes,
  } = body;

  if (!plays_granted || plays_granted < 1 || plays_granted > 1000) {
    return NextResponse.json(
      { error: "عدد الألعاب يجب أن يكون بين 1 و 1000" },
      { status: 400 },
    );
  }

  if (count < 1 || count > 200) {
    return NextResponse.json(
      { error: "عدد الأكواد يجب أن يكون بين 1 و 200" },
      { status: 400 },
    );
  }

  const admin = getAdminClient();
  const rows = Array.from({ length: count }).map(() => ({
    code: generateCode(),
    plays_granted,
    package_name: package_name || null,
    expires_at: expires_at || null,
    notes: notes || null,
  }));

  const { data, error } = await admin
    .from("access_codes")
    .insert(rows)
    .select("*");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ codes: data ?? [] });
}

// تعطيل/إلغاء كود
export async function PATCH(req: Request) {
  const user = await requireAdmin();
  if (!user) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id, is_active } = (await req.json()) as {
    id: string;
    is_active: boolean;
  };

  const admin = getAdminClient();
  const { error } = await admin
    .from("access_codes")
    .update({ is_active })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
