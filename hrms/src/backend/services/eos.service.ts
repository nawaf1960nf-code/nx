/**
 * خدمة حساب مكافأة نهاية الخدمة وفق نظام العمل السعودي — بجميع المواد ذات
 * العلاقة، مع اختلاف الاستحقاق حسب سبب انتهاء العلاقة العمّالية.
 *
 * الأساس (المادة 84):
 *   أجر نصف شهر عن كل سنة من السنوات الخمس الأولى، وأجر شهر كامل عن كل سنة
 *   تالية، ويُحسب جزء السنة بنسبة ما قضاه العامل منها. ويُحتسب على الأجر
 *   الأخير الشامل (الأساسي + البدلات الثابتة).
 *
 * الاستقالة (المادة 85):
 *   • أقل من سنتين: لا يستحق شيئاً.
 *   • من سنتين إلى أقل من خمس: يستحق ثلث المكافأة.
 *   • من خمس إلى أقل من عشر: يستحق ثلثيها.
 *   • عشر سنوات فأكثر: يستحقها كاملة.
 *
 * استثناءات الاستحقاق الكامل رغم ترك العامل للعمل:
 *   • المادة 87: ترك العمل لقوة قاهرة خارجة عن الإرادة، أو إنهاء العاملة
 *     عقدها خلال ستة أشهر من زواجها أو ثلاثة أشهر من وضعها → مكافأة كاملة.
 *   • المادة 81: ترك العامل العمل لسبب مشروع يعود لخطأ صاحب العمل → يُعامل
 *     معاملة الإنهاء من صاحب العمل ويستحق المكافأة كاملة.
 *
 * الحرمان من المكافأة (المادة 80):
 *   • فصل العامل لارتكابه إحدى المخالفات الجسيمة المنصوص عليها → لا يستحق
 *     مكافأة نهاية خدمة.
 *
 * الوفاة والعجز والتقاعد (المادة 84): تُصرف المكافأة كاملة (وللورثة عند
 * الوفاة).
 */

export type EndOfServiceReason =
  // استحقاق كامل (المادة 84)
  | 'TERMINATION' // إنهاء من صاحب العمل
  | 'END_OF_CONTRACT' // انتهاء العقد محدّد المدة
  | 'RETIREMENT' // التقاعد
  | 'DEATH' // الوفاة (تُصرف للورثة)
  | 'DISABILITY' // العجز أو المرض المُقعِد
  // الاستقالة وسلّم التخفيض (المادة 85)
  | 'RESIGNATION'
  // استثناءات الاستحقاق الكامل (المادة 87)
  | 'RESIGNATION_FORCE_MAJEURE' // ترك العمل لقوة قاهرة
  | 'FEMALE_MARRIAGE' // إنهاء العاملة خلال 6 أشهر من الزواج
  | 'FEMALE_CHILDBIRTH' // إنهاء العاملة خلال 3 أشهر من الوضع
  // ترك مبرر بخطأ صاحب العمل (المادة 81)
  | 'WORKER_LEFT_EMPLOYER_FAULT'
  // الحرمان من المكافأة (المادة 80)
  | 'MISCONDUCT_DISMISSAL';

type EntitlementBasis = 'FULL' | 'ART85_SCALE' | 'NONE';

interface ReasonRule {
  article: string;
  basis: EntitlementBasis;
  label: string;
}

