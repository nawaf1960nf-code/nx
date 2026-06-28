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
  Employee,
  LeaveRequest,
  LeaveStatus,
  NotificationType,
  PayrollRun,
  PayrollStatus,
  RequestStatus,
  UserRole,
} from "@/lib/types";
import {
  SEED_ANNOUNCEMENTS,
  SEED_ATTENDANCE,
  SEED_COMPANIES,
  SEED_EMPLOYEES,
  SEED_LEAVES,
  SEED_NOTIFICATIONS,
  SEED_REQUESTS,
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
          const lines = list.map(computePayrollLine);
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
          if (run && status === "PAID")
            audit("PAY_PAYROLL", `اعتماد صرف رواتب ${MONTH_NAMES[run.month - 1]} ${run.year}`, run.companyId);
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
    { name: "hrms-store", version: 4 },
  ),
);
