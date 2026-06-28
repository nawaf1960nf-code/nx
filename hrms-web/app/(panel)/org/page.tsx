"use client";

import Link from "next/link";
import { Building2, Users } from "lucide-react";
import { useStore } from "@/store/useStore";
import { useScopedCompanyId } from "@/lib/scope";
import { Card, Badge, StatCard } from "@/components/ui";

export default function OrgPage() {
  const companyId = useScopedCompanyId();
  const companies = useStore((s) => s.companies);
  const employees = useStore((s) => s.employees);

  if (!companyId) {
    return <Card className="p-10 text-center text-sm text-slate-500">اختر شركة من المبدّل في الأعلى أولاً.</Card>;
  }

  const company = companies.find((c) => c.id === companyId);
  const list = employees.filter((e) => e.companyId === companyId);

  // تجميع الموظفين حسب الإدارة.
  const byDept = new Map<string, typeof list>();
  for (const e of list) {
    if (!byDept.has(e.department)) byDept.set(e.department, []);
    byDept.get(e.department)!.push(e);
  }
  const departments = [...byDept.entries()];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">الهيكل التنظيمي</h1>
        <p className="mt-1 text-sm text-slate-500">توزيع الموظفين على الإدارات داخل {company?.name}.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="عدد الإدارات" value={departments.length} icon={<Building2 size={20} />} />
        <StatCard label="إجمالي الموظفين" value={list.length} icon={<Users size={20} />} />
        <StatCard label="متوسط حجم الإدارة" value={departments.length ? Math.round(list.length / departments.length) : 0} />
      </div>

      {/* قمة الهرم: الشركة */}
      <div className="flex flex-col items-center">
        <div className="rounded-lg border border-ink bg-ink px-6 py-3 text-center text-white shadow-sm">
          <Building2 className="mx-auto mb-1" size={20} />
          <p className="text-sm font-bold">{company?.name}</p>
          <p className="text-[11px] text-ink-100">{company?.city}</p>
        </div>
        <div className="h-6 w-px bg-slate-300" />
      </div>

      {/* الإدارات */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {departments.map(([dept, members]) => (
          <Card key={dept} className="overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3">
              <h2 className="text-sm font-bold text-slate-800">{dept}</h2>
              <Badge tone="info">{members.length}</Badge>
            </div>
            <ul className="divide-y divide-slate-100">
              {members.map((e) => (
                <li key={e.id}>
                  <Link href={`/employees/${e.id}`} className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50">
                    <span className="flex h-8 w-8 items-center justify-center rounded-md bg-ink-50 text-xs font-semibold text-ink">
                      {e.firstName.charAt(0)}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-800">{e.displayName}</p>
                      <p className="truncate text-xs text-slate-400">{e.position}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </div>
  );
}
