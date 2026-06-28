"use client";

import { useState } from "react";
import { Plus, Star, Award } from "lucide-react";
import { useStore } from "@/store/useStore";
import { useScopedCompanyId } from "@/lib/scope";
import { roleHasPermission } from "@/lib/permissions";
import { Card, Badge, Button, Modal, Field, Input, Select, StatCard } from "@/components/ui";
import { formatDate } from "@/lib/format";

const DEFAULT_CRITERIA = ["جودة العمل", "الالتزام والانضباط", "العمل الجماعي", "المبادرة والتطوير"];
const CYCLES = ["التقييم السنوي 2026", "تقييم فترة التجربة", "التقييم النصف سنوي 2026"];

function Stars({ value }: { value: number }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={15}
          className={i <= Math.round(value) ? "fill-warning text-warning" : "text-slate-300"}
        />
      ))}
      <span className="mr-1 text-sm font-semibold text-slate-700">{value}</span>
    </span>
  );
}

export default function PerformancePage() {
  const companyId = useScopedCompanyId();
  const role = useStore((s) => s.currentUser?.role);
  const employees = useStore((s) => s.employees);
  const reviews = useStore((s) => s.reviews);
  const addReview = useStore((s) => s.addReview);

  const [open, setOpen] = useState(false);
  const [employeeId, setEmployeeId] = useState("");
  const [cycle, setCycle] = useState(CYCLES[0]);
  const [scores, setScores] = useState<number[]>(DEFAULT_CRITERIA.map(() => 4));
  const [comments, setComments] = useState("");

  const canReview = roleHasPermission(role, "SETTINGS_MANAGE");

  if (!companyId) {
    return <Card className="p-10 text-center text-sm text-slate-500">اختر شركة من المبدّل في الأعلى أولاً.</Card>;
  }

  const companyEmployees = employees.filter((e) => e.companyId === companyId);
  const list = reviews.filter((r) => r.companyId === companyId);
  const avg =
    list.length > 0 ? Math.round((list.reduce((s, r) => s + r.finalRating, 0) / list.length) * 100) / 100 : 0;
  const liveAvg = Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 100) / 100;

  function submit() {
    const emp = companyEmployees.find((e) => e.id === employeeId) ?? companyEmployees[0];
    if (!emp || !companyId) return;
    addReview({
      companyId,
      employeeId: emp.id,
      employeeName: emp.displayName,
      cycle,
      criteria: DEFAULT_CRITERIA.map((name, i) => ({ name, score: scores[i] })),
      comments,
    });
    setOpen(false);
    setEmployeeId("");
    setScores(DEFAULT_CRITERIA.map(() => 4));
    setComments("");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">تقييم الأداء</h1>
          <p className="mt-1 text-sm text-slate-500">دورات التقييم ونتائج الموظفين.</p>
        </div>
        {canReview && (
          <Button onClick={() => setOpen(true)}>
            <Plus size={18} /> تقييم جديد
          </Button>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="عدد التقييمات" value={list.length} icon={<Award size={20} />} />
        <StatCard label="متوسط الأداء" value={`${avg} / 5`} icon={<Star size={20} />} />
        <StatCard label="الموظفون المقيَّمون" value={new Set(list.map((r) => r.employeeId)).size} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {list.map((r) => (
          <Card key={r.id} className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">{r.employeeName}</h3>
                <p className="text-xs text-slate-400">{r.cycle}</p>
              </div>
              <Stars value={r.finalRating} />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {r.criteria.map((c) => (
                <div key={c.name} className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-1.5 text-xs">
                  <span className="text-slate-600">{c.name}</span>
                  <span className="font-semibold text-ink">{c.score}/5</span>
                </div>
              ))}
            </div>
            {r.comments && <p className="mt-3 text-sm leading-6 text-slate-600">{r.comments}</p>}
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                {r.reviewerName} • {formatDate(r.createdAt)}
              </span>
              <Badge tone="success">مكتمل</Badge>
            </div>
          </Card>
        ))}
        {list.length === 0 && (
          <Card className="p-10 text-center text-sm text-slate-400 lg:col-span-2">لا توجد تقييمات بعد.</Card>
        )}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="تقييم أداء جديد">
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="الموظف">
              <Select value={employeeId} onChange={(e) => setEmployeeId(e.target.value)}>
                <option value="">— اختر —</option>
                {companyEmployees.map((e) => (
                  <option key={e.id} value={e.id}>{e.displayName}</option>
                ))}
              </Select>
            </Field>
            <Field label="دورة التقييم">
              <Select value={cycle} onChange={(e) => setCycle(e.target.value)}>
                {CYCLES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </Select>
            </Field>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-medium text-slate-600">معايير التقييم (من 5)</span>
            {DEFAULT_CRITERIA.map((name, i) => (
              <div key={name} className="flex items-center justify-between gap-3 rounded-md border border-slate-200 px-3 py-2">
                <span className="text-sm text-slate-700">{name}</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((v) => (
                    <button
                      key={v}
                      onClick={() => setScores((s) => s.map((x, idx) => (idx === i ? v : x)))}
                      aria-label={`${v}`}
                    >
                      <Star size={18} className={v <= scores[i] ? "fill-warning text-warning" : "text-slate-300"} />
                    </button>
                  ))}
                </div>
              </div>
            ))}
            <div className="rounded-md bg-ink-50 px-3 py-2 text-sm">
              <span className="text-slate-600">النتيجة النهائية: </span>
              <span className="font-bold text-ink">{liveAvg} / 5</span>
            </div>
          </div>

          <Field label="ملاحظات">
            <Input value={comments} onChange={(e) => setComments(e.target.value)} />
          </Field>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setOpen(false)}>إلغاء</Button>
          <Button onClick={submit}>حفظ التقييم</Button>
        </div>
      </Modal>
    </div>
  );
}
