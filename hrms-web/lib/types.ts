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

export type Gender = "MALE" | "FEMALE";

export interface Employee {
  id: string;
  companyId: string;
  employeeNumber: string;

  // الاسم بالعربية (الأول والثاني والأخير هم الأساس)
  firstName: string;
  secondName?: string;
  thirdName?: string;
  lastName: string;
  // الاسم بالإنجليزية
  firstNameEn?: string;
  secondNameEn?: string;
  lastNameEn?: string;
  displayName: string; // الاسم المعروض (مشتق) — يُستخدم في القوائم
  nameInEnglish?: string;

  // بيانات شخصية
  gender?: Gender;
  dateOfBirth?: string;
  nationality: string;
  idNumber: string;
  mobile?: string;
  email?: string;

  // بيانات العمل
  department: string;
  position: string;
  workLocation?: string;
  hireDate: string;
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
  | "SUBMIT_REQUEST"
  | "DECIDE_REQUEST"
  | "PUBLISH_ANNOUNCEMENT"
  | "GRANT_LOAN"
  | "ADD_DEDUCTION"
  | "ADD_REVIEW"
  | "ADD_DOCUMENT"
  | "CREATE_TICKET"
  | "UPDATE_TICKET"
  | "ADD_INSURANCE"
  | "LINK_CHI"
  | "ASSIGN_ASSET"
  | "ADD_ONBOARDING"
  | "ADD_TRAINING"
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
  loanDeduction: number;
  otherDeductions: number;
  net: number;
}

// ── السلف والخصومات ──
export type LoanStatus = "ACTIVE" | "SETTLED";
export interface Loan {
  id: string;
  companyId: string;
  employeeId: string;
  employeeName: string;
  amount: number;
  installments: number;
  installmentAmount: number;
  paidInstallments: number;
  remaining: number;
  startMonth: number;
  startYear: number;
  status: LoanStatus;
  createdAt: string;
}

export type DeductionType = "PENALTY" | "ADVANCE" | "OTHER";
export interface Deduction {
  id: string;
  companyId: string;
  employeeId: string;
  employeeName: string;
  amount: number;
  reason: string;
  type: DeductionType;
  month: number;
  year: number;
  createdAt: string;
}

// ── تذاكر الدعم ──
export type TicketCategory = "IT" | "HR" | "FINANCE" | "FACILITIES" | "OTHER";
export type TicketPriority = "LOW" | "MEDIUM" | "HIGH";
export type TicketStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";

export interface SupportTicket {
  id: string;
  companyId: string;
  number: string;
  requesterName: string;
  subject: string;
  description?: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  assignee?: string;
  createdAt: string;
}

// ── التأمين الطبي ──
export type InsuranceClass = "VIP" | "A_PLUS" | "A" | "B" | "C";
export type InsuranceStatus = "ACTIVE" | "EXPIRED" | "PENDING";

export interface InsurancePolicy {
  id: string;
  companyId: string;
  employeeId: string;
  employeeName: string;
  provider: string;
  policyNumber: string;
  memberId?: string;
  className: InsuranceClass;
  dependents: number;
  startDate: string;
  endDate: string;
  status: InsuranceStatus;
  chiLinked: boolean; // مرتبط بمنصة الضمان الصحي
}

// ── الأصول والعُهد ──
export type AssetCategory = "LAPTOP" | "PHONE" | "VEHICLE" | "SIM" | "ACCESS_CARD" | "OTHER";
export type AssetStatus = "ASSIGNED" | "RETURNED" | "LOST" | "MAINTENANCE";

export interface CompanyAsset {
  id: string;
  companyId: string;
  employeeId?: string;
  employeeName?: string;
  name: string;
  category: AssetCategory;
  serialNumber?: string;
  assignedAt?: string;
  returnedAt?: string;
  status: AssetStatus;
}

// ── تهيئة الموظفين الجدد ──
export interface OnboardingTask {
  id: string;
  companyId: string;
  employeeId: string;
  employeeName: string;
  title: string;
  isCompleted: boolean;
  dueDate?: string;
}

// ── التدريب والتطوير ──
export type TrainingStatus = "ENROLLED" | "IN_PROGRESS" | "COMPLETED";
export interface TrainingRecord {
  id: string;
  companyId: string;
  employeeId: string;
  employeeName: string;
  title: string;
  provider?: string;
  hours?: number;
  status: TrainingStatus;
  startDate?: string;
  completedAt?: string;
}

// ── مستندات الموظفين ──
export interface EmployeeDocument {
  id: string;
  companyId: string;
  employeeId: string;
  employeeName: string;
  type: string; // الهوية الوطنية / الإقامة / العقد / الشهادة ...
  number?: string;
  issueDate?: string;
  expiryDate?: string;
  createdAt: string;
}

// ── تقييم الأداء ──
export type ReviewStatus = "DRAFT" | "COMPLETED";
export interface ReviewCriterion {
  name: string;
  score: number; // 1-5
}
export interface PerformanceReview {
  id: string;
  companyId: string;
  employeeId: string;
  employeeName: string;
  cycle: string; // مثل "التقييم السنوي 2025"
  reviewerName: string;
  criteria: ReviewCriterion[];
  finalRating: number; // 1-5
  comments?: string;
  status: ReviewStatus;
  createdAt: string;
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

// ── الطلبات (منظومة موحّدة) ──
export type RequestKind = "LEAVE" | "PERMISSION" | "LOAN" | "REMOTE" | "DOCUMENT" | "TRANSFER" | "OTHER";
export type RequestStatus = "PENDING" | "APPROVED" | "REJECTED";
export type TransferType = "DEPARTMENT" | "COMPANY";

export interface CompanyRequest {
  id: string;
  companyId: string;
  employeeId: string;
  employeeName: string;
  kind: RequestKind;
  // حقول اختيارية بحسب نوع الطلب
  leaveType?: LeaveType;
  startDate?: string;
  endDate?: string;
  days?: number;
  date?: string; // للاستئذان / العمل عن بعد ليوم واحد
  hours?: number; // الاستئذان
  amount?: number; // السلفة
  installments?: number; // أقساط السلفة
  docType?: string; // نوع المستند المطلوب
  // النقل
  transferType?: TransferType;
  fromName?: string; // الإدارة أو الشركة الحالية
  targetDepartment?: string; // عند النقل بين الإدارات
  targetCompanyId?: string; // عند النقل بين الشركات
  targetCompanyName?: string;
  reason?: string;
  status: RequestStatus;
  createdAt: string;
}

// ── الإشعارات ──
export type NotificationType = "REQUEST" | "APPROVAL" | "ANNOUNCEMENT" | "INFO";

export interface AppNotification {
  id: string;
  companyId: string;
  title: string;
  body: string;
  type: NotificationType;
  read: boolean;
  createdAt: string; // ISO
}

// ── الإعلانات ──
export type AnnouncementAudience = "ALL" | "DEPARTMENT" | "EMPLOYEES";

export interface Announcement {
  id: string;
  companyId: string;
  title: string;
  content: string;
  audience: AnnouncementAudience;
  targetDept?: string;
  targetEmployeeIds?: string[];
  recipients: number;
  createdByName: string;
  createdAt: string;
}
