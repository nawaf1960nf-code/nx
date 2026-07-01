import { useAuthStore } from '../store/auth.store';
import { roleHasPermission, type Permission, type UserRole } from '../lib/permissions';

/**
 * خطّاف الصلاحيات: يربط دور المستخدم الحالي بدالة فحص الصلاحيات لاستخدامها
 * في التحكم بإظهار/إخفاء العناصر على مستوى المكوّن.
 *
 * مثال: const { hasPermission } = usePermissions();
 *       if (hasPermission('FINANCIAL_VIEW')) { ... }
 */
export function usePermissions(): {
  role: UserRole | undefined;
  hasPermission: (permission: Permission) => boolean;
} {
  const role = useAuthStore((state) => state.user?.role);
  return {
    role,
    hasPermission: (permission: Permission) => roleHasPermission(role, permission),
  };
}
