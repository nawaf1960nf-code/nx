"use client";

import { useState } from "react";
import { Plus, Check, X, CalendarDays, Clock3, Wallet, Laptop, FileText, FileQuestion } from "lucide-react";
import { useStore } from "@/store/useStore";
import { useScopedCompanyId } from "@/lib/scope";
import { roleHasPermission } from "@/lib/permissions";
import { Card, Badge, Button, Modal, Field, Input, Select, StatCard } from "@/components/ui";
import { formatDate, formatSAR } from "@/lib/format";
import type { RequestKind, RequestStatus, CompanyRequest, LeaveType } from "@/lib/types";

const KIND_META: Record<RequestKind, { label: string; icon: typeof CalendarDays }> = {
  LEAVE: { label: "إجازة", icon: CalendarDays },
  PERMISSION: { label: "استئذان", icon: Clock3 },
  LOAN: { label: "سلفة", icon: Wallet },
  REMOTE: { label: "عمل عن بُعد", icon: Laptop },
  DOCUMENT: { label: "طلب مستند", icon: FileText },
  OTHER: { label: "طلب آخر", icon: FileQuestion },
};
const LEAVE_LABELS: Record<LeaveType, string> = {
  ANNUAL: "سنوية",
  SICK: "مرضية",
  UNPAID: "بدون راتب",
  EMERGENCY: "اضطرارية",
  MATERNITY: "وضع",
};
const STATUS_META: Record<RequestStatus, { label: string; tone: "warning" | "success" | "danger" }> = {
  PENDING: { label: "قيد الاعتماد", tone: "warning" },
  APPROVED: { label: "معتمد", tone: "success" },
  REJECTED: { label: "مرفوض", tone: "danger" },
};
const DOC_TYPES = ["تعريف بالراتب", "شهادة راتب", "شهادة خبرة", "تعريف بالعمل", "خطاب لجهة حكومية"];

function daysBetween(a: string, b: string): number {
  const d = (new Date(b).getTime() - new Date(a).getTime()) / 86400000 + 1;
  return d > 0 ? Math.round(d) : 1;
}

function detailsOf(r: CompanyRequest): string {
  switch (r.kind) {
    case "LEAVE":
      return `${r.leaveType ? LEAVE_LABELS[r.leaveType] : ""} • ${r.days} يوم (${formatDate(r.startDate!)} — ${formatDate(r.endDate!)})`;
    case "PERMISSION":
      return `${r.hours} ساعة • ${r.date ? formatDate(r.date) : ""}`;
    case "LOAN":
      return `${formatSAR(r.amount ?? 0)} على ${r.installments} قسط`;
    case "REMOTE":
      return `${r.date ? formatDate(r.date) : ""}${r.reason ? " • " + r.reason : ""}`;
    case "DOCUMENT":
      return `${r.docType ?? ""}${r.reason ? " • " + r.reason : ""}`;
    default:
      return r.reason ?? "—";
  }
}

