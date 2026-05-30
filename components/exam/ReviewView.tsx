"use client";

import { motion } from "framer-motion";
import { Check, X, ArrowLeft, Info } from "lucide-react";
import type { PreparedQuestion } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { useLocale } from "@/lib/locale-context";

export function ReviewView({
  questions,
  selections,
  onBack,
}: {
  questions: PreparedQuestion[];
  selections: (number | null)[];
  onBack: () => void;
}) {
  const { t } = useLocale();
  return (
    <div className="mx-auto w-full max-w-2xl pb-16">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-white">{t.review.title}</h1>
        <Button onClick={onBack} variant="subtle" size="sm">
          <ArrowLeft className="h-4 w-4 rtl:rotate-180" /> {t.review.back}
        </Button>
      </div>

      <div className="space-y-4">
        {questions.map((q, i) => {
          const sel = selections[i];
          const correct = sel === q.correctIndex;
          return (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3 }}
              className="glass rounded-3xl p-5 sm:p-6"
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <span className="text-xs font-medium uppercase tracking-wider text-brand-200/60">
                  {i + 1}. {t.topics[q.topic]} · {t.exam.chShort} {q.chapter}
                </span>
                <span
                  className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    correct
                      ? "bg-success/15 text-success"
                      : "bg-danger/15 text-danger"
                  }`}
                >
                  {correct ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                  {correct ? t.review.correct : t.review.incorrect}
                </span>
              </div>

              <p className="font-medium text-white">{q.prompt}</p>

              <div className="mt-4 space-y-2">
                {q.options.map((opt, oi) => {
                  const isCorrect = oi === q.correctIndex;
                  const isChosen = oi === sel;
                  return (
                    <div
                      key={oi}
                      className="flex items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-sm"
                      style={{
                        borderColor: isCorrect
                          ? "rgba(52,211,153,0.5)"
                          : isChosen
                            ? "rgba(244,63,94,0.5)"
                            : "rgba(255,255,255,0.08)",
                        background: isCorrect
                          ? "rgba(52,211,153,0.1)"
                          : isChosen
                            ? "rgba(244,63,94,0.08)"
                            : "transparent",
                      }}
                    >
                      {isCorrect ? (
                        <Check className="h-4 w-4 shrink-0 text-success" />
                      ) : isChosen ? (
                        <X className="h-4 w-4 shrink-0 text-danger" />
                      ) : (
                        <span className="h-4 w-4 shrink-0" />
                      )}
                      <span
                        className={
                          isCorrect
                            ? "text-success"
                            : isChosen
                              ? "text-danger"
                              : "text-brand-100/70"
                        }
                      >
                        {opt}
                      </span>
                      {isChosen && !isCorrect && (
                        <span className="ms-auto text-[11px] text-danger/70">
                          {t.review.yourAnswer}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {sel === null && (
                <p className="mt-2 text-xs text-brand-100/40">{t.review.noAnswer}</p>
              )}

              <div className="mt-4 flex gap-2 rounded-xl bg-brand-500/8 p-3.5">
                <Info className="h-4 w-4 shrink-0 text-brand-300" />
                <p className="text-sm leading-relaxed text-brand-100/80">
                  {q.explanation}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-8 text-center">
        <Button onClick={onBack} size="lg">
          <ArrowLeft className="h-4 w-4 rtl:rotate-180" /> {t.review.back}
        </Button>
      </div>
    </div>
  );
}
