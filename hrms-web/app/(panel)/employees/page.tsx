"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { useStore } from "@/store/useStore";
import { useScopedCompanyId } from "@/lib/scope";
import { Card, Badge, Button, Modal, Field, Input, Select } from "@/components/ui";
import { serviceLength } from "@/lib/format";
import type { EmployeeStatus } from "@/lib/types";

const STATUS_META: Record<EmployeeStatus, { label: string; tone: "success" | "warning" | "danger" | "neutral" }> = {
  ACTIVE: { label: "نشط", tone: "success" },
  ON_PROBATION: { label: "تحت التجربة", tone: "warning" },
  ON_LEAVE: { label: "في إجازة", tone: "warning" },
  TERMINATED: { label: "منتهي", tone: "danger" },
  RESIGNED: { label: "مستقيل", tone: "neutral" },
};

export default function EmployeesPage() {
  const companyId = useScopedCompanyId();
  const employees = useStore((s) => s.employees);
  const addEmployee = useStore((s) => s.addEmployee);

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    displayName: "",
    employeeNumber: "",
    department: "",
    position: "",
    nationality: "سعودي",
    baseSalary: 8000,
    hireDate: new Date().toISOString().slice(0, 10),
  });

  if (!companyId) {
    return <Card className="p-10 text-center text-sm text-slate-500">اختر شركة من المبدّل في الأعلى أولاً.</Card>;
  }

  const list = employees
    .filter((e) => e.companyId === companyId)
    .filter((e) => e.displayName.includes(query) || e.employeeNumber.includes(query) || e.department.includes(query));

  function submit() {
    if (!form.displayName.trim() || !companyId) return;
    addEmployee({
      companyId,
      employeeNumber: form.employeeNumber || String(Math.floor(1000 + Math.random() * 9000)),
      displayName: form.displayName,
      department: form.department || "غير محدّد",
      position: form.position || "غير محدّد",
      nationality: form.nationality,
      idNumber: "—",
      hireDate: form.hireDate,
      status: "ON_PROBATION",
      employmentType: "FULL_TIME",
      baseSalary: form.baseSalary,
      housingAllowance: Math.round(form.baseSalary * 0.25),
      transportAllowance: 500,
      otherAllowances: 0,
      bankName: "—",
      ibanNumber: "—",
    });
    setOpen(false);
    setForm({ ...form, displayName: "", employeeNumber: "", department: "", position: "" });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">الموظفون</h1>
          <p className="mt-1 text-sm text-slate-500">{list.length} موظف</p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus size={18} /> إضافة موظف
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="بحث بالاسم أو الرقم أو القسم…"
          className="w-full pr-9"
        />
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="bg-slate-50 text-xs text-slate-500">
              <tr>
                <th className="px-5 py-3 font-medium">الموظف</th>
                <th className="px-5 py-3 font-medium">القسم</th>
                <th className="px-5 py-3 font-medium">المسمى</th>
                <th className="px-5 py-3 font-medium">مدة الخدمة</th>
                <th className="px-5 py-3 font-medium">الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {list.map((e) => {
                const meta = STATUS_META[e.status];
                return (
                  <tr key={e.id} className="cursor-pointer hover:bg-slate-50">
                    <td className="px-5 py-3">
                      <Link href={`/employees/${e.id}`} className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-md bg-ink-50 text-sm font-semibold text-ink">
                          {e.displayName.charAt(0)}
                        </span>
                        <div>
                          <p className="font-medium text-slate-800">{e.displayName}</p>
                          <p className="text-xs text-slate-400">#{e.employeeNumber}</p>
                        </div>
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-slate-600">{e.department}</td>
                    <td className="px-5 py-3 text-slate-600">{e.position}</td>
                    <td className="px-5 py-3 text-slate-600">{serviceLength(e.hireDate)}</td>
                    <td className="px-5 py-3">
                      <Badge tone={meta.tone}>{meta.label}</Badge>
                    </td>
                  </tr>
                );
              })}
              {list.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-sm text-slate-400">
                    لا يوجد موظفون مطابقون.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title="إضافة موظف جديد">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="الاسم الكامل">
            <Input value={form.displayName} onChange={(e) => setForm({ ...form, displayName: e.target.value })} />
          </Field>
          <Field label="الرقم الوظيفي">
            <Input value={form.employeeNumber} onChange={(e) => setForm({ ...form, employeeNumber: e.target.value })} placeholder="تلقائي إن تُرك فارغاً" />
          </Field>
          <Field label="القسم">
            <Input value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
          </Field>
          <Field label="المسمى الوظيفي">
            <Input value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} />
          </Field>
          <Field label="الجنسية">
            <Select value={form.nationality} onChange={(e) => setForm({ ...form, nationality: e.target.value })}>
              <option value="سعودي">سعودي</option>
              <option value="غير سعودي">غير سعودي</option>
            </Select>
          </Field>
          <Field label="الراتب الأساسي">
            <Input type="number" value={form.baseSalary} onChange={(e) => setForm({ ...form, baseSalary: Number(e.target.value) })} />
          </Field>
          <Field label="تاريخ التعيين">
            <Input type="date" value={form.hireDate} onChange={(e) => setForm({ ...form, hireDate: e.target.value })} />
          </Field>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setOpen(false)}>إلغاء</Button>
          <Button onClick={submit}>حفظ الموظف</Button>
        </div>
      </Modal>
    </div>
  );
}
