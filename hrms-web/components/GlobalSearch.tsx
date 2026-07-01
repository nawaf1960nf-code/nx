"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, User, ArrowLeft } from "lucide-react";
import { useStore } from "@/store/useStore";

// صفحات النظام القابلة للبحث بالاسم.
const PAGES = [
  { href: "/employees", label: "الموظفون" },
  { href: "/org", label: "الهيكل التنظيمي" },
  { href: "/attendance", label: "الحضور والانصراف" },
  { href: "/leaves", label: "الإجازات" },
  { href: "/requests", label: "الطلبات" },
  { href: "/documents", label: "المستندات" },
  { href: "/assets", label: "الأصول والعُهد" },
  { href: "/announcements", label: "الإعلانات" },
  { href: "/performance", label: "تقييم الأداء" },
  { href: "/training", label: "التدريب والتطوير" },
  { href: "/insurance", label: "التأمين الطبي" },
  { href: "/support", label: "الدعم الفني" },
  { href: "/payroll", label: "الرواتب" },
  { href: "/loans", label: "السلف والخصومات" },
  { href: "/reports", label: "التقارير" },
  { href: "/import", label: "استيراد بيانات" },
  { href: "/onboarding", label: "تهيئة الموظفين" },
  { href: "/notifications", label: "الإشعارات" },
  { href: "/activity", label: "سجل النشاط" },
  { href: "/settings", label: "الإعدادات" },
];

export function GlobalSearch() {
  const router = useRouter();
  const currentUser = useStore((s) => s.currentUser);
  const activeCompanyId = useStore((s) => s.activeCompanyId);
  const employees = useStore((s) => s.employees);

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  // إغلاق القائمة عند النقر خارجها.
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const scope = currentUser?.companyId ?? activeCompanyId;
  const q = query.trim();

  const employeeHits = q
    ? employees
        .filter((e) => (scope ? e.companyId === scope : true))
        .filter(
          (e) =>
            e.displayName.includes(q) ||
            e.employeeNumber.includes(q) ||
            e.department.includes(q) ||
            e.position.includes(q) ||
            (e.nameInEnglish ?? "").toLowerCase().includes(q.toLowerCase()),
        )
        .slice(0, 5)
    : [];

  const pageHits = q ? PAGES.filter((p) => p.label.includes(q)).slice(0, 4) : [];

  function go(href: string) {
    setQuery("");
    setOpen(false);
    router.push(href);
  }

  return (
    <div ref={boxRef} className="relative hidden md:block">
      <Search size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
      <input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Escape") setOpen(false);
          if (e.key === "Enter") {
            const first = employeeHits[0] ? `/employees/${employeeHits[0].id}` : pageHits[0]?.href;
            if (first) go(first);
          }
        }}
        placeholder="بحث سريع: موظف أو صفحة…"
        className="w-64 rounded-md border border-slate-300 bg-white py-1.5 pl-3 pr-9 text-sm text-slate-700 outline-none transition-all focus:w-80 focus:border-ink focus:ring-2 focus:ring-ink/20"
      />

      {open && q && (
        <div className="absolute right-0 z-30 mt-2 w-80 overflow-hidden rounded-lg border border-slate-200 bg-surface shadow-xl">
          {employeeHits.length === 0 && pageHits.length === 0 ? (
            <p className="p-4 text-center text-sm text-slate-400">لا توجد نتائج.</p>
          ) : (
            <>
              {employeeHits.length > 0 && (
                <div>
                  <p className="border-b border-slate-100 bg-slate-50 px-3 py-1.5 text-[11px] font-medium text-slate-400">الموظفون</p>
                  {employeeHits.map((e) => (
                    <button
                      key={e.id}
                      onClick={() => go(`/employees/${e.id}`)}
                      className="flex w-full items-center gap-2.5 px-3 py-2.5 text-right hover:bg-slate-50"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-ink-50 text-xs font-semibold text-ink">
                        <User size={14} />
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium text-slate-800">{e.displayName}</span>
                        <span className="block truncate text-xs text-slate-400">
                          #{e.employeeNumber} — {e.position}
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              )}
              {pageHits.length > 0 && (
                <div>
                  <p className="border-b border-t border-slate-100 bg-slate-50 px-3 py-1.5 text-[11px] font-medium text-slate-400">الصفحات</p>
                  {pageHits.map((p) => (
                    <button
                      key={p.href}
                      onClick={() => go(p.href)}
                      className="flex w-full items-center justify-between px-3 py-2.5 text-right text-sm text-slate-700 hover:bg-slate-50"
                    >
                      {p.label}
                      <ArrowLeft size={14} className="text-slate-300" />
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
