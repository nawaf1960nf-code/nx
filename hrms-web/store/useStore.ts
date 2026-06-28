"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Company, CompanyStatus, CurrentUser, Employee, UserRole } from "@/lib/types";
import { SEED_COMPANIES, SEED_EMPLOYEES } from "@/lib/seed";

function genId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

interface StoreState {
  currentUser: CurrentUser | null;
  activeCompanyId: string | null; // الشركة قيد العرض (لمدير النظام)
  companies: Company[];
  employees: Employee[];

  // المصادقة
  login: (user: { name: string; role: UserRole; companyId?: string }) => void;
  logout: () => void;
  setActiveCompany: (companyId: string | null) => void;

  // الشركات
  addCompany: (data: Omit<Company, "id" | "createdAt">) => void;
  updateCompany: (id: string, patch: Partial<Company>) => void;
  setCompanyStatus: (id: string, status: CompanyStatus) => void;

  // الموظفون
  addEmployee: (data: Omit<Employee, "id" | "events">) => void;
  updateEmployee: (id: string, patch: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      currentUser: null,
      activeCompanyId: null,
      companies: SEED_COMPANIES,
      employees: SEED_EMPLOYEES,

      login: (user) =>
        set({
          currentUser: { id: genId("u"), name: user.name, role: user.role, companyId: user.companyId },
          activeCompanyId: user.companyId ?? null,
        }),

      logout: () => set({ currentUser: null, activeCompanyId: null }),

      setActiveCompany: (companyId) => set({ activeCompanyId: companyId }),

      addCompany: (data) =>
        set((state) => ({
          companies: [
            { ...data, id: genId("c"), createdAt: new Date().toISOString().slice(0, 10) },
            ...state.companies,
          ],
        })),

      updateCompany: (id, patch) =>
        set((state) => ({
          companies: state.companies.map((c) => (c.id === id ? { ...c, ...patch } : c)),
        })),

      setCompanyStatus: (id, status) =>
        set((state) => ({
          companies: state.companies.map((c) => (c.id === id ? { ...c, status } : c)),
        })),

      addEmployee: (data) =>
        set((state) => ({
          employees: [{ ...data, id: genId("e"), events: [] }, ...state.employees],
        })),

      updateEmployee: (id, patch) =>
        set((state) => ({
          employees: state.employees.map((e) => (e.id === id ? { ...e, ...patch } : e)),
        })),

      deleteEmployee: (id) =>
        set((state) => ({ employees: state.employees.filter((e) => e.id !== id) })),
    }),
    { name: "hrms-store", version: 1 },
  ),
);
