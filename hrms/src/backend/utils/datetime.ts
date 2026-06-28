/**
 * أدوات التعامل مع التاريخ والوقت بتوقيت الرياض (Asia/Riyadh).
 *
 * توقيت الرياض ثابت عند +03:00 دون توقيت صيفي، ما يجعل تحديد بداية اليوم
 * المحلي دقيقاً عبر تثبيت الإزاحة. كل الحسابات اليومية في محرك الأتمتة
 * تستند إلى اليوم التقويمي في الرياض لا إلى UTC.
 */

export const RIYADH_TZ = 'Asia/Riyadh';

const MS_PER_DAY = 24 * 60 * 60 * 1000;

interface RiyadhDateParts {
  year: number;
  month: number; // 1-12
  day: number;
  weekday: string; // بالإنجليزية بحروف صغيرة، مثل "sunday"
}

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

/** استخراج مكوّنات التاريخ بتوقيت الرياض من لحظة زمنية. */
export function getRiyadhDateParts(date: Date = new Date()): RiyadhDateParts {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: RIYADH_TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'long',
  });

  const parts = formatter.formatToParts(date);
  const lookup = (type: string): string =>
    parts.find((p) => p.type === type)?.value ?? '';

  return {
    year: parseInt(lookup('year'), 10),
    month: parseInt(lookup('month'), 10),
    day: parseInt(lookup('day'), 10),
    weekday: lookup('weekday').toLowerCase(),
  };
}

/** مفتاح اليوم بصيغة YYYY-MM-DD بتوقيت الرياض (يُستخدم لمنع تكرار التشغيل). */
export function riyadhDateKey(date: Date = new Date()): string {
  const { year, month, day } = getRiyadhDateParts(date);
  return `${year}-${pad(month)}-${pad(day)}`;
}

/** اسم يوم الأسبوع بتوقيت الرياض (بحروف صغيرة) للمقارنة مع أيام العطلة. */
export function riyadhWeekday(date: Date = new Date()): string {
  return getRiyadhDateParts(date).weekday;
}

/**
 * نطاق اليوم التقويمي في الرياض كلحظتين زمنيتين (UTC) لاستخدامه في
 * استعلامات قاعدة البيانات: [بداية اليوم، بداية اليوم التالي).
 */
export function riyadhDayRange(date: Date = new Date()): { start: Date; end: Date } {
  const { year, month, day } = getRiyadhDateParts(date);
  const start = new Date(`${year}-${pad(month)}-${pad(day)}T00:00:00+03:00`);
  const end = new Date(start.getTime() + MS_PER_DAY);
  return { start, end };
}

/** إضافة عدد من الأيام إلى لحظة زمنية. */
export function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * MS_PER_DAY);
}
