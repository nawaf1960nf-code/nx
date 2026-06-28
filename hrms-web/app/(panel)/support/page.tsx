"use client";

import { useState } from "react";
import { Plus, LifeBuoy, ArrowLeftRight } from "lucide-react";
import { useStore } from "@/store/useStore";
import { useScopedCompanyId } from "@/lib/scope";
import { Card, Badge, Button, Modal, Field, Input, Select, StatCard } from "@/components/ui";
import type { TicketCategory, TicketPriority, TicketStatus } from "@/lib/types";

const CAT_LABELS: Record<TicketCategory, string> = {
  IT: "تقنية المعلومات",
  HR: "الموارد البشرية",
  FINANCE: "المالية",
  FACILITIES: "الخدمات والمرافق",
  OTHER: "أخرى",
};
const PRIORITY_META: Record<TicketPriority, { label: string; tone: "neutral" | "warning" | "danger" }> = {
  LOW: { label: "منخفضة", tone: "neutral" },
  MEDIUM: { label: "متوسطة", tone: "warning" },
  HIGH: { label: "عالية", tone: "danger" },
};
const STATUS_META: Record<TicketStatus, { label: string; tone: "info" | "warning" | "success" | "neutral" }> = {
  OPEN: { label: "مفتوحة", tone: "info" },
  IN_PROGRESS: { label: "قيد المعالجة", tone: "warning" },
  RESOLVED: { label: "تم الحل", tone: "success" },
  CLOSED: { label: "مغلقة", tone: "neutral" },
};
const NEXT_STATUS: Record<TicketStatus, TicketStatus | null> = {
  OPEN: "IN_PROGRESS",
  IN_PROGRESS: "RESOLVED",
  RESOLVED: "CLOSED",
  CLOSED: null,
};

export default function SupportPage() {
  const companyId = useScopedCompanyId();
  const employees = useStore((s) => s.employees);
  const tickets = useStore((s) => s.tickets);
  const createTicket = useStore((s) => s.createTicket);
  const setTicketStatus = useStore((s) => s.setTicketStatus);

  const [filter, setFilter] = useState<"ALL" | TicketStatus>("ALL");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ requesterId: "", subject: "", description: "", category: "IT" as TicketCategory, priority: "MEDIUM" as TicketPriority });

  if (!companyId) {
    return <Card className="p-10 text-center text-sm text-slate-500">اختر شركة من المبدّل في الأعلى أولاً.</Card>;
  }

  const companyEmployees = employees.filter((e) => e.companyId === companyId);
  const all = tickets.filter((t) => t.companyId === companyId);
  const list = filter === "ALL" ? all : all.filter((t) => t.status === filter);
  const openCount = all.filter((t) => t.status === "OPEN" || t.status === "IN_PROGRESS").length;

  function submit() {
    const emp = companyEmployees.find((e) => e.id === form.requesterId);
    if (!form.subject.trim() || !companyId) return;
    createTicket({
      companyId,
      requesterName: emp?.displayName ?? "موظف",
      subject: form.subject,
      description: form.description || undefined,
      category: form.category,
      priority: form.priority,
    });
    setOpen(false);
    setForm({ requesterId: "", subject: "", description: "", category: "IT", priority: "MEDIUM" });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">الدعم الفني</h1>
          <p className="mt-1 text-sm text-slate-500">تذاكر الدعم وطلبات المساعدة الداخلية.</p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus size={18} /> تذكرة جديدة
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="إجمالي التذاكر" value={all.length} icon={<LifeBuoy size={20} />} />
        <StatCard label="مفتوحة / قيد المعالجة" value={openCount} />
        <StatCard label="تم حلّها" value={all.filter((t) => t.status === "RESOLVED" || t.status === "CLOSED").length} />
      </div>

      <div className="flex flex-wrap gap-2">
        {(["ALL", "OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"] as const).map((x) => (
          <button
            key={x}
            onClick={() => setFilter(x)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium ${filter === x ? "bg-ink text-white" : "border border-slate-200 bg-white text-slate-600"}`}
          >
            {x === "ALL" ? "الكل" : STATUS_META[x].label}
          </button>
        ))}
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="bg-slate-50 text-xs text-slate-500">
              <tr>
                <th className="px-5 py-3 font-medium">الرقم</th>
                <th className="px-5 py-3 font-medium">الموضوع</th>
                <th className="px-5 py-3 font-medium">مقدّم الطلب</th>
                <th className="px-5 py-3 font-medium">التصنيف</th>
                <th className="px-5 py-3 font-medium">الأولوية</th>
                <th className="px-5 py-3 font-medium">الحالة</th>
                <th className="px-5 py-3 font-medium">إجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {list.map((t) => {
                const next = NEXT_STATUS[t.status];
                return (
                  <tr key={t.id} className="hover:bg-slate-50">
                    <td className="px-5 py-3 font-mono text-xs text-slate-500">{t.number}</td>
                    <td className="px-5 py-3 font-medium text-slate-800">{t.subject}</td>
                    <td className="px-5 py-3 text-slate-600">{t.requesterName}</td>
                    <td className="px-5 py-3 text-slate-600">{CAT_LABELS[t.category]}</td>
                    <td className="px-5 py-3">
                      <Badge tone={PRIORITY_META[t.priority].tone}>{PRIORITY_META[t.priority].label}</Badge>
                    </td>
                    <td className="px-5 py-3">
                      <Badge tone={STATUS_META[t.status].tone}>{STATUS_META[t.status].label}</Badge>
                    </td>
                    <td className="px-5 py-3">
                      {next ? (
                        <Button variant="secondary" className="px-2.5 py-1.5 text-xs" onClick={() => setTicketStatus(t.id, next)}>
                          <ArrowLeftRight size={14} /> {STATUS_META[next].label}
                        </Button>
                      ) : (
                        <span className="text-xs text-slate-400">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {list.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-sm text-slate-400">لا توجد تذاكر.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title="تذكرة دعم جديدة">
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="مقدّم الطلب">
              <Select value={form.requesterId} onChange={(e) => setForm({ ...form, requesterId: e.target.value })}>
                <option value="">— اختر —</option>
                {companyEmployees.map((e) => (
                  <option key={e.id} value={e.id}>{e.displayName}</option>
                ))}
              </Select>
            </Field>
            <Field label="التصنيف">
              <Select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as TicketCategory })}>
                {Object.entries(CAT_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </Select>
            </Field>
          </div>
          <Field label="الموضوع">
            <Input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
          </Field>
          <Field label="الوصف">
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-ink focus:ring-2 focus:ring-ink/20"
            />
          </Field>
          <Field label="الأولوية">
            <Select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value as TicketPriority })}>
              {Object.entries(PRIORITY_META).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </Select>
          </Field>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setOpen(false)}>إلغاء</Button>
          <Button onClick={submit}>إنشاء التذكرة</Button>
        </div>
      </Modal>
    </div>
  );
}
