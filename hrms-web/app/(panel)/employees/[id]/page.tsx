"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowRight, User, Briefcase, Wallet, Landmark, FolderArchive, Star, Calculator, History, Package } from "lucide-react";
import { useStore } from "@/store/useStore";
import { roleHasPermission } from "@/lib/permissions";
import { Card, Badge } from "@/components/ui";
import { EmployeeTimeline } from "@/components/EmployeeTimeline";
import { EosCalculator } from "@/components/EosCalculator";
import { formatSAR, formatDate, serviceLength } from "@/lib/format";
import { sumWage } from "@/lib/eos";
import { computePayrollLine } from "@/lib/payroll";
import type { CompanyAsset, Employee, EmployeeDocument, Loan, PerformanceReview, TrainingRecord } from "@/lib/types";

const STATUS_LABELS: Record<string, string> = {
  ACTIVE: "نشط",
  ON_PROBATION: "تحت التجربة",
  ON_LEAVE: "في إجازة",
  TERMINATED: "منتهي",
  RESIGNED: "مستقيل",
};
const TYPE_LABELS: Record<string, string> = {
  FULL_TIME: "دوام كامل",
  PART_TIME: "دوام جزئي",
  CONTRACT: "عقد",
  INTERN: "تدريب",
};

function age(dob?: string): string {
  if (!dob) return "—";
  const y = (Date.now() - new Date(dob).getTime()) / (365.25 * 86400000);
  return `${Math.floor(y)} سنة`;
}
function docState(expiry?: string): { label: string; tone: "success" | "warning" | "danger" | "neutral" } {
  if (!expiry) return { label: "بدون انتهاء", tone: "neutral" };
  const d = (new Date(expiry).getTime() - Date.now()) / 86400000;
  if (d < 0) return { label: "منتهية", tone: "danger" };
  if (d <= 30) return { label: "تنتهي قريباً", tone: "warning" };
  return { label: "سارية", tone: "success" };
}

export default function EmployeeDetailPage() {
  const params = useParams<{ id: string }>();
  const employees = useStore((s) => s.employees);
  const companies = useStore((s) => s.companies);
  const role = useStore((s) => s.currentUser?.role);
  const reviews = useStore((s) => s.reviews);
  const loans = useStore((s) => s.loans);
  const documents = useStore((s) => s.documents);
  const assets = useStore((s) => s.assets);
  const training = useStore((s) => s.training);
  const employee = employees.find((e) => e.id === params.id);

  const canFinancial = roleHasPermission(role, "FINANCIAL_VIEW");

  const sections = useMemo(() => {
    if (!employee) return [];
    const empReviews = reviews.filter((r) => r.employeeId === employee.id);
    const empLoans = loans.filter((l) => l.employeeId === employee.id);
    const empDocs = documents.filter((d) => d.employeeId === employee.id);
    const company = companies.find((c) => c.id === employee.companyId);

    const list: { key: string; label: string; icon: ReactNode; render: () => ReactNode }[] = [
      { key: "personal", label: "البيانات الشخصية", icon: <User size={17} />, render: () => <PersonalInfo e={employee} /> },
      { key: "work", label: "معلومات العمل", icon: <Briefcase size={17} />, render: () => <WorkInfo e={employee} companyName={company?.name} /> },
    ];
    if (canFinancial) {
      list.push({ key: "salary", label: "معلومات الراتب", icon: <Wallet size={17} />, render: () => <SalaryInfo e={employee} loans={empLoans} /> });
      list.push({ key: "bank", label: "البيانات البنكية", icon: <Landmark size={17} />, render: () => <BankInfo e={employee} /> });
    }
    list.push({ key: "documents", label: "المستندات", icon: <FolderArchive size={17} />, render: () => <DocsInfo docs={empDocs} /> });
    list.push({ key: "assets", label: "العُهد والتدريب", icon: <Package size={17} />, render: () => <AssetsTrainingInfo assets={assets.filter((a) => a.employeeId === employee.id)} training={training.filter((t) => t.employeeId === employee.id)} /> });
    list.push({ key: "performance", label: "الأداء", icon: <Star size={17} />, render: () => <PerformanceInfo reviews={empReviews} /> });
    if (canFinancial) {
      list.push({ key: "eos", label: "نهاية الخدمة", icon: <Calculator size={17} />, render: () => <EosCalculator employee={employee} /> });
    }
    list.push({ key: "timeline", label: "السجل الزمني", icon: <History size={17} />, render: () => <EmployeeTimeline events={employee.events} /> });
    return list;
  }, [employee, canFinancial, reviews, loans, documents, assets, training, companies]);

  const [active, setActive] = useState("personal");

  if (!employee) {
    return (
      <Card className="p-10 text-center text-sm text-slate-500">
        لم يُعثر على الموظف.{" "}
        <Link href="/employees" className="text-ink hover:underline">العودة للقائمة</Link>
      </Card>
    );
  }

  const activeSection = sections.find((s) => s.key === active) ?? sections[0];
  const latestRating = reviews.filter((r) => r.employeeId === employee.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0]?.finalRating;

  return (
    <div className="space-y-5">
      <Link href="/employees" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-ink">
        <ArrowRight size={16} /> العودة للموظفين
      </Link>

      {/* بطاقة الترويسة */}
      <Card className="p-6">
        <div className="flex flex-wrap items-center gap-4">
          <span className="flex h-16 w-16 items-center justify-center rounded-md bg-ink text-2xl font-semibold text-white">
            {employee.firstName.charAt(0)}
          </span>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-slate-900">{employee.displayName}</h1>
            {employee.nameInEnglish && <p className="text-sm text-slate-400">{employee.nameInEnglish}</p>}
            <p className="mt-0.5 text-sm text-slate-500">
              #{employee.employeeNumber} — {employee.position} — {employee.department}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={employee.status === "ACTIVE" ? "success" : "warning"}>{STATUS_LABELS[employee.status]}</Badge>
            {latestRating != null && (
              <span className="inline-flex items-center gap-1 rounded-md bg-warning-50 px-2 py-0.5 text-xs font-semibold text-warning">
                <Star size={12} className="fill-warning" /> {latestRating}
              </span>
            )}
          </div>
        </div>
      </Card>

      {/* قائمة جانبية + محتوى القسم */}
      <div className="flex flex-col gap-5 lg:flex-row">
        <nav className="flex gap-1 overflow-x-auto lg:w-60 lg:shrink-0 lg:flex-col lg:overflow-visible">
          {sections.map((s) => {
            const on = s.key === activeSection?.key;
            return (
              <button
                key={s.key}
                onClick={() => setActive(s.key)}
                className={`flex items-center gap-2.5 whitespace-nowrap rounded-md px-3.5 py-2.5 text-sm font-medium transition-colors ${
                  on ? "bg-ink text-white" : "bg-surface text-slate-600 hover:bg-slate-100"
                }`}
              >
                {s.icon}
                {s.label}
              </button>
            );
          })}
        </nav>

        <Card className="min-w-0 flex-1 p-6">{activeSection?.render()}</Card>
      </div>
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
function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h3 className="mb-4 text-sm font-bold text-slate-800">{title}</h3>
      {children}
    </div>
  );
}

