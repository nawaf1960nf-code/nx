/**
 * خدمة السجل الزمني للموظف (Employee Timeline).
 *
 * تجمع أحداث الموظف من عدة جداول (الحضور، الإجازات، التقييمات، الطلبات
 * العامة، السلف) وتدمجها في مصفوفة واحدة مرتّبة تنازلياً حسب تاريخ الحدث،
 * جاهزة للعرض في سجل زمني عمودي.
 */

import { prisma } from '../config/database';

export type TimelineEventType =
  | 'ATTENDANCE'
  | 'LEAVE'
  | 'PERFORMANCE'
  | 'REQUEST'
  | 'LOAN';

export interface TimelineEvent {
  id: string;
  type: TimelineEventType;
  category: string; // تصنيف فرعي مثل LATE أو ABSENT
  title: string;
  description?: string;
  date: string; // ISO 8601
}

const REQUEST_TYPE_LABELS: Record<string, string> = {
  SALARY_CERTIFICATE: 'شهادة راتب',
  EMPLOYMENT_CERTIFICATE: 'شهادة عمل',
  EXPERIENCE_CERTIFICATE: 'شهادة خبرة',
  SALARY_DEFINITION: 'تعريف بالراتب',
  LOAN: 'سلفة',
  ADVANCE: 'سلفة مالية',
  OTHER: 'طلب',
};

/** صياغة عدد الأيام بالعربية بشكل طبيعي. */
function arabicDays(count: number): string {
  if (count === 1) return 'يوماً واحداً';
  if (count === 2) return 'يومين';
  if (count >= 3 && count <= 10) return `${count} أيام`;
  return `${count} يوماً`;
}

/** صياغة مبلغ مالي بالريال. */
function formatSar(amount: number): string {
  return `${amount.toLocaleString('en-US')} ريال`;
}

/**
 * يجمع السجل الزمني الكامل للموظف مرتّباً من الأحدث إلى الأقدم.
 */
export async function getEmployeeTimeline(employeeId: string): Promise<TimelineEvent[]> {
  const [attendance, leaves, reviews, requests, loans] = await Promise.all([
    prisma.attendanceRecord.findMany({
      where: {
        employeeId,
        status: { in: ['LATE', 'ABSENT', 'EARLY_DEPARTURE'] },
      },
      select: {
        id: true,
        date: true,
        status: true,
        lateMinutes: true,
        earlyDepartureMinutes: true,
      },
      orderBy: { date: 'desc' },
      take: 100,
    }),

    prisma.leaveRequest.findMany({
      where: { employeeId, status: 'APPROVED' },
      select: {
        id: true,
        totalDays: true,
        startDate: true,
        approvedAt: true,
        createdAt: true,
        leaveType: { select: { name: true } },
      },
      orderBy: { startDate: 'desc' },
    }),

    prisma.performanceReview.findMany({
      where: { employeeId, status: 'COMPLETED' },
      select: {
        id: true,
        finalRating: true,
        updatedAt: true,
        cycle: { select: { name: true } },
      },
      orderBy: { updatedAt: 'desc' },
    }),

    prisma.generalRequest.findMany({
      where: { employeeId, status: 'APPROVED' },
      select: { id: true, type: true, title: true, updatedAt: true },
      orderBy: { updatedAt: 'desc' },
    }),

    prisma.loanRequest.findMany({
      where: { employeeId, status: 'APPROVED' },
      select: { id: true, amount: true, installments: true, updatedAt: true },
      orderBy: { updatedAt: 'desc' },
    }),
  ]);

  const events: TimelineEvent[] = [];

  // الحضور: التأخير والغياب والانصراف المبكر.
  for (const record of attendance) {
    let title: string;
    if (record.status === 'LATE') {
      title = `تأخر ${record.lateMinutes} دقيقة`;
    } else if (record.status === 'EARLY_DEPARTURE') {
      title = `انصراف مبكر بـ ${record.earlyDepartureMinutes} دقيقة`;
    } else {
      title = 'غياب بدون تسجيل حضور';
    }
    events.push({
      id: `attendance:${record.id}`,
      type: 'ATTENDANCE',
      category: record.status,
      title,
      date: record.date.toISOString(),
    });
  }

  // الإجازات المعتمدة.
  for (const leave of leaves) {
    const days = Math.round(leave.totalDays);
    events.push({
      id: `leave:${leave.id}`,
      type: 'LEAVE',
      category: 'APPROVED',
      title: `تم اعتماد ${leave.leaveType.name} لمدة ${arabicDays(days)}`,
      date: (leave.approvedAt ?? leave.startDate ?? leave.createdAt).toISOString(),
    });
  }

  // التقييمات المكتملة.
  for (const review of reviews) {
    const rating = review.finalRating != null ? review.finalRating : '—';
    events.push({
      id: `review:${review.id}`,
      type: 'PERFORMANCE',
      category: 'COMPLETED',
      title: `اكتمل تقييم ${review.cycle.name} بتقييم ${rating}`,
      date: review.updatedAt.toISOString(),
    });
  }

  // الطلبات العامة المعتمدة.
  for (const request of requests) {
    const label = REQUEST_TYPE_LABELS[request.type] ?? 'طلب';
    events.push({
      id: `request:${request.id}`,
      type: 'REQUEST',
      category: request.type,
      title: `تم اعتماد ${label}`,
      description: request.title,
      date: request.updatedAt.toISOString(),
    });
  }

  // السلف المعتمدة.
  for (const loan of loans) {
    events.push({
      id: `loan:${loan.id}`,
      type: 'LOAN',
      category: 'APPROVED',
      title: `تم اعتماد سلفة بقيمة ${formatSar(Number(loan.amount))}`,
      description: `على ${loan.installments} قسط`,
      date: loan.updatedAt.toISOString(),
    });
  }

  // الترتيب التنازلي حسب تاريخ الحدث.
  events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return events;
}
