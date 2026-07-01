"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import { useStore } from "@/store/useStore";
import { useScopedCompanyId } from "@/lib/scope";
import { roleHasPermission } from "@/lib/permissions";
import { Card, Button, Field, Input, Select, Badge } from "@/components/ui";
import type { CompanyPlan } from "@/lib/types";

export default function SettingsPage() {
  const companyId = useScopedCompanyId();
  const role = useStore((s) => s.currentUser?.role);
  const companies = useStore((s) => s.companies);
  const updateCompany = useStore((s) => s.updateCompany);

  const company = companies.find((c) => c.id === companyId);
  const canManage = roleHasPermission(role, "SETTINGS_MANAGE");

  const [name, setName] = useState(company?.name ?? "");
  const [city, setCity] = useState(company?.city ?? "");
  const [plan, setPlan] = useState<CompanyPlan>(company?.plan ?? "PRO");
  const [saved, setSaved] = useState(false);

  if (!companyId || !company) {
    return <Card className="p-10 text-center text-sm text-slate-500">اختر شركة من المبدّل في الأعلى أولاً.</Card>;
  }

  function save() {
    if (!company) return;
    updateCompany(company.id, { name, city, plan });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">إعدادات الشركة</h1>
        <p className="mt-1 text-sm text-slate-500">بيانات الشركة وباقة الاشتراك.</p>
      </div>

      <Card className="p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="اسم الشركة">
            <Input value={name} onChange={(e) => setName(e.target.value)} disabled={!canManage} />
          </Field>
          <Field label="المدينة">
            <Input value={city} onChange={(e) => setCity(e.target.value)} disabled={!canManage} />
          </Field>
          <Field label="باقة الاشتراك">
            <Select value={plan} onChange={(e) => setPlan(e.target.value as CompanyPlan)} disabled={!canManage}>
              <option value="BASIC">أساسية</option>
              <option value="PRO">احترافية</option>
              <option value="ENTERPRISE">مؤسسية</option>
            </Select>
          </Field>
          <Field label="حد المقاعد">
            <Input value={company.seatLimit} disabled />
          </Field>
        </div>

        {canManage ? (
          <div className="mt-5 flex items-center gap-3">
            <Button onClick={save}>
              <Save size={16} /> حفظ التغييرات
            </Button>
            {saved && <Badge tone="success">تم الحفظ</Badge>}
          </div>
        ) : (
          <p className="mt-5 text-sm text-slate-400">ليست لديك صلاحية تعديل إعدادات الشركة.</p>
        )}
      </Card>
    </div>
  );
}
