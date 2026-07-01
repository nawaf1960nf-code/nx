// حساب مكافأة نهاية الخدمة وفق نظام العمل السعودي (جميع المواد ذات العلاقة).
// نسخة الواجهة المستقلة عن الخادم — منطق نقي بلا تبعيات.

export type EndOfServiceReason =
  | "TERMINATION" // إنهاء من صاحب العمل (84)
  | "END_OF_CONTRACT" // انتهاء/عدم تجديد العقد محدّد المدة (84)
  | "MUTUAL_AGREEMENT" // اتفاق الطرفين (74)
  | "RETIREMENT" // التقاعد (84)
  | "DEATH" // الوفاة (84)
  | "DISABILITY" // العجز (84)
  | "RESIGNATION" // الاستقالة (85)
  | "RESIGNATION_FORCE_MAJEURE" // قوة قاهرة (87)
  | "FEMALE_MARRIAGE" // العاملة خلال 6 أشهر من الزواج (87)
  | "FEMALE_CHILDBIRTH" // العاملة خلال 3 أشهر من الوضع (87)
  | "WORKER_LEFT_EMPLOYER_FAULT" // ترك بخطأ صاحب العمل (81)
  | "MISCONDUCT_DISMISSAL"; // الفصل لمخالفة (80)

type EntitlementBasis = "FULL" | "ART85_SCALE" | "NONE";

interface ReasonRule {
  article: string;
  basis: EntitlementBasis;
  label: string;
}

export const REASON_RULES: Record<EndOfServiceReason, ReasonRule> = {
  TERMINATION: { article: "84", basis: "FULL", label: "إنهاء من صاحب العمل" },
  END_OF_CONTRACT: { article: "84", basis: "FULL", label: "انتهاء أو عدم تجديد العقد محدّد المدة" },
  MUTUAL_AGREEMENT: { article: "74", basis: "FULL", label: "إنهاء العقد باتفاق الطرفين (التراضي)" },
  RETIREMENT: { article: "84", basis: "FULL", label: "التقاعد" },
  DEATH: { article: "84", basis: "FULL", label: "الوفاة (تُصرف للورثة)" },
  DISABILITY: { article: "84", basis: "FULL", label: "العجز أو المرض المُقعِد" },
  RESIGNATION: { article: "85", basis: "ART85_SCALE", label: "الاستقالة" },
  RESIGNATION_FORCE_MAJEURE: { article: "87", basis: "FULL", label: "ترك العمل لقوة قاهرة" },
  FEMALE_MARRIAGE: { article: "87", basis: "FULL", label: "إنهاء العاملة عقدها خلال ستة أشهر من الزواج" },
  FEMALE_CHILDBIRTH: { article: "87", basis: "FULL", label: "إنهاء العاملة عقدها خلال ثلاثة أشهر من الوضع" },
  WORKER_LEFT_EMPLOYER_FAULT: { article: "81", basis: "FULL", label: "ترك العمل لسبب مشروع بخطأ صاحب العمل" },
  MISCONDUCT_DISMISSAL: { article: "80", basis: "NONE", label: "الفصل لارتكاب مخالفة جسيمة" },
};

export interface WageComponents {
  baseSalary: number;
  housingAllowance?: number;
  transportAllowance?: number;
  otherAllowances?: number;
}

export interface EosResult {
  monthlyWage: number;
  yearsOfService: number;
  legalArticle: string;
  entitlementBasis: EntitlementBasis;
  grossGratuity: number;
  entitlementFactor: number;
  totalPayable: number;
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
    (wage.otherAllowances || 0)
  );
}

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
    } else break;
  }
  const remainderDays = (lastWorkingDay.getTime() - cursor.getTime()) / MS_PER_DAY + 1;
  return fullYears + remainderDays / daysInYearStartingAt(cursor);
}

function computeGrossGratuity(years: number, monthlyWage: number): number {
  const firstTier = Math.min(years, FIRST_TIER_YEARS) * 0.5 * monthlyWage;
  const secondTier = Math.max(0, years - FIRST_TIER_YEARS) * 1.0 * monthlyWage;
  return firstTier + secondTier;
}

export function resignationEntitlementFactor(years: number): number {
  if (years < 2) return 0;
  if (years < 5) return 1 / 3;
  if (years < 10) return 2 / 3;
  return 1;
}

function round(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function calculateEndOfService(input: {
  hireDate: Date;
  lastWorkingDay: Date;
  reason: EndOfServiceReason;
  wage: WageComponents;
}): EosResult {
  const monthlyWage = sumWage(input.wage);
  const years = calculateYearsOfService(input.hireDate, input.lastWorkingDay);
  const gross = computeGrossGratuity(years, monthlyWage);
  const rule = REASON_RULES[input.reason];

  const notes: string[] = [];
  let factor: number;

  if (rule.basis === "FULL") {
    factor = 1;
    notes.push(`${rule.label}: استحقاق كامل المكافأة وفق المادة (${rule.article}).`);
  } else if (rule.basis === "NONE") {
    factor = 0;
    notes.push(`${rule.label}: لا يستحق مكافأة وفق المادة (${rule.article}).`);
  } else {
    factor = resignationEntitlementFactor(years);
    if (factor === 0) notes.push("لا يستحق مكافأة (الخدمة أقل من سنتين) — المادة 85.");
    else if (factor === 1 / 3) notes.push("استحقاق ثلث المكافأة (سنتان إلى أقل من خمس) — المادة 85.");
    else if (factor === 2 / 3) notes.push("استحقاق ثلثي المكافأة (خمس إلى أقل من عشر) — المادة 85.");
    else notes.push("استحقاق كامل المكافأة (عشر سنوات فأكثر) — المادة 85.");
  }

  return {
    monthlyWage: round(monthlyWage),
    yearsOfService: round(years),
    legalArticle: rule.article,
    entitlementBasis: rule.basis,
    grossGratuity: round(gross),
    entitlementFactor: round(factor),
    totalPayable: round(gross * factor),
    notes,
  };
}
