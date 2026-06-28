"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { useStore } from "@/store/useStore";
import { roleHasPermission } from "@/lib/permissions";
import { Card, Badge } from "@/components/ui";
import { EmployeeTimeline } from "@/components/EmployeeTimeline";
import { EosCalculator } from "@/components/EosCalculator";
import { formatSAR, formatDate, serviceLength } from "@/lib/format";
import { sumWage } from "@/lib/eos";
import { Star } from "lucide-react";
import type { Employee, Loan, PerformanceReview } from "@/lib/types";

export default function EmployeeDetailPage() {
  const params = useParams<{ id: string }>();
  const employees = useStore((s) => s.employees);
  const role = useStore((s) => s.currentUser?.role);
  const reviews = useStore((s) => s.reviews);
  const loans = useStore((s) => s.loans);
  const employee = employees.find((e) => e.id === params.id);

  const canSeeFinancial = roleHasPermission(role, "FINANCIAL_VIEW");

  const tabs = useMemo(() => {
    if (!employee) return [];
    const empReviews = reviews.filter((r) => r.employeeId === employee.id);
    const empLoans = loans.filter((l) => l.employeeId === employee.id);
    const list: { key: string; label: string; render: () => ReactNode }[] = [
      { key: "personal", label: "المعلومات الشخصية", render: () => <PersonalInfo e={employee} /> },
      { key: "job", label: "المعلومات الوظيفية", render: () => <JobInfo e={employee} /> },
      { key: "performance", label: "الأداء", render: () => <PerformanceInfo reviews={empReviews} /> },
    ];
    // التبويبات المالية لا تُبنى في الـ DOM إلا لمن يملك الصلاحية.
    if (canSeeFinancial) {
      list.push({ key: "financial", label: "المعلومات المالية", render: () => <FinancialInfo e={employee} loans={empLoans} /> });
      list.push({ key: "eos", label: "نهاية الخدمة", render: () => <EosCalculator employee={employee} /> });
    }
    list.push({ key: "timeline", label: "السجل الزمني", render: () => <EmployeeTimeline events={employee.events} /> });
    return list;
  }, [employee, canSeeFinancial, reviews, loans]);

  const [active, setActive] = useState("personal");

  if (!employee) {
    return (
      <Card className="p-10 text-center text-sm text-slate-500">
        لم يُعثر على الموظف.{" "}
        <Link href="/employees" className="text-ink hover:underline">
          العودة للقائمة
        </Link>
      </Card>
    );
  }

  const activeTab = tabs.find((t) => t.key === active) ?? tabs[0];

  return (
    <div className="space-y-5">
      <Link href="/employees" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-ink">
        <ArrowRight size={16} /> العودة للموظفين
      </Link>

      <Card>
        <header className="flex flex-wrap items-center gap-4 border-b border-slate-200 px-6 py-5">
          <span className="flex h-14 w-14 items-center justify-center rounded-md bg-ink text-lg font-semibold text-white">
            {employee.displayName.charAt(0)}
          </span>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-slate-900">{employee.displayName}</h1>
            <p className="text-sm text-slate-500">
              #{employee.employeeNumber} — {employee.position} — {employee.department}
            </p>
          </div>
          <div className="text-left">
            <p className="text-xs text-slate-400">مدة الخدمة</p>
            <p className="text-sm font-semibold text-slate-700">{serviceLength(employee.hireDate)}</p>
          </div>
        </header>

        <nav className="flex gap-1 overflow-x-auto border-b border-slate-200 px-4" role="tablist">
          {tabs.map((t) => {
            const on = t.key === activeTab?.key;
            return (
              <button
                key={t.key}
                onClick={() => setActive(t.key)}
                className="whitespace-nowrap rounded-t-md px-4 py-3 text-sm font-medium transition-colors"
                style={on ? { color: "#1e3a5f", borderBottom: "2px solid #1e3a5f" } : { color: "#64748b" }}
              >
                {t.label}
              </button>
            );
          })}
        </nav>

        <div className="px-6 py-5">{activeTab?.render()}</div>
      </Card>
    </div>
  );
}

