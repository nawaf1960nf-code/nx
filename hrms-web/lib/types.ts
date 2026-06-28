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
