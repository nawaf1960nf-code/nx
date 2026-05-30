"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { aiStatus } from "@/lib/ai-client";
import { useLocale } from "@/lib/locale-context";

/** Shows whether the live AI engine is configured; otherwise smart offline mode. */
export function AIBadge() {
  const { t } = useLocale();
  const [enabled, setEnabled] = useState<boolean | null>(null);

  useEffect(() => {
    aiStatus().then(setEnabled);
  }, []);

  if (enabled === null) return null;

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium"
      style={{ color: enabled ? "#34d399" : "#818cf8" }}
    >
      <Sparkles className="h-3.5 w-3.5" />
      <span className="text-brand-100/80">{enabled ? t.ai.live : t.ai.offline}</span>
    </span>
  );
}
