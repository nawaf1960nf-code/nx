"use client";

import { useState } from "react";
import { Plus, Megaphone, Users, Building, UserCheck } from "lucide-react";
import { useStore } from "@/store/useStore";
import { useScopedCompanyId } from "@/lib/scope";
import { roleHasPermission } from "@/lib/permissions";
import { Card, Badge, Button, Modal, Field, Input, Select } from "@/components/ui";
import { formatDate } from "@/lib/format";
import type { AnnouncementAudience } from "@/lib/types";

const AUDIENCE_META: Record<AnnouncementAudience, { label: string; icon: typeof Users }> = {
  ALL: { label: "كل الموظفين", icon: Users },
  DEPARTMENT: { label: "إدارة محددة", icon: Building },
  EMPLOYEES: { label: "موظفون محددون", icon: UserCheck },
};

export default function AnnouncementsPage() {
  const companyId = useScopedCompanyId();
  const role = useStore((s) => s.currentUser?.role);
  const employees = useStore((s) => s.employees);
  const announcements = useStore((s) => s.announcements);
  const publishAnnouncement = useStore((s) => s.publishAnnouncement);

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    content: "",
    audience: "ALL" as AnnouncementAudience,
    targetDept: "",
    targetEmployeeIds: [] as string[],
  });

  const canPublish = roleHasPermission(role, "SETTINGS_MANAGE");

  if (!companyId) {
    return <Card className="p-10 text-center text-sm text-slate-500">اختر شركة من المبدّل في الأعلى أولاً.</Card>;
  }

  const companyEmployees = employees.filter((e) => e.companyId === companyId);
  const departments = [...new Set(companyEmployees.map((e) => e.department))];
  const list = announcements.filter((a) => a.companyId === companyId);

  function toggleEmployee(id: string) {
    setForm((f) => ({
      ...f,
      targetEmployeeIds: f.targetEmployeeIds.includes(id)
        ? f.targetEmployeeIds.filter((x) => x !== id)
        : [...f.targetEmployeeIds, id],
    }));
  }

  function publish() {
    if (!form.title.trim() || !form.content.trim() || !companyId) return;
    publishAnnouncement({
      companyId,
      title: form.title,
      content: form.content,
      audience: form.audience,
      targetDept: form.audience === "DEPARTMENT" ? form.targetDept || departments[0] : undefined,
      targetEmployeeIds: form.audience === "EMPLOYEES" ? form.targetEmployeeIds : undefined,
    });
    setOpen(false);
    setForm({ title: "", content: "", audience: "ALL", targetDept: "", targetEmployeeIds: [] });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">الإعلانات</h1>
          <p className="mt-1 text-sm text-slate-500">نشر إعلانات للجميع أو لإدارة أو لموظفين محددين.</p>
        </div>
        {canPublish && (
          <Button onClick={() => setOpen(true)}>
            <Plus size={18} /> إعلان جديد
          </Button>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {list.map((a) => {
          const meta = AUDIENCE_META[a.audience];
          const Icon = meta.icon;
          const target = a.audience === "DEPARTMENT" ? `${meta.label}: ${a.targetDept}` : meta.label;
          return (
            <Card key={a.id} className="p-5">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-ink-50 text-ink">
                  <Megaphone size={18} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-base font-bold text-slate-900">{a.title}</h3>
                    <Badge tone="info">
                      <Icon size={12} /> <span className="mr-1">{target}</span>
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{a.content}</p>
                  <p className="mt-3 text-xs text-slate-400">
                    {a.createdByName} • {formatDate(a.createdAt)} • {a.recipients} مستلم
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
        {list.length === 0 && (
          <Card className="p-10 text-center text-sm text-slate-400 lg:col-span-2">لا توجد إعلانات بعد.</Card>
        )}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="إعلان جديد">
        <div className="space-y-4">
          <Field label="العنوان">
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </Field>
          <Field label="المحتوى">
            <textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              rows={4}
              className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-ink focus:ring-2 focus:ring-ink/20"
            />
          </Field>
          <Field label="الجمهور المستهدف">
            <Select value={form.audience} onChange={(e) => setForm({ ...form, audience: e.target.value as AnnouncementAudience })}>
              {Object.entries(AUDIENCE_META).map(([k, v]) => (
                <option key={k} value={k}>
                  {v.label}
                </option>
              ))}
            </Select>
          </Field>

          {form.audience === "DEPARTMENT" && (
            <Field label="الإدارة">
              <Select value={form.targetDept} onChange={(e) => setForm({ ...form, targetDept: e.target.value })}>
                {departments.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </Select>
            </Field>
          )}

          {form.audience === "EMPLOYEES" && (
            <div>
              <span className="mb-1.5 block text-xs font-medium text-slate-600">اختر الموظفين</span>
              <div className="max-h-44 space-y-1 overflow-y-auto rounded-md border border-slate-200 p-2">
                {companyEmployees.map((e) => (
                  <label key={e.id} className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-slate-50">
                    <input
                      type="checkbox"
                      checked={form.targetEmployeeIds.includes(e.id)}
                      onChange={() => toggleEmployee(e.id)}
                      className="accent-[#1e3a5f]"
                    />
                    <span className="text-slate-700">{e.displayName}</span>
                    <span className="text-xs text-slate-400">— {e.department}</span>
                  </label>
                ))}
              </div>
              <p className="mt-1 text-xs text-slate-400">المحدّدون: {form.targetEmployeeIds.length}</p>
            </div>
          )}
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setOpen(false)}>
            إلغاء
          </Button>
          <Button onClick={publish}>نشر الإعلان</Button>
        </div>
      </Modal>
    </div>
  );
}