/** قاعدة الاستحقاق لكل سبب، مع المادة النظامية المستندة إليها. */
const REASON_RULES: Record<EndOfServiceReason, ReasonRule> = {
  TERMINATION: { article: '84', basis: 'FULL', label: 'إنهاء من صاحب العمل' },
  END_OF_CONTRACT: { article: '84', basis: 'FULL', label: 'انتهاء مدة العقد' },
  RETIREMENT: { article: '84', basis: 'FULL', label: 'التقاعد' },
  DEATH: { article: '84', basis: 'FULL', label: 'الوفاة (تُصرف للورثة)' },
  DISABILITY: { article: '84', basis: 'FULL', label: 'العجز أو المرض المُقعِد' },
  RESIGNATION: { article: '85', basis: 'ART85_SCALE', label: 'الاستقالة' },
  RESIGNATION_FORCE_MAJEURE: { article: '87', basis: 'FULL', label: 'ترك العمل لقوة قاهرة' },
  FEMALE_MARRIAGE: { article: '87', basis: 'FULL', label: 'إنهاء العاملة عقدها خلال ستة أشهر من الزواج' },
  FEMALE_CHILDBIRTH: { article: '87', basis: 'FULL', label: 'إنهاء العاملة عقدها خلال ثلاثة أشهر من الوضع' },
  WORKER_LEFT_EMPLOYER_FAULT: { article: '81', basis: 'FULL', label: 'ترك العمل لسبب مشروع بخطأ صاحب العمل' },
  MISCONDUCT_DISMISSAL: { article: '80', basis: 'NONE', label: 'الفصل لارتكاب مخالفة جسيمة' },
};

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
  /** المادة النظامية المُطبّقة. */
  legalArticle: string;
  /** أساس الاستحقاق: كامل، سلّم الاستقالة، أو محروم. */
  entitlementBasis: EntitlementBasis;
  /** المكافأة الكاملة قبل تطبيق أي تخفيض. */
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
 * مدة الخدمة بالسنوات (مع الكسور) بأسلوب تقويمي تقع فيه السنوات الكاملة على
 * تواريخ الذكرى بالضبط، مع احتساب آخر يوم عمل ضمن المدة المستحقة.
 */
export function calculateYearsOfService(hireDate: Date, lastWorkingDay: Date): number {
  if (lastWorkingDay.getTime() <= hireDate.getTime()) return 0;

  let fullYears = 0;
  let cursor = new Date(hireDate);

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

  const remainderDays = (lastWorkingDay.getTime() - cursor.getTime()) / MS_PER_DAY + 1;
  const yearDays = daysInYearStartingAt(cursor);
  return fullYears + remainderDays / yearDays;
}

/**
 * المكافأة الكاملة وفق المادة (84): نصف شهر لكل سنة من الخمس الأولى، وشهر
 * كامل عن كل سنة بعدها، مع احتساب كسور السنوات بالتناسب.
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

/** نسبة الاستحقاق في حال الاستقالة وفق المادة (85). */
export function resignationEntitlementFactor(years: number): number {
  if (years < 2) return 0;
  if (years < 5) return 1 / 3;
  if (years < 10) return 2 / 3;
  return 1;
}

function round(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function describeResignationFactor(factor: number): string {
  if (factor === 0) return 'لا تستحق مكافأة لأن مدة الخدمة أقل من سنتين (المادة 85).';
  if (factor === 1 / 3) return 'استحقاق ثلث المكافأة (خدمة من سنتين إلى أقل من خمس سنوات) — المادة 85.';
  if (factor === 2 / 3) return 'استحقاق ثلثي المكافأة (خدمة من خمس إلى أقل من عشر سنوات) — المادة 85.';
  return 'استحقاق كامل المكافأة (خدمة عشر سنوات فأكثر) — المادة 85.';
}

/**
 * حساب مكافأة نهاية الخدمة كاملةً مع تحديد المادة النظامية وأساس الاستحقاق.
 */
export function calculateEndOfService(input: EosInput): EosResult {
  const monthlyWage = sumWage(input.wage);
  const dailyWage = monthlyWage / 30;
  const years = calculateYearsOfService(input.hireDate, input.lastWorkingDay);

  const { gross, tiers } = computeGrossGratuity(years, monthlyWage);

  const rule = REASON_RULES[input.reason];
  const notes: string[] = [];
  let entitlementFactor: number;

  switch (rule.basis) {
    case 'FULL':
      entitlementFactor = 1;
      notes.push(`${rule.label}: استحقاق كامل المكافأة وفق المادة (${rule.article}).`);
      break;
    case 'NONE':
      entitlementFactor = 0;
      notes.push(`${rule.label}: لا يستحق مكافأة نهاية الخدمة وفق المادة (${rule.article}).`);
      break;
    case 'ART85_SCALE':
    default:
      entitlementFactor = resignationEntitlementFactor(years);
      notes.push(describeResignationFactor(entitlementFactor));
      break;
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
    legalArticle: rule.article,
    entitlementBasis: rule.basis,
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
 * أُنهيت خدمته في تاريخ مرجعي — يُستخدم في التقارير المالية والمخصصات،
 * ويُحتسب على أساس الاستحقاق الكامل (المادة 84).
 */
export function calculateEosProvision(
  hireDate: Date,
  wage: WageComponents,
  asOfDate: Date = new Date(),
): EosResult {
  return calculateEndOfService({
    hireDate,
    lastWorkingDay: asOfDate,
    reason: 'TERMINATION',
    wage,
  });
}
