/**
 * محرّك التقارير: يجمع بين التقارير القياسية الجاهزة والتقارير الديناميكية
 * التي يبنيها المستخدم باختيار الأعمدة والفلاتر ثم تصديرها.
 *
 * الأمان: جميع الأعمدة والفلاتر تمرّ عبر قوائم سماح (whitelist) صارمة لكل
 * كيان لمنع تسريب الحقول الحساسة أو حقن استعلامات غير مقصودة.
 */

import type { Request, Response } from 'express';
import { prisma } from '../config/database';
import { calculateEosProvision, sumWage } from '../services/eos.service';

type ExportFormat = 'json' | 'csv';

interface ReportDefinition {
  /** اسم نموذج Prisma. */
  model: string;
  /** الأعمدة المسموح إظهارها مع تسمياتها العربية. */
  columns: Record<string, string>;
  /** الحقول المسموح الفلترة عليها وأنواعها. */
  filters: Record<string, 'string' | 'enum' | 'date' | 'number' | 'boolean'>;
  /** أعمدة افتراضية إن لم يحدد المستخدم. */
  defaultColumns: string[];
}

/**
 * سجلّ الكيانات المتاحة للتقارير الديناميكية.
 */
const REPORT_REGISTRY: Record<string, ReportDefinition> = {
  employees: {
    model: 'employee',
    columns: {
      employeeNumber: 'الرقم الوظيفي',
      displayName: 'الاسم',
      nameInEnglish: 'الاسم بالإنجليزية',
      nationality: 'الجنسية',
      employmentType: 'نوع التوظيف',
      status: 'الحالة',
      hireDate: 'تاريخ التعيين',
      baseSalary: 'الراتب الأساسي',
      departmentId: 'القسم',
      positionId: 'المسمى الوظيفي',
      regionId: 'الفرع',
    },
    filters: {
      status: 'enum',
      employmentType: 'enum',
      departmentId: 'string',
      regionId: 'string',
      gender: 'enum',
      hireDate: 'date',
    },
    defaultColumns: ['employeeNumber', 'displayName', 'departmentId', 'status', 'hireDate'],
  },
  attendance: {
    model: 'attendanceRecord',
    columns: {
      employeeId: 'الموظف',
      date: 'التاريخ',
      checkIn: 'الحضور',
      checkOut: 'الانصراف',
      status: 'الحالة',
      lateMinutes: 'دقائق التأخير',
      earlyDepartureMinutes: 'دقائق التبكير',
      overtimeMinutes: 'دقائق العمل الإضافي',
    },
    filters: {
      employeeId: 'string',
      status: 'enum',
      date: 'date',
    },
    defaultColumns: ['employeeId', 'date', 'status', 'lateMinutes', 'overtimeMinutes'],
  },
  leaves: {
    model: 'leaveRequest',
    columns: {
      employeeId: 'الموظف',
      leaveTypeId: 'نوع الإجازة',
      startDate: 'من تاريخ',
      endDate: 'إلى تاريخ',
      totalDays: 'عدد الأيام',
      status: 'الحالة',
    },
    filters: {
      employeeId: 'string',
      leaveTypeId: 'string',
      status: 'enum',
      startDate: 'date',
    },
    defaultColumns: ['employeeId', 'leaveTypeId', 'startDate', 'endDate', 'totalDays', 'status'],
  },
  payroll: {
    model: 'payrollRecord',
    columns: {
      employeeId: 'الموظف',
      grossSalary: 'إجمالي الراتب',
      gosiDeduction: 'خصم التأمينات',
      loanDeduction: 'خصم السلف',
      netSalary: 'صافي الراتب',
      status: 'الحالة',
    },
    filters: {
      employeeId: 'string',
      payrollPeriodId: 'string',
      status: 'enum',
    },
    defaultColumns: ['employeeId', 'grossSalary', 'gosiDeduction', 'netSalary', 'status'],
  },
};

interface DynamicReportBody {
  entity: string;
  columns?: string[];
  filters?: Record<string, unknown>;
  format?: ExportFormat;
  orderBy?: { field: string; direction: 'asc' | 'desc' };
  limit?: number;
}

/**
 * بناء شرط where الخاص بـ Prisma من الفلاتر المسموح بها فقط.
 */
function buildWhere(
  def: ReportDefinition,
  filters: Record<string, unknown> = {},
): Record<string, unknown> {
  const where: Record<string, unknown> = {};

  for (const [field, rawValue] of Object.entries(filters)) {
    const type = def.filters[field];
    if (!type || rawValue === undefined || rawValue === null || rawValue === '') {
      continue; // تجاهل أي فلتر غير مُصرّح به.
    }

    if (type === 'date' && typeof rawValue === 'object') {
      const range = rawValue as { from?: string; to?: string };
      const condition: Record<string, Date> = {};
      if (range.from) condition.gte = new Date(range.from);
      if (range.to) condition.lte = new Date(range.to);
      if (Object.keys(condition).length) where[field] = condition;
    } else if (type === 'number') {
      where[field] = Number(rawValue);
    } else if (type === 'boolean') {
      where[field] = rawValue === true || rawValue === 'true';
    } else {
      where[field] = rawValue;
    }
  }

  return where;
}