function Item({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-slate-500">{label}</span>
      <span className="text-sm text-slate-800">{value ?? "—"}</span>
    </div>
  );
}

function PersonalInfo({ e }: { e: Employee }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <Item label="الاسم الكامل" value={e.displayName} />
      <Item label="الاسم بالإنجليزية" value={e.nameInEnglish} />
      <Item label="الجنسية" value={e.nationality} />
      <Item label="رقم الهوية / الإقامة" value={e.idNumber} />
    </div>
  );
}

function JobInfo({ e }: { e: Employee }) {
  const statusLabels: Record<string, string> = {
    ACTIVE: "نشط",
    ON_PROBATION: "تحت التجربة",
    ON_LEAVE: "في إجازة",
    TERMINATED: "منتهي",
    RESIGNED: "مستقيل",
  };
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <Item label="الرقم الوظيفي" value={e.employeeNumber} />
      <Item label="القسم" value={e.department} />
      <Item label="المسمى الوظيفي" value={e.position} />
      <Item label="تاريخ التعيين" value={formatDate(e.hireDate)} />
      <Item label="نوع التوظيف" value={e.employmentType === "FULL_TIME" ? "دوام كامل" : e.employmentType} />
      <Item label="الحالة" value={<Badge tone="info">{statusLabels[e.status]}</Badge>} />
    </div>
  );
}

function FinancialInfo({ e, loans }: { e: Employee; loans: Loan[] }) {
  const total = sumWage({
    baseSalary: e.baseSalary,
    housingAllowance: e.housingAllowance,
    transportAllowance: e.transportAllowance,
    otherAllowances: e.otherAllowances,
  });
  const activeLoans = loans.filter((l) => l.status === "ACTIVE");
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <Item label="الراتب الأساسي" value={formatSAR(e.baseSalary)} />
        <Item label="بدل السكن" value={formatSAR(e.housingAllowance)} />
        <Item label="بدل النقل" value={formatSAR(e.transportAllowance)} />
        <Item label="بدلات أخرى" value={formatSAR(e.otherAllowances)} />
        <Item label="اسم البنك" value={e.bankName} />
        <Item label="رقم الآيبان" value={e.ibanNumber} />
      </div>
      <div className="rounded-md bg-ink-50 px-4 py-3 text-sm">
        <span className="text-slate-600">إجمالي الأجر الشهري: </span>
        <span className="font-bold text-ink">{formatSAR(total)}</span>
      </div>
      {activeLoans.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-semibold text-slate-700">السلف الجارية</p>
          <div className="space-y-2">
            {activeLoans.map((l) => (
              <div key={l.id} className="flex items-center justify-between rounded-md border border-slate-200 px-4 py-2.5 text-sm">
                <span className="text-slate-600">
                  سلفة {formatSAR(l.amount)} — قسط {formatSAR(l.installmentAmount)}
                </span>
                <span className="font-medium text-slate-800">
                  المتبقّي {formatSAR(l.remaining)} ({l.paidInstallments}/{l.installments})
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function PerformanceInfo({ reviews }: { reviews: PerformanceReview[] }) {
  if (reviews.length === 0) {
    return <p className="py-6 text-center text-sm text-slate-400">لا توجد تقييمات لهذا الموظف بعد.</p>;
  }
  return (
    <div className="space-y-4">
      {reviews.map((r) => (
        <div key={r.id} className="rounded-lg border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-800">{r.cycle}</p>
            <span className="inline-flex items-center gap-1 text-sm font-bold text-slate-800">
              <Star size={15} className="fill-warning text-warning" />
              {r.finalRating} / 5
            </span>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {r.criteria.map((c) => (
              <div key={c.name} className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-1.5 text-xs">
                <span className="text-slate-600">{c.name}</span>
                <span className="font-semibold text-ink">{c.score}/5</span>
              </div>
            ))}
          </div>
          {r.comments && <p className="mt-2 text-sm text-slate-600">{r.comments}</p>}
        </div>
      ))}
    </div>
  );
}
