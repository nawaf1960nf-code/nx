import IORedis, { RedisOptions } from 'ioredis';

/**
 * إعداد اتصال Redis المستخدم في الكاش وطوابير المهام (BullMQ).
 *
 * يُمرَّر `bullConnection` إلى Queue/Worker. الخيار `maxRetriesPerRequest: null`
 * إلزامي لـ BullMQ كي لا تُسقط الأوامر المعلّقة أثناء انقطاع مؤقت.
 */

export const bullConnection: RedisOptions = {
  host: process.env.REDIS_HOST ?? '127.0.0.1',
  port: parseInt(process.env.REDIS_PORT ?? '6379', 10),
  password: process.env.REDIS_PASSWORD || undefined,
  maxRetriesPerRequest: null,
  enableReadyCheck: true,
};

/** اتصال عام يُستخدم للكاش وعمليات Redis المباشرة. */
export const redis = new IORedis(bullConnection);

redis.on('error', (err) => {
  // يُسجَّل الخطأ دون إسقاط العملية كي تستمر بقية الخدمات.
  console.error('[redis] خطأ في الاتصال:', err.message);
});