function PersonalInfo({ e }: { e: Employee }) {
  const fullEn = [e.firstNameEn, e.secondNameEn, e.lastNameEn].filter(Boolean).join(" ");
  return (
    <div className="space-y-6">
      <Section title="الاسم بالعربية">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <Item label="الاسم الأول" value={e.firstName} />
          <Item label="الاسم الثاني" value={e.secondName} />
          <Item label="الاسم الثالث" value={e.thirdName} />
          <Item label="الاسم الأخير" value={e.lastName} />
        </div>
      </Section>
      <Section title="الاسم بالإنجليزية">
        <Item label="الاسم الكامل" value={fullEn || e.nameInEnglish} />
      </Section>
      <Section title="بيانات التعريف">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <Item label="رقم الهوية / الإقامة" value={e.idNumber} />
          <Item label="الجنس" value={e.gender === "FEMALE" ? "أنثى" : e.gender === "MALE" ? "ذكر" : "—"} />
          <Item label="تاريخ الميلاد" value={e.dateOfBirth ? `${formatDate(e.dateOfBirth)} (${age(e.dateOfBirth)})` : "—"} />
          <Item label="الجنسية" value={e.nationality} />
          <Item label="رقم الجوال" value={e.mobile} />
          <Item label="البريد الإلكتروني" value={e.email} />
        </div>
      </Section>
    </div>
  );
}

function WorkInfo({ e, companyName }: { e: Employee; companyName?: string }) {
  return (
    <Section title="معلومات العمل">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <Item label="الشركة" value={companyName} />
        <Item label="القسم / الإدارة" value={e.department} />
        <Item label="المسمى الوظيفي" value={e.position} />
        <Item label="مقر العمل" value={e.workLocation} />
        <Item label="الرقم الوظيفي" value={e.employeeNumber} />
        <Item label="نوع التوظيف" value={TYPE_LABELS[e.employmentType]} />
        <Item label="تاريخ التعيين" value={formatDate(e.hireDate)} />
        <Item label="مدة الخدمة" value={serviceLength(e.hireDate)} />
        <Item label="الحالة" value={<Badge tone="info">{STATUS_LABELS[e.status]}</Badge>} />
      </div>
    </Section>
  );
}

