"use client";

import { useState } from "react";
import { Plus, FileText, AlertTriangle, FileWarning } from "lucide-react";
import { useStore } from "@/store/useStore";
import { useScopedCompanyId } from "@/lib/scope";
import { roleHasPermission } from "@/lib/permissions";
import { Card, Badge, Button, Modal, Field, Input, Select, StatCard } from "@/components/ui";
import { formatDate } from "@/lib/format";

const DOC_TYPES = ["الهوية الوطنية", "الإقامة", "عقد العمل", "جواز السفر", "الشهادة الجامعية", "رخصة مهنية", "أخرى"];

type DocState = "VALID" | "EXPIRING" | "EXPIRED" | "NONE";

function docState(expiry?: string): DocState {
  if (!expiry) return "NONE";
  const days = (new Date(expiry).getTime() - Date.now()) / 86400000;
  if (days < 0) return "EXPIRED";
  if (days <= 30) return "EXPIRING";
  return "VALID";
}

const STATE_META: Record<DocState, { label: string; tone: "success" | "warning" | "danger" | "neutral" }> = {
  VALID: { label: "سارية", tone: "success" },
  EXPIRING: { label: "تنتهي قريباً", tone: "warning" },
  EXPIRED: { label: "منتهية", tone: "danger" },
  NONE: { label: "بدون انتهاء", tone: "neutral" },
};

export default function DocumentsPage() {
  const companyId = useScopedCompanyId();
  const role = useStore((s) => s.currentUser?.role);
  const employees = useStore((s) => s.employees);
  const documents = useStore((s) => s.documents);
  const addDocument = useStore((s) => s.addDocument);

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ employeeId: "", type: DOC_TYPES[0], number: "", expiryDate: "" });

  const canManage = roleHasPermission(role, "EMPLOYEE_EDIT");

  if (!companyId) {
    return <Card className="p-10 text-center text-sm text-slate-500">اختر شركة من المبدّل في الأعلى أولاً.</Card>;
  }

  const companyEmployees = employees.filter((e) => e.companyId === companyId);
  const list = documents.filter((d) => d.companyId === companyId);
  const expiring = list.filter((d) => docState(d.expiryDate) === "EXPIRING").length;
  const expired = list.filter((d) => docState(d.expiryDate) === "EXPIRED").length;

  function submit() {
    const emp = companyEmployees.find((e) => e.id === form.employeeId) ?? companyEmployees[0];
    if (!emp || !companyId) return;
    addDocument({
      companyId,
      employeeId: emp.id,
      employeeName: emp.displayName,
      type: form.type,
      number: form.number || undefined,
      expiryDate: form.expiryDate || undefined,
    });
    setOpen(false);
    setForm({ employeeId: "", type: DOC_TYPES[0], number: "", expiryDate: "" });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">المستندات</h1>
          <p className="mt-1 text-sm text-slate-500">وثائق الموظفين وتواريخ انتهائها مع التنبيه قبل الانتهاء.</p>
        </div>
        {canManage && (
          <Button onClick={() => setOpen(true)}>
            <Plus size={18} /> إضافة مستند
          </Button>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="إجمالي المستندات" value={list.length} icon={<FileText size={20} />} />
        <StatCard label="تنتهي خلال 30 يوماً" value={expiring} icon={<AlertTriangle size={20} />} />
        <StatCard label="منتهية" value={expired} icon={<FileWarning size={20} />} />
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="bg-slate-50 text-xs text-slate-500">
              <tr>
                <th className="px-5 py-3 font-medium">الموظف</th>
                <th className="px-5 py-3 font-medium">نوع المستند</th>
                <th className="px-5 py-3 font-medium">الرقم</th>
                <th className="px-5 py-3 font-medium">تاريخ الانتهاء</th>
                <th className="px-5 py-3 font-medium">الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {list.map((d) => {
                const st = docState(d.expiryDate);
                const meta = STATE_META[st];
                return (
                  <tr key={d.id} className={st === "EXPIRED" ? "bg-danger-50/40" : st === "EXPIRING" ? "bg-warning-50/40" : "hover:bg-slate-50"}>
                    <td className="px-5 py-3 font-medium text-slate-800">{d.employeeName}</td>
                    <td className="px-5 py-3 text-slate-600">{d.type}</td>
                    <td className="px-5 py-3 text-slate-600">{d.number ?? "—"}</td>
                    <td className="px-5 py-3 text-slate-600">{d.expiryDate ? formatDate(d.expiryDate) : "—"}</td>
                    <td className="px-5 py-3">
                      <Badge tone={meta.tone}>{meta.label}</Badge>
                    </td>
                  </tr>
                );
              })}
              {list.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-sm text-slate-400">لا توجد مستندات.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title="إضافة مستند">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="الموظف">
            <Select value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })}>
              <option value="">— اختر —</option>
              {companyEmployees.map((e) => (
                <option key={e.id} value={e.id}>{e.displayName}</option>
              ))}
            </Select>
          </Field>
          <Field label="نوع المستند">
            <Select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              {DOC_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </Select>
          </Field>
          <Field label="رقم المستند">
            <Input value={form.number} onChange={(e) => setForm({ ...form, number: e.target.value })} />
          </Field>
          <Field label="تاريخ الانتهاء">
            <Input type="date" value={form.expiryDate} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} />
          </Field>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setOpen(false)}>إلغاء</Button>
          <Button onClick={submit}>حفظ المستند</Button>
        </div>
      </Modal>
    </div>
  );
}
