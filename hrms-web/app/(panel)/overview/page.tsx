"use client";

import { Building2, Users, CheckCircle2, Clock } from "lucide-react";
import { useStore } from "@/store/useStore";
import { StatCard, Card, Badge } from "@/components/ui";
import { formatDate } from "@/lib/format";

const STATUS_META = {
  ACTIVE: { label: "نشطة", tone: "success" as const },
  TRIAL: { label: "تجريبية", tone: "warning" as const },
  SUSPENDED: { label: "موقوفة", tone: "danger" as const },
};

const PLAN_LABELS = { BASIC: "أساسية", PRO: "احترافية", ENTERPRISE: "مؤسسية" };

export default function OverviewPage() {
  const companies = useStore((s) => s.companies);
  const employees = useStore((s) => s.employees);

  const active = companies.filter((c) => c.status === "ACTIVE").length;
  const trial = companies.filter((c) => c.status === "TRIAL").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">نظرة عامة على المنصّة</h1>
        <p className="mt-1 text-sm text-slate-500">ملخّص الشركات المشتركة والمستخدمين عبر النظام.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="إجمالي الشركات" value={companies.length} icon={<Building2 size={20} />} />
        <StatCard label="شركات نشطة" value={active} icon={<CheckCircle2 size={20} />} />
        <StatCard label="اشتراكات تجريبية" value={trial} icon={<Clock size={20} />} />
        <StatCard label="إجمالي الموظفين" value={employees.length} icon={<Users size={20} />} />
      </div>

      <Card>
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="text-base font-semibold text-slate-800">الشركات المشتركة</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="bg-slate-50 text-xs text-slate-500">
              <tr>
                <th className="px-5 py-3 font-medium">الشركة</th>
                <th className="px-5 py-3 font-medium">المدينة</th>
                <th className="px-5 py-3 font-medium">الباقة</th>
                <th className="px-5 py-3 font-medium">الموظفون</th>
                <th className="px-5 py-3 font-medium">الحالة</th>
                <th className="px-5 py-3 font-medium">نهاية الاشتراك</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {companies.map((c) => {
                const count = employees.filter((e) => e.companyId === c.id).length;
                const meta = STATUS_META[c.status];
                return (
                  <tr key={c.id} className="hover:bg-slate-50">
                    <td className="px-5 py-3 font-medium text-slate-800">{c.name}</td>
                    <td className="px-5 py-3 text-slate-600">{c.city}</td>
                    <td className="px-5 py-3 text-slate-600">{PLAN_LABELS[c.plan]}</td>
                    <td className="px-5 py-3 text-slate-600">
                      {count} / {c.seatLimit}
                    </td>
                    <td className="px-5 py-3">
                      <Badge tone={meta.tone}>{meta.label}</Badge>
                    </td>
                    <td className="px-5 py-3 text-slate-600">{formatDate(c.subscriptionEndsAt)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
