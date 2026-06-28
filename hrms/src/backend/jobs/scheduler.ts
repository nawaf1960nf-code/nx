/**
 * محرّك الجدولة: يربط مواقيت node-cron (بتوقيت الرياض) بطابور BullMQ.
 *
 * الفكرة: تعمل مواقيت cron كمشغّل خفيف لا يقوم بأي عمل ثقيل، بل يضيف مهمة
 * إلى الطابور فقط، بينما يتولّى الـ Worker تنفيذ المنطق الفعلي خارج مسار
 * الطلبات حتى لا يستهلك موارد السيرفر. ويُستخدم jobId يومي لمنع تكرار
 * الإضافة عند تشغيل أكثر من نسخة من التطبيق.
 */

import cron, { ScheduledTask } from 'node-cron';
import { Queue, Worker, Job } from 'bullmq';
import { bullConnection } from '../config/redis';
import { RIYADH_TZ, riyadhDateKey } from '../utils/datetime';
import {
  accrueLeaveBalances,
  checkAbsentees,
  checkExpiringDocuments,
} from './automation.service';

const QUEUE_NAME = 'automation';

export type AutomationJobName = 'accrue-leave' | 'check-absentees' | 'check-expiring-documents';

export const automationQueue = new Queue(QUEUE_NAME, { connection: bullConnection });

/** خريطة اسم المهمة إلى منفّذها في خدمة الأتمتة. */
const handlers: Record<AutomationJobName, () => Promise<unknown>> = {
  'accrue-leave': () => accrueLeaveBalances(),
  'check-absentees': () => checkAbsentees(),
  'check-expiring-documents': () => checkExpiringDocuments(),
};

const DEFAULT_JOB_OPTIONS = {
  attempts: 3,
  backoff: { type: 'exponential' as const, delay: 30_000 },
  removeOnComplete: 100,
  removeOnFail: 500,
};

/**
 * إضافة مهمة إلى الطابور مع jobId يومي يمنع التكرار خلال نفس اليوم.
 */
async function enqueue(name: AutomationJobName): Promise<void> {
  const jobId = `${name}:${riyadhDateKey()}`;
  await automationQueue.add(name, {}, { ...DEFAULT_JOB_OPTIONS, jobId });
}

/**
 * تشغيل الـ Worker الذي ينفّذ مهام الطابور. يُستدعى مرة واحدة عند إقلاع
 * التطبيق (أو في عملية عاملة منفصلة).
 */
export function startAutomationWorker(): Worker {
  const worker = new Worker(
    QUEUE_NAME,
    async (job: Job) => {
      const handler = handlers[job.name as AutomationJobName];
      if (!handler) {
        throw new Error(`مهمة غير معروفة: ${job.name}`);
      }
      return handler();
    },
    { connection: bullConnection, concurrency: 1 },
  );

  worker.on('completed', (job, result) => {
    console.info(`[automation] اكتملت المهمة ${job.name}`, result);
  });
  worker.on('failed', (job, err) => {
    console.error(`[automation] فشلت المهمة ${job?.name}:`, err.message);
  });

  return worker;
}

/**
 * تسجيل مواقيت cron بتوقيت الرياض. يعيد المهام المجدولة لإمكانية إيقافها.
 */
export function registerSchedules(): ScheduledTask[] {
  const cronOptions = { timezone: RIYADH_TZ };

  const tasks: ScheduledTask[] = [
    // استحقاق الإجازات: اليوم الأول من كل شهر الساعة 00:05.
    cron.schedule('5 0 1 * *', () => void enqueue('accrue-leave'), cronOptions),

    // رصد الغياب: يومياً الساعة 11:00 صباحاً.
    cron.schedule('0 11 * * *', () => void enqueue('check-absentees'), cronOptions),

    // رصد المستندات المنتهية: يومياً الساعة 08:00 صباحاً.
    cron.schedule('0 8 * * *', () => void enqueue('check-expiring-documents'), cronOptions),
  ];

  return tasks;
}

/**
 * نقطة التشغيل الموحّدة: تبدأ الـ Worker وتسجّل المواقيت معاً.
 */
export function startScheduler(): { worker: Worker; tasks: ScheduledTask[] } {
  const worker = startAutomationWorker();
  const tasks = registerSchedules();
  console.info('[automation] تم تشغيل محرّك الجدولة بتوقيت', RIYADH_TZ);
  return { worker, tasks };
}

/** تشغيل مهمة فوراً يدوياً (للاختبار أو إعادة المعالجة من لوحة الإدارة). */
export async function triggerNow(name: AutomationJobName): Promise<void> {
  await enqueue(name);
}
