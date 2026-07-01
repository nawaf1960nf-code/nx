"use client";

import { useMemo, useState } from "react";
import type { Employee } from "@/lib/types";
import { calculateEndOfService, REASON_RULES, type EndOfServiceReason } from "@/lib/eos";
import { formatSAR } from "@/lib/format";
import { Field, Select, Input, Badge } from "./ui";

// ترتيب الأسباب للعرض.
const REASON_ORDER: EndOfServiceReason[] = [
  "TERMINATION",
  "END_OF_CONTRACT",
  "MUTUAL_AGREEMENT",
  "RETIREMENT",
  "DEATH",
  "DISABILITY",
  "RESIGNATION",
  "RESIGNATION_FORCE_MAJEURE",
  "FEMALE_MARRIAGE",
  "FEMALE_CHILDBIRTH",
  "WORKER_LEFT_EMPLOYER_FAULT",
  "MISCONDUCT_DISMISSAL",
];

export function EosCalculator({ employee }: { employee: Employee }) {
  const [reason, setReason] = useState<EndOfServiceReason>("TERMINATION");
  const [lastDay, setLastDay] = useState<string>(new Date().toISOString().slice(0, 10));

  const result = useMemo(
    () =>
      calculateEndOfService({
        hireDate: new Date(employee.hireDate),
        lastWorkingDay: new Date(lastDay),
        reason,
        wage: {
          baseSalary: employee.baseSalary,
          housingAllowance: employee.housingAllowance,
          transportAllowance: employee.transportAllowance,
          otherAllowances: employee.otherAllowances,
        },
      }),
    [employee, reason, lastDay],
  );

  const basisTone =
    result.entitlementBasis === "FULL" ? "success" : result.entitlementBasis === "NONE" ? "danger" : "warning";

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4">
        <Field label="سبب انتهاء الخدمة">
          <Select value={reason} onChange={(e) => setReason(e.target.value as EndOfServiceReason)}>
            {REASON_ORDER.map((r) => (
              <option key={r} value={r}>
                {REASON_RULES[r].label} (مادة {REASON_RULES[r].article})
              </option>
            ))}
          </Select>
        </Field>

        <Field label="آخر يوم عمل">
          <Input type="date" value={lastDay} onChange={(e) => setLastDay(e.target.value)} />
        </Field>

        <div className="rounded-md bg-slate-50 p-3 text-xs text-slate-500">
          الأجر الشامل الشهري المعتمد:{" "}
          <span className="font-semibold text-slate-700">{formatSAR(result.monthlyWage)}</span>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 p-5">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-500">المستحق الإجمالي</span>
          <Badge tone={basisTone}>المادة {result.legalArticle}</Badge>
        </div>
        <p className="mt-1 text-3xl font-bold text-ink">{formatSAR(result.totalPayable)}</p>

        <dl className="mt-4 space-y-2 text-sm">
          <Row label="مدة الخدمة" value={`${result.yearsOfService} سنة`} />
          <Row label="المكافأة الكاملة (مادة 84)" value={formatSAR(result.grossGratuity)} />
          <Row label="نسبة الاستحقاق" value={`${Math.round(result.entitlementFactor * 100)}%`} />
        </dl>

        <ul className="mt-4 space-y-1 border-t border-slate-100 pt-3 text-xs text-slate-500">
          {result.notes.map((n, i) => (
            <li key={i}>• {n}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-slate-500">{label}</dt>
      <dd className="font-medium text-slate-800">{value}</dd>
    </div>
  );
}
