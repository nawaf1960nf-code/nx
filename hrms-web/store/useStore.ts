"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Announcement,
  AppNotification,
  AppUser,
  AttendanceRecord,
  AuditAction,
  AuditEntry,
  AuditUndo,
  Company,
  CompanyRequest,
  CompanyStatus,
  CurrentUser,
  Deduction,
  Employee,
  EmployeeDocument,
  InsurancePolicy,
  LeaveRequest,
  LeaveStatus,
  Loan,
  NotificationType,
  PayrollRun,
  PayrollStatus,
  PerformanceReview,
  ReviewCriterion,
  RequestStatus,
  SupportTicket,
  TicketStatus,
  UserRole,
} from "@/lib/types";
import {
  SEED_ANNOUNCEMENTS,
  SEED_ATTENDANCE,
  SEED_COMPANIES,
  SEED_DEDUCTIONS,
  SEED_DOCUMENTS,
  SEED_EMPLOYEES,
  SEED_INSURANCE,
  SEED_LEAVES,
  SEED_LOANS,
  SEED_NOTIFICATIONS,
  SEED_REQUESTS,
  SEED_REVIEWS,
  SEED_TICKETS,
  SEED_USERS,
} from "@/lib/seed";
import { computePayrollLine, lateMinutesFor, MONTH_NAMES } from "@/lib/payroll";

function genId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

interface StoreState {
  currentUser: CurrentUser | null;
  activeCompanyId: string | null;
  companies: Company[];
  employees: Employee[];
  users: AppUser[];
  auditLog: AuditEntry[];
  leaveRequests: LeaveRequest[];
  attendance: AttendanceRecord[];
  payrollRuns: PayrollRun[];
  requests: CompanyRequest[];
  announcements: Announcement[];
  notifications: AppNotification[];
  loans: Loan[];
  deductions: Deduction[];
  reviews: PerformanceReview[];
  documents: EmployeeDocument[];
  tickets: SupportTicket[];
  insurance: InsurancePolicy[];

  // المصادقة
  login: (user: { name: string; role: UserRole; companyId?: string }) => void;
  loginByEmail: (email: string) => boolean;
  logout: () => void;
  setActiveCompany: (companyId: string | null) => void;

  // الشركات
  addCompany: (data: Omit<Company, "id" | "createdAt">) => void;
  updateCompany: (id: string, patch: Partial<Company>) => void;
  setCompanyStatus: (id: string, status: CompanyStatus) => void;
  inviteCompanyAdmin: (companyId: string, data: { name: string; email: string }) => void;

