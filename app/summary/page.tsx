"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChevronDown, Sparkles } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { getSubject } from "@/lib/subjects";
import { buildChapterSummaries } from "@/lib/review";
import { useLocale } from "@/lib/locale-context";

function SummaryInner() {
  const { t, locale } = useLocale();
  const params = useSearchParams();
  const subject = getSubject(params.get("subject"));
  const summaries = useMemo(() => buildChapterSummaries(subject, locale), [subject, locale]);
  const [open, setOpen] = useState<number>(summaries[0]?.chapter ?? 0);

  return (
    <main className="min-h-screen pb-20">
      <Navbar />
      <div className="mx-auto max-w-3xl px-4 pt-10">
        <Link
          href={`/course/${subject.id}`}
          className="inline-flex items-center gap-1.5 text-sm text-brand-100/60 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4 rtl:rotate-180" /> {subject.name[locale]}
        </Link>

        <div className="mt-5 mb-8 text-center">
          <h1 className="font-display text-3xl font-bold text-white">{t.summary.title}</h1>
          <p className="mt-2 text-sm text-brand-100/60">{t.summary.subtitle}</p>
        </div>

        <div className="space-y-3">
          {summaries.map((s, i) => {
            const isOpen = open === s.chapter;
            return (
              <motion.div
                key={s.chapter}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="card-premium overflow-hidden"
              >
                <button
                  onClick={() => setOpen(isOpen ? -1 : s.chapter)}
                  className="flex w-full items-center gap-4 p-5 text-start"
                >
                  <span
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-xl font-display text-sm font-bold"
                    style={{ background: `${subject.accent}1f`, color: subject.accent }}
                  >
                    {s.chapter}
                  </span>
                  <div className="flex-1">
                    <p className="font-semibold text-white">{s.title}</p>
                    <p className="text-xs text-brand-100/60">{t.summary.points(s.points.length)}</p>
                  </div>
                  <motion.span animate={{ rotate: isOpen ? 180 : 0 }} className="text-brand-200">
                    <ChevronDown className="h-5 w-5" />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="space-y-4 border-t border-white/8 p-5">
                        {s.points.map((p) => (
                          <div key={p.term} className="flex gap-3">
                            <span
                              className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                              style={{ background: subject.accent }}
                            />
                            <div>
                              <p className="text-sm font-semibold text-white">{p.term}</p>
                              <p className="mt-1 text-sm leading-relaxed text-brand-100/70">
                                {p.definition}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </main>
  );
}

export default function SummaryPage() {
  return (
    <Suspense fallback={<div className="grid min-h-screen place-items-center"><Sparkles className="h-8 w-8 animate-pulse text-brand-300" /></div>}>
      <SummaryInner />
    </Suspense>
  );
}
