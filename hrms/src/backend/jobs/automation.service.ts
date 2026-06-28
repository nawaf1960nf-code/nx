/**
 * خدمة الأتمتة: تحتوي المنطق الفعلي للمهام المجدولة. كل دالة قابلة للتشغيل
 * يدوياً (لإعادة المعالجة) أو عبر طابور BullMQ من المُجدول.
 *
 * جميع الحسابات اليومية تستند إلى اليوم التقويمي بتوقيت الرياض، مع حماية من
 * التكرار (Idempotency) عبر تسجيل آخر يوم تشغيل في جدول SystemSettings.
 */

import { Prisma } from '@prisma/client';
import { prisma } from '../config/database';
import { addDays, riyadhDateKey, riyadhDayRange, getRiyadhDateParts, riyadhWeekday } from '../utils/datetime';

const ACTIVE_EMPLOYEE_STATUSES = ['ACTIVE', 'ON_PROBATION', 'ON_LEAVE'] as const;
const DEFAULT_WEEKEND = ['friday', 'saturday'];
const DOCUMENT_EXPIRY_THRESHOLD_DAYS = 30;

interface NotificationDraft {
  title: string;
  body: string;
  type: 'ATTENDANCE_ALERT' | 'DOCUMENT_EXPIRY' | 'LEAVE_ACCRUAL';
  data?: Record<string, unknown>;
}

/**
 * يضمن تشغيل المهمة مرة واحدة فقط في اليوم نفسه؛ يعيد false إذا سبق تشغيلها.
 */
async function claimDailyRun(jobKey: string, dateKey: string): Promise<boolean> {
  const key = `automation:lastRun:${jobKey}`;
  const existing = await prisma.systemSettings.findUnique({ where: { key } });
  const stored = existing?.value as Prisma.JsonObject | null;
  if (stored?.date === dateKey) {
    return false;
  }
  await prisma.systemSettings.upsert({
    where: { key },
    create: { key, value: { date: dateKey }, category: 'AUTOMATION' },
    update: { value: { date: dateKey } },
  });
  return true;
}

/** معرّفات مستخدمي الموارد البشرية النشطين (لإرسال التنبيهات إليهم). */
async function getHrUserIds(): Promise<string[]> {
  const users = await prisma.user.findMany({
    where: { roleId: { in: ['HR_ADMIN', 'SUPER_ADMIN'] }, status: 'ACTIVE' },
    select: { id: true },
  });
  return users.map((u) => u.id);
}

/** إنشاء إشعارات لمجموعة مستخدمين بعد إزالة المعرّفات الفارغة والمكرّرة. */
async function createNotifications(
  recipientUserIds: (string | null | undefined)[],
  draft: NotificationDraft,
): Promise<number> {
  const ids = Array.from(
    new Set(recipientUserIds.filter((id): id is string => Boolean(id))),
  );
  if (ids.length === 0) return 0;

  await prisma.notification.createMany({
    data: ids.map((userId) => ({
      userId,
      title: draft.title,
      body: draft.body,
      type: draft.type,
      data: (draft.data ?? {}) as Prisma.InputJsonValue,
    })),
  });
  return ids.length;
}

// ════════════════════════════════════════════════════════════════════
// 1) استحقاق أرصدة الإجازات
// ════════════════════════════════════════════════════════════════════

export interface AccrualSummary {
  ranAt: string;
  yearlyAccrued: number;
  monthlyAccrued: number;
  employees: number;
  leaveTypes: number;
  skipped: boolean;
}

/**
 * زيادة رصيد الإجازات لكل موظف نشط بناءً على نوع الاستحقاق:
 *  - ANNUAL / FRONT_LOADED: تُحمّل الأيام السنوية كاملةً في أول شهر من السنة
 *    المالية، مع ترحيل الرصيد المتبقي من السنة السابقة عند السماح بذلك.
 *  - MONTHLY: يُضاف جزء شهري (الأيام السنوية ÷ 12) في بداية كل شهر.
 *
 * تُستدعى من المُجدول في اليوم الأول من كل شهر.
 */
