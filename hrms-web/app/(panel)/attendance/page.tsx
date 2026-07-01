"use client";

import { Clock, UserCheck, UserX, Timer } from "lucide-react";
import { useStore } from "@/store/useStore";
import { useScopedCompanyId } from "@/lib/scope";
import { Card, Badge, Button, StatCard } from "@/components/ui";
import type { AttendanceStatus } from "@/lib/types";

const STATUS_META: Record<AttendanceStatus, { label: string; tone: "success" | "warning" | "danger" | "info" }> = {
  PRESENT: { label: "حاضر", tone: "success" },
  LATE: { label: "متأخر", tone: "warning" },
  ABSENT: { label: "غائب", tone: "danger" },
  ON_LEAVE: { label: "في إجازة", tone: "info" },
};

export default function AttendancePage() {
  const companyId = useScopedCompanyId();
  const employees = useStore((s) => s.employees);
  const attendance = useStore((s) => s.attendance);
  const markAttendance = useStore((s) => s.markAttendance);

  if (!companyId) {
    return <Card className="p-10 text-center text-sm text-slate-500">اختر شركة من المبدّل في الأعلى أولاً.</Card>;
  }

  const today = new Date().toISOString().slice(0, 10);
  const companyEmployees = employees.filter((e) => e.companyId === companyId);
  const todayRecords = attendance.filter((a) => a.companyId === companyId && a.date === today);

  const present = todayRecords.filter((a) => a.status === "PRESENT").length;
  const late = todayRecords.filter((a) => a.status === "LATE").length;
  const absent = companyEmployees.length - todayRecords.filter((a) => a.status !== "ABSENT").length;

  // دمج الموظفين مع سجل اليوم.
  const rows = companyEmployees.map((e) => {
    const rec = todayRecords.find((a) => a.employeeId === e.id);
    return { employee: e, rec };
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">الحضور والانصراف</h1>
        <p className="mt-1 text-sm text-slate-500">حضور اليوم مع حساب التأخير آلياً (وردية 08:00).</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="حاضرون" value={present} icon={<UserCheck size={20} />} />
        <StatCard label="متأخرون" value={late} icon={<Timer size={20} />} />
        <StatCard label="غائبون" value={absent < 0 ? 0 : absent} icon={<UserX size={20} />} />
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="bg-slate-50 text-xs text-slate-500">
              <tr>
                <th className="px-5 py-3 font-medium">الموظف</th>
                <th className="px-5 py-3 font-medium">الحضور</th>
                <th className="px-5 py-3 font-medium">الانصراف</th>
                <th className="px-5 py-3 font-medium">التأخير</th>
                <th className="px-5 py-3 font-medium">الحالة</th>
                <th className="px-5 py-3 font-medium">تسجيل</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map(({ employee, rec }) => {
                const status: AttendanceStatus = rec?.status ?? "ABSENT";
                const meta = STATUS_META[status];
                return (
                  <tr key={employee.id} className="hover:bg-slate-50">
                    <td className="px-5 py-3">
                      <p className="font-medium text-slate-800">{employee.displayName}</p>
                      <p className="text-xs text-slate-400">{employee.department}</p>
                    </td>
                    <td className="px-5 py-3 text-slate-600">{rec?.checkIn ?? "—"}</td>
                    <td className="px-5 py-3 text-slate-600">{rec?.checkOut ?? "—"}</td>
                    <td className="px-5 py-3">
                      {rec && rec.lateMinutes > 0 ? (
                        <span className="text-warning">{rec.lateMinutes} دقيقة</span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <Badge tone={meta.tone}>{meta.label}</Badge>
                    </td>
                    <td className="px-5 py-3">
                      {!rec?.checkOut ? (
                        <Button
                          variant="secondary"
                          className="px-2.5 py-1.5 text-xs"
                          onClick={() => markAttendance(companyId, employee.id, employee.displayName)}
                        >
                          <Clock size={14} /> {rec?.checkIn ? "تسجيل انصراف" : "تسجيل حضور"}
                        </Button>
                      ) : (
                        <span className="text-xs text-slate-400">مكتمل</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
