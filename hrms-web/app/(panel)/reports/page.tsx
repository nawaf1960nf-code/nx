"use client";

import { Download, Users, Coins, PieChart } from "lucide-react";
import * as XLSX from "xlsx";
import { useStore } from "@/store/useStore";
import { useScopedCompanyId } from "@/lib/scope";
import { roleHasPermission } from "@/lib/permissions";
import { Card, Button, StatCard } from "@/components/ui";
import { formatSAR } from "@/lib/format";
import { calculateEndOfService, sumWage } from "@/lib/eos";

function exportSheet(rows: Record<string, unknown>[], filename: string, sheet = "تقرير") {
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheet);
  XLSX.writeFile(wb, filename);
}

export default function ReportsPage() {
  const companyId = useScopedCompanyId();
  const role = useStore((s) => s.currentUser?.role);
  const employees = useStore((s) => s.employees);

  const canFinance = roleHasPermission(role, "FINANCIAL_VIEW");

  if (!companyId) {
    return <Card className="p-10 text-center text-sm text-slate-500">اختر شركة من المبدّل في الأعلى أولاً.</Card>;
  }

  const list = employees.filter((e) => e.companyId === companyId);
  const active = list.filter((e) => e.status !== "TERMINATED" && e.status !== "RESIGNED");

  // تعداد حسب القسم
  const byDept = new Map<string, number>();
  for (const e of list) byDept.set(e.department, (byDept.get(e.department) ?? 0) + 1);
  const deptRows = [...byDept.entries()].map(([department, count]) => ({ القسم: department, العدد: count }));

  // مخصص نهاية الخدمة
  const eosRows = active.map((e) => {
    const r = calculateEndOfService({
      hireDate: new Date(e.hireDate),
      lastWorkingDay: new Date(),
      reason: "TERMINATION",
      wage: {
        baseSalary: e.baseSalary,
        housingAllowance: e.housingAllowance,
        transportAllowance: e.transportAllowance,
        otherAllowances: e.otherAllowances,
      },
    });
    return { الموظف: e.displayName, "سنوات الخدمة": r.yearsOfService, "المخصص (ر.س)": r.totalPayable };
  });
  const eosTotal = eosRows.reduce((s, r) => s + (r["المخصص (ر.س)"] as number), 0);

  const totalPayroll = active.reduce(
    (s, e) =>
      s +
      sumWage({
        baseSalary: e.baseSalary,
        housingAllowance: e.housingAllowance,
        transportAllowance: e.transportAllowance,
        otherAllowances: e.otherAllowances,
      }),
    0,
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">التقارير</h1>
        <p className="mt-1 text-sm text-slate-500">تقارير قياسية قابلة للتصدير إلى إكسل.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="إجمالي الموظفين" value={list.length} icon={<Users size={20} />} />
        {canFinance && <StatCard label="إجمالي الأجور الشهرية" value={formatSAR(totalPayroll)} icon={<Coins size={20} />} />}
        {canFinance && <StatCard label="مخصص نهاية الخدمة" value={formatSAR(eosTotal)} icon={<PieChart size={20} />} />}
      </div>

      {/* تعداد الموظفين حسب القسم */}
      <Card>
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 className="text-base font-semibold text-slate-800">تعداد الموظفين حسب القسم</h2>
          <Button variant="secondary" onClick={() => exportSheet(deptRows, "تعداد_الأقسام.xlsx", "الأقسام")}>
            <Download size={16} /> تصدير إكسل
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="bg-slate-50 text-xs text-slate-500">
              <tr>
                <th className="px-5 py-3 font-medium">القسم</th>
                <th className="px-5 py-3 font-medium">العدد</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {deptRows.map((r) => (
                <tr key={r.القسم} className="hover:bg-slate-50">
                  <td className="px-5 py-3 font-medium text-slate-800">{r.القسم}</td>
                  <td className="px-5 py-3 text-slate-600">{r.العدد}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* مخصص نهاية الخدمة */}
      {canFinance && (
        <Card>
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <h2 className="text-base font-semibold text-slate-800">مخصص نهاية الخدمة (تقدير)</h2>
            <Button variant="secondary" onClick={() => exportSheet(eosRows, "مخصص_نهاية_الخدمة.xlsx", "نهاية الخدمة")}>
              <Download size={16} /> تصدير إكسل
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead className="bg-slate-50 text-xs text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-medium">الموظف</th>
                  <th className="px-5 py-3 font-medium">سنوات الخدمة</th>
                  <th className="px-5 py-3 font-medium">المخصص المقدّر</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {eosRows.map((r, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="px-5 py-3 font-medium text-slate-800">{r.الموظف}</td>
                    <td className="px-5 py-3 text-slate-600">{r["سنوات الخدمة"]}</td>
                    <td className="px-5 py-3 text-slate-600">{formatSAR(r["المخصص (ر.س)"] as number)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-slate-200 bg-slate-50 font-semibold">
                  <td className="px-5 py-3 text-slate-700" colSpan={2}>
                    إجمالي المخصص
                  </td>
                  <td className="px-5 py-3 text-ink">{formatSAR(eosTotal)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