  // الموظفون
  addEmployee: (data: Omit<Employee, "id" | "events">) => void;
  updateEmployee: (id: string, patch: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;
  importEmployees: (companyId: string, rows: Omit<Employee, "id" | "companyId" | "events">[]) => number;

  // الإجازات
  requestLeave: (data: Omit<LeaveRequest, "id" | "status" | "createdAt">) => void;
  setLeaveStatus: (id: string, status: Extract<LeaveStatus, "APPROVED" | "REJECTED">) => void;

  // الحضور
  markAttendance: (companyId: string, employeeId: string, employeeName: string) => void;

  // الرواتب
  runPayroll: (companyId: string, month: number, year: number) => string | null;
  setPayrollStatus: (runId: string, status: PayrollStatus) => void;

  // الطلبات
  submitRequest: (data: Omit<CompanyRequest, "id" | "status" | "createdAt">) => void;
  setRequestStatus: (id: string, status: Extract<RequestStatus, "APPROVED" | "REJECTED">) => void;

  // الإعلانات
  publishAnnouncement: (data: Omit<Announcement, "id" | "recipients" | "createdByName" | "createdAt">) => void;

  // الإشعارات
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: (companyId: string) => void;

  // السلف والخصومات
  grantLoan: (data: { companyId: string; employeeId: string; employeeName: string; amount: number; installments: number; startMonth: number; startYear: number }) => void;
  addDeduction: (data: Omit<Deduction, "id" | "createdAt">) => void;

  // تقييم الأداء
  addReview: (data: { companyId: string; employeeId: string; employeeName: string; cycle: string; criteria: ReviewCriterion[]; comments?: string }) => void;

  // المستندات
  addDocument: (data: Omit<EmployeeDocument, "id" | "createdAt">) => void;

  // تذاكر الدعم
  createTicket: (data: Omit<SupportTicket, "id" | "number" | "status" | "createdAt">) => void;
  setTicketStatus: (id: string, status: TicketStatus) => void;

  // التأمين الطبي
  addInsurance: (data: Omit<InsurancePolicy, "id" | "status" | "chiLinked">) => void;
  toggleChiLink: (id: string) => void;

  // التدقيق والتراجع
  revertAudit: (entryId: string) => void;
}

const REQUEST_KIND_LABELS: Record<CompanyRequest["kind"], string> = {
  LEAVE: "إجازة",
  PERMISSION: "استئذان",
  LOAN: "سلفة",
  REMOTE: "عمل عن بُعد",
  DOCUMENT: "مستند",
  OTHER: "طلب",
};

export const useStore = create<StoreState>()(
  persist(
    (set, get) => {
      // إضافة قيد في سجل النشاط مع حمولة التراجع.
      function audit(action: AuditAction, summary: string, companyId?: string, undo?: AuditUndo) {
        const actor = get().currentUser;
        const entry: AuditEntry = {
          id: genId("a"),
          at: new Date().toISOString(),
          actorName: actor?.name ?? "النظام",
          actorRole: actor?.role ?? "SUPER_ADMIN",
          companyId,
          action,
          summary,
          undo,
        };
        set((s) => ({ auditLog: [entry, ...s.auditLog] }));
      }

      // إنشاء إشعار للشركة.
      function notify(companyId: string, title: string, body: string, type: NotificationType) {
        const n: AppNotification = {
          id: genId("nt"),
          companyId,
          title,
          body,
          type,
          read: false,
          createdAt: new Date().toISOString(),
        };
        set((s) => ({ notifications: [n, ...s.notifications] }));
      }

      return {
        currentUser: null,
        activeCompanyId: null,
        companies: SEED_COMPANIES,
        employees: SEED_EMPLOYEES,
        users: SEED_USERS,
        auditLog: [],
        leaveRequests: SEED_LEAVES,
        attendance: SEED_ATTENDANCE,
        payrollRuns: [],
        requests: SEED_REQUESTS,
        announcements: SEED_ANNOUNCEMENTS,
        notifications: SEED_NOTIFICATIONS,
        loans: SEED_LOANS,
        deductions: SEED_DEDUCTIONS,
        reviews: SEED_REVIEWS,
        documents: SEED_DOCUMENTS,
        tickets: SEED_TICKETS,
        insurance: SEED_INSURANCE,

        login: (user) =>
          set({
            currentUser: { id: genId("u"), name: user.name, role: user.role, companyId: user.companyId },
            activeCompanyId: user.companyId ?? null,
          }),

        loginByEmail: (email) => {
          const user = get().users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
          if (!user) return false;
          set({
            currentUser: { id: user.id, name: user.name, role: user.role, companyId: user.companyId },
            activeCompanyId: user.companyId ?? null,
          });
          return true;
        },

        logout: () => set({ currentUser: null, activeCompanyId: null }),
        setActiveCompany: (companyId) => set({ activeCompanyId: companyId }),

        addCompany: (data) => {
          const company: Company = { ...data, id: genId("c"), createdAt: new Date().toISOString().slice(0, 10) };
          set((s) => ({ companies: [company, ...s.companies] }));
          audit("ADD_COMPANY", `إضافة شركة «${company.name}»`, company.id, {
            type: "REMOVE_COMPANY",
            companyId: company.id,
          });
        },

        updateCompany: (id, patch) => {
          const prev = get().companies.find((c) => c.id === id);
          set((s) => ({ companies: s.companies.map((c) => (c.id === id ? { ...c, ...patch } : c)) }));
          if (prev) audit("UPDATE_COMPANY", `تعديل بيانات «${prev.name}»`, id, { type: "RESTORE_COMPANY", company: prev });
        },

        setCompanyStatus: (id, status) => {
          const prev = get().companies.find((c) => c.id === id);
          set((s) => ({ companies: s.companies.map((c) => (c.id === id ? { ...c, status } : c)) }));
          if (prev) {
            const label = status === "SUSPENDED" ? "تعليق" : "تفعيل";
            audit("SET_COMPANY_STATUS", `${label} اشتراك «${prev.name}»`, id, { type: "RESTORE_COMPANY", company: prev });
          }
        },

        inviteCompanyAdmin: (companyId, data) => {
          const user: AppUser = {
            id: genId("u"),
            name: data.name,
            email: data.email,
            role: "HR_ADMIN",
            companyId,
            createdAt: new Date().toISOString().slice(0, 10),
          };
          set((s) => ({ users: [user, ...s.users] }));
          const company = get().companies.find((c) => c.id === companyId);
          audit("INVITE_ADMIN", `دعوة مسؤول «${data.email}» لشركة «${company?.name ?? ""}»`, companyId, {
            type: "REMOVE_USER",
            userId: user.id,
          });
        },

        addEmployee: (data) => {
          const employee: Employee = { ...data, id: genId("e"), events: [] };
          set((s) => ({ employees: [employee, ...s.employees] }));
          audit("ADD_EMPLOYEE", `إضافة موظف «${employee.displayName}»`, employee.companyId, {
            type: "REMOVE_EMPLOYEE",
            employeeId: employee.id,
          });
        },

        updateEmployee: (id, patch) => {
          const prev = get().employees.find((e) => e.id === id);
          set((s) => ({ employees: s.employees.map((e) => (e.id === id ? { ...e, ...patch } : e)) }));
          if (prev)
            audit("UPDATE_EMPLOYEE", `تعديل بيانات «${prev.displayName}»`, prev.companyId, {
              type: "RESTORE_EMPLOYEE",
              employee: prev,
            });
        },

        deleteEmployee: (id) => {
          const prev = get().employees.find((e) => e.id === id);
          set((s) => ({ employees: s.employees.filter((e) => e.id !== id) }));
          if (prev)
            audit("DELETE_EMPLOYEE", `حذف موظف «${prev.displayName}»`, prev.companyId, {
              type: "RESTORE_EMPLOYEE",
              employee: prev,
            });
        },

        importEmployees: (companyId, rows) => {
          const created: Employee[] = rows.map((r) => ({ ...r, id: genId("e"), companyId, events: [] }));
          set((s) => ({ employees: [...created, ...s.employees] }));
          const company = get().companies.find((c) => c.id === companyId);
          audit("IMPORT_EMPLOYEES", `استيراد ${created.length} موظف لشركة «${company?.name ?? ""}»`, companyId, {
            type: "REMOVE_EMPLOYEES",
            employeeIds: created.map((e) => e.id),
          });
          return created.length;
        },

        requestLeave: (data) => {
          const req: LeaveRequest = {
            ...data,
            id: genId("lv"),
            status: "PENDING",
            createdAt: new Date().toISOString().slice(0, 10),
          };
          set((s) => ({ leaveRequests: [req, ...s.leaveRequests] }));
          audit("REQUEST_LEAVE", `طلب إجازة لـ«${req.employeeName}» (${req.days} يوم)`, req.companyId);
        },

        setLeaveStatus: (id, status) => {
          const req = get().leaveRequests.find((l) => l.id === id);
          set((s) => ({ leaveRequests: s.leaveRequests.map((l) => (l.id === id ? { ...l, status } : l)) }));
          if (req) {
            const verb = status === "APPROVED" ? "اعتماد" : "رفض";
            audit(status === "APPROVED" ? "APPROVE_LEAVE" : "REJECT_LEAVE", `${verb} إجازة «${req.employeeName}»`, req.companyId);
          }
        },

        markAttendance: (companyId, employeeId, employeeName) => {
          const date = new Date().toISOString().slice(0, 10);
          const now = new Date().toTimeString().slice(0, 5);
          const existing = get().attendance.find((a) => a.employeeId === employeeId && a.date === date);

          if (!existing) {
            const late = lateMinutesFor(now);
            const record: AttendanceRecord = {
              id: genId("at"),
              companyId,
              employeeId,
              employeeName,
              date,
              checkIn: now,
              status: late > 0 ? "LATE" : "PRESENT",
              lateMinutes: late,
            };
            set((s) => ({ attendance: [record, ...s.attendance] }));
            audit("RECORD_ATTENDANCE", `تسجيل حضور «${employeeName}» الساعة ${now}`, companyId);
          } else if (!existing.checkOut) {
            set((s) => ({
              attendance: s.attendance.map((a) => (a.id === existing.id ? { ...a, checkOut: now } : a)),
            }));
            audit("RECORD_ATTENDANCE", `تسجيل انصراف «${employeeName}» الساعة ${now}`, companyId);
          }
        },

        runPayroll: (companyId, month, year) => {
          const exists = get().payrollRuns.find((r) => r.companyId === companyId && r.month === month && r.year === year);
          if (exists) return null;
          const list = get().employees.filter((e) => e.companyId === companyId && e.status !== "TERMINATED" && e.status !== "RESIGNED");
          const loans = get().loans;
          const deductions = get().deductions;
          const lines = list.map((emp) => {
            // قسط السلفة الشهري (لا يتجاوز المتبقّي).
            const loanDed = loans
              .filter((l) => l.employeeId === emp.id && l.status === "ACTIVE" && l.remaining > 0)
              .reduce((s, l) => s + Math.min(l.installmentAmount, l.remaining), 0);
            // خصومات الشهر.
            const otherDed = deductions
              .filter((d) => d.employeeId === emp.id && d.month === month && d.year === year)
              .reduce((s, d) => s + d.amount, 0);
            return computePayrollLine(emp, loanDed, otherDed);
          });
          const total = lines.reduce((sum, l) => sum + l.net, 0);
          const run: PayrollRun = {
            id: genId("pr"),
            companyId,
            month,
            year,
            status: "DRAFT",
            lines,
            total: Math.round((total + Number.EPSILON) * 100) / 100,
            createdAt: new Date().toISOString().slice(0, 10),
          };
          set((s) => ({ payrollRuns: [run, ...s.payrollRuns] }));
          audit("RUN_PAYROLL", `تشغيل رواتب ${MONTH_NAMES[month - 1]} ${year} (${lines.length} موظف)`, companyId);
          return run.id;
        },

        setPayrollStatus: (runId, status) => {
          const run = get().payrollRuns.find((r) => r.id === runId);
          set((s) => ({ payrollRuns: s.payrollRuns.map((r) => (r.id === runId ? { ...r, status } : r)) }));
          if (run && status === "PAID" && run.status !== "PAID") {
            // عند الصرف: خصم قسط من سلف الموظفين الذين خُصم منهم في هذا الكشف.
            const debtors = new Set(run.lines.filter((l) => l.loanDeduction > 0).map((l) => l.employeeId));
            set((s) => ({
              loans: s.loans.map((l) => {
                if (l.companyId !== run.companyId || l.status !== "ACTIVE" || !debtors.has(l.employeeId)) return l;
                const remaining = Math.max(0, l.remaining - l.installmentAmount);
                return {
                  ...l,
                  paidInstallments: l.paidInstallments + 1,
                  remaining,
                  status: remaining <= 0 ? "SETTLED" : "ACTIVE",
                };
              }),
            }));
            audit("PAY_PAYROLL", `اعتماد صرف رواتب ${MONTH_NAMES[run.month - 1]} ${run.year}`, run.companyId);
          }
        },

        submitRequest: (data) => {
          const req: CompanyRequest = {
            ...data,
            id: genId("rq"),
            status: "PENDING",
            createdAt: new Date().toISOString().slice(0, 10),
          };
          set((s) => ({ requests: [req, ...s.requests] }));
          const label = REQUEST_KIND_LABELS[req.kind];
          notify(req.companyId, "طلب جديد", `طلب ${label} من ${req.employeeName} بانتظار الاعتماد.`, "REQUEST");
          audit("SUBMIT_REQUEST", `طلب ${label} من «${req.employeeName}»`, req.companyId);
        },

        setRequestStatus: (id, status) => {
          const req = get().requests.find((r) => r.id === id);
          set((s) => ({ requests: s.requests.map((r) => (r.id === id ? { ...r, status } : r)) }));
          if (req) {
            const label = REQUEST_KIND_LABELS[req.kind];
            const verb = status === "APPROVED" ? "اعتماد" : "رفض";
            notify(req.companyId, `${verb} طلب`, `تم ${verb} طلب ${label} الخاص بـ${req.employeeName}.`, "APPROVAL");
            audit("DECIDE_REQUEST", `${verb} طلب ${label} «${req.employeeName}»`, req.companyId);
          }
        },

        publishAnnouncement: (data) => {
          const employees = get().employees.filter((e) => e.companyId === data.companyId);
          let recipients = employees.length;
          if (data.audience === "DEPARTMENT") {
            recipients = employees.filter((e) => e.department === data.targetDept).length;
          } else if (data.audience === "EMPLOYEES") {
            recipients = data.targetEmployeeIds?.length ?? 0;
          }
          const announcement: Announcement = {
            ...data,
            id: genId("an"),
            recipients,
            createdByName: get().currentUser?.name ?? "الإدارة",
            createdAt: new Date().toISOString().slice(0, 10),
          };
          set((s) => ({ announcements: [announcement, ...s.announcements] }));
          notify(data.companyId, "إعلان منشور", `${announcement.title} (إلى ${recipients} مستلم).`, "ANNOUNCEMENT");
          audit("PUBLISH_ANNOUNCEMENT", `نشر إعلان «${announcement.title}»`, data.companyId);
        },

        markNotificationRead: (id) =>
          set((s) => ({ notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)) })),

        markAllNotificationsRead: (companyId) =>
          set((s) => ({
            notifications: s.notifications.map((n) => (n.companyId === companyId ? { ...n, read: true } : n)),
          })),

        grantLoan: (data) => {
          const installmentAmount = Math.round((data.amount / Math.max(1, data.installments)) * 100) / 100;
          const loan: Loan = {
            id: genId("ln"),
            companyId: data.companyId,
            employeeId: data.employeeId,
            employeeName: data.employeeName,
            amount: data.amount,
            installments: data.installments,
            installmentAmount,
            paidInstallments: 0,
            remaining: data.amount,
            startMonth: data.startMonth,
            startYear: data.startYear,
            status: "ACTIVE",
            createdAt: new Date().toISOString().slice(0, 10),
          };
          set((s) => ({ loans: [loan, ...s.loans] }));
          notify(data.companyId, "سلفة معتمدة", `تم منح سلفة بقيمة ${data.amount} ر.س لـ${data.employeeName} على ${data.installments} قسط.`, "APPROVAL");
          audit("GRANT_LOAN", `منح سلفة ${data.amount} ر.س لـ«${data.employeeName}»`, data.companyId);
        },

        addDeduction: (data) => {
          const deduction: Deduction = { ...data, id: genId("dd"), createdAt: new Date().toISOString().slice(0, 10) };
          set((s) => ({ deductions: [deduction, ...s.deductions] }));
          audit("ADD_DEDUCTION", `خصم ${data.amount} ر.س على «${data.employeeName}» (${data.reason})`, data.companyId);
        },

        addReview: (data) => {
          const finalRating =
            data.criteria.length > 0
              ? Math.round((data.criteria.reduce((s, c) => s + c.score, 0) / data.criteria.length) * 100) / 100
              : 0;
          const review: PerformanceReview = {
            id: genId("pr"),
            companyId: data.companyId,
            employeeId: data.employeeId,
            employeeName: data.employeeName,
            cycle: data.cycle,
            reviewerName: get().currentUser?.name ?? "الإدارة",
            criteria: data.criteria,
            finalRating,
            comments: data.comments,
            status: "COMPLETED",
            createdAt: new Date().toISOString().slice(0, 10),
          };
          set((s) => ({ reviews: [review, ...s.reviews] }));
          notify(data.companyId, "تقييم جديد", `تم إنجاز تقييم ${data.employeeName} بنتيجة ${finalRating} من 5.`, "INFO");
          audit("ADD_REVIEW", `تقييم «${data.employeeName}» (${finalRating}/5)`, data.companyId);
        },

        addDocument: (data) => {
          const doc: EmployeeDocument = { ...data, id: genId("doc"), createdAt: new Date().toISOString().slice(0, 10) };
          set((s) => ({ documents: [doc, ...s.documents] }));
          audit("ADD_DOCUMENT", `إضافة مستند «${data.type}» لـ«${data.employeeName}»`, data.companyId);
        },

        createTicket: (data) => {
          const seq = get().tickets.filter((t) => t.companyId === data.companyId).length + 1001;
          const ticket: SupportTicket = {
            ...data,
            id: genId("tk"),
            number: `TK-${seq}`,
            status: "OPEN",
            createdAt: new Date().toISOString().slice(0, 10),
          };
          set((s) => ({ tickets: [ticket, ...s.tickets] }));
          notify(data.companyId, "تذكرة دعم جديدة", `${ticket.number}: ${data.subject}`, "INFO");
          audit("CREATE_TICKET", `تذكرة دعم ${ticket.number}: ${data.subject}`, data.companyId);
        },

        setTicketStatus: (id, status) => {
          const t = get().tickets.find((x) => x.id === id);
          set((s) => ({ tickets: s.tickets.map((x) => (x.id === id ? { ...x, status } : x)) }));
          if (t) audit("UPDATE_TICKET", `تحديث حالة التذكرة ${t.number}`, t.companyId);
        },

        addInsurance: (data) => {
          const policy: InsurancePolicy = { ...data, id: genId("in"), status: "ACTIVE", chiLinked: false };
          set((s) => ({ insurance: [policy, ...s.insurance] }));
          audit("ADD_INSURANCE", `وثيقة تأمين «${data.provider}» لـ«${data.employeeName}»`, data.companyId);
        },

        toggleChiLink: (id) => {
          const p = get().insurance.find((x) => x.id === id);
          set((s) => ({ insurance: s.insurance.map((x) => (x.id === id ? { ...x, chiLinked: !x.chiLinked } : x)) }));
          if (p && !p.chiLinked) audit("LINK_CHI", `ربط وثيقة ${p.employeeName} بالضمان الصحي`, p.companyId);
        },

        revertAudit: (entryId) => {
          const entry = get().auditLog.find((a) => a.id === entryId);
          if (!entry || !entry.undo || entry.reverted) return;
          const u = entry.undo;

          set((s) => {
            switch (u.type) {
              case "REMOVE_COMPANY":
                return { companies: s.companies.filter((c) => c.id !== u.companyId) };
              case "RESTORE_COMPANY":
                return { companies: s.companies.map((c) => (c.id === u.company.id ? u.company : c)) };
              case "REMOVE_EMPLOYEE":
                return { employees: s.employees.filter((e) => e.id !== u.employeeId) };
              case "RESTORE_EMPLOYEE": {
                const exists = s.employees.some((e) => e.id === u.employee.id);
                return {
                  employees: exists
                    ? s.employees.map((e) => (e.id === u.employee.id ? u.employee : e))
                    : [u.employee, ...s.employees],
                };
              }
              case "REMOVE_EMPLOYEES":
                return { employees: s.employees.filter((e) => !u.employeeIds.includes(e.id)) };
              case "REMOVE_USER":
                return { users: s.users.filter((usr) => usr.id !== u.userId) };
              default:
                return {};
            }
          });

          set((s) => ({
            auditLog: s.auditLog.map((a) => (a.id === entryId ? { ...a, reverted: true } : a)),
          }));
          audit("REVERT", `تراجع عن: ${entry.summary}`, entry.companyId);
        },
      };
    },
    { name: "hrms-store", version: 7 },
  ),
);
