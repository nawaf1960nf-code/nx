/**
 * تعريف الأدوار والصلاحيات على مستوى التطبيق.
 *
 * الصلاحيات مفصّلة (Fine-grained) لتمكين التحكم على مستوى الحقول والمكوّنات،
 * لا على مستوى الصفحات فقط. الصلاحية المالية (FINANCIAL_VIEW) مقصورة على
 * إدارة الموارد البشرية والمدير العام.
 */

export type UserRole = 'SUPER_ADMIN' | 'HR_ADMIN' | 'MANAGER' | 'DEPARTMENT_HEAD' | 'EMPLOYEE';

export type Permission =
  | 'FINANCIAL_VIEW'
  | 'FINANCIAL_EDIT'
  | 'EMPLOYEE_VIEW'
  | 'EMPLOYEE_EDIT'
  | 'PAYROLL_MANAGE'
  | 'REPORTS_VIEW';

const ROLE_PERMISSIONS: Record<UserRole, readonly Permission[]> = {
  SUPER_ADMIN: ['FINANCIAL_VIEW', 'FINANCIAL_EDIT', 'EMPLOYEE_VIEW', 'EMPLOYEE_EDIT', 'PAYROLL_MANAGE', 'REPORTS_VIEW'],
  HR_ADMIN: ['FINANCIAL_VIEW', 'FINANCIAL_EDIT', 'EMPLOYEE_VIEW', 'EMPLOYEE_EDIT', 'PAYROLL_MANAGE', 'REPORTS_VIEW'],
  DEPARTMENT_HEAD: ['EMPLOYEE_VIEW', 'REPORTS_VIEW'],
  MANAGER: ['EMPLOYEE_VIEW'],
  EMPLOYEE: [],
};

/** هل يملك الدور المحدد الصلاحية المطلوبة؟ */
export function roleHasPermission(role: UserRole | undefined, permission: Permission): boolean {
  if (!role) return false;
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}
