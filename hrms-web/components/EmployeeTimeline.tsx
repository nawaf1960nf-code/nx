"use client";

import { motion, type Variants } from "framer-motion";
import { Clock, CalendarDays, Award, Wallet, FileText, type LucideIcon } from "lucide-react";
import type { EmployeeEvent, EmployeeEventType } from "@/lib/types";
import { formatDate } from "@/lib/format";

const TYPE_STYLES: Record<EmployeeEventType, { icon: LucideIcon; color: string; tint: string }> = {
  LEAVE: { icon: CalendarDays, color: "#1e3a5f", tint: "#dfe7f0" },
  PERFORMANCE: { icon: Award, color: "#15803d", tint: "#e7f4ec" },
  LOAN: { icon: Wallet, color: "#b45309", tint: "#fbf0e0" },
  ATTENDANCE: { icon: Clock, color: "#b91c1c", tint: "#fbe9e9" },
  REQUEST: { icon: FileText, color: "#475569", tint: "#eef1f5" },
};

const container: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.05 } } };
const item: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
};

export function EmployeeTimeline({ events }: { events: EmployeeEvent[] }) {
  const sorted = [...events].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (sorted.length === 0) {
    return <p className="p-8 text-center text-sm text-slate-500">لا توجد أحداث مسجّلة لهذا الموظف بعد.</p>;
  }

  return (
    <motion.ol className="relative space-y-6 p-2" variants={container} initial="hidden" animate="visible">
      <span className="absolute bottom-2 right-[18px] top-2 w-px bg-slate-200" aria-hidden />
      {sorted.map((e) => {
        const style = TYPE_STYLES[e.type];
        const Icon = style.icon;
        return (
          <motion.li key={e.id} variants={item} className="relative flex gap-4">
            <span
              className="z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-md ring-4 ring-white"
              style={{ backgroundColor: style.tint, color: style.color }}
            >
              <Icon size={17} />
            </span>
            <div className="flex-1 pt-1">
              <time className="block text-xs text-slate-500">{formatDate(e.date)}</time>
              <p className="mt-0.5 text-sm font-bold text-slate-900">{e.title}</p>
              {e.description && <p className="mt-0.5 text-sm text-slate-600">{e.description}</p>}
            </div>
          </motion.li>
        );
      })}
    </motion.ol>
  );
}
