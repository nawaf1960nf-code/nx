import { motion, type Variants } from 'framer-motion';
import {
  Clock,
  CalendarDays,
  Award,
  Wallet,
  FileText,
  type LucideIcon,
} from 'lucide-react';

/**
 * السجل الزمني للموظف: عرض عمودي نظيف لأحداث الموظف (إجازات، تقييمات، سلف،
 * تأخير وطلبات) مع أيقونة مميّزة لكل نوع وحركات لطيفة عبر framer-motion.
 */

export type TimelineEventType = 'ATTENDANCE' | 'LEAVE' | 'PERFORMANCE' | 'REQUEST' | 'LOAN';

export interface TimelineEvent {
  id: string;
  type: TimelineEventType;
  category: string;
  title: string;
  description?: string;
  date: string; // ISO 8601
}

interface EmployeeTimelineProps {
  events: TimelineEvent[];
  loading?: boolean;
}

interface TypeStyle {
  icon: LucideIcon;
  color: string; // لون الأيقونة والإطار
  tint: string; // خلفية دائرة الأيقونة
}

const TYPE_STYLES: Record<TimelineEventType, TypeStyle> = {
  LEAVE: { icon: CalendarDays, color: '#1E3A5F', tint: '#E8EEF5' },
  PERFORMANCE: { icon: Award, color: '#15803D', tint: '#E7F4EC' },
  LOAN: { icon: Wallet, color: '#B45309', tint: '#FBF0E0' },
  ATTENDANCE: { icon: Clock, color: '#B91C1C', tint: '#FBE9E9' },
  REQUEST: { icon: FileText, color: '#475569', tint: '#EEF1F5' },
};

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
};

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('ar-SA', {
    calendar: 'gregory',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(iso));
}

export function EmployeeTimeline({ events, loading = false }: EmployeeTimelineProps) {
  const fontFamily = '"IBM Plex Sans Arabic", "Tajawal", sans-serif';

  if (loading) {
    return (
      <div dir="rtl" className="space-y-4 p-6" style={{ fontFamily }}>
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex gap-4">
            <div className="h-10 w-10 animate-pulse rounded-md bg-slate-100" />
            <div className="flex-1 space-y-2 py-1">
              <div className="h-3 w-24 animate-pulse rounded bg-slate-100" />
              <div className="h-4 w-2/3 animate-pulse rounded bg-slate-100" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div dir="rtl" className="p-10 text-center text-sm text-slate-500" style={{ fontFamily }}>
        لا توجد أحداث مسجّلة لهذا الموظف بعد.
      </div>
    );
  }

  return (
    <motion.ol
      dir="rtl"
      className="relative space-y-6 p-6"
      style={{ fontFamily }}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* الخط العمودي للسجل الزمني (على يمين المحتوى في الاتجاه RTL). */}
      <span className="absolute bottom-2 right-[34px] top-2 w-px bg-slate-200" aria-hidden />

      {events.map((event) => {
        const style = TYPE_STYLES[event.type];
        const Icon = style.icon;

        return (
          <motion.li key={event.id} variants={itemVariants} className="relative flex gap-4">
            <span
              className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-md ring-4 ring-white"
              style={{ backgroundColor: style.tint, color: style.color }}
            >
              <Icon size={18} strokeWidth={2} />
            </span>

            <div className="flex-1 pt-1">
              <time className="block text-xs text-slate-500">{formatDate(event.date)}</time>
              <p className="mt-0.5 text-sm font-bold text-slate-900">{event.title}</p>
              {event.description && (
                <p className="mt-1 text-sm text-slate-600">{event.description}</p>
              )}
            </div>
          </motion.li>
        );
      })}
    </motion.ol>
  );
}
