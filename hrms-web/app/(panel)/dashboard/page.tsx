"use client";

import Link from "next/link";
import { Users, UserCheck, Plane, FileClock, Megaphone } from "lucide-react";
import { useStore } from "@/store/useStore";
import { useScopedCompanyId } from "@/lib/scope";
import { StatCard, Card, Badge } from "@/components/ui";
import { EmployeeTimeline } from "@/components/EmployeeTimeline";
import { formatDate } from "@/lib/format";
import type { EmployeeEvent } from "@/lib/types";

const STATUS_LABELS: Record<string, string> = {
  ACTIVE: "نشط",
  ON_PROBATION: "تحت التجربة",
  ON_LEAVE: "في إجازة",
  TERMINATED: "منتهي",
  RESIGNED: "مستقيل",
};

export default function DashboardPage() {
  const companyId = useScopedCompanyId();
  const companies = useStore((s) => s.companies);
  const employees = useStore((s) => s.employees);
  const requests = useStore((s) => s.requests);
  const announcements = useStore((s) => s.announcements);

  if (!companyId) {
    return (
      <Card className="p-10 text-center text-sm text-slate-500">
        اختر شركة من المبدّل في الأعلى لعرض لوحتها.
      </Card>
    );
  }

  const company = companies.find((c) => c.id === companyId);
  const list = employees.filter((e) => e.companyId === companyId);
  const onProbation = list.filter((e) => e.status === "ON_PROBATION").length;
  const onLeave = list.filter((e) => e.status === "ON_LEAVE").length;
  const pendingRequests = requests.filter((r) => r.companyId === companyId && r.status === "PENDING").length;
  const companyAnnouncements = announcements.filter((a) => a.companyId === companyId).slice(0, 3);

  // تحليلات سريعة
  const deptCounts = new Map<string, number>();
  for (const e of list) deptCounts.set(e.department, (deptCounts.get(e.department) ?? 0) + 1);
  const byDept = [...deptCounts.entries()].sort((a, b) => b[1] - a[1]);
  const males = list.filter((e) => e.gender === "MALE").length;
  const females = list.filter((e) => e.gender === "FEMALE").length;
  const saudis = list.filter((e) => e.nationality.includes("سعودي")).length;
  const maxDept = Math.max(1, ...byDept.map(([, n]) => n));

  // أحدث الأحداث عبر موظفي الشركة.
  const recent: EmployeeEvent[] = list
    .flatMap((e) => e.events.map((ev) => ({ ...ev, id: `${e.id}-${ev.id}`, title: `${e.displayName} — ${ev.title}` })))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">لوحة {company?.name ?? "الشركة"}</h1>
          <p className="mt-1 text-sm text-slate-500">ملخّص حالة الموظفين والنشاط الأخير.</p>
        </div>
        {company && <Badge tone="info">{company.city}</Badge>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="إجمالي الموظفين" value={list.length} icon={<Users size={20} />} />
        <StatCard label="تحت التجربة" value={onProbation} icon={<UserCheck size={20} />} />
        <StatCard label="في إجازة" value={onLeave} icon={<Plane size={20} />} />
        <StatCard label="طلبات معلّقة" value={pendingRequests} icon={<FileClock size={20} />} />
      </div>

      {/* تحليلات سريعة */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <h2 className="mb-4 text-base font-semibold text-slate-800">التوزيع حسب الإدارة</h2>
          <div className="space-y-3">
            {byDept.map(([dept, n]) => (
              <div key={dept}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="text-slate-600">{dept}</span>
                  <span className="font-medium text-slate-800">{n}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-ink" style={{ width: `${(n / maxDept) * 100}%` }} />
                </div>
              </div>
            ))}
            {byDept.length === 0 && <p className="text-sm text-slate-400">لا توجد بيانات.</p>}
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="mb-4 text-base font-semibold text-slate-800">نظرة عامة</h2>
          <div className="space-y-4">
            <div>
              <div className="mb-1.5 flex justify-between text-sm">
                <span className="text-slate-600">ذكور / إناث</span>
                <span className="font-medium text-slate-800">{males} / {females}</span>
              </div>
              <div className="flex h-2 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full bg-ink" style={{ width: `${list.length ? (males / list.length) * 100 : 0}%` }} />
                <div className="h-full bg-success" style={{ width: `${list.length ? (females / list.length) * 100 : 0}%` }} />
              </div>
            </div>
            <div className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-2.5 text-sm">
              <span className="text-slate-600">السعوديون</span>
              <span className="font-semibold text-ink">{saudis} من {list.length}</span>
            </div>
            <div className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-2.5 text-sm">
              <span className="text-slate-600">نسبة التوطين</span>
              <span className="font-semibold text-success">{list.length ? Math.round((saudis / list.length) * 100) : 0}%</span>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <h2 className="text-base font-semibold text-slate-800">أحدث الموظفين</h2>
            <Link href="/employees" className="text-sm text-ink hover:underline">
              عرض الكل
            </Link>
          </div>
          <ul className="divide-y divide-slate-100">
            {list.slice(0, 5).map((e) => (
              <li key={e.id}>
                <Link href={`/employees/${e.id}`} className="flex items-center justify-between px-5 py-3 hover:bg-slate-50">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-md bg-ink-50 text-sm font-semibold text-ink">
                      {e.displayName.charAt(0)}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-slate-800">{e.displayName}</p>
                      <p className="text-xs text-slate-400">{e.position}</p>
                    </div>
                  </div>
                  <Badge tone={e.status === "ACTIVE" ? "success" : "warning"}>{STATUS_LABELS[e.status]}</Badge>
                </Link>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="text-base font-semibold text-slate-800">النشاط الأخير</h2>
          </div>
          <div className="p-3">
            <EmployeeTimeline events={recent} />
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 className="flex items-center gap-2 text-base font-semibold text-slate-800">
            <Megaphone size={18} className="text-ink" /> آخر الإعلانات
          </h2>
          <Link href="/announcements" className="text-sm text-ink hover:underline">
            عرض الكل
          </Link>
        </div>
        {companyAnnouncements.length === 0 ? (
          <p className="p-6 text-center text-sm text-slate-400">لا توجد إعلانات.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {companyAnnouncements.map((a) => (
              <li key={a.id} className="px-5 py-3.5">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-slate-800">{a.title}</p>
                  <span className="shrink-0 text-xs text-slate-400">{formatDate(a.createdAt)}</span>
                </div>
                <p className="mt-0.5 line-clamp-1 text-sm text-slate-500">{a.content}</p>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
