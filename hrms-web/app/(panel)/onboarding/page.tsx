"use client";

import { useState } from "react";
import { Plus, ClipboardList, CheckCircle2, Circle } from "lucide-react";
import { useStore } from "@/store/useStore";
import { useScopedCompanyId } from "@/lib/scope";
import { roleHasPermission } from "@/lib/permissions";
import { Card, Button, Modal, Field, Input, Select, StatCard } from "@/components/ui";

export default function OnboardingPage() {
  const companyId = useScopedCompanyId();
  const role = useStore((s) => s.currentUser?.role);
  const employees = useStore((s) => s.employees);
  const onboarding = useStore((s) => s.onboarding);
  const addOnboardingTask = useStore((s) => s.addOnboardingTask);
  const toggleOnboardingTask = useStore((s) => s.toggleOnboardingTask);

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ employeeId: "", title: "" });

  const canManage = roleHasPermission(role, "EMPLOYEE_EDIT");

  if (!companyId) {
    return <Card className="p-10 text-center text-sm text-slate-500">اختر شركة من المبدّل في الأعلى أولاً.</Card>;
  }

  const companyEmployees = employees.filter((e) => e.companyId === companyId);
  const tasks = onboarding.filter((t) => t.companyId === companyId);

  // تجميع المهام حسب الموظف.
  const byEmployee = new Map<string, typeof tasks>();
  for (const t of tasks) {
    if (!byEmployee.has(t.employeeId)) byEmployee.set(t.employeeId, []);
    byEmployee.get(t.employeeId)!.push(t);
  }
  const groups = [...byEmployee.entries()];
  const done = tasks.filter((t) => t.isCompleted).length;

  function submit() {
    const emp = companyEmployees.find((e) => e.id === form.employeeId);
    if (!emp || !form.title.trim() || !companyId) return;
    addOnboardingTask({ companyId, employeeId: emp.id, employeeName: emp.displayName, title: form.title });
    setOpen(false);
    setForm({ employeeId: "", title: "" });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">تهيئة الموظفين الجدد</h1>
          <p className="mt-1 text-sm text-slate-500">قوائم مهام التهيئة (Onboarding) ونسبة إنجازها.</p>
        </div>
        {canManage && (
          <Button onClick={() => setOpen(true)}>
            <Plus size={18} /> إضافة مهمة
          </Button>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="موظفون قيد التهيئة" value={groups.length} icon={<ClipboardList size={20} />} />
        <StatCard label="إجمالي المهام" value={tasks.length} />
        <StatCard label="نسبة الإنجاز" value={tasks.length ? `${Math.round((done / tasks.length) * 100)}%` : "—"} />
      </div>

      {groups.length === 0 ? (
        <Card className="p-10 text-center text-sm text-slate-400">لا توجد مهام تهيئة حالياً.</Card>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {groups.map(([empId, items]) => {
            const completed = items.filter((t) => t.isCompleted).length;
            const pct = Math.round((completed / items.length) * 100);
            return (
              <Card key={empId} className="p-5">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-sm font-bold text-slate-800">{items[0].employeeName}</h2>
                  <span className="text-xs font-medium text-slate-500">{completed}/{items.length}</span>
                </div>
                <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full bg-ink transition-all" style={{ width: `${pct}%` }} />
                </div>
                <ul className="space-y-1">
                  {items.map((t) => (
                    <li key={t.id}>
                      <button
                        onClick={() => canManage && toggleOnboardingTask(t.id)}
                        disabled={!canManage}
                        className="flex w-full items-center gap-2.5 rounded-md px-2 py-2 text-right text-sm hover:bg-slate-50 disabled:cursor-default"
                      >
                        {t.isCompleted ? (
                          <CheckCircle2 size={18} className="shrink-0 text-success" />
                        ) : (
                          <Circle size={18} className="shrink-0 text-slate-300" />
                        )}
                        <span className={t.isCompleted ? "text-slate-400 line-through" : "text-slate-700"}>{t.title}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </Card>
            );
          })}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="إضافة مهمة تهيئة">
        <div className="space-y-4">
          <Field label="الموظف">
            <Select value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })}>
              <option value="">— اختر —</option>
              {companyEmployees.map((e) => (
                <option key={e.id} value={e.id}>{e.displayName}</option>
              ))}
            </Select>
          </Field>
          <Field label="المهمة">
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="مثال: تفعيل البريد الإلكتروني" />
          </Field>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setOpen(false)}>إلغاء</Button>
          <Button onClick={submit}>إضافة</Button>
        </div>
      </Modal>
    </div>
  );
}
