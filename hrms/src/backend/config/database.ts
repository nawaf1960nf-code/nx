import { PrismaClient } from '@prisma/client';

/**
 * عميل Prisma وحيد (Singleton) مع Middleware للحذف المنطقي.
 *
 * الجداول التي تملك الحقل `deletedAt` تُعامل تلقائياً:
 *  - عمليات delete / deleteMany تتحوّل إلى update تضع deletedAt = now().
 *  - عمليات القراءة (find / count) تستثني السجلات المحذوفة ما لم يُطلب صراحةً
 *    تضمينها عبر تمرير `deletedAt` في شرط where.
 */

const SOFT_DELETE_MODELS = new Set<string>([
  'User',
  'Employee',
  'Department',
  'Position',
  'Branch',
  'LeaveRequest',
  'LoanRequest',
  'Document',
  'GeneralRequest',
  'Announcement',
]);

function buildClient(): PrismaClient {
  const prisma = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

  prisma.$use(async (params, next) => {
    const model = params.model;
    if (!model || !SOFT_DELETE_MODELS.has(model)) {
      return next(params);
    }

    // تحويل الحذف إلى تحديث لحقل deletedAt
    if (params.action === 'delete') {
      params.action = 'update';
      params.args = params.args ?? {};
      params.args.data = { deletedAt: new Date() };
    }

    if (params.action === 'deleteMany') {
      params.action = 'updateMany';
      params.args = params.args ?? {};
      params.args.data = { ...(params.args.data ?? {}), deletedAt: new Date() };
    }

    // استبعاد السجلات المحذوفة من القراءة افتراضياً
    if (params.action === 'findUnique' || params.action === 'findFirst') {
      params.action = params.action === 'findUnique' ? 'findFirst' : params.action;
      params.args = params.args ?? {};
      if (params.args.where?.deletedAt === undefined) {
        params.args.where = { ...params.args.where, deletedAt: null };
      }
    }

    if (params.action === 'findMany' || params.action === 'count') {
      params.args = params.args ?? {};
      if (!params.args.where) {
        params.args.where = { deletedAt: null };
      } else if (params.args.where.deletedAt === undefined) {
        params.args.where.deletedAt = null;
      }
    }

    return next(params);
  });

  return prisma;
}

declare global {
  // eslint-disable-next-line no-var
  var __hrmsPrisma: PrismaClient | undefined;
}

export const prisma = global.__hrmsPrisma ?? buildClient();

if (process.env.NODE_ENV !== 'production') {
  global.__hrmsPrisma = prisma;
}
