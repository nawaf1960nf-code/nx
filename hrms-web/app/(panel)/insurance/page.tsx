"use client";

import { useState } from "react";
import { Plus, HeartPulse, ShieldCheck, Link2 } from "lucide-react";
import { useStore } from "@/store/useStore";
import { useScopedCompanyId } from "@/lib/scope";
import { roleHasPermission } from "@/lib/permissions";
import { Card, Badge, Button, Modal, Field, Input, Select, StatCard } from "@/components/ui";
import { formatDate } from "@/lib/format";
import type { InsuranceClass } from "@/lib/types";

const CLASS_LABELS: Record<InsuranceClass, string> = {
  VIP: "كبار الشخصيات (VIP)",
  A_PLUS: "الفئة +A",
  A: "الفئة A",
  B: "الفئة B",
  C: "الفئة C",
};
const PROVIDERS = ["بوبا العربية", "التعاونية للتأمين", "ميدغلف", "ملاذ للتأمين", "الراجحي تكافل"];

export default function InsurancePage() {
  const companyId = useScopedCompanyId();
  const role = useStore((s) => s.currentUser?.role);
  const employees = useStore((s) => s.employees);
  const insurance = useStore((s) => s.insurance);
  const addInsurance = useStore((s) => s.addInsurance);
  const toggleChiLink = useStore((s) => s.toggleChiLink);

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    employeeId: "",
    provider: PROVIDERS[0],
    policyNumber: "",
    memberId: "",
    className: "A" as InsuranceClass,
    dependents: 0,
    startDate: new Date().toISOString().slice(0, 10),
    endDate: "",
  });

  const canManage = roleHasPermission(role, "SETTINGS_MANAGE");

  if (!companyId) {
    return <Card className="p-10 text-center text-sm text-slate-500">اختر شركة من المبدّل في الأعلى أولاً.</Card>;
  }

  const companyEmployees = employees.filter((e) => e.companyId === companyId);
  const list = insurance.filter((p) => p.companyId === companyId);
  const linked = list.filter((p) => p.chiLinked).length;

  function submit() {
    const emp = companyEmployees.find((e) => e.id === form.employeeId) ?? companyEmployees[0];
    if (!emp || !companyId || !form.endDate) return;
    addInsurance({
      companyId,
      employeeId: emp.id,
      employeeName: emp.displayName,
      provider: form.provider,
      policyNumber: form.policyNumber || `POL-${Math.floor(10000 + Math.random() * 89999)}`,
      memberId: form.memberId || undefined,
      className: form.className,
      dependents: form.dependents,
      startDate: form.startDate,
      endDate: form.endDate,
    });
    setOpen(false);
    setForm({ ...form, employeeId: "", policyNumber: "", memberId: "", dependents: 0, endDate: "" });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">التأمين الطبي</h1>
          <p className="mt-1 text-sm text-slate-500">وثائق التأمين الطبي للموظفين والتابعين مع الربط بالضمان الصحي.</p>
        </div>
        {canManage && (
          <Button onClick={() => setOpen(true)}>
            <Plus size={18} /> إضافة وثيقة
          </Button>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="إجمالي الوثائق" value={list.length} icon={<HeartPulse size={20} />} />
        <StatCard label="إجمالي التابعين" value={list.reduce((s, p) => s + p.dependents, 0)} />
        <StatCard label="مرتبطة بالضمان الصحي" value={`${linked} / ${list.length}`} icon={<ShieldCheck size={20} />} />
      </div>

      {/* تنبيه الربط مع الضمان الصحي */}
      <div className="flex items-start gap-3 rounded-md border border-ink-100 bg-ink-50 px-4 py-3 text-sm text-slate-600">
        <ShieldCheck size={18} className="mt-0.5 shrink-0 text-ink" />
        <p>
          يمكن ربط كل وثيقة بمنصة <span className="font-semibold text-ink">الضمان الصحي (CHI)</span> لمزامنة بيانات
          الاشتراك والتابعين. الربط هنا تجريبي، ويُستبدل لاحقاً بتكامل فعلي عبر واجهات المجلس.
        </p>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="bg-slate-50 text-xs text-slate-500">
              <tr>
                <th className="px-5 py-3 font-medium">الموظف</th>
                <th className="px-5 py-3 font-medium">شركة التأمين</th>
                <th className="px-5 py-3 font-medium">رقم الوثيقة</th>
                <th className="px-5 py-3 font-medium">الفئة</th>
                <th className="px-5 py-3 font-medium">التابعون</th>
                <th className="px-5 py-3 font-medium">الانتهاء</th>
                <th className="px-5 py-3 font-medium">الضمان الصحي</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {list.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="px-5 py-3 font-medium text-slate-800">{p.employeeName}</td>
                  <td className="px-5 py-3 text-slate-600">{p.provider}</td>
                  <td className="px-5 py-3 font-mono text-xs text-slate-500">{p.policyNumber}</td>
                  <td className="px-5 py-3">
                    <Badge tone="info">{CLASS_LABELS[p.className]}</Badge>
                  </td>
                  <td className="px-5 py-3 text-slate-600">{p.dependents}</td>
                  <td className="px-5 py-3 text-slate-600">{formatDate(p.endDate)}</td>
                  <td className="px-5 py-3">
                    {p.chiLinked ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-success">
                        <ShieldCheck size={14} /> مرتبطة
                        {canManage && (
                          <button onClick={() => toggleChiLink(p.id)} className="mr-2 text-slate-400 hover:underline">
                            (فصل)
                          </button>
                        )}
                      </span>
                    ) : canManage ? (
                      <Button variant="secondary" className="px-2.5 py-1.5 text-xs" onClick={() => toggleChiLink(p.id)}>
                        <Link2 size={14} /> ربط بالضمان الصحي
                      </Button>
                    ) : (
                      <span className="text-xs text-slate-400">غير مرتبطة</span>
                    )}
                  </td>
                </tr>
              ))}
              {list.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-sm text-slate-400">لا توجد وثائق تأمين.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title="إضافة وثيقة تأمين">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="الموظف">
            <Select value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })}>
              <option value="">— اختر —</option>
              {companyEmployees.map((e) => (
                <option key={e.id} value={e.id}>{e.displayName}</option>
              ))}
            </Select>
          </Field>
          <Field label="شركة التأمين">
            <Select value={form.provider} onChange={(e) => setForm({ ...form, provider: e.target.value })}>
              {PROVIDERS.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </Select>
          </Field>
          <Field label="رقم الوثيقة">
            <Input value={form.policyNumber} onChange={(e) => setForm({ ...form, policyNumber: e.target.value })} placeholder="تلقائي" />
          </Field>
          <Field label="رقم العضوية">
            <Input value={form.memberId} onChange={(e) => setForm({ ...form, memberId: e.target.value })} />
          </Field>
          <Field label="فئة التغطية">
            <Select value={form.className} onChange={(e) => setForm({ ...form, className: e.target.value as InsuranceClass })}>
              {Object.entries(CLASS_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </Select>
          </Field>
          <Field label="عدد التابعين">
            <Input type="number" value={form.dependents} onChange={(e) => setForm({ ...form, dependents: Number(e.target.value) })} />
          </Field>
          <Field label="تاريخ البداية">
            <Input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
          </Field>
          <Field label="تاريخ الانتهاء">
            <Input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
          </Field>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setOpen(false)}>إلغاء</Button>
          <Button onClick={submit}>حفظ الوثيقة</Button>
        </div>
      </Modal>
    </div>
  );
}
