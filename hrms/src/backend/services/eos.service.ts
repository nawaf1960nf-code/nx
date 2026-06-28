/**
 * خدمة حساب مكافأة نهاية الخدمة وفق نظام العمل السعودي.
 *
 * المرجع:
 *  - المادة (84): تُحسب المكافأة بواقع أجر نصف شهر عن كل سنة من السنوات
 *    الخمس الأولى، وأجر شهر كامل عن كل سنة من السنوات التالية، ويُحسب
 *    جزء السنة بنسبة ما قضاه العامل منها.
 *  - المادة (85): في حال الاستقالة تُخفّض المكافأة كالتالي:
 *      • أقل من سنتين: لا يستحق شيئاً.
 *      • من سنتين إلى أقل من خمس سنوات: يستحق ثلث المكافأة.
 *      • من خمس سنوات إلى أقل من عشر سنوات: يستحق ثلثي المكافأة.
 *      • عشر سنوات فأكثر: يستحق المكافأة كاملة.
 *  - المادة (87): تستحق العاملة كامل المكافأة إذا أنهت العقد خلال ستة أشهر
 *    من زواجها أو ثلاثة أشهر من وضعها، وكذلك حالات الوفاة والعجز.
 *
 * ملاحظة: الأجر المعتمد في الحساب هو الأجر الأخير الشامل (الأساسي + البدلات
 * الثابتة) ما لم يُحدّد خلاف ذلك.
 */

export type EndOfServiceReason =
  | 'RESIGNATION'
  | 'TERMINATION'
  | 'END_OF_CONTRACT'
  | 'RETIREMENT'
  | 'DEATH';

export interface WageComponents {
  baseSalary: number;
  housingAllowance?: number;
  transportAllowance?: number;
  foodAllowance?: number;
  otherAllowances?: number;
}

export interface EosInput {
  hireDate: Date;
  lastWorkingDay: Date;
  reason: EndOfServiceReason;
  wage: WageComponents;
  /** أيام إجازات مستحقة لم تُصرف، تُضاف كرصيد منفصل عن المكافأة. */
  accruedLeaveDays?: number;
  /** استثناء المادة (87): استحقاق كامل المكافأة رغم الاستقالة (زواج/وضع/عجز). */
  fullEntitlementOverride?: boolean;
}

export interface EosBreakdownTier {
  label: string;
  years: number;
  rateMonthsPerYear: number;
  amount: number;
}

export interface EosResult {
  monthlyWage: number;
  dailyWage: number;
  yearsOfService: number;
  reason: EndOfServiceReason;
  /** المكافأة الكاملة قبل تطبيق تخفيض الاستقالة. */
  grossGratuity: number;
  /** نسبة الاستحقاق المطبّقة (1، 2/3، 1/3، أو 0). */
  entitlementFactor: number;
  /** المكافأة بعد تطبيق نسبة الاستحقاق. */
  gratuityAfterReduction: number;
  /** بدل الإجازات غير المستنفدة. */
  leaveEncashment: number;
  /** الإجمالي المستحق صرفه. */
  totalPayable: number;
  tiers: EosBreakdownTier[];
  notes: string[];
}

const FIRST_TIER_YEARS = 5;
const MS_PER_DAY = 1000 * 60 * 60 * 24;

function daysInYearStartingAt(date: Date): number {
  const next = new Date(date);
  next.setFullYear(next.getFullYear() + 1);
  return Math.round((next.getTime() - date.getTime()) / MS_PER_DAY);
}

export function sumWage(wage: WageComponents): number {
  return (
    (wage.baseSalary || 0) +
    (wage.housingAllowance || 0) +
    (wage.transportAllowance || 0) +
    (wage.foodAllowance || 0) +
    (wage.otherAllowances || 0)
  );
}

/**
 * مدة الخدمة بالسنوات (مع الكسور) بين تاريخ التعيين وآخر يوم عمل.
 *
 * يُحسب بأسلوب تقويمي حتى تقع السنوات الكاملة على تواريخ الذكرى بالضبط؛
 * فمن أتمّ سنتين تقويميتين تُحسب له سنتان تامّتان (وهو ما يهمّ في حدود
 * المادة 85)، ثم يُضاف جزء السنة الأخيرة بنسبة أيامه. ويُحتسب آخر يوم عمل
 * ضمن المدة المستحقة.
 */
export function calculateYearsOfService(hireDate: Date, lastWorkingDay: Date): number {
  if (lastWorkingDay.getTime() <= hireDate.getTime()) return 0;

  let fullYears = 0;
  let cursor = new Date(hireDate);

  // التقدّم سنةً بسنة طالما أن الذكرى التالية تقع ضمن مدة الخدمة.
  while (true) {
    const next = new Date(cursor);
    next.setFullYear(next.getFullYear() + 1);
    if (next.getTime() <= lastWorkingDay.getTime()) {
      fullYears += 1;
      cursor = next;
    } else {
      break;
    }
  }

  // جزء السنة الأخيرة (مع احتساب آخر يوم عمل).
  const remainderDays = (lastWorkingDay.getTime() - cursor.getTime()) / MS_PER_DAY + 1;
  const yearDays = daysInYearStartingAt(cursor);
  return fullYears + remainderDays / yearDays;
}

