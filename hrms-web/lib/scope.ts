"use client";

import { useStore } from "@/store/useStore";

/**
 * معرّف الشركة قيد العرض: لمستخدم الشركة هو شركته، ولمدير النظام هو الشركة
 * التي اختارها من المبدّل العلوي.
 */
export function useScopedCompanyId(): string | null {
  const currentUser = useStore((s) => s.currentUser);
  const activeCompanyId = useStore((s) => s.activeCompanyId);
  return currentUser?.companyId ?? activeCompanyId ?? null;
}
