// الأنواع المشتركة عبر الواجهة.

export type UserRole = "SUPER_ADMIN" | "HR_ADMIN" | "MANAGER" | "EMPLOYEE";

export type CompanyPlan = "BASIC" | "PRO" | "ENTERPRISE";
export type CompanyStatus = "ACTIVE" | "TRIAL" | "SUSPENDED";

export interface Company {
  id: string;
  name: string;
  nameEn?: string;
  city: string;
  plan: CompanyPlan;
  status: CompanyStatus;
  seatLimit: number;
  subscriptionEndsAt: string; // ISO
  createdAt: string; // ISO
}

export type EmployeeStatus =
  | "ACTIVE"
  | "ON_PROBATION"
  | "ON_LEAVE"
  | "TERMINATED"
  | "RESIGNED";

export type EmploymentType = "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERN";

export type EmployeeEventType =
  | "LEAVE"
  | "PERFORMANCE"
  | "LOAN"
  | "ATTENDANCE"
  | "REQUEST";

export interface EmployeeEvent {
  id: string;
  type: EmployeeEventType;
  title: string;
  description?: string;
  date: string; // ISO
}

export interface Employee {
  id: string;
  companyId: string;
  employeeNumber: string;
  displayName: string;
  nameInEnglish?: string;
  department: string;
  position: string;
  nationality: string;
  idNumber: string;
  hireDate: string; // ISO
  status: EmployeeStatus;
  employmentType: EmploymentType;
  // مالية (تظهر حسب الصلاحية)
  baseSalary: number;
  housingAllowance: number;
  transportAllowance: number;
  otherAllowances: number;
  bankName: string;
  ibanNumber: string;
  events: EmployeeEvent[];
}

export interface CurrentUser {
  id: string;
  name: string;
  role: UserRole;
  companyId?: string; // غير محدّد لمدير النظام
}

// ── المستخدمون (لتسجيل الدخول بالإيميل) ──
export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  companyId?: string;
  createdAt: string;
}

// ── سجل النشاط/التدقيق ──
export type AuditAction =
  | "ADD_COMPANY"
  | "UPDATE_COMPANY"
  | "SET_COMPANY_STATUS"
  | "INVITE_ADMIN"
  | "ADD_EMPLOYEE"
  | "UPDATE_EMPLOYEE"
  | "DELETE_EMPLOYEE"
  | "IMPORT_EMPLOYEES"
  | "REQUEST_LEAVE"
  | "APPROVE_LEAVE"
  | "REJECT_LEAVE"
  | "RECORD_ATTENDANCE"
  | "RUN_PAYROLL"
  | "PAY_PAYROLL"
  | "REVERT";

// حمولة التراجع: ما يلزم لعكس الإجراء.
export type AuditUndo =
  | { type: "REMOVE_COMPANY"; companyId: string }
  | { type: "RESTORE_COMPANY"; company: Company }
  | { type: "REMOVE_EMPLOYEE"; employeeId: string }
  | { type: "RESTORE_EMPLOYEE"; employee: Employee }
  | { type: "REMOVE_EMPLOYEES"; employeeIds: string[] }
  | { type: "REMOVE_USER"; userId: string };

export interface AuditEntry {
  id: string;
  at: string; // ISO
  actorName: string;
  actorRole: UserRole;
  companyId?: string;
  action: AuditAction;
  summary: string;
  undo?: AuditUndo;
  reverted?: boolean;
}

// ── الإجازات ──
export type LeaveType = "ANNUAL" | "SICK" | "UNPAID" | "EMERGENCY" | "MATERNITY";
export type LeaveStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface LeaveRequest {
  id: string;
  companyId: string;
  employeeId: string;
  employeeName: string;
  type: LeaveType;
  startDate: string;
  endDate: string;
  days: number;
  reason?: string;
  status: LeaveStatus;
  createdAt: string;
}

// ── الحضور ──
export type AttendanceStatus = "PRESENT" | "LATE" | "ABSENT" | "ON_LEAVE";

export interface AttendanceRecord {
  id: string;
  companyId: string;
  employeeId: string;
  employeeName: string;
  date: string; // YYYY-MM-DD
  checkIn?: string; // HH:mm
  checkOut?: string; // HH:mm
  status: AttendanceStatus;
  lateMinutes: number;
}

// ── الرواتب ──
export type PayrollStatus = "DRAFT" | "APPROVED" | "PAID";

export interface PayrollLine {
  employeeId: string;
  employeeName: string;
  baseSalary: number;
  allowances: number;
  gross: number;
  gosi: number;
  net: number;
}

export interface PayrollRun {
  id: string;
  companyId: string;
  month: number; // 1-12
  year: number;
  status: PayrollStatus;
  lines: PayrollLine[];
  total: number;
  createdAt: string;
}
