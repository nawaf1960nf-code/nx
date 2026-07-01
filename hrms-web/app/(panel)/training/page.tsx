"use client";

import { useState } from "react";
import { Plus, GraduationCap, Clock, Award } from "lucide-react";
import { useStore } from "@/store/useStore";
import { useScopedCompanyId } from "@/lib/scope";
import { roleHasPermission } from "@/lib/permissions";
import { Card, Badge, Button, Modal, Field, Input, Select, StatCard } from "@/components/ui";
import type { TrainingStatus } from "@/lib/types";

const STATUS_META: Record<TrainingStatus, { label: string; tone: "info" | "warning" | "success" }> = {
  ENROLLED: { label: "مُسجَّل", tone: "info" },
  IN_PROGRESS: { label: "قيد التنفيذ", tone: "warning" },
  COMPLETED: { label: "مكتمل", tone: "success" },
};
const NEXT: Record<TrainingStatus, TrainingStatus | null> = {
  ENROLLED: "IN_PROGRESS",
  IN_PROGRESS: "COMPLETED",
  COMPLETED: null,
};

export default function TrainingPage() {
  const companyId = useScopedCompanyId();
  const role = useStore((s) => s.currentUser?.role);
  const employees = useStore((s) => s.employees);
  const training = useStore((s) => s.training);
  const addTraining = useStore((s) => s.addTraining);
  const setTrainingStatus = useStore((s) => s.setTrainingStatus);

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ employeeId: "", title: "", provider: "", hours: 10 });

  const canManage = roleHasPermission(role, "SETTINGS_MANAGE");

  if (!companyId) {
    return <Card className="p-10 text-center text-sm text-slate-500">اختر شركة من المبدّل في الأعلى أولاً.</Card>;
  }

  const companyEmployees = employees.filter((e) => e.companyId === companyId);
  const list = training.filter((t) => t.companyId === companyId);
  const completed = list.filter((t) => t.status === "COMPLETED").length;
  const totalHours = list.reduce((s, t) => s + (t.hours ?? 0), 0);

  function submit() {
    const emp = companyEmployees.find((e) => e.id === form.employeeId);
    if (!emp || !form.title.trim() || !companyId) return;
    addTraining({
      companyId,
      employeeId: emp.id,
      employeeName: emp.displayName,
      title: form.title,
      provider: form.provider || undefined,
      hours: form.hours,
      startDate: new Date().toISOString().slice(0, 10),
    });
    setOpen(false);
    setForm({ employeeId: "", title: "", provider: "", hours: 10 });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">التدريب والتطوير</h1>
          <p className="mt-1 text-sm text-slate-500">البرامج التدريبية للموظفين ومتابعة إنجازها.</p>
        </div>
        {canManage && (
          <Button onClick={() => setOpen(true)}>
            <Plus size={18} /> تسجيل تدريب
          </Button>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="إجمالي البرامج" value={list.length} icon={<GraduationCap size={20} />} />
        <StatCard label="مكتملة" value={completed} icon={<Award size={20} />} />
        <StatCard label="إجمالي الساعات" value={`${totalHours} ساعة`} icon={<Clock size={20} />} />
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="bg-slate-50 text-xs text-slate-500">
              <tr>
                <th className="px-5 py-3 font-medium">البرنامج</th>
                <th className="px-5 py-3 font-medium">الموظف</th>
                <th className="px-5 py-3 font-medium">الجهة</th>
                <th className="px-5 py-3 font-medium">الساعات</th>
                <th className="px-5 py-3 font-medium">الحالة</th>
                {canManage && <th className="px-5 py-3 font-medium">إجراء</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {list.map((t) => {
                const next = NEXT[t.status];
                return (
                  <tr key={t.id} className="hover:bg-slate-50">
                    <td className="px-5 py-3 font-medium text-slate-800">{t.title}</td>
                    <td className="px-5 py-3 text-slate-600">{t.employeeName}</td>
                    <td className="px-5 py-3 text-slate-600">{t.provider ?? "—"}</td>
                    <td className="px-5 py-3 text-slate-600">{t.hours ?? "—"}</td>
                    <td className="px-5 py-3">
                      <Badge tone={STATUS_META[t.status].tone}>{STATUS_META[t.status].label}</Badge>
                    </td>
                    {canManage && (
                      <td className="px-5 py-3">
                        {next ? (
                          <Button variant="secondary" className="px-2.5 py-1.5 text-xs" onClick={() => setTrainingStatus(t.id, next)}>
                            {STATUS_META[next].label}
                          </Button>
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
                  <td colSpan={canManage ? 6 : 5} className="px-5 py-10 text-center text-sm text-slate-400">لا توجد برامج تدريبية.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title="تسجيل برنامج تدريبي">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="الموظف">
            <Select value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })}>
              <option value="">— اختر —</option>
              {companyEmployees.map((e) => (
                <option key={e.id} value={e.id}>{e.displayName}</option>
              ))}
            </Select>
          </Field>
          <Field label="اسم البرنامج">
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </Field>
          <Field label="الجهة المقدّمة">
            <Input value={form.provider} onChange={(e) => setForm({ ...form, provider: e.target.value })} />
          </Field>
          <Field label="عدد الساعات">
            <Input type="number" value={form.hours} onChange={(e) => setForm({ ...form, hours: Number(e.target.value) })} />
          </Field>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setOpen(false)}>إلغاء</Button>
          <Button onClick={submit}>تسجيل</Button>
        </div>
      </Modal>
    </div>
  );
}
