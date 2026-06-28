"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Building2,
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  LayoutGrid,
  UploadCloud,
  History,
  CalendarClock,
  Plane,
  Wallet,
  BarChart3,
  FileText,
  Megaphone,
  Bell,
  ChevronLeft,
} from "lucide-react";
import { useStore } from "@/store/useStore";
import { ROLE_LABELS, roleHasPermission } from "@/lib/permissions";
import { cn } from "@/lib/cn";

interface NavItem {
  href: string;
  label: string;
  icon: ReactNode;
}

export function PanelShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [showNotif, setShowNotif] = useState(false);

  const currentUser = useStore((s) => s.currentUser);
  const companies = useStore((s) => s.companies);
  const activeCompanyId = useStore((s) => s.activeCompanyId);
  const setActiveCompany = useStore((s) => s.setActiveCompany);
  const logout = useStore((s) => s.logout);
  const notifications = useStore((s) => s.notifications);
  const markNotificationRead = useStore((s) => s.markNotificationRead);
  const markAllNotificationsRead = useStore((s) => s.markAllNotificationsRead);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (mounted && !currentUser) router.replace("/login");
  }, [mounted, currentUser, router]);

  if (!mounted || !currentUser) {
    return <div className="grid min-h-screen place-items-center text-sm text-slate-400">جارٍ التحميل…</div>;
  }

  const isSuperAdmin = currentUser.role === "SUPER_ADMIN";
  const activeCompany = companies.find((c) => c.id === activeCompanyId) ?? null;

  const notifScope = currentUser.companyId ?? activeCompanyId;
  const scopedNotifs = notifications
    .filter((n) => n.companyId === notifScope)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const unreadCount = scopedNotifs.filter((n) => !n.read).length;

  const nav: NavItem[] = [];
  if (isSuperAdmin) {
    nav.push({ href: "/overview", label: "نظرة عامة", icon: <LayoutGrid size={18} /> });
    nav.push({ href: "/companies", label: "الشركات المشتركة", icon: <Building2 size={18} /> });
  }
  if (activeCompany || !isSuperAdmin) {
    nav.push({ href: "/dashboard", label: "لوحة الشركة", icon: <LayoutDashboard size={18} /> });
    nav.push({ href: "/employees", label: "الموظفون", icon: <Users size={18} /> });
    nav.push({ href: "/attendance", label: "الحضور والانصراف", icon: <CalendarClock size={18} /> });
    nav.push({ href: "/leaves", label: "الإجازات", icon: <Plane size={18} /> });
    nav.push({ href: "/requests", label: "الطلبات", icon: <FileText size={18} /> });
    nav.push({ href: "/announcements", label: "الإعلانات", icon: <Megaphone size={18} /> });
    if (roleHasPermission(currentUser.role, "FINANCIAL_VIEW")) {
      nav.push({ href: "/payroll", label: "الرواتب", icon: <Wallet size={18} /> });
    }
    nav.push({ href: "/reports", label: "التقارير", icon: <BarChart3 size={18} /> });
    if (roleHasPermission(currentUser.role, "EMPLOYEE_EDIT")) {
      nav.push({ href: "/import", label: "استيراد بيانات", icon: <UploadCloud size={18} /> });
    }
    nav.push({ href: "/notifications", label: "الإشعارات", icon: <Bell size={18} /> });
    nav.push({ href: "/settings", label: "الإعدادات", icon: <Settings size={18} /> });
  }
  // سجل النشاط لمدير النظام ومسؤولي الموارد البشرية.
  if (isSuperAdmin || roleHasPermission(currentUser.role, "SETTINGS_MANAGE")) {
    nav.push({ href: "/activity", label: "سجل النشاط", icon: <History size={18} /> });
  }

  return (
    <div className="flex min-h-screen">
      {/* الشريط الجانبي */}
      <aside className="flex w-64 shrink-0 flex-col border-l border-slate-200 bg-surface">
        <div className="flex items-center gap-2 border-b border-slate-200 px-5 py-4">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-ink font-bold text-white">م</span>
          <div>
            <p className="text-sm font-bold text-slate-800">منصّة الموارد البشرية</p>
            <p className="text-[11px] text-slate-400">إدارة شؤون الموظفين</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {nav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                  active ? "bg-ink text-white" : "text-slate-600 hover:bg-slate-100",
                )}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-slate-200 p-3">
          <button
            onClick={() => {
              logout();
              router.replace("/login");
            }}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            <LogOut size={18} />
            تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* المحتوى */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-slate-200 bg-surface px-6 py-3">
          <div className="flex items-center gap-3">
            {isSuperAdmin && (
              <select
                value={activeCompanyId ?? ""}
                onChange={(e) => setActiveCompany(e.target.value || null)}
                className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 outline-none focus:border-ink"
              >
                <option value="">كل الشركات (نظرة عامة)</option>
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            )}
            {!isSuperAdmin && activeCompany && (
              <span className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                <Building2 size={16} className="text-ink" />
                {activeCompany.name}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* جرس الإشعارات */}
            {notifScope && (
              <div className="relative">
                <button
                  onClick={() => setShowNotif((v) => !v)}
                  className="relative flex h-9 w-9 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100"
                  aria-label="الإشعارات"
                >
                  <Bell size={18} />
                  {unreadCount > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold text-white">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {showNotif && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowNotif(false)} aria-hidden />
                    <div className="absolute left-0 z-20 mt-2 w-80 overflow-hidden rounded-lg border border-slate-200 bg-surface shadow-xl">
                      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-2.5">
                        <span className="text-sm font-semibold text-slate-800">الإشعارات</span>
                        {unreadCount > 0 && (
                          <button
                            onClick={() => markAllNotificationsRead(notifScope)}
                            className="text-xs text-ink hover:underline"
                          >
                            تعليم الكل كمقروء
                          </button>
                        )}
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {scopedNotifs.length === 0 ? (
                          <p className="p-6 text-center text-sm text-slate-400">لا توجد إشعارات.</p>
                        ) : (
                          scopedNotifs.slice(0, 6).map((n) => (
                            <button
                              key={n.id}
                              onClick={() => markNotificationRead(n.id)}
                              className={cn(
                                "block w-full border-b border-slate-50 px-4 py-3 text-right hover:bg-slate-50",
                                !n.read && "bg-ink-50/40",
                              )}
                            >
                              <div className="flex items-center gap-2">
                                {!n.read && <span className="h-2 w-2 shrink-0 rounded-full bg-ink" />}
                                <span className="text-sm font-medium text-slate-800">{n.title}</span>
                              </div>
                              <span className="mt-0.5 block text-xs text-slate-500">{n.body}</span>
                            </button>
                          ))
                        )}
                      </div>
                      <Link
                        href="/notifications"
                        onClick={() => setShowNotif(false)}
                        className="block border-t border-slate-200 px-4 py-2.5 text-center text-sm font-medium text-ink hover:bg-slate-50"
                      >
                        عرض كل الإشعارات
                      </Link>
                    </div>
                  </>
                )}
              </div>
            )}

            <div className="text-left">
              <p className="text-sm font-semibold text-slate-800">{currentUser.name}</p>
              <p className="text-[11px] text-slate-400">{ROLE_LABELS[currentUser.role]}</p>
            </div>
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-ink-50 font-semibold text-ink">
              {currentUser.name.charAt(0)}
            </span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}

export { ChevronLeft };
