"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  AppUser,
  AuditAction,
  AuditEntry,
  AuditUndo,
  Company,
  CompanyStatus,
  CurrentUser,
  Employee,
  UserRole,
} from "@/lib/types";
import { SEED_COMPANIES, SEED_EMPLOYEES, SEED_USERS } from "@/lib/seed";

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

  // التدقيق والتراجع
  revertAudit: (entryId: string) => void;
}

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

      return {
        currentUser: null,
        activeCompanyId: null,
        companies: SEED_COMPANIES,
        employees: SEED_EMPLOYEES,
        users: SEED_USERS,
        auditLog: [],

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
    { name: "hrms-store", version: 2 },
  ),
);
