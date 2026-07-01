"use client";

import { useState } from "react";
import { Plus, Check, X } from "lucide-react";
import { useStore } from "@/store/useStore";
import { useScopedCompanyId } from "@/lib/scope";
import { roleHasPermission } from "@/lib/permissions";
import { Card, Badge, Button, Modal, Field, Input, Select, StatCard } from "@/components/ui";
import { formatDate } from "@/lib/format";
import type { LeaveStatus, LeaveType } from "@/lib/types";

const TYPE_LABELS: Record<LeaveType, string> = {
  ANNUAL: "سنوية",
  SICK: "مرضية",
  UNPAID: "بدون راتب",
  EMERGENCY: "اضطرارية",
  MATERNITY: "وضع",
};
const STATUS_META: Record<LeaveStatus, { label: string; tone: "warning" | "success" | "danger" }> = {
  PENDING: { label: "قيد الاعتماد", tone: "warning" },
  APPROVED: { label: "معتمدة", tone: "success" },
  REJECTED: { label: "مرفوضة", tone: "danger" },
};

function daysBetween(a: string, b: string): number {
  const d = (new Date(b).getTime() - new Date(a).getTime()) / 86400000 + 1;
  return d > 0 ? Math.round(d) : 1;
}

export default function LeavesPage() {
  const companyId = useScopedCompanyId();
  const role = useStore((s) => s.currentUser?.role);
  const employees = useStore((s) => s.employees);
  const leaveRequests = useStore((s) => s.leaveRequests);
  const requestLeave = useStore((s) => s.requestLeave);
  const setLeaveStatus = useStore((s) => s.setLeaveStatus);

  const [filter, setFilter] = useState<"ALL" | LeaveStatus>("ALL");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ employeeId: "", type: "ANNUAL" as LeaveType, startDate: "", endDate: "", reason: "" });

  const canApprove = roleHasPermission(role, "SETTINGS_MANAGE"); // HR / مدير النظام

  if (!companyId) {
    return <Card className="p-10 text-center text-sm text-slate-500">اختر شركة من المبدّل في الأعلى أولاً.</Card>;
  }

  const companyEmployees = employees.filter((e) => e.companyId === companyId);
  const all = leaveRequests.filter((l) => l.companyId === companyId);
  const list = filter === "ALL" ? all : all.filter((l) => l.status === filter);
  const pending = all.filter((l) => l.status === "PENDING").length;
  const approved = all.filter((l) => l.status === "APPROVED").length;

  function submit() {
    const emp = companyEmployees.find((e) => e.id === form.employeeId) ?? companyEmployees[0];
    if (!emp || !form.startDate || !form.endDate || !companyId) return;
    requestLeave({
      companyId,
      employeeId: emp.id,
      employeeName: emp.displayName,
      type: form.type,
      startDate: form.startDate,
      endDate: form.endDate,
      days: daysBetween(form.startDate, form.endDate),
      reason: form.reason,
    });
    setOpen(false);
    setForm({ employeeId: "", type: "ANNUAL", startDate: "", endDate: "", reason: "" });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">الإجازات</h1>
          <p className="mt-1 text-sm text-slate-500">طلبات الإجازات واعتمادها.</p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus size={18} /> طلب إجازة
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="إجمالي الطلبات" value={all.length} />
        <StatCard label="قيد الاعتماد" value={pending} />
        <StatCard label="معتمدة" value={approved} />
      </div>

      <div className="flex gap-2">
        {(["ALL", "PENDING", "APPROVED", "REJECTED"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium ${
              filter === f ? "bg-ink text-white" : "bg-white text-slate-600 border border-slate-200"
            }`}
          >
            {f === "ALL" ? "الكل" : STATUS_META[f].label}
          </button>
        ))}
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="bg-slate-50 text-xs text-slate-500">
              <tr>
                <th className="px-5 py-3 font-medium">الموظف</th>
                <th className="px-5 py-3 font-medium">النوع</th>
                <th className="px-5 py-3 font-medium">من</th>
                <th className="px-5 py-3 font-medium">إلى</th>
                <th className="px-5 py-3 font-medium">الأيام</th>
                <th className="px-5 py-3 font-medium">الحالة</th>
                {canApprove && <th className="px-5 py-3 font-medium">إجراء</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {list.map((l) => {
                const meta = STATUS_META[l.status];
                return (
                  <tr key={l.id} className="hover:bg-slate-50">
                    <td className="px-5 py-3 font-medium text-slate-800">{l.employeeName}</td>
                    <td className="px-5 py-3 text-slate-600">{TYPE_LABELS[l.type]}</td>
                    <td className="px-5 py-3 text-slate-600">{formatDate(l.startDate)}</td>
                    <td className="px-5 py-3 text-slate-600">{formatDate(l.endDate)}</td>
                    <td className="px-5 py-3 text-slate-600">{l.days}</td>
                    <td className="px-5 py-3">
                      <Badge tone={meta.tone}>{meta.label}</Badge>
                    </td>
                    {canApprove && (
                      <td className="px-5 py-3">
                        {l.status === "PENDING" ? (
                          <div className="flex gap-2">
                            <Button className="px-2.5 py-1.5 text-xs" onClick={() => setLeaveStatus(l.id, "APPROVED")}>
                              <Check size={14} /> اعتماد
                            </Button>
                            <Button variant="danger" className="px-2.5 py-1.5 text-xs" onClick={() => setLeaveStatus(l.id, "REJECTED")}>
                              <X size={14} /> رفض
                            </Button>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400">—</span>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })}
              {list.length === 0 && (
                <tr>
                  <td colSpan={canApprove ? 7 : 6} className="px-5 py-10 text-center text-sm text-slate-400">
                    لا توجد طلبات.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title="طلب إجازة جديدة">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="الموظف">
            <Select value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })}>
              <option value="">— اختر —</option>
              {companyEmployees.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.displayName}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="نوع الإجازة">
            <Select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as LeaveType })}>
              {Object.entries(TYPE_LABELS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="من تاريخ">
            <Input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
          </Field>
          <Field label="إلى تاريخ">
            <Input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
          </Field>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setOpen(false)}>
            إلغاء
          </Button>
          <Button onClick={submit}>إرسال الطلب</Button>
        </div>
      </Modal>
    </div>
  );
}
