"use client";

import { CheckCheck, Inbox, FileText, BellRing, Megaphone, Info } from "lucide-react";
import { useStore } from "@/store/useStore";
import { useScopedCompanyId } from "@/lib/scope";
import { Card, Button } from "@/components/ui";
import type { NotificationType } from "@/lib/types";

const TYPE_ICON: Record<NotificationType, { icon: typeof Info; color: string; tint: string }> = {
  REQUEST: { icon: FileText, color: "#1e3a5f", tint: "#dfe7f0" },
  APPROVAL: { icon: BellRing, color: "#15803d", tint: "#e7f4ec" },
  ANNOUNCEMENT: { icon: Megaphone, color: "#b45309", tint: "#fbf0e0" },
  INFO: { icon: Info, color: "#475569", tint: "#eef1f5" },
};

function timeAgo(iso: string): string {
  const m = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (m < 1) return "الآن";
  if (m < 60) return `قبل ${m} دقيقة`;
  const h = Math.floor(m / 60);
  if (h < 24) return `قبل ${h} ساعة`;
  return `قبل ${Math.floor(h / 24)} يوم`;
}

export default function NotificationsPage() {
  const companyId = useScopedCompanyId();
  const notifications = useStore((s) => s.notifications);
  const markNotificationRead = useStore((s) => s.markNotificationRead);
  const markAllNotificationsRead = useStore((s) => s.markAllNotificationsRead);

  if (!companyId) {
    return <Card className="p-10 text-center text-sm text-slate-500">اختر شركة من المبدّل في الأعلى أولاً.</Card>;
  }

  const list = notifications
    .filter((n) => n.companyId === companyId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const unread = list.filter((n) => !n.read).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">الإشعارات</h1>
          <p className="mt-1 text-sm text-slate-500">{unread} غير مقروء من أصل {list.length}.</p>
        </div>
        {unread > 0 && (
          <Button variant="secondary" onClick={() => markAllNotificationsRead(companyId)}>
            <CheckCheck size={16} /> تعليم الكل كمقروء
          </Button>
        )}
      </div>

      <Card>
        {list.length === 0 ? (
          <div className="flex flex-col items-center gap-2 p-12 text-center text-sm text-slate-400">
            <Inbox size={28} /> لا توجد إشعارات.
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {list.map((n) => {
              const t = TYPE_ICON[n.type];
              const Icon = t.icon;
              return (
                <li
                  key={n.id}
                  onClick={() => markNotificationRead(n.id)}
                  className={`flex cursor-pointer items-start gap-3 px-5 py-4 hover:bg-slate-50 ${n.read ? "" : "bg-ink-50/40"}`}
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md" style={{ backgroundColor: t.tint, color: t.color }}>
                    <Icon size={17} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-slate-800">{n.title}</p>
                      {!n.read && <span className="h-2 w-2 rounded-full bg-ink" />}
                    </div>
                    <p className="mt-0.5 text-sm text-slate-600">{n.body}</p>
                    <p className="mt-1 text-xs text-slate-400">{timeAgo(n.createdAt)}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </div>
  );
}
