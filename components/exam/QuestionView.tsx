"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import type { PreparedQuestion } from "@/lib/types";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { topicLabel } from "@/lib/topics";
import { levelConfig } from "@/lib/levels";

const TYPE_LABEL: Record<string, string> = {
  "multiple-choice": "Multiple Choice",
  "true-false": "True / False",
  scenario: "Scenario",
  definition: "Definition",
  comparison: "Comparison",
};

export function QuestionView({
  question,
  index,
  total,
  selected,
  onSelect,
}: {
  question: PreparedQuestion;
  index: number;
  total: number;
  selected: number | null;
  onSelect: (i: number) => void;
}) {
  const accent = levelConfig(question.difficulty).accent;
  const progress = ((index) / total) * 100;

  return (
    <div className="mx-auto w-full max-w-2xl">
      {/* Counter + progress */}
      <div className="mb-6">
        <div className="mb-3 flex items-center justify-between text-sm">
          <span className="font-semibold text-white">
            Question {index + 1}{" "}
            <span className="text-brand-100/50">of {total}</span>
          </span>
          <span
            className="rounded-full px-2.5 py-0.5 text-xs font-medium"
            style={{ background: `${accent}1f`, color: accent }}
          >
            Ch. {question.chapter} · {TYPE_LABEL[question.type] ?? question.type}
          </span>
        </div>
        <ProgressBar value={progress} accent={accent} />
      </div>

      <motion.div
        key={question.id}
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -40 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="glass-strong rounded-3xl p-6 sm:p-8"
      >
        <p className="mb-1 text-xs font-medium uppercase tracking-wider text-brand-200/60">
          {topicLabel(question.topic)}
          {question.aiGenerated && " · AI"}
        </p>
        <h2 className="font-display text-xl font-semibold leading-snug text-white sm:text-2xl">
          {question.prompt}
        </h2>

        <div className="mt-7 space-y-3">
          {question.options.map((opt, i) => {
            const active = selected === i;
            return (
              <motion.button
                key={i}
                onClick={() => onSelect(i)}
                disabled={selected !== null}
                whileHover={selected === null ? { scale: 1.01 } : undefined}
                whileTap={selected === null ? { scale: 0.99 } : undefined}
                className="flex w-full items-center gap-3 rounded-2xl border p-4 text-left text-sm transition-all duration-200 disabled:cursor-default"
                style={{
                  borderColor: active ? accent : "rgba(255,255,255,0.1)",
                  background: active ? `${accent}1f` : "rgba(255,255,255,0.03)",
                }}
              >
                <span
                  className="grid h-6 w-6 shrink-0 place-items-center rounded-full border text-xs font-bold"
                  style={{
                    borderColor: active ? accent : "rgba(255,255,255,0.2)",
                    background: active ? accent : "transparent",
                    color: active ? "#0a0c1b" : "#c7d2fe",
                  }}
                >
                  {active ? <Check className="h-3.5 w-3.5" /> : String.fromCharCode(65 + i)}
                </span>
                <span className="text-white/90">{opt}</span>
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
