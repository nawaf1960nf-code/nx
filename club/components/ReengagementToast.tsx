"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Flame, X } from "lucide-react";
import { useLocale } from "@/lib/locale-context";
import { recordVisit } from "@/lib/activity";

/** Show a motivational nudge if the user has been away for a few days. */
const AWAY_THRESHOLD_DAYS = 3;

export function ReengagementToast() {
  const { t } = useLocale();
  const [daysAway, setDaysAway] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Record this visit once; decide whether to nudge based on the gap.
    const { daysAway } = recordVisit();
    if (daysAway >= AWAY_THRESHOLD_DAYS) {
      setDaysAway(daysAway);
      setOpen(true);
    }
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-md"
        >
          <div className="card-premium glass-strong flex items-start gap-3 p-5">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-flame-500/15 text-flame-400">
              <Flame className="h-5 w-5" />
            </span>
            <div className="flex-1">
              <p className="font-display font-bold text-white">{t.activity.comebackTitle}</p>
              <p className="mt-1 text-sm text-energy-100/70">{t.activity.comeback(daysAway)}</p>
              <div className="mt-3 flex items-center gap-2">
                <Link
                  href="/workout"
                  onClick={() => setOpen(false)}
                  className="inline-flex min-h-9 items-center rounded-lg bg-energy-500 px-4 text-sm font-semibold text-base-950"
                >
                  {t.activity.comebackCta}
                </Link>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="min-h-9 rounded-lg px-3 text-sm font-medium text-energy-100/60 hover:text-white"
                >
                  {t.activity.dismiss}
                </button>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="close"
              className="text-energy-100/40 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
