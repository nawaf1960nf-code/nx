"use client";

import { useEffect, useState } from "react";
import { Flame } from "lucide-react";
import { useLocale } from "@/lib/locale-context";
import { getStats } from "@/lib/activity";

/** Compact streak badge shown in the header once the user has any streak. */
export function StreakChip() {
  const { t } = useLocale();
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const refresh = () => setStreak(getStats().dayStreak);
    refresh();
    window.addEventListener("club:activity-changed", refresh);
    return () => window.removeEventListener("club:activity-changed", refresh);
  }, []);

  if (streak <= 0) return null;

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-flame-500/15 px-2.5 py-1 text-xs font-bold text-flame-400 tabular-nums">
      <Flame className="h-3.5 w-3.5" /> {streak} {t.activity.streak}
    </span>
  );
}
