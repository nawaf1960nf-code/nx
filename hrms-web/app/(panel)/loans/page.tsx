"use client";

import { useState } from "react";
import { Plus, Wallet, MinusCircle } from "lucide-react";
import { useStore } from "@/store/useStore";
import { useScopedCompanyId } from "@/lib/scope";
import { roleHasPermission } from "@/lib/permissions";
import { Card, Badge, Button, Modal, Field, Input, Select, StatCard } from "@/components/ui";
import { formatSAR } from "@/lib/format";
import type { DeductionType } from "@/lib/types";

const now = new Date();
const DEDUCTION_LABELS: Record<DeductionType, string> = {
  PENALTY: "جزاء",
  ADVANCE: "سلفة نقدية",
  OTHER: "أخرى",
};

export default function LoansPage() {
  const companyId = useScopedCompanyId();
  const role = useStore((s) => s.currentUser?.role);
  const employees = useStore((s) => s.employees);
  const loans = useStore((s) => s.loans);
  const deductions = useStore((s) => s.deductions);
  const grantLoan = useStore((s) => s.grantLoan);
  const addDeduction = useStore((s) => s.addDeduction);

  const [loanOpen, setLoanOpen] = useState(false);
  const [dedOpen, setDedOpen] = useState(false);
  const [lf, setLf] = useState({ employeeId: "", amount: 10000, installments: 10 });
  const [df, setDf] = useState({ employeeId: "", amount: 200, reason: "", type: "PENALTY" as DeductionType });

  const canManage = roleHasPermission(role, "FINANCIAL_VIEW");

  if (!companyId) {
    return <Card className="p-10 text-center text-sm text-slate-500">اختر شركة من المبدّل في الأعلى أولاً.</Card>;
  }
  if (!canManage) {
    return <Card className="p-10 text-center text-sm text-slate-500">هذه الصفحة متاحة للموارد البشرية فقط.</Card>;
  }

  const companyEmployees = employees.filter((e) => e.companyId === companyId);
  const companyLoans = loans.filter((l) => l.companyId === companyId);
  const companyDeductions = deductions.filter((d) => d.companyId === companyId);
  const outstanding = companyLoans.filter((l) => l.status === "ACTIVE").reduce((s, l) => s + l.remaining, 0);

  function submitLoan() {
    const emp = companyEmployees.find((e) => e.id === lf.employeeId) ?? companyEmployees[0];
    if (!emp || !companyId) return;
    grantLoan({
      companyId,
      employeeId: emp.id,
      employeeName: emp.displayName,
      amount: lf.amount,
      installments: lf.installments,
      startMonth: now.getMonth() + 1,
      startYear: now.getFullYear(),
    });
    setLoanOpen(false);
    setLf({ employeeId: "", amount: 10000, installments: 10 });
  }

  function submitDeduction() {
    const emp = companyEmployees.find((e) => e.id === df.employeeId) ?? companyEmployees[0];
    if (!emp || !companyId) return;
    addDeduction({
      companyId,
      employeeId: emp.id,
      employeeName: emp.displayName,
      amount: df.amount,
      reason: df.reason || DEDUCTION_LABELS[df.type],
      type: df.type,
      month: now.getMonth() + 1,
      year: now.getFullYear(),
    });
    setDedOpen(false);
    setDf({ employeeId: "", amount: 200, reason: "", type: "PENALTY" });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">السلف والخصومات</h1>
        <p className="mt-1 text-sm text-slate-500">تُخصم الأقساط والخصومات آلياً من كشف الرواتب.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="سلف نشطة" value={companyLoans.filter((l) => l.status === "ACTIVE").length} icon={<Wallet size={20} />} />
        <StatCard label="إجمالي المتبقّي" value={formatSAR(outstanding)} />
        <StatCard label="خصومات الشهر" value={companyDeductions.length} icon={<MinusCircle size={20} />} />
      </div>

      {/* السلف */}
      <Card>
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 className="text-base font-semibold text-slate-800">السلف</h2>
          <Button onClick={() => setLoanOpen(true)}>
            <Plus size={16} /> منح سلفة
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="bg-slate-50 text-xs text-slate-500">
              <tr>
                <th className="px-5 py-3 font-medium">الموظف</th>
                <th className="px-5 py-3 font-medium">المبلغ</th>
                <th className="px-5 py-3 font-medium">القسط</th>
                <th className="px-5 py-3 font-medium">التقدّم</th>
                <th className="px-5 py-3 font-medium">المتبقّي</th>
                <th className="px-5 py-3 font-medium">الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {companyLoans.map((l) => (
                <tr key={l.id} className="hover:bg-slate-50">
                  <td className="px-5 py-3 font-medium text-slate-800">{l.employeeName}</td>
                  <td className="px-5 py-3 text-slate-600">{formatSAR(l.amount)}</td>
                  <td className="px-5 py-3 text-slate-600">{formatSAR(l.installmentAmount)}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-slate-100">
                        <div className="h-full bg-ink" style={{ width: `${(l.paidInstallments / l.installments) * 100}%` }} />
                      </div>
                      <span className="text-xs text-slate-500">
                        {l.paidInstallments}/{l.installments}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-slate-600">{formatSAR(l.remaining)}</td>
                  <td className="px-5 py-3">
                    <Badge tone={l.status === "ACTIVE" ? "warning" : "success"}>{l.status === "ACTIVE" ? "جارية" : "مسدّدة"}</Badge>
                  </td>
                </tr>
              ))}
              {companyLoans.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-sm text-slate-400">لا توجد سلف.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* الخصومات */}
      <Card>
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 className="text-base font-semibold text-slate-800">الخصومات</h2>
          <Button variant="secondary" onClick={() => setDedOpen(true)}>
            <Plus size={16} /> إضافة خصم
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="bg-slate-50 text-xs text-slate-500">
              <tr>
                <th className="px-5 py-3 font-medium">الموظف</th>
                <th className="px-5 py-3 font-medium">المبلغ</th>
                <th className="px-5 py-3 font-medium">النوع</th>
                <th className="px-5 py-3 font-medium">السبب</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {companyDeductions.map((d) => (
                <tr key={d.id} className="hover:bg-slate-50">
                  <td className="px-5 py-3 font-medium text-slate-800">{d.employeeName}</td>
                  <td className="px-5 py-3 text-danger">- {formatSAR(d.amount)}</td>
                  <td className="px-5 py-3 text-slate-600">{DEDUCTION_LABELS[d.type]}</td>
                  <td className="px-5 py-3 text-slate-600">{d.reason}</td>
                </tr>
              ))}
              {companyDeductions.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-8 text-center text-sm text-slate-400">لا توجد خصومات.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* منح سلفة */}
      <Modal open={loanOpen} onClose={() => setLoanOpen(false)} title="منح سلفة">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="الموظف">
            <Select value={lf.employeeId} onChange={(e) => setLf({ ...lf, employeeId: e.target.value })}>
              <option value="">— اختر —</option>
              {companyEmployees.map((e) => (
                <option key={e.id} value={e.id}>{e.displayName}</option>
              ))}
            </Select>
          </Field>
          <div />
          <Field label="مبلغ السلفة">
            <Input type="number" value={lf.amount} onChange={(e) => setLf({ ...lf, amount: Number(e.target.value) })} />
          </Field>
          <Field label="عدد الأقساط">
            <Input type="number" value={lf.installments} onChange={(e) => setLf({ ...lf, installments: Number(e.target.value) })} />
          </Field>
        </div>
        <div className="mt-3 rounded-md bg-slate-50 p-3 text-sm text-slate-600">
          القسط الشهري:{" "}
          <span className="font-semibold text-ink">
            {formatSAR(Math.round((lf.amount / Math.max(1, lf.installments)) * 100) / 100)}
          </span>{" "}
          — يُخصم آلياً من الراتب.
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setLoanOpen(false)}>إلغاء</Button>
          <Button onClick={submitLoan}>اعتماد السلفة</Button>
        </div>
      </Modal>

      {/* إضافة خصم */}
      <Modal open={dedOpen} onClose={() => setDedOpen(false)} title="إضافة خصم">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="الموظف">
            <Select value={df.employeeId} onChange={(e) => setDf({ ...df, employeeId: e.target.value })}>
              <option value="">— اختر —</option>
              {companyEmployees.map((e) => (
                <option key={e.id} value={e.id}>{e.displayName}</option>
              ))}
            </Select>
          </Field>
          <Field label="النوع">
            <Select value={df.type} onChange={(e) => setDf({ ...df, type: e.target.value as DeductionType })}>
              {Object.entries(DEDUCTION_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </Select>
          </Field>
          <Field label="المبلغ">
            <Input type="number" value={df.amount} onChange={(e) => setDf({ ...df, amount: Number(e.target.value) })} />
          </Field>
          <Field label="السبب">
            <Input value={df.reason} onChange={(e) => setDf({ ...df, reason: e.target.value })} />
          </Field>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setDedOpen(false)}>إلغاء</Button>
          <Button onClick={submitDeduction}>إضافة الخصم</Button>
        </div>
      </Modal>
    </div>
  );
}