/**
 * المكافأة الكاملة وفق المادة (84): نصف شهر لكل سنة من الخمس الأولى،
 * وشهر كامل عن كل سنة بعدها، مع احتساب كسور السنوات بالتناسب.
 */
function computeGrossGratuity(
  years: number,
  monthlyWage: number,
): { gross: number; tiers: EosBreakdownTier[] } {
  const firstTierYears = Math.min(years, FIRST_TIER_YEARS);
  const secondTierYears = Math.max(0, years - FIRST_TIER_YEARS);

  const firstTierAmount = firstTierYears * 0.5 * monthlyWage;
  const secondTierAmount = secondTierYears * 1.0 * monthlyWage;

  const tiers: EosBreakdownTier[] = [
    {
      label: 'السنوات الخمس الأولى (نصف شهر لكل سنة)',
      years: round(firstTierYears),
      rateMonthsPerYear: 0.5,
      amount: round(firstTierAmount),
    },
  ];

  if (secondTierYears > 0) {
    tiers.push({
      label: 'ما بعد خمس سنوات (شهر كامل لكل سنة)',
      years: round(secondTierYears),
      rateMonthsPerYear: 1,
      amount: round(secondTierAmount),
    });
  }

  return { gross: firstTierAmount + secondTierAmount, tiers };
}

/**
 * نسبة الاستحقاق في حال الاستقالة وفق المادة (85).
 */
export function resignationEntitlementFactor(years: number): number {
  if (years < 2) return 0;
  if (years < 5) return 1 / 3;
  if (years < 10) return 2 / 3;
  return 1;
}

function round(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

/**
 * حساب مكافأة نهاية الخدمة كاملةً.
 */
export function calculateEndOfService(input: EosInput): EosResult {
  const monthlyWage = sumWage(input.wage);
  const dailyWage = monthlyWage / 30;
  const years = calculateYearsOfService(input.hireDate, input.lastWorkingDay);

  const { gross, tiers } = computeGrossGratuity(years, monthlyWage);

  const notes: string[] = [];
  let entitlementFactor = 1;

  if (input.reason === 'RESIGNATION') {
    if (input.fullEntitlementOverride) {
      entitlementFactor = 1;
      notes.push('استحقاق كامل المكافأة استثناءً وفق المادة (87).');
    } else {
      entitlementFactor = resignationEntitlementFactor(years);
      if (entitlementFactor === 0) {
        notes.push('لا تستحق مكافأة لأن مدة الخدمة أقل من سنتين (المادة 85).');
      } else if (entitlementFactor === 1 / 3) {
        notes.push('استحقاق ثلث المكافأة (خدمة من سنتين إلى أقل من خمس سنوات).');
      } else if (entitlementFactor === 2 / 3) {
        notes.push('استحقاق ثلثي المكافأة (خدمة من خمس إلى أقل من عشر سنوات).');
      } else {
        notes.push('استحقاق كامل المكافأة (خدمة عشر سنوات فأكثر).');
      }
    }
  } else {
    // إنهاء من صاحب العمل، انتهاء عقد، تقاعد، أو وفاة: المكافأة كاملة.
    entitlementFactor = 1;
    notes.push('استحقاق كامل المكافأة وفق المادة (84).');
  }

  const gratuityAfterReduction = gross * entitlementFactor;

  const accruedLeaveDays = input.accruedLeaveDays ?? 0;
  const leaveEncashment = accruedLeaveDays * dailyWage;
  if (accruedLeaveDays > 0) {
    notes.push(`بدل ${accruedLeaveDays} يوم إجازة غير مستنفدة بأجر اليوم.`);
  }

  const totalPayable = gratuityAfterReduction + leaveEncashment;

  return {
    monthlyWage: round(monthlyWage),
    dailyWage: round(dailyWage),
    yearsOfService: round(years),
    reason: input.reason,
    grossGratuity: round(gross),
    entitlementFactor: round(entitlementFactor),
    gratuityAfterReduction: round(gratuityAfterReduction),
    leaveEncashment: round(leaveEncashment),
    totalPayable: round(totalPayable),
    tiers,
    notes,
  };
}

/**
 * تقدير مخصص نهاية الخدمة (Provision) لموظف لا يزال على رأس العمل، كما لو
 * أُنهيت خدمته في تاريخ مرجعي — يُستخدم في التقارير المالية والمخصصات.
 */
export function calculateEosProvision(
  hireDate: Date,
  wage: WageComponents,
  asOfDate: Date = new Date(),
): EosResult {
  return calculateEndOfService({
    hireDate,
    lastWorkingDay: asOfDate,
    reason: 'TERMINATION', // المخصص يُقدّر على أساس الاستحقاق الكامل.
    wage,
  });
}
