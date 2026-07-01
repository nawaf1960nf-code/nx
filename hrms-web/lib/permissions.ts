import type { UserRole } from "./types";

export type Permission =
  | "MANAGE_COMPANIES" // إدارة الشركات المشتركة (مدير النظام)
  | "FINANCIAL_VIEW" // رؤية الحقول المالية والبنكية
  | "EMPLOYEE_VIEW"
  | "EMPLOYEE_EDIT"
  | "SETTINGS_MANAGE";

const ROLE_PERMISSIONS: Record<UserRole, readonly Permission[]> = {
  SUPER_ADMIN: ["MANAGE_COMPANIES", "FINANCIAL_VIEW", "EMPLOYEE_VIEW", "EMPLOYEE_EDIT", "SETTINGS_MANAGE"],
  HR_ADMIN: ["FINANCIAL_VIEW", "EMPLOYEE_VIEW", "EMPLOYEE_EDIT", "SETTINGS_MANAGE"],
  MANAGER: ["EMPLOYEE_VIEW"],
  EMPLOYEE: [],
};

export function roleHasPermission(role: UserRole | undefined, permission: Permission): boolean {
  if (!role) return false;
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export const ROLE_LABELS: Record<UserRole, string> = {
  SUPER_ADMIN: "مدير النظام",
  HR_ADMIN: "الموارد البشرية",
  MANAGER: "مدير مباشر",
  EMPLOYEE: "موظف",
};
