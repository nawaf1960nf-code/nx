"use client";

import { useState } from "react";
import { Play, BadgeCheck, Wallet } from "lucide-react";
import { useStore } from "@/store/useStore";
import { useScopedCompanyId } from "@/lib/scope";
import { roleHasPermission } from "@/lib/permissions";
import { Card, Badge, Button, Field, Select, StatCard } from "@/components/ui";
import { formatSAR } from "@/lib/format";
import { MONTH_NAMES } from "@/lib/payroll";
import type { PayrollStatus } from "@/lib/types";

const STATUS_META: Record<PayrollStatus, { label: string; tone: "warning" | "info" | "success" }> = {
  DRAFT: { label: "مسودة", tone: "warning" },
  APPROVED: { label: "معتمدة", tone: "info" },
  PAID: { label: "مصروفة", tone: "success" },
};

const now = new Date();

export default function PayrollPage() {
  const companyId = useScopedCompanyId();
  const role = useStore((s) => s.currentUser?.role);
  const payrollRuns = useStore((s) => s.payrollRuns);
  const runPayroll = useStore((s) => s.runPayroll);
  const setPayrollStatus = useStore((s) => s.setPayrollStatus);

  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [selected, setSelected] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const canRun = roleHasPermission(role, "SETTINGS_MANAGE");

  if (!companyId) {
    return <Card className="p-10 text-center text-sm text-slate-500">اختر شركة من المبدّل في الأعلى أولاً.</Card>;
  }

  const runs = payrollRuns.filter((r) => r.companyId === companyId);
  const current = runs.find((r) => r.id === selected) ?? runs[0] ?? null;

  function run() {
    if (!companyId) return;
    const id = runPayroll(companyId, month, year);
    if (id) {
      setSelected(id);
      setNotice(null);
    } else {
      setNotice("يوجد كشف رواتب لهذا الشهر مسبقاً.");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">الرواتب</h1>
        <p className="mt-1 text-sm text-slate-500">تشغيل كشف الرواتب واحتساب التأمينات (GOSI) آلياً.</p>
      </div>

      {canRun && (
        <Card className="p-5">
          <div className="flex flex-wrap items-end gap-4">
            <Field label="الشهر">
              <Select value={month} onChange={(e) => setMonth(Number(e.target.value))}>
                {MONTH_NAMES.map((m, i) => (
                  <option key={m} value={i + 1}>
                    {m}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="السنة">
              <Select value={year} onChange={(e) => setYear(Number(e.target.value))}>
                {[year - 1, year, year + 1].map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </Select>
            </Field>
            <Button onClick={run}>
              <Play size={16} /> تشغيل الرواتب
            </Button>
            {notice && <span className="text-sm text-danger">{notice}</span>}
          </div>
        </Card>
      )}

      {runs.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {runs.map((r) => (
            <button
              key={r.id}
              onClick={() => setSelected(r.id)}
              className={`rounded-md border px-3 py-1.5 text-sm ${
                current?.id === r.id ? "border-ink bg-ink text-white" : "border-slate-200 bg-white text-slate-600"
              }`}
            >
              {MONTH_NAMES[r.month - 1]} {r.year}
            </button>
          ))}
        </div>
      )}

      {current ? (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard label="عدد الموظفين" value={current.lines.length} />
            <StatCard label="إجمالي صافي الرواتب" value={formatSAR(current.total)} icon={<Wallet size={20} />} />
            <StatCard label="الحالة" value={<Badge tone={STATUS_META[current.status].tone}>{STATUS_META[current.status].label}</Badge>} />
          </div>

          <Card>
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <h2 className="text-base font-semibold text-slate-800">
                كشف {MONTH_NAMES[current.month - 1]} {current.year}
              </h2>
              {canRun && current.status !== "PAID" && (
                <Button onClick={() => setPayrollStatus(current.id, "PAID")}>
                  <BadgeCheck size={16} /> اعتماد الصرف
                </Button>
              )}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-right text-sm">
                <thead className="bg-slate-50 text-xs text-slate-500">
                  <tr>
                    <th className="px-5 py-3 font-medium">الموظف</th>
                    <th className="px-5 py-3 font-medium">الأساسي</th>
                    <th className="px-5 py-3 font-medium">البدلات</th>
                    <th className="px-5 py-3 font-medium">الإجمالي</th>
                    <th className="px-5 py-3 font-medium">التأمينات</th>
                    <th className="px-5 py-3 font-medium">الصافي</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {current.lines.map((l) => (
                    <tr key={l.employeeId} className="hover:bg-slate-50">
                      <td className="px-5 py-3 font-medium text-slate-800">{l.employeeName}</td>
                      <td className="px-5 py-3 text-slate-600">{formatSAR(l.baseSalary)}</td>
                      <td className="px-5 py-3 text-slate-600">{formatSAR(l.allowances)}</td>
                      <td className="px-5 py-3 text-slate-600">{formatSAR(l.gross)}</td>
                      <td className="px-5 py-3 text-danger">{l.gosi ? `- ${formatSAR(l.gosi)}` : "—"}</td>
                      <td className="px-5 py-3 font-semibold text-ink">{formatSAR(l.net)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t border-slate-200 bg-slate-50 font-semibold">
                    <td className="px-5 py-3 text-slate-700" colSpan={5}>
                      الإجمالي
                    </td>
                    <td className="px-5 py-3 text-ink">{formatSAR(current.total)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </Card>
        </>
      ) : (
        <Card className="p-10 text-center text-sm text-slate-400">لا يوجد كشف رواتب بعد. شغّل كشفاً جديداً للبدء.</Card>
      )}
    </div>
  );
}