export default function RequestsPage() {
  const companyId = useScopedCompanyId();
  const role = useStore((s) => s.currentUser?.role);
  const employees = useStore((s) => s.employees);
  const requests = useStore((s) => s.requests);
  const submitRequest = useStore((s) => s.submitRequest);
  const setRequestStatus = useStore((s) => s.setRequestStatus);

  const [filter, setFilter] = useState<"ALL" | RequestStatus>("ALL");
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({
    employeeId: "",
    kind: "PERMISSION" as RequestKind,
    leaveType: "ANNUAL" as LeaveType,
    startDate: "",
    endDate: "",
    date: "",
    hours: 2,
    amount: 5000,
    installments: 6,
    docType: DOC_TYPES[0],
    reason: "",
  });

  const canApprove = roleHasPermission(role, "SETTINGS_MANAGE");

  if (!companyId) {
    return <Card className="p-10 text-center text-sm text-slate-500">اختر شركة من المبدّل في الأعلى أولاً.</Card>;
  }

  const companyEmployees = employees.filter((e) => e.companyId === companyId);
  const all = requests.filter((r) => r.companyId === companyId);
  const list = filter === "ALL" ? all : all.filter((r) => r.status === filter);
  const pending = all.filter((r) => r.status === "PENDING").length;

  function submit() {
    const emp = companyEmployees.find((e) => e.id === f.employeeId) ?? companyEmployees[0];
    if (!emp || !companyId) return;
    const base = { companyId, employeeId: emp.id, employeeName: emp.displayName, kind: f.kind, reason: f.reason };
    let extra: Partial<CompanyRequest> = {};
    if (f.kind === "LEAVE") extra = { leaveType: f.leaveType, startDate: f.startDate, endDate: f.endDate, days: f.startDate && f.endDate ? daysBetween(f.startDate, f.endDate) : 1 };
    else if (f.kind === "PERMISSION") extra = { date: f.date, hours: f.hours };
    else if (f.kind === "LOAN") extra = { amount: f.amount, installments: f.installments };
    else if (f.kind === "REMOTE") extra = { date: f.date };
    else if (f.kind === "DOCUMENT") extra = { docType: f.docType };
    submitRequest({ ...base, ...extra });
    setOpen(false);
    setF({ ...f, employeeId: "", reason: "", startDate: "", endDate: "", date: "" });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">الطلبات</h1>
          <p className="mt-1 text-sm text-slate-500">إجازات، استئذان، سلف، عمل عن بُعد، ومستندات.</p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus size={18} /> طلب جديد
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="إجمالي الطلبات" value={all.length} />
        <StatCard label="قيد الاعتماد" value={pending} />
        <StatCard label="معتمدة" value={all.filter((r) => r.status === "APPROVED").length} />
      </div>

      <div className="flex flex-wrap gap-2">
        {(["ALL", "PENDING", "APPROVED", "REJECTED"] as const).map((x) => (
          <button
            key={x}
            onClick={() => setFilter(x)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium ${
              filter === x ? "bg-ink text-white" : "border border-slate-200 bg-white text-slate-600"
            }`}
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
                <th className="px-5 py-3 font-medium">الموظف</th>
                <th className="px-5 py-3 font-medium">النوع</th>
                <th className="px-5 py-3 font-medium">التفاصيل</th>
                <th className="px-5 py-3 font-medium">الحالة</th>
                {canApprove && <th className="px-5 py-3 font-medium">إجراء</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {list.map((r) => {
                const meta = KIND_META[r.kind];
                const Icon = meta.icon;
                const sm = STATUS_META[r.status];
                return (
                  <tr key={r.id} className="hover:bg-slate-50">
                    <td className="px-5 py-3 font-medium text-slate-800">{r.employeeName}</td>
                    <td className="px-5 py-3">
                      <span className="inline-flex items-center gap-1.5 text-slate-600">
                        <Icon size={15} className="text-ink" /> {meta.label}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-slate-600">{detailsOf(r)}</td>
                    <td className="px-5 py-3">
                      <Badge tone={sm.tone}>{sm.label}</Badge>
                    </td>
                    {canApprove && (
                      <td className="px-5 py-3">
                        {r.status === "PENDING" ? (
                          <div className="flex gap-2">
                            <Button className="px-2.5 py-1.5 text-xs" onClick={() => setRequestStatus(r.id, "APPROVED")}>
                              <Check size={14} /> اعتماد
                            </Button>
                            <Button variant="danger" className="px-2.5 py-1.5 text-xs" onClick={() => setRequestStatus(r.id, "REJECTED")}>
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
                  <td colSpan={canApprove ? 5 : 4} className="px-5 py-10 text-center text-sm text-slate-400">
                    لا توجد طلبات.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title="طلب جديد">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="الموظف">
            <Select value={f.employeeId} onChange={(e) => setF({ ...f, employeeId: e.target.value })}>
              <option value="">— اختر —</option>
              {companyEmployees.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.displayName}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="نوع الطلب">
            <Select value={f.kind} onChange={(e) => setF({ ...f, kind: e.target.value as RequestKind })}>
              {Object.entries(KIND_META).map(([k, v]) => (
                <option key={k} value={k}>
                  {v.label}
                </option>
              ))}
            </Select>
          </Field>

          {f.kind === "LEAVE" && (
            <>
              <Field label="نوع الإجازة">
                <Select value={f.leaveType} onChange={(e) => setF({ ...f, leaveType: e.target.value as LeaveType })}>
                  {Object.entries(LEAVE_LABELS).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </Select>
              </Field>
              <div />
              <Field label="من تاريخ">
                <Input type="date" value={f.startDate} onChange={(e) => setF({ ...f, startDate: e.target.value })} />
              </Field>
              <Field label="إلى تاريخ">
                <Input type="date" value={f.endDate} onChange={(e) => setF({ ...f, endDate: e.target.value })} />
              </Field>
            </>
          )}
          {f.kind === "PERMISSION" && (
            <>
              <Field label="التاريخ">
                <Input type="date" value={f.date} onChange={(e) => setF({ ...f, date: e.target.value })} />
              </Field>
              <Field label="عدد الساعات">
                <Input type="number" value={f.hours} onChange={(e) => setF({ ...f, hours: Number(e.target.value) })} />
              </Field>
            </>
          )}
          {f.kind === "LOAN" && (
            <>
              <Field label="مبلغ السلفة">
                <Input type="number" value={f.amount} onChange={(e) => setF({ ...f, amount: Number(e.target.value) })} />
              </Field>
              <Field label="عدد الأقساط">
                <Input type="number" value={f.installments} onChange={(e) => setF({ ...f, installments: Number(e.target.value) })} />
              </Field>
            </>
          )}
          {f.kind === "REMOTE" && (
            <Field label="التاريخ">
              <Input type="date" value={f.date} onChange={(e) => setF({ ...f, date: e.target.value })} />
            </Field>
          )}
          {f.kind === "DOCUMENT" && (
            <Field label="نوع المستند">
              <Select value={f.docType} onChange={(e) => setF({ ...f, docType: e.target.value })}>
                {DOC_TYPES.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </Select>
            </Field>
          )}

          <div className="sm:col-span-2">
            <Field label="السبب / ملاحظات">
              <Input value={f.reason} onChange={(e) => setF({ ...f, reason: e.target.value })} />
            </Field>
          </div>
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