export async function accrueLeaveBalances(referenceDate: Date = new Date()): Promise<AccrualSummary> {
  const dateKey = riyadhDateKey(referenceDate);
  const { year, month } = getRiyadhDateParts(referenceDate);

  if (!(await claimDailyRun('accrue-leave', dateKey))) {
    return {
      ranAt: dateKey,
      yearlyAccrued: 0,
      monthlyAccrued: 0,
      employees: 0,
      leaveTypes: 0,
      skipped: true,
    };
  }

  const company = await prisma.companySettings.findFirst();
  const fiscalYearStart = company?.fiscalYearStart ?? 1;
  const isFiscalYearStart = month === fiscalYearStart;

  const [leaveTypes, employees] = await Promise.all([
    prisma.leaveType.findMany({ where: { status: true } }),
    prisma.employee.findMany({
      where: { status: { in: [...ACTIVE_EMPLOYEE_STATUSES] }, deletedAt: null },
      select: { id: true, userId: true },
    }),
  ]);

  let yearlyAccrued = 0;
  let monthlyAccrued = 0;

  for (const leaveType of leaveTypes) {
    const isYearly = leaveType.accrualType === 'ANNUAL' || leaveType.accrualType === 'FRONT_LOADED';
    const isMonthly = leaveType.accrualType === 'MONTHLY';

    // الاستحقاق السنوي يُنفّذ فقط في بداية السنة المالية.
    if (isYearly && !isFiscalYearStart) continue;

    for (const employee of employees) {
      if (isYearly) {
        const previous = await prisma.leaveBalance.findUnique({
          where: {
            employeeId_leaveTypeId_year: {
              employeeId: employee.id,
              leaveTypeId: leaveType.id,
              year: year - 1,
            },
          },
        });

        let carried = 0;
        if (leaveType.isCarryForward && previous) {
          const cap = leaveType.carryForwardMaxDays ?? previous.remainingDays;
          carried = Math.max(0, Math.min(previous.remainingDays, cap));
        }

        const total = leaveType.maxDaysPerYear;
        await prisma.leaveBalance.upsert({
          where: {
            employeeId_leaveTypeId_year: {
              employeeId: employee.id,
              leaveTypeId: leaveType.id,
              year,
            },
          },
          create: {
            employeeId: employee.id,
            leaveTypeId: leaveType.id,
            year,
            totalDays: total,
            usedDays: 0,
            pendingDays: 0,
            carriedForwardDays: carried,
            remainingDays: total + carried,
          },
          update: {
            totalDays: total,
            carriedForwardDays: carried,
            remainingDays: total + carried,
          },
        });
        yearlyAccrued += 1;
      } else if (isMonthly) {
        const monthlyAmount = leaveType.maxDaysPerYear / 12;
        const existing = await prisma.leaveBalance.findUnique({
          where: {
            employeeId_leaveTypeId_year: {
              employeeId: employee.id,
              leaveTypeId: leaveType.id,
              year,
            },
          },
        });

        if (existing) {
          await prisma.leaveBalance.update({
            where: { id: existing.id },
            data: {
              totalDays: existing.totalDays + monthlyAmount,
              remainingDays: existing.remainingDays + monthlyAmount,
            },
          });
        } else {
          await prisma.leaveBalance.create({
            data: {
              employeeId: employee.id,
              leaveTypeId: leaveType.id,
              year,
              totalDays: monthlyAmount,
              usedDays: 0,
              pendingDays: 0,
              carriedForwardDays: 0,
              remainingDays: monthlyAmount,
            },
          });
        }
        monthlyAccrued += 1;
      }
    }
  }

  return {
    ranAt: dateKey,
    yearlyAccrued,
    monthlyAccrued,
    employees: employees.length,
    leaveTypes: leaveTypes.length,
    skipped: false,
  };
}

// ════════════════════════════════════════════════════════════════════
// 2) رصد الغياب
// ════════════════════════════════════════════════════════════════════

export interface AbsenteeSummary {
  ranAt: string;
  checked: number;
  absentees: number;
  notificationsSent: number;
  skipped: boolean;
}

/**
 * البحث عن الموظفين الذين لا سجل حضور لهم في يوم العمل الحالي مع تجاهل
 * أيام العطلة الأسبوعية (حسب سياسة الوردية) والإجازات المعتمدة، ثم إنشاء
 * تنبيه غياب للمدير المباشر وللموارد البشرية.
 *
 * تُستدعى يومياً الساعة 11:00 صباحاً بتوقيت الرياض.
 */
export async function checkAbsentees(referenceDate: Date = new Date()): Promise<AbsenteeSummary> {
  const dateKey = riyadhDateKey(referenceDate);
  if (!(await claimDailyRun('check-absentees', dateKey))) {
    return { ranAt: dateKey, checked: 0, absentees: 0, notificationsSent: 0, skipped: true };
  }

  const { start, end } = riyadhDayRange(referenceDate);
  const todayWeekday = riyadhWeekday(referenceDate);

  const employees = await prisma.employee.findMany({
    where: { status: { in: [...ACTIVE_EMPLOYEE_STATUSES] }, deletedAt: null },
    select: {
      id: true,
      userId: true,
      displayName: true,
      employeeNumber: true,
      reportingTo: { select: { userId: true } },
      workShift: { select: { policy: { select: { weekendDays: true } } } },
    },
  });

  const hrUserIds = await getHrUserIds();
  let absentees = 0;
  let notificationsSent = 0;

  for (const employee of employees) {
    const weekendDays = parseWeekend(employee.workShift?.policy?.weekendDays);
    if (weekendDays.includes(todayWeekday)) continue; // عطلة أسبوعية.

    // إجازة معتمدة تغطي اليوم الحالي.
    const onLeave = await prisma.leaveRequest.findFirst({
      where: {
        employeeId: employee.id,
        status: 'APPROVED',
        startDate: { lt: end },
        endDate: { gte: start },
        deletedAt: null,
      },
      select: { id: true },
    });
    if (onLeave) continue;

    // سجل حضور لليوم الحالي.
    const attendance = await prisma.attendanceRecord.findFirst({
      where: { employeeId: employee.id, date: { gte: start, lt: end } },
      select: { id: true },
    });
    if (attendance) continue;

    absentees += 1;
    notificationsSent += await createNotifications([employee.reportingTo?.userId, ...hrUserIds], {
      title: 'تنبيه غياب',
      body: `الموظف ${employee.displayName} (${employee.employeeNumber}) لا يملك تسجيل حضور لليوم.`,
      type: 'ATTENDANCE_ALERT',
      data: { employeeId: employee.id, date: dateKey },
    });
  }

  return { ranAt: dateKey, checked: employees.length, absentees, notificationsSent, skipped: false };
}

