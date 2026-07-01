"use client";

import { useState } from "react";
import { Plus, Laptop, Smartphone, Car, CreditCard, Package, Undo2 } from "lucide-react";
import { useStore } from "@/store/useStore";
import { useScopedCompanyId } from "@/lib/scope";
import { roleHasPermission } from "@/lib/permissions";
import { Card, Badge, Button, Modal, Field, Input, Select, StatCard } from "@/components/ui";
import { formatDate } from "@/lib/format";
import type { AssetCategory, AssetStatus } from "@/lib/types";

const CAT_META: Record<AssetCategory, { label: string; icon: typeof Laptop }> = {
  LAPTOP: { label: "حاسب محمول", icon: Laptop },
  PHONE: { label: "جوال", icon: Smartphone },
  VEHICLE: { label: "مركبة", icon: Car },
  SIM: { label: "شريحة اتصال", icon: CreditCard },
  ACCESS_CARD: { label: "بطاقة دخول", icon: CreditCard },
  OTHER: { label: "أخرى", icon: Package },
};
const STATUS_META: Record<AssetStatus, { label: string; tone: "success" | "neutral" | "danger" | "warning" }> = {
  ASSIGNED: { label: "بعهدة موظف", tone: "success" },
  RETURNED: { label: "مُسترجَع", tone: "neutral" },
  LOST: { label: "مفقود", tone: "danger" },
  MAINTENANCE: { label: "صيانة", tone: "warning" },
};

export default function AssetsPage() {
  const companyId = useScopedCompanyId();
  const role = useStore((s) => s.currentUser?.role);
  const employees = useStore((s) => s.employees);
  const assets = useStore((s) => s.assets);
  const assignAsset = useStore((s) => s.assignAsset);
  const returnAsset = useStore((s) => s.returnAsset);

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", category: "LAPTOP" as AssetCategory, serialNumber: "", employeeId: "" });

  const canManage = roleHasPermission(role, "EMPLOYEE_EDIT");

  if (!companyId) {
    return <Card className="p-10 text-center text-sm text-slate-500">اختر شركة من المبدّل في الأعلى أولاً.</Card>;
  }

  const companyEmployees = employees.filter((e) => e.companyId === companyId);
  const list = assets.filter((a) => a.companyId === companyId);
  const assigned = list.filter((a) => a.status === "ASSIGNED").length;

  function submit() {
    if (!form.name.trim() || !companyId) return;
    const emp = companyEmployees.find((e) => e.id === form.employeeId);
    assignAsset({
      companyId,
      name: form.name,
      category: form.category,
      serialNumber: form.serialNumber || undefined,
      employeeId: emp?.id,
      employeeName: emp?.displayName,
      assignedAt: new Date().toISOString().slice(0, 10),
    });
    setOpen(false);
    setForm({ name: "", category: "LAPTOP", serialNumber: "", employeeId: "" });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">الأصول والعُهد</h1>
          <p className="mt-1 text-sm text-slate-500">تتبّع أصول الشركة المسلّمة للموظفين.</p>
        </div>
        {canManage && (
          <Button onClick={() => setOpen(true)}>
            <Plus size={18} /> تسليم عهدة
          </Button>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="إجمالي الأصول" value={list.length} icon={<Package size={20} />} />
        <StatCard label="بعهدة الموظفين" value={assigned} />
        <StatCard label="مُسترجَعة" value={list.filter((a) => a.status === "RETURNED").length} />
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="bg-slate-50 text-xs text-slate-500">
              <tr>
                <th className="px-5 py-3 font-medium">الأصل</th>
                <th className="px-5 py-3 font-medium">الفئة</th>
                <th className="px-5 py-3 font-medium">الرقم التسلسلي</th>
                <th className="px-5 py-3 font-medium">بعهدة</th>
                <th className="px-5 py-3 font-medium">تاريخ التسليم</th>
                <th className="px-5 py-3 font-medium">الحالة</th>
                {canManage && <th className="px-5 py-3 font-medium">إجراء</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {list.map((a) => {
                const Icon = CAT_META[a.category].icon;
                return (
                  <tr key={a.id} className="hover:bg-slate-50">
                    <td className="px-5 py-3 font-medium text-slate-800">{a.name}</td>
                    <td className="px-5 py-3">
                      <span className="inline-flex items-center gap-1.5 text-slate-600">
                        <Icon size={15} className="text-ink" /> {CAT_META[a.category].label}
                      </span>
                    </td>
                    <td className="px-5 py-3 font-mono text-xs text-slate-500">{a.serialNumber ?? "—"}</td>
                    <td className="px-5 py-3 text-slate-600">{a.employeeName ?? "—"}</td>
                    <td className="px-5 py-3 text-slate-600">{a.assignedAt ? formatDate(a.assignedAt) : "—"}</td>
                    <td className="px-5 py-3">
                      <Badge tone={STATUS_META[a.status].tone}>{STATUS_META[a.status].label}</Badge>
                    </td>
                    {canManage && (
                      <td className="px-5 py-3">
                        {a.status === "ASSIGNED" ? (
                          <Button variant="secondary" className="px-2.5 py-1.5 text-xs" onClick={() => returnAsset(a.id)}>
                            <Undo2 size={14} /> استرجاع
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
                  <td colSpan={canManage ? 7 : 6} className="px-5 py-10 text-center text-sm text-slate-400">لا توجد أصول.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title="تسليم عهدة">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="اسم الأصل">
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="مثال: لابتوب Dell" />
          </Field>
          <Field label="الفئة">
            <Select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as AssetCategory })}>
              {Object.entries(CAT_META).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </Select>
          </Field>
          <Field label="الرقم التسلسلي">
            <Input value={form.serialNumber} onChange={(e) => setForm({ ...form, serialNumber: e.target.value })} />
          </Field>
          <Field label="الموظف (العهدة)">
            <Select value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })}>
              <option value="">— غير مُسلَّم —</option>
              {companyEmployees.map((e) => (
                <option key={e.id} value={e.id}>{e.displayName}</option>
              ))}
            </Select>
          </Field>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setOpen(false)}>إلغاء</Button>
          <Button onClick={submit}>حفظ</Button>
        </div>
      </Modal>
    </div>
  );
}
