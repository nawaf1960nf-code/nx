"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud, FileSpreadsheet, Download, CheckCircle2, AlertTriangle } from "lucide-react";
import { useStore } from "@/store/useStore";
import { useScopedCompanyId } from "@/lib/scope";
import { roleHasPermission } from "@/lib/permissions";
import { parseEmployeeFiles, downloadTemplate, type ParsedRow } from "@/lib/excel";
import { Card, Button, Badge } from "@/components/ui";
import { formatSAR } from "@/lib/format";

export default function ImportPage() {
  const router = useRouter();
  const companyId = useScopedCompanyId();
  const role = useStore((s) => s.currentUser?.role);
  const companies = useStore((s) => s.companies);
  const importEmployees = useStore((s) => s.importEmployees);

  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const canImport = roleHasPermission(role, "EMPLOYEE_EDIT");
  const company = companies.find((c) => c.id === companyId);

  if (!companyId || !company) {
    return <Card className="p-10 text-center text-sm text-slate-500">اختر شركة من المبدّل في الأعلى أولاً.</Card>;
  }
  if (!canImport) {
    return <Card className="p-10 text-center text-sm text-slate-500">ليست لديك صلاحية استيراد البيانات.</Card>;
  }

  async function onFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setBusy(true);
    setDone(null);
    const list = Array.from(files);
    setFileNames(list.map((f) => f.name));
    try {
      const parsed = await parseEmployeeFiles(list);
      setRows(parsed);
    } finally {
      setBusy(false);
    }
  }

  const valid = rows.filter((r) => r.errors.length === 0);
  const invalid = rows.filter((r) => r.errors.length > 0);

  function runImport() {
    if (!companyId || valid.length === 0) return;
    const count = importEmployees(companyId, valid.map((r) => r.data));
    setDone(count);
    setRows([]);
    setFileNames([]);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">استيراد بيانات الموظفين</h1>
          <p className="mt-1 text-sm text-slate-500">رفع عدة ملفات إكسل لتعبئة بيانات «{company.name}».</p>
        </div>
        <Button variant="secondary" onClick={downloadTemplate}>
          <Download size={16} /> تنزيل قالب
        </Button>
      </div>

      <Card className="p-6">
        <label
          htmlFor="excel-input"
          className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-300 px-6 py-10 text-center transition-colors hover:border-ink hover:bg-ink-50"
        >
          <UploadCloud size={32} className="text-ink" />
          <span className="text-sm font-medium text-slate-700">اسحب ملفات الإكسل هنا أو اضغط للاختيار</span>
          <span className="text-xs text-slate-400">يمكن اختيار عدة ملفات (.xlsx / .xls) دفعة واحدة</span>
          <input
            id="excel-input"
            ref={inputRef}
            type="file"
            accept=".xlsx,.xls"
            multiple
            className="hidden"
            onChange={(e) => onFiles(e.target.files)}
          />
        </label>

        {fileNames.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {fileNames.map((n) => (
              <span key={n} className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
                <FileSpreadsheet size={14} /> {n}
              </span>
            ))}
          </div>
        )}

        {busy && <p className="mt-4 text-sm text-slate-500">جارٍ قراءة الملفات…</p>}

        {done !== null && (
          <div className="mt-4 flex items-center gap-2 rounded-md bg-success-50 px-4 py-3 text-sm text-success">
            <CheckCircle2 size={18} /> تم استيراد {done} موظف بنجاح وإضافتهم إلى الشركة.
          </div>
        )}
      </Card>

      {rows.length > 0 && (
        <Card>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-4">
            <div className="flex items-center gap-3 text-sm">
              <Badge tone="info">الإجمالي {rows.length}</Badge>
              <Badge tone="success">صالح {valid.length}</Badge>
              {invalid.length > 0 && <Badge tone="danger">به أخطاء {invalid.length}</Badge>}
            </div>
            <Button onClick={runImport} disabled={valid.length === 0}>
              استيراد {valid.length} موظف
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead className="bg-slate-50 text-xs text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-medium">الاسم</th>
                  <th className="px-4 py-3 font-medium">الرقم</th>
                  <th className="px-4 py-3 font-medium">القسم</th>
                  <th className="px-4 py-3 font-medium">المسمى</th>
                  <th className="px-4 py-3 font-medium">الراتب الأساسي</th>
                  <th className="px-4 py-3 font-medium">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.slice(0, 50).map((r) => (
                  <tr key={r.index} className={r.errors.length ? "bg-danger-50/40" : ""}>
                    <td className="px-4 py-2.5 font-medium text-slate-800">{r.data.displayName || "—"}</td>
                    <td className="px-4 py-2.5 text-slate-600">{r.data.employeeNumber}</td>
                    <td className="px-4 py-2.5 text-slate-600">{r.data.department}</td>
                    <td className="px-4 py-2.5 text-slate-600">{r.data.position}</td>
                    <td className="px-4 py-2.5 text-slate-600">{formatSAR(r.data.baseSalary)}</td>
                    <td className="px-4 py-2.5">
                      {r.errors.length === 0 ? (
                        <span className="inline-flex items-center gap-1 text-xs text-success">
                          <CheckCircle2 size={14} /> جاهز
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-danger">
                          <AlertTriangle size={14} /> {r.errors.join("، ")}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {rows.length > 50 && (
              <p className="px-4 py-3 text-xs text-slate-400">عرض أول 50 صفاً من أصل {rows.length}.</p>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
