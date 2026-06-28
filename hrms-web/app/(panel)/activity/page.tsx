"use client";

import { Undo2, History } from "lucide-react";
import { useStore } from "@/store/useStore";
import { Card, Badge, Button } from "@/components/ui";
import type { AuditAction } from "@/lib/types";

const ACTION_META: Record<AuditAction, { label: string; tone: "info" | "success" | "danger" | "warning" | "neutral" }> = {
  ADD_COMPANY: { label: "إضافة شركة", tone: "success" },
  UPDATE_COMPANY: { label: "تعديل شركة", tone: "info" },
  SET_COMPANY_STATUS: { label: "حالة اشتراك", tone: "warning" },
  INVITE_ADMIN: { label: "دعوة مسؤول", tone: "info" },
  ADD_EMPLOYEE: { label: "إضافة موظف", tone: "success" },
  UPDATE_EMPLOYEE: { label: "تعديل موظف", tone: "info" },
  DELETE_EMPLOYEE: { label: "حذف موظف", tone: "danger" },
  IMPORT_EMPLOYEES: { label: "استيراد", tone: "success" },
  REQUEST_LEAVE: { label: "طلب إجازة", tone: "info" },
  APPROVE_LEAVE: { label: "اعتماد إجازة", tone: "success" },
  REJECT_LEAVE: { label: "رفض إجازة", tone: "danger" },
  RECORD_ATTENDANCE: { label: "حضور", tone: "info" },
  RUN_PAYROLL: { label: "تشغيل رواتب", tone: "info" },
  PAY_PAYROLL: { label: "صرف رواتب", tone: "success" },
  SUBMIT_REQUEST: { label: "طلب جديد", tone: "info" },
  DECIDE_REQUEST: { label: "قرار طلب", tone: "success" },
  PUBLISH_ANNOUNCEMENT: { label: "إعلان", tone: "warning" },
  GRANT_LOAN: { label: "سلفة", tone: "info" },
  ADD_DEDUCTION: { label: "خصم", tone: "danger" },
  ADD_REVIEW: { label: "تقييم", tone: "success" },
  ADD_DOCUMENT: { label: "مستند", tone: "info" },
  CREATE_TICKET: { label: "تذكرة دعم", tone: "info" },
  UPDATE_TICKET: { label: "تحديث تذكرة", tone: "info" },
  ADD_INSURANCE: { label: "تأمين طبي", tone: "info" },
  LINK_CHI: { label: "ربط الضمان الصحي", tone: "success" },
  REVERT: { label: "تراجع", tone: "neutral" },
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "الآن";
  if (m < 60) return `قبل ${m} دقيقة`;
  const h = Math.floor(m / 60);
  if (h < 24) return `قبل ${h} ساعة`;
  return `قبل ${Math.floor(h / 24)} يوم`;
}

export default function ActivityPage() {
  const currentUser = useStore((s) => s.currentUser);
  const activeCompanyId = useStore((s) => s.activeCompanyId);
  const auditLog = useStore((s) => s.auditLog);
  const companies = useStore((s) => s.companies);
  const revertAudit = useStore((s) => s.revertAudit);

  const isSuper = currentUser?.role === "SUPER_ADMIN";
  // مدير النظام يرى الكل (أو شركة محدّدة)؛ مسؤول الشركة يرى شركته فقط.
  const scopeCompany = isSuper ? activeCompanyId : currentUser?.companyId ?? null;
  const entries = auditLog.filter((e) => (scopeCompany ? e.companyId === scopeCompany : true));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">سجل النشاط</h1>
        <p className="mt-1 text-sm text-slate-500">
          متابعة كل حركة في النظام مع إمكانية التراجع عن الإجراءات الخاطئة.
        </p>
      </div>

      <Card>
        {entries.length === 0 ? (
          <div className="flex flex-col items-center gap-2 p-12 text-center text-sm text-slate-400">
            <History size={28} />
            لا توجد حركات مسجّلة بعد. ابدأ بإضافة أو تعديل البيانات لتظهر هنا.
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {entries.map((e) => {
              const meta = ACTION_META[e.action];
              const company = companies.find((c) => c.id === e.companyId);
              return (
                <li key={e.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 hover:bg-slate-50">
                  <div className="flex items-center gap-3">
                    <Badge tone={meta.tone}>{meta.label}</Badge>
                    <div>
                      <p className={`text-sm ${e.reverted ? "text-slate-400 line-through" : "text-slate-800"}`}>
                        {e.summary}
                      </p>
                      <p className="text-xs text-slate-400">
                        {e.actorName} • {timeAgo(e.at)}
                        {isSuper && company ? ` • ${company.name}` : ""}
                      </p>
                    </div>
                  </div>

                  {e.undo &&
                    (e.reverted ? (
                      <Badge tone="neutral">تم التراجع</Badge>
                    ) : (
                      <Button variant="secondary" className="px-2.5 py-1.5 text-xs" onClick={() => revertAudit(e.id)}>
                        <Undo2 size={14} /> تراجع
                      </Button>
                    ))}
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </div>
  );
}
