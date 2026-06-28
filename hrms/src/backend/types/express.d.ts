import type { UserRole } from '@prisma/client';

/**
 * توسعة نوع طلب Express لإضافة المستخدم المصادَق عليه الذي تحقنه طبقة
 * المصادقة (auth middleware) بعد التحقق من التوكن.
 */
export interface AuthenticatedUser {
  id: string;
  role: UserRole;
  employeeId?: string;
  departmentId?: string;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export {};
