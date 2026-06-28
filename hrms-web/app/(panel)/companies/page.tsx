"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Power, LogIn } from "lucide-react";
import { useStore } from "@/store/useStore";
import { Card, Badge, Button, Modal, Field, Input, Select } from "@/components/ui";
import type { CompanyPlan } from "@/lib/types";

const STATUS_META = {
  ACTIVE: { label: "نشطة", tone: "success" as const },
  TRIAL: { label: "تجريبية", tone: "warning" as const },
  SUSPENDED: { label: "موقوفة", tone: "danger" as const },
};
const PLAN_LABELS: Record<CompanyPlan, string> = { BASIC: "أساسية", PRO: "احترافية", ENTERPRISE: "مؤسسية" };

export default function CompaniesPage() {
  const router = useRouter();
  const companies = useStore((s) => s.companies);
  const employees = useStore((s) => s.employees);
  const addCompany = useStore((s) => s.addCompany);
  const setCompanyStatus = useStore((s) => s.setCompanyStatus);
  const setActiveCompany = useStore((s) => s.setActiveCompany);

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    nameEn: "",
    city: "الرياض",
    plan: "PRO" as CompanyPlan,
    seatLimit: 50,
    subscriptionEndsAt: "2026-12-31",
  });

  function submit() {
    if (!form.name.trim()) return;
    addCompany({ ...form, status: "TRIAL" });
    setOpen(false);
    setForm({ name: "", nameEn: "", city: "الرياض", plan: "PRO", seatLimit: 50, subscriptionEndsAt: "2026-12-31" });
  }

  function enterCompany(id: string) {
    setActiveCompany(id);
    router.push("/dashboard");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">الشركات المشتركة</h1>
          <p className="mt-1 text-sm text-slate-500">إدارة اشتراكات الشركات والدخول إلى بياناتها.</p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus size={18} /> إضافة شركة
        </Button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="bg-slate-50 text-xs text-slate-500">
              <tr>
                <th className="px-5 py-3 font-medium">الشركة</th>
                <th className="px-5 py-3 font-medium">المدينة</th>
                <th className="px-5 py-3 font-medium">الباقة</th>
                <th className="px-5 py-3 font-medium">المقاعد</th>
                <th className="px-5 py-3 font-medium">الحالة</th>
                <th className="px-5 py-3 font-medium">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {companies.map((c) => {
                const count = employees.filter((e) => e.companyId === c.id).length;
                const meta = STATUS_META[c.status];
                return (
                  <tr key={c.id} className="hover:bg-slate-50">
                    <td className="px-5 py-3">
                      <p className="font-medium text-slate-800">{c.name}</p>
                      {c.nameEn && <p className="text-xs text-slate-400">{c.nameEn}</p>}
                    </td>
                    <td className="px-5 py-3 text-slate-600">{c.city}</td>
                    <td className="px-5 py-3 text-slate-600">{PLAN_LABELS[c.plan]}</td>
                    <td className="px-5 py-3 text-slate-600">
                      {count} / {c.seatLimit}
                    </td>
                    <td className="px-5 py-3">
                      <Badge tone={meta.tone}>{meta.label}</Badge>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <Button variant="secondary" className="px-2.5 py-1.5 text-xs" onClick={() => enterCompany(c.id)}>
                          <LogIn size={14} /> دخول
                        </Button>
                        <Button
                          variant={c.status === "SUSPENDED" ? "secondary" : "danger"}
                          className="px-2.5 py-1.5 text-xs"
                          onClick={() => setCompanyStatus(c.id, c.status === "SUSPENDED" ? "ACTIVE" : "SUSPENDED")}
                        >
                          <Power size={14} /> {c.status === "SUSPENDED" ? "تفعيل" : "تعليق"}
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title="إضافة شركة مشتركة">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="اسم الشركة">
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="مثال: شركة المستقبل" />
          </Field>
          <Field label="الاسم بالإنجليزية">
            <Input value={form.nameEn} onChange={(e) => setForm({ ...form, nameEn: e.target.value })} />
          </Field>
          <Field label="المدينة">
            <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
          </Field>
          <Field label="الباقة">
            <Select value={form.plan} onChange={(e) => setForm({ ...form, plan: e.target.value as CompanyPlan })}>
              <option value="BASIC">أساسية</option>
              <option value="PRO">احترافية</option>
              <option value="ENTERPRISE">مؤسسية</option>
            </Select>
          </Field>
          <Field label="حد المقاعد">
            <Input
              type="number"
              value={form.seatLimit}
              onChange={(e) => setForm({ ...form, seatLimit: Number(e.target.value) })}
            />
          </Field>
          <Field label="نهاية الاشتراك">
            <Input
              type="date"
              value={form.subscriptionEndsAt}
              onChange={(e) => setForm({ ...form, subscriptionEndsAt: e.target.value })}
            />
          </Field>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setOpen(false)}>
            إلغاء
          </Button>
          <Button onClick={submit}>حفظ الشركة</Button>
        </div>
      </Modal>
    </div>
  );
}