function SalaryInfo({ e, loans }: { e: Employee; loans: Loan[] }) {
  const activeLoans = loans.filter((l) => l.status === "ACTIVE");
  const loanDed = activeLoans.reduce((s, l) => s + Math.min(l.installmentAmount, l.remaining), 0);
  const line = computePayrollLine(e, loanDed, 0);
  return (
    <Section title="تفاصيل الراتب">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <Item label="الراتب الأساسي" value={formatSAR(e.baseSalary)} />
        <Item label="بدل السكن" value={formatSAR(e.housingAllowance)} />
        <Item label="بدل النقل" value={formatSAR(e.transportAllowance)} />
        <Item label="بدلات أخرى" value={formatSAR(e.otherAllowances)} />
        <Item label="إجمالي الأجر" value={formatSAR(line.gross)} />
        <Item label="خصم التأمينات (GOSI)" value={line.gosi ? `- ${formatSAR(line.gosi)}` : "—"} />
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-md bg-ink-50 px-4 py-3">
        <span className="text-sm text-slate-600">صافي الراتب التقديري{loanDed ? " (بعد خصم قسط السلفة)" : ""}</span>
        <span className="text-lg font-bold text-ink">{formatSAR(line.net)}</span>
      </div>
      {activeLoans.length > 0 && (
        <div className="mt-5">
          <h4 className="mb-2 text-sm font-bold text-slate-700">السلف الجارية</h4>
          <div className="space-y-2">
            {activeLoans.map((l) => (
              <div key={l.id} className="flex items-center justify-between rounded-md border border-slate-200 px-4 py-2.5 text-sm">
                <span className="text-slate-600">سلفة {formatSAR(l.amount)} — قسط {formatSAR(l.installmentAmount)}</span>
                <span className="font-medium text-slate-800">المتبقّي {formatSAR(l.remaining)} ({l.paidInstallments}/{l.installments})</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Section>
  );
}

function BankInfo({ e }: { e: Employee }) {
  return (
    <Section title="البيانات البنكية">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Item label="اسم البنك" value={e.bankName} />
        <Item label="رقم الآيبان (IBAN)" value={<span className="font-mono tracking-wide">{e.ibanNumber}</span>} />
      </div>
    </Section>
  );
}

function DocsInfo({ docs }: { docs: EmployeeDocument[] }) {
  if (docs.length === 0) return <p className="py-6 text-center text-sm text-slate-400">لا توجد مستندات لهذا الموظف.</p>;
  return (
    <Section title="مستندات الموظف">
      <div className="space-y-2">
        {docs.map((d) => {
          const st = docState(d.expiryDate);
          return (
            <div key={d.id} className="flex items-center justify-between rounded-md border border-slate-200 px-4 py-3 text-sm">
              <div>
                <p className="font-medium text-slate-800">{d.type}</p>
                <p className="text-xs text-slate-400">
                  {d.number ? `رقم: ${d.number}` : ""}
                  {d.expiryDate ? ` — ينتهي ${formatDate(d.expiryDate)}` : ""}
                </p>
              </div>
              <Badge tone={st.tone}>{st.label}</Badge>
            </div>
          );
        })}
      </div>
    </Section>
  );
}

function AssetsTrainingInfo({ assets, training }: { assets: CompanyAsset[]; training: TrainingRecord[] }) {
  const trStatus: Record<string, string> = { ENROLLED: "مُسجَّل", IN_PROGRESS: "قيد التنفيذ", COMPLETED: "مكتمل" };
  return (
    <div className="space-y-6">
      <Section title="العُهد المُسلَّمة">
        {assets.length === 0 ? (
          <p className="text-sm text-slate-400">لا توجد عُهد مُسلَّمة.</p>
        ) : (
          <div className="space-y-2">
            {assets.map((a) => (
              <div key={a.id} className="flex items-center justify-between rounded-md border border-slate-200 px-4 py-2.5 text-sm">
                <span className="text-slate-700">{a.name}</span>
                <Badge tone={a.status === "ASSIGNED" ? "success" : "neutral"}>{a.status === "ASSIGNED" ? "بالعهدة" : "مُسترجَع"}</Badge>
              </div>
            ))}
          </div>
        )}
      </Section>
      <Section title="البرامج التدريبية">
        {training.length === 0 ? (
          <p className="text-sm text-slate-400">لا توجد برامج تدريبية.</p>
        ) : (
          <div className="space-y-2">
            {training.map((t) => (
              <div key={t.id} className="flex items-center justify-between rounded-md border border-slate-200 px-4 py-2.5 text-sm">
                <div>
                  <p className="font-medium text-slate-800">{t.title}</p>
                  <p className="text-xs text-slate-400">{t.provider ?? ""}{t.hours ? ` — ${t.hours} ساعة` : ""}</p>
                </div>
                <Badge tone={t.status === "COMPLETED" ? "success" : "warning"}>{trStatus[t.status]}</Badge>
              </div>
            ))}
          </div>
        )}
      </Section>
    </div>
  );
}

function PerformanceInfo({ reviews }: { reviews: PerformanceReview[] }) {
  if (reviews.length === 0) return <p className="py-6 text-center text-sm text-slate-400">لا توجد تقييمات لهذا الموظف بعد.</p>;
  return (
    <Section title="تقييمات الأداء">
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
    </Section>
  );
}