function parseWeekend(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((d) => String(d).toLowerCase());
  }
  return DEFAULT_WEEKEND;
}

// ════════════════════════════════════════════════════════════════════
// 3) رصد المستندات المنتهية
// ════════════════════════════════════════════════════════════════════

export interface ExpirySummary {
  ranAt: string;
  documents: number;
  iqamaExpiries: number;
  contractExpiries: number;
  notificationsSent: number;
  skipped: boolean;
}

/**
 * البحث عن المستندات وحقول التواريخ التي تنتهي خلال 30 يوماً (مستندات
 * الموظف، انتهاء الإقامة idExpiryDate، انتهاء العقد contractEndDate) وإنشاء
 * تنبيه انتهاء صلاحية للموارد البشرية وللموظف المعني.
 *
 * تُستدعى يومياً.
 */
export async function checkExpiringDocuments(referenceDate: Date = new Date()): Promise<ExpirySummary> {
  const dateKey = riyadhDateKey(referenceDate);
  if (!(await claimDailyRun('check-expiring-documents', dateKey))) {
    return {
      ranAt: dateKey,
      documents: 0,
      iqamaExpiries: 0,
      contractExpiries: 0,
      notificationsSent: 0,
      skipped: true,
    };
  }

  const { start } = riyadhDayRange(referenceDate);
  const windowEnd = addDays(start, DOCUMENT_EXPIRY_THRESHOLD_DAYS);
  const hrUserIds = await getHrUserIds();

  let notificationsSent = 0;

  // مستندات الموظفين.
  const documents = await prisma.document.findMany({
    where: { expiryDate: { gte: start, lte: windowEnd }, deletedAt: null },
    select: {
      id: true,
      name: true,
      type: true,
      expiryDate: true,
      employee: { select: { id: true, userId: true, displayName: true } },
    },
  });

  for (const doc of documents) {
    notificationsSent += await createNotifications([doc.employee.userId, ...hrUserIds], {
      title: 'انتهاء صلاحية مستند',
      body: `مستند "${doc.name}" للموظف ${doc.employee.displayName} ينتهي بتاريخ ${formatDate(doc.expiryDate)}.`,
      type: 'DOCUMENT_EXPIRY',
      data: { documentId: doc.id, documentType: doc.type, employeeId: doc.employee.id },
    });
  }

  // انتهاء الإقامة وانتهاء العقد على مستوى الموظف.
  const employees = await prisma.employee.findMany({
    where: {
      status: { in: [...ACTIVE_EMPLOYEE_STATUSES] },
      deletedAt: null,
      OR: [
        { idExpiryDate: { gte: start, lte: windowEnd } },
        { contractEndDate: { gte: start, lte: windowEnd } },
      ],
    },
    select: {
      id: true,
      userId: true,
      displayName: true,
      employeeNumber: true,
      idExpiryDate: true,
      contractEndDate: true,
    },
  });

  let iqamaExpiries = 0;
  let contractExpiries = 0;

  for (const employee of employees) {
    if (employee.idExpiryDate && employee.idExpiryDate >= start && employee.idExpiryDate <= windowEnd) {
      iqamaExpiries += 1;
      notificationsSent += await createNotifications([employee.userId, ...hrUserIds], {
        title: 'قرب انتهاء الإقامة',
        body: `إقامة الموظف ${employee.displayName} (${employee.employeeNumber}) تنتهي بتاريخ ${formatDate(employee.idExpiryDate)}.`,
        type: 'DOCUMENT_EXPIRY',
        data: { employeeId: employee.id, field: 'idExpiryDate' },
      });
    }

    if (
      employee.contractEndDate &&
      employee.contractEndDate >= start &&
      employee.contractEndDate <= windowEnd
    ) {
      contractExpiries += 1;
      notificationsSent += await createNotifications([employee.userId, ...hrUserIds], {
        title: 'قرب انتهاء العقد',
        body: `عقد الموظف ${employee.displayName} (${employee.employeeNumber}) ينتهي بتاريخ ${formatDate(employee.contractEndDate)}.`,
        type: 'DOCUMENT_EXPIRY',
        data: { employeeId: employee.id, field: 'contractEndDate' },
      });
    }
  }

  return {
    ranAt: dateKey,
    documents: documents.length,
    iqamaExpiries,
    contractExpiries,
    notificationsSent,
    skipped: false,
  };
}

function formatDate(date: Date | null): string {
  if (!date) return '—';
  return riyadhDateKey(date);
}
