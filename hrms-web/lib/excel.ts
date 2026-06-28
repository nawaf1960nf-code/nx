"use client";

import * as XLSX from "xlsx";
import type { Employee } from "./types";

type EmployeeInput = Omit<Employee, "id" | "companyId" | "events">;

export interface ParsedRow {
  index: number;
  data: EmployeeInput;
  errors: string[];
}

// خرائط رؤوس الأعمدة: تدعم العربية والإنجليزية بمطابقة مرنة (تضمين جزئي).
const COLUMN_MAP: { field: keyof EmployeeInput; match: string[] }[] = [
  { field: "displayName", match: ["الاسم", "اسم الموظف", "full name", "name", "employee name"] },
  { field: "employeeNumber", match: ["الرقم الوظيفي", "رقم الموظف", "employee number", "emp no", "staff id"] },
  { field: "department", match: ["القسم", "الإدارة", "department", "dept"] },
  { field: "position", match: ["المسمى الوظيفي", "المسمى", "الوظيفة", "position", "title", "job title"] },
  { field: "nationality", match: ["الجنسية", "nationality"] },
  { field: "idNumber", match: ["رقم الهوية", "الهوية", "الإقامة", "iqama", "national id", "id number"] },
  { field: "hireDate", match: ["تاريخ التعيين", "التعيين", "hire date", "join date", "joining"] },
  { field: "baseSalary", match: ["الراتب الأساسي", "الراتب", "basic salary", "base salary", "salary"] },
  { field: "housingAllowance", match: ["بدل السكن", "السكن", "housing"] },
  { field: "transportAllowance", match: ["بدل النقل", "النقل", "transport"] },
  { field: "otherAllowances", match: ["بدلات أخرى", "بدلات اخرى", "other allowance"] },
  { field: "bankName", match: ["اسم البنك", "البنك", "bank"] },
  { field: "ibanNumber", match: ["الآيبان", "ايبان", "iban"] },
];

function norm(value: unknown): string {
  return String(value ?? "").trim().toLowerCase();
}

function toNumber(value: unknown): number {
  if (typeof value === "number") return value;
  const n = parseFloat(String(value ?? "").replace(/[^\d.]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

function toISODate(value: unknown): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  const d = new Date(String(value));
  return Number.isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 10);
}

function resolveColumns(headers: string[]): Partial<Record<keyof EmployeeInput, string>> {
  const map: Partial<Record<keyof EmployeeInput, string>> = {};
  for (const { field, match } of COLUMN_MAP) {
    const header = headers.find((h) => match.some((m) => norm(h).includes(m)));
    if (header) map[field] = header;
  }
  return map;
}

function buildRow(raw: Record<string, unknown>, cols: Partial<Record<keyof EmployeeInput, string>>, index: number): ParsedRow {
  const get = (field: keyof EmployeeInput): unknown => {
    const key = cols[field];
    return key ? raw[key] : undefined;
  };

  const displayName = String(get("displayName") ?? "").trim();
  const baseSalary = toNumber(get("baseSalary"));
  const hireRaw = get("hireDate");

  const errors: string[] = [];
  if (!displayName) errors.push("الاسم مفقود");
  if (hireRaw && !toISODate(hireRaw)) errors.push("تاريخ التعيين غير صالح");

  // اشتقاق أجزاء الاسم من الاسم الكامل.
  const parts = displayName.split(/\s+/).filter(Boolean);
  const firstName = parts[0] ?? displayName;
  const lastName = parts.length > 1 ? parts[parts.length - 1] : "";
  const secondName = parts.length > 2 ? parts[1] : undefined;

  const data: EmployeeInput = {
    firstName,
    secondName,
    lastName,
    displayName,
    employeeNumber: String(get("employeeNumber") ?? "").trim() || String(1000 + index),
    department: String(get("department") ?? "").trim() || "غير محدّد",
    position: String(get("position") ?? "").trim() || "غير محدّد",
    nationality: String(get("nationality") ?? "").trim() || "—",
    idNumber: String(get("idNumber") ?? "").trim() || "—",
    hireDate: toISODate(hireRaw) || new Date().toISOString().slice(0, 10),
    status: "ON_PROBATION",
    employmentType: "FULL_TIME",
    baseSalary,
    housingAllowance: toNumber(get("housingAllowance")) || Math.round(baseSalary * 0.25),
    transportAllowance: toNumber(get("transportAllowance")),
    otherAllowances: toNumber(get("otherAllowances")),
    bankName: String(get("bankName") ?? "").trim() || "—",
    ibanNumber: String(get("ibanNumber") ?? "").trim() || "—",
  };

  return { index, data, errors };
}

/** قراءة عدة ملفات إكسل ودمج صفوف الموظفين منها. */
export async function parseEmployeeFiles(files: File[]): Promise<ParsedRow[]> {
  const all: ParsedRow[] = [];
  let counter = 0;

  for (const file of files) {
    const buffer = await file.arrayBuffer();
    const wb = XLSX.read(buffer, { type: "array", cellDates: true });
    for (const sheetName of wb.SheetNames) {
      const sheet = wb.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "" });
      if (rows.length === 0) continue;
      const cols = resolveColumns(Object.keys(rows[0]));
      // تجاهل الأوراق التي لا تحتوي عمود اسم.
      if (!cols.displayName) continue;
      for (const raw of rows) {
        all.push(buildRow(raw, cols, counter++));
      }
    }
  }

  return all;
}

/** تنزيل قالب إكسل بالأعمدة المتوقّعة وصف مثال. */
export function downloadTemplate(): void {
  const sample = {
    "الاسم": "محمد أحمد العمري",
    "الرقم الوظيفي": "1050",
    "القسم": "المالية",
    "المسمى الوظيفي": "محاسب",
    "الجنسية": "سعودي",
    "رقم الهوية": "1012345678",
    "تاريخ التعيين": "2023-05-01",
    "الراتب الأساسي": 9000,
    "بدل السكن": 2250,
    "بدل النقل": 500,
    "اسم البنك": "مصرف الراجحي",
    "الآيبان": "SA0000000000000000000000",
  };
  const ws = XLSX.utils.json_to_sheet([sample]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "الموظفون");
  XLSX.writeFile(wb, "قالب_بيانات_الموظفين.xlsx");
}
