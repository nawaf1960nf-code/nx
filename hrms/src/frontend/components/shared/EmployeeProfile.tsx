import { useMemo, useState, type ReactNode } from 'react';
import { usePermissions } from '../../hooks/usePermissions';

/**
 * ملف الموظف مع تبويبات معلومات. تبويب "المعلومات المالية" لا يُبنى ولا
 * يُدرَج في شجرة الـ DOM إطلاقاً ما لم يملك المستخدم صلاحية FINANCIAL_VIEW
 * (إخفاء حقيقي عبر الشرط في React، لا إخفاء بصري عبر CSS).
 */

export interface EmployeeProfileData {
  id: string;
  employeeNumber: string;
  displayName: string;
  nameInEnglish?: string | null;
  nationality?: string | null;
  idNumber?: string | null;
  hireDate: string;
  departmentName?: string | null;
  positionTitle?: string | null;
  workLocation?: string | null;
  status: string;

  // حقول مالية — تصل من الخادم فقط لأصحاب الصلاحية، وتكون undefined لغيرهم.
  baseSalary?: number;
  housingAllowance?: number;
  transportAllowance?: number;
  foodAllowance?: number;
  otherAllowances?: number;
  bankName?: string | null;
  ibanNumber?: string | null;
}

interface TabDefinition {
  key: string;
  label: string;
  render: () => JSX.Element;
}

interface EmployeeProfileProps {
  employee: EmployeeProfileData;
}

const BRAND = '#1E3A5F';

export function EmployeeProfile({ employee }: EmployeeProfileProps) {
  const { hasPermission } = usePermissions();

  const tabs = useMemo<TabDefinition[]>(() => {
    const list: TabDefinition[] = [
      {
        key: 'personal',
        label: 'المعلومات الشخصية',
        render: () => <PersonalInfo employee={employee} />,
      },
      {
        key: 'job',
        label: 'المعلومات الوظيفية',
        render: () => <JobInfo employee={employee} />,
      },
    ];

    // يُدرَج تبويب المعلومات المالية فقط لمن يملك الصلاحية.
    if (hasPermission('FINANCIAL_VIEW')) {
      list.push({
        key: 'financial',
        label: 'المعلومات المالية',
        render: () => <FinancialInfo employee={employee} />,
      });
    }

    return list;
  }, [employee, hasPermission]);

  const [activeKey, setActiveKey] = useState(tabs[0]?.key ?? 'personal');
  const activeTab = tabs.find((tab) => tab.key === activeKey) ?? tabs[0];

  return (
    <section
      dir="rtl"
      className="rounded-lg border border-slate-200 bg-white shadow-sm"
      style={{ fontFamily: '"IBM Plex Sans Arabic", "Tajawal", sans-serif' }}
    >
      <header className="flex items-center gap-4 border-b border-slate-200 px-6 py-5">
        <div
          className="flex h-14 w-14 items-center justify-center rounded-md text-lg font-semibold text-white"
          style={{ backgroundColor: BRAND }}
        >
          {employee.displayName.charAt(0)}
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-800">{employee.displayName}</h2>
          <p className="text-sm text-slate-500">
            رقم وظيفي: {employee.employeeNumber}
            {employee.positionTitle ? ` — ${employee.positionTitle}` : ''}
          </p>
        </div>
      </header>

      <nav className="flex gap-1 border-b border-slate-200 px-4" role="tablist">
        {tabs.map((tab) => {
          const isActive = tab.key === activeTab?.key;
          return (
            <button
              key={tab.key}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveKey(tab.key)}
              className="rounded-t-md px-4 py-3 text-sm font-medium transition-colors"
              style={
                isActive
                  ? { color: BRAND, borderBottom: `2px solid ${BRAND}` }
                  : { color: '#64748b' }
              }
            >
              {tab.label}
            </button>
          );
        })}
      </nav>

      <div className="px-6 py-5" role="tabpanel">
        {activeTab?.render()}
      </div>
    </section>
  );
}

function Field({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-slate-500">{label}</span>
      <span className="text-sm text-slate-800">{value ?? '—'}</span>
    </div>
  );
}

function PersonalInfo({ employee }: EmployeeProfileProps) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <Field label="الاسم الكامل" value={employee.displayName} />
      <Field label="الاسم بالإنجليزية" value={employee.nameInEnglish} />
      <Field label="الجنسية" value={employee.nationality} />
      <Field label="رقم الهوية / الإقامة" value={employee.idNumber} />
    </div>
  );
}

function JobInfo({ employee }: EmployeeProfileProps) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <Field label="الرقم الوظيفي" value={employee.employeeNumber} />
      <Field label="القسم" value={employee.departmentName} />
      <Field label="المسمى الوظيفي" value={employee.positionTitle} />
      <Field label="مقر العمل" value={employee.workLocation} />
      <Field label="تاريخ التعيين" value={employee.hireDate} />
      <Field label="الحالة الوظيفية" value={employee.status} />
    </div>
  );
}

function FinancialInfo({ employee }: EmployeeProfileProps) {
  const currency = (value?: number) =>
    typeof value === 'number' ? `${value.toLocaleString('ar-SA')} ر.س` : '—';

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <Field label="الراتب الأساسي" value={currency(employee.baseSalary)} />
      <Field label="بدل السكن" value={currency(employee.housingAllowance)} />
      <Field label="بدل النقل" value={currency(employee.transportAllowance)} />
      <Field label="بدل الطعام" value={currency(employee.foodAllowance)} />
      <Field label="بدلات أخرى" value={currency(employee.otherAllowances)} />
      <Field label="اسم البنك" value={employee.bankName} />
      <Field label="رقم الآيبان" value={employee.ibanNumber} />
    </div>
  );
}
