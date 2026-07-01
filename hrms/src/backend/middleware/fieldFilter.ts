/**
 * ترشيح الحقول على مستوى الصلاحية (Field-Level RBAC).
 *
 * المدير المباشر (MANAGER) ورئيس القسم (DEPARTMENT_HEAD) والموظف (EMPLOYEE)
 * يطّلعون على بيانات الموظفين ضمن نطاقهم، لكن يُمنعون منعاً باتاً من رؤية
 * الحقول المالية والبنكية. هذه الحقول مقصورة على HR_ADMIN و SUPER_ADMIN.
 *
 * يعمل الترشيح بإزالة المفاتيح الحساسة أينما ظهرت في شجرة الاستجابة (بما في
 * ذلك السجلات المتداخلة مثل سجلات الرواتب داخل كائن الموظف أو العكس)، فلا
 * تصل القيم إلى العميل إطلاقاً بدلاً من إخفائها في الواجهة فقط.
 */

import type { Request, Response, NextFunction } from 'express';
import type { UserRole } from '@prisma/client';

/** الأدوار التي يحقّ لها رؤية الحقول المالية والبنكية. */
const PRIVILEGED_ROLES: ReadonlySet<UserRole> = new Set<UserRole>([
  'HR_ADMIN',
  'SUPER_ADMIN',
]);

/**
 * الحقول الحساسة المزالة. تغطي حقول الموظف (Employee) المالية والبنكية،
 * وكذلك حقول سجل الرواتب (PayrollRecord) كاملةً لأنها مالية بطبيعتها.
 */
const SENSITIVE_FIELDS: ReadonlySet<string> = new Set<string>([
  // حقول الموظف
  'baseSalary',
  'housingAllowance',
  'transportAllowance',
  'foodAllowance',
  'otherAllowances',
  'bankName',
  'ibanNumber',
  // حقول سجل الرواتب الإضافية
  'iban',
  'grossSalary',
  'gosiDeduction',
  'taxDeduction',
  'loanDeduction',
  'otherDeductions',
  'deductionDetails',
  'netSalary',
  'overtimePay',
  'paymentReference',
]);

export function canViewFinancialFields(role: UserRole | undefined): boolean {
  return role !== undefined && PRIVILEGED_ROLES.has(role);
}

/**
 * يحدد ما إذا كانت القيمة كائناً عادياً (Plain Object) قابلاً للمرور خلاله،
 * مقابل الأنواع التي تُمرَّر كما هي (Date، Decimal، المصفوفات، القيم الأولية).
 */
function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== 'object') return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

/**
 * يُرجع نسخة مرشَّحة من القيمة دون تعديل الأصل، مع إزالة المفاتيح الحساسة من
 * كل كائن عادي ضمن الشجرة. يدعم التداخل والمصفوفات ويتجنّب الحلقات الدائرية.
 */
export function filterSensitiveFields<T>(data: T, role: UserRole | undefined, seen = new WeakSet<object>()): T {
  if (canViewFinancialFields(role)) {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map((item) => filterSensitiveFields(item, role, seen)) as unknown as T;
  }

  if (isPlainObject(data)) {
    if (seen.has(data)) return data;
    seen.add(data);

    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
      if (SENSITIVE_FIELDS.has(key)) continue; // تُحذف نهائياً.
      result[key] = filterSensitiveFields(value, role, seen);
    }
    return result as T;
  }

  // Date، Decimal، القيم الأولية، null → تُمرَّر كما هي.
  return data;
}

/**
 * Middleware يعترض res.json ويُطبّق الترشيح بناءً على دور المستخدم قبل الإرسال.
 * يُركّب بعد طبقة المصادقة وقبل المسارات (routes).
 *
 * مبدأ الأمان الافتراضي: غياب المستخدم يعني عدم الكشف (يُعامَل كغير مخوّل).
 */
export function fieldFilterMiddleware(req: Request, res: Response, next: NextFunction): void {
  const role = req.user?.role;

  if (canViewFinancialFields(role)) {
    return next(); // لا حاجة للترشيح للأدوار المخوّلة.
  }

  const originalJson = res.json.bind(res);
  res.json = (body: unknown) => originalJson(filterSensitiveFields(body, role));

  next();
}
