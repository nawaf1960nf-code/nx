import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// نستخدم SupabaseClient بدون Database generic لتفادي
// مشاكل توليد الأنواع المُعقّدة - الجداول موثّقة في supabase-types.ts
let cachedClient: SupabaseClient | null = null;

/**
 * عميل Supabase بصلاحيات service_role (يتجاوز RLS).
 * يُستخدم فقط في API routes للعمليات الحساسة.
 */
export function getAdminClient(): SupabaseClient {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY غير مضاف في متغيرات البيئة",
    );
  }
  if (!cachedClient) {
    cachedClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: { autoRefreshToken: false, persistSession: false },
      },
    );
  }
  return cachedClient;
}

export const ADMIN_EMAIL = "nawaf1960nf@gmail.com";

export function isAdminEmail(email: string | null | undefined): boolean {
  return email?.toLowerCase().trim() === ADMIN_EMAIL.toLowerCase();
}
