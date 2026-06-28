import type { Employee, PayrollLine } from "./types";
import { sumWage } from "./eos";

// نسبة حصة الموظف في التأمينات الاجتماعية (GOSI) للسعوديين.
const GOSI_EMPLOYEE_RATE = 0.0975;

function round(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

function isSaudi(nationality: string): boolean {
  return nationality.includes("سعودي");
}

/** احتساب سطر راتب موظف واحد مع خصم أقساط السلف والخصومات الأخرى. */
export function computePayrollLine(emp: Employee, loanDeduction = 0, otherDeductions = 0): PayrollLine {
  const gross = sumWage({
    baseSalary: emp.baseSalary,
    housingAllowance: emp.housingAllowance,
    transportAllowance: emp.transportAllowance,
    otherAllowances: emp.otherAllowances,
  });
  const allowances = gross - emp.baseSalary;
  // التأمينات تُحتسب على (الأساسي + بدل السكن) للسعوديين.
  const gosiBase = emp.baseSalary + emp.housingAllowance;
  const gosi = isSaudi(emp.nationality) ? round(gosiBase * GOSI_EMPLOYEE_RATE) : 0;
  const net = round(gross - gosi - loanDeduction - otherDeductions);
  return {
    employeeId: emp.id,
    employeeName: emp.displayName,
    baseSalary: emp.baseSalary,
    allowances: round(allowances),
    gross: round(gross),
    gosi,
    loanDeduction: round(loanDeduction),
    otherDeductions: round(otherDeductions),
    net,
  };
}

export const MONTH_NAMES = [
  "يناير",
  "فبراير",
  "مارس",
  "أبريل",
  "مايو",
  "يونيو",
  "يوليو",
  "أغسطس",
  "سبتمبر",
  "أكتوبر",
  "نوفمبر",
  "ديسمبر",
];

/** احتساب دقائق التأخير مقارنةً ببداية الوردية مع فترة سماح. */
export function lateMinutesFor(checkIn: string, shiftStart = "08:00", grace = 15): number {
  const [ch, cm] = checkIn.split(":").map(Number);
  const [sh, sm] = shiftStart.split(":").map(Number);
  const diff = ch * 60 + cm - (sh * 60 + sm);
  return diff > grace ? diff : 0;
}
