"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, ShieldCheck, Users, Briefcase, LogIn } from "lucide-react";
import { useStore } from "@/store/useStore";
import type { UserRole } from "@/lib/types";

interface Profile {
  name: string;
  role: UserRole;
  companyId?: string;
  subtitle: string;
  icon: React.ReactNode;
  to: string;
}

const PROFILES: Profile[] = [
  {
    name: "أحمد العنزي",
    role: "SUPER_ADMIN",
    subtitle: "مدير النظام — إدارة الشركات المشتركة",
    icon: <ShieldCheck size={20} />,
    to: "/overview",
  },
  {
    name: "سارة العتيبي",
    role: "HR_ADMIN",
    companyId: "c-alfajr",
    subtitle: "موارد بشرية — شركة الفجر القابضة (ترى الرواتب)",
    icon: <Users size={20} />,
    to: "/dashboard",
  },
  {
    name: "عبدالله القحطاني",
    role: "MANAGER",
    companyId: "c-alfajr",
    subtitle: "مدير مباشر — شركة الفجر (لا يرى البيانات المالية)",
    icon: <Briefcase size={20} />,
    to: "/dashboard",
  },
  {
    name: "ماجد الغامدي",
    role: "HR_ADMIN",
    companyId: "c-noor",
    subtitle: "موارد بشرية — مؤسسة نور للتجارة",
    icon: <Building2 size={20} />,
    to: "/dashboard",
  },
];

export default function LoginPage() {
  const router = useRouter();
  const login = useStore((s) => s.login);
  const loginByEmail = useStore((s) => s.loginByEmail);

  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);

  function enter(p: Profile) {
    login({ name: p.name, role: p.role, companyId: p.companyId });
    router.push(p.to);
  }

  function enterByEmail() {
    if (!email.trim()) return;
    const ok = loginByEmail(email);
    if (!ok) {
      setError(true);
      return;
    }
    const user = useStore.getState().currentUser;
    router.push(user?.role === "SUPER_ADMIN" ? "/overview" : "/dashboard");
  }

  return (
    <main className="grid min-h-screen place-items-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-md bg-ink text-lg font-bold text-white">
            م
          </span>
          <h1 className="text-xl font-bold text-slate-900">منصّة إدارة الموارد البشرية</h1>
          <p className="mt-1 text-sm text-slate-500">اختر حساباً للدخول إلى لوحة التحكم</p>
        </div>

        <div className="space-y-3">
          {PROFILES.map((p) => (
            <button
              key={p.name + p.role}
              onClick={() => enter(p)}
              className="flex w-full items-center gap-3 rounded-lg border border-slate-200 bg-surface px-4 py-3 text-right shadow-sm transition-colors hover:border-ink hover:bg-ink-50"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-md bg-ink-50 text-ink">{p.icon}</span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-slate-800">{p.name}</span>
                <span className="block text-xs text-slate-500">{p.subtitle}</span>
              </span>
            </button>
          ))}
        </div>

        <div className="my-5 flex items-center gap-3 text-xs text-slate-400">
          <span className="h-px flex-1 bg-slate-200" />
          أو الدخول بالبريد الإلكتروني
          <span className="h-px flex-1 bg-slate-200" />
        </div>

        <div className="rounded-lg border border-slate-200 bg-surface p-4 shadow-sm">
          <div className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(false);
              }}
              onKeyDown={(e) => e.key === "Enter" && enterByEmail()}
              placeholder="admin@company.sa"
              className="flex-1 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-ink focus:ring-2 focus:ring-ink/20"
            />
            <button
              onClick={enterByEmail}
              className="inline-flex items-center gap-1.5 rounded-md bg-ink px-4 py-2 text-sm font-medium text-white hover:bg-ink-700"
            >
              <LogIn size={16} /> دخول
            </button>
          </div>
          {error && <p className="mt-2 text-xs text-danger">لا يوجد حساب بهذا البريد. جرّب: sara@alfajr.sa</p>}
          <p className="mt-2 text-xs text-slate-400">حسابات للتجربة: admin@system.sa · sara@alfajr.sa · majed@noor.sa</p>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          بيئة تجريبية — البيانات محفوظة محلياً في متصفحك.
        </p>
      </div>
    </main>
  );
}