/**
 * بناء select الخاص بـ Prisma من الأعمدة المطلوبة بعد التحقق من القائمة.
 */
function buildSelect(def: ReportDefinition, requested?: string[]): Record<string, boolean> {
  const allowed = requested?.length
    ? requested.filter((col) => col in def.columns)
    : def.defaultColumns;

  const finalColumns = allowed.length ? allowed : def.defaultColumns;
  return finalColumns.reduce<Record<string, boolean>>((acc, col) => {
    acc[col] = true;
    return acc;
  }, {});
}

function toCsv(rows: Record<string, unknown>[], headers: string[]): string {
  const escape = (value: unknown): string => {
    if (value === null || value === undefined) return '';
    const str = value instanceof Date ? value.toISOString() : String(value);
    return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
  };

  const headerLine = headers.join(',');
  const lines = rows.map((row) => headers.map((h) => escape(row[h])).join(','));
  return [headerLine, ...lines].join('\n');
}

/**
 * POST /api/reports/dynamic — تقرير ديناميكي قابل للتخصيص.
 */
export async function generateDynamicReport(req: Request, res: Response): Promise<Response> {
  const body = req.body as DynamicReportBody;
  const def = REPORT_REGISTRY[body.entity];

  if (!def) {
    return res.status(400).json({
      message: 'نوع التقرير غير معروف.',
      availableEntities: Object.keys(REPORT_REGISTRY),
    });
  }

  const where = buildWhere(def, body.filters);
  const select = buildSelect(def, body.columns);
  const selectedColumns = Object.keys(select);

  const orderBy =
    body.orderBy && body.orderBy.field in def.columns
      ? { [body.orderBy.field]: body.orderBy.direction === 'desc' ? 'desc' : 'asc' }
      : undefined;

  const limit = Math.min(Math.max(Number(body.limit) || 1000, 1), 10000);

  // الوصول الديناميكي لنموذج Prisma بعد التحقق من اسمه ضمن السجلّ.
  const model = (prisma as Record<string, any>)[def.model];
  const rows: Record<string, unknown>[] = await model.findMany({
    where,
    select,
    orderBy,
    take: limit,
  });

  if ((body.format ?? 'json') === 'csv') {
    const csv = toCsv(rows, selectedColumns);
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${body.entity}-report.csv"`);
    return res.status(200).send('﻿' + csv); // BOM لدعم العربية في Excel.
  }

  return res.status(200).json({
    entity: body.entity,
    columns: selectedColumns.map((col) => ({ field: col, label: def.columns[col] })),
    count: rows.length,
    rows,
  });
}

/**
 * GET /api/reports/headcount — تعداد الموظفين حسب القسم والحالة.
 */
export async function headcountReport(_req: Request, res: Response): Promise<Response> {
  const [byDepartment, byStatus, byType, total] = await Promise.all([
    prisma.employee.groupBy({ by: ['departmentId'], _count: { _all: true } }),
    prisma.employee.groupBy({ by: ['status'], _count: { _all: true } }),
    prisma.employee.groupBy({ by: ['employmentType'], _count: { _all: true } }),
    prisma.employee.count(),
  ]);

  return res.status(200).json({
    total,
    byDepartment: byDepartment.map((r) => ({ departmentId: r.departmentId, count: r._count._all })),
    byStatus: byStatus.map((r) => ({ status: r.status, count: r._count._all })),
    byEmploymentType: byType.map((r) => ({ type: r.employmentType, count: r._count._all })),
  });
}

/**
 * GET /api/reports/eos-provision — تقرير مخصص نهاية الخدمة لجميع الموظفين على رأس العمل.
 */
export async function eosProvisionReport(req: Request, res: Response): Promise<Response> {
  const asOf = req.query.asOf ? new Date(String(req.query.asOf)) : new Date();

  const employees = await prisma.employee.findMany({
    where: { status: { in: ['ACTIVE', 'ON_PROBATION', 'ON_LEAVE'] } },
    select: {
      id: true,
      employeeNumber: true,
      displayName: true,
      hireDate: true,
      baseSalary: true,
      housingAllowance: true,
      transportAllowance: true,
      foodAllowance: true,
      otherAllowances: true,
    },
  });

  const rows = employees.map((emp) => {
    const wage = {
      baseSalary: Number(emp.baseSalary),
      housingAllowance: Number(emp.housingAllowance),
      transportAllowance: Number(emp.transportAllowance),
      foodAllowance: Number(emp.foodAllowance),
      otherAllowances: Number(emp.otherAllowances),
    };
    const result = calculateEosProvision(emp.hireDate, wage, asOf);
    return {
      employeeNumber: emp.employeeNumber,
      displayName: emp.displayName,
      monthlyWage: sumWage(wage),
      yearsOfService: result.yearsOfService,
      provisionAmount: result.totalPayable,
    };
  });

  const totalProvision = rows.reduce((sum, r) => sum + r.provisionAmount, 0);

  return res.status(200).json({
    asOf: asOf.toISOString(),
    employeeCount: rows.length,
    totalProvision: Math.round((totalProvision + Number.EPSILON) * 100) / 100,
    rows,
  });
}
