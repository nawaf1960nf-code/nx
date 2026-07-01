"use client";

import { useState } from "react";
import { Play, BadgeCheck, Wallet, Printer, Receipt } from "lucide-react";
import { useStore } from "@/store/useStore";
import { useScopedCompanyId } from "@/lib/scope";
import { roleHasPermission } from "@/lib/permissions";
import { Card, Badge, Button, Field, Select, StatCard, Modal } from "@/components/ui";
import { formatSAR } from "@/lib/format";
import { MONTH_NAMES } from "@/lib/payroll";
import type { PayrollLine, PayrollStatus } from "@/lib/types";

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
  const companies = useStore((s) => s.companies);
  const runPayroll = useStore((s) => s.runPayroll);
  const setPayrollStatus = useStore((s) => s.setPayrollStatus);

  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [selected, setSelected] = useState<string | null>(null);
  const [slip, setSlip] = useState<PayrollLine | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const canRun = roleHasPermission(role, "SETTINGS_MANAGE");

  if (!companyId) {
    return <Card className="p-10 text-center text-sm text-slate-500">اختر شركة من المبدّل في الأعلى أولاً.</Card>;
  }

  // حاجز وصول: بيانات الرواتب مقصورة على من يملك الصلاحية المالية،
  // حتى عند فتح الرابط مباشرة.
  if (!roleHasPermission(role, "FINANCIAL_VIEW")) {
    return <Card className="p-10 text-center text-sm text-slate-500">هذه الصفحة متاحة للموارد البشرية فقط.</Card>;
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
                    <th className="px-5 py-3 font-medium">السلف</th>
                    <th className="px-5 py-3 font-medium">خصومات</th>
                    <th className="px-5 py-3 font-medium">الصافي</th>
                    <th className="px-5 py-3 font-medium">قسيمة</th>
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
                      <td className="px-5 py-3 text-danger">{l.loanDeduction ? `- ${formatSAR(l.loanDeduction)}` : "—"}</td>
                      <td className="px-5 py-3 text-danger">{l.otherDeductions ? `- ${formatSAR(l.otherDeductions)}` : "—"}</td>
                      <td className="px-5 py-3 font-semibold text-ink">{formatSAR(l.net)}</td>
                      <td className="px-5 py-3">
                        <Button variant="secondary" className="px-2.5 py-1.5 text-xs" onClick={() => setSlip(l)}>
                          <Receipt size={14} /> عرض
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t border-slate-200 bg-slate-50 font-semibold">
                    <td className="px-5 py-3 text-slate-700" colSpan={7}>
                      الإجمالي
                    </td>
                    <td className="px-5 py-3 text-ink" colSpan={2}>{formatSAR(current.total)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </Card>
        </>
      ) : (
        <Card className="p-10 text-center text-sm text-slate-400">لا يوجد كشف رواتب بعد. شغّل كشفاً جديداً للبدء.</Card>
      )}

      {/* قسيمة الراتب — قابلة للطباعة */}
      <Modal open={slip !== null} onClose={() => setSlip(null)} title="قسيمة راتب">
        {slip && current && (
          <div>
            <div className="print-area rounded-lg border border-slate-200 p-5">
              <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-4">
                <div>
                  <p className="text-base font-bold text-slate-900">
                    {companies.find((c) => c.id === companyId)?.name ?? "الشركة"}
                  </p>
                  <p className="text-xs text-slate-500">
                    قسيمة راتب — {MONTH_NAMES[current.month - 1]} {current.year}
                  </p>
                </div>
                <span className="flex h-10 w-10 items-center justify-center rounded-md bg-ink font-bold text-white">م</span>
              </div>

              <p className="mb-4 text-sm font-semibold text-slate-800">{slip.employeeName}</p>

              <table className="w-full text-right text-sm">
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-2 text-slate-500">الراتب الأساسي</td>
                    <td className="py-2 font-medium text-slate-800">{formatSAR(slip.baseSalary)}</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-slate-500">البدلات</td>
                    <td className="py-2 font-medium text-slate-800">{formatSAR(slip.allowances)}</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-slate-500">إجمالي الأجر</td>
                    <td className="py-2 font-medium text-slate-800">{formatSAR(slip.gross)}</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-slate-500">خصم التأمينات (GOSI)</td>
                    <td className="py-2 font-medium text-danger">{slip.gosi ? `- ${formatSAR(slip.gosi)}` : "—"}</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-slate-500">قسط السلفة</td>
                    <td className="py-2 font-medium text-danger">{slip.loanDeduction ? `- ${formatSAR(slip.loanDeduction)}` : "—"}</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-slate-500">خصومات أخرى</td>
                    <td className="py-2 font-medium text-danger">{slip.otherDeductions ? `- ${formatSAR(slip.otherDeductions)}` : "—"}</td>
                  </tr>
                  <tr className="bg-ink-50">
                    <td className="py-2.5 pr-2 font-bold text-slate-800">صافي الراتب</td>
                    <td className="py-2.5 text-lg font-bold text-ink">{formatSAR(slip.net)}</td>
                  </tr>
                </tbody>
              </table>

              <p className="mt-4 text-[11px] text-slate-400">
                هذه القسيمة إشعار داخلي بمكوّنات الراتب ولا تُعد مستنداً بنكياً.
              </p>
            </div>

            <div className="no-print mt-4 flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setSlip(null)}>
                إغلاق
              </Button>
              <Button onClick={() => window.print()}>
                <Printer size={16} /> طباعة
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
