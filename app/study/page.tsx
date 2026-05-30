"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Check,
  X,
  Sparkles,
  ArrowRight,
  Send,
  Loader2,
  GraduationCap,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { AIBadge } from "@/components/AIBadge";
import { QUESTION_BANK } from "@/lib/questions";
import { shuffle } from "@/lib/utils";
import { aiTutor, type TutorMessage } from "@/lib/ai-client";
import type { Question } from "@/lib/types";
import { useLocale } from "@/lib/locale-context";

export default function StudyPage() {
  const { t } = useLocale();
  const [deck, setDeck] = useState<Question[]>([]);
  const [pos, setPos] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [chat, setChat] = useState<TutorMessage[]>([]);
  const [input, setInput] = useState("");
  const [tutorLoading, setTutorLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setDeck(shuffle(QUESTION_BANK));
  }, []);

  const q = deck[pos];
  const answered = selected !== null;
  const correct = answered && selected === q?.correctIndex;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, tutorLoading]);

  async function choose(i: number) {
    if (answered || !q) return;
    setSelected(i);
    // Ask the AI tutor to elaborate with an example (graceful fallback).
    setTutorLoading(true);
    const res = await aiTutor({
      topic: q.topic,
      question: q.prompt,
      studentAnswer: `${q.options[i]} (${i === q.correctIndex ? "correct" : "incorrect"})`,
    });
    if (res?.source === "ai") {
      setChat([{ role: "assistant", content: res.reply }]);
    }
    setTutorLoading(false);
  }

  async function ask() {
    if (!input.trim() || !q) return;
    const userMsg: TutorMessage = { role: "user", content: input.trim() };
    const history = [...chat, userMsg];
    setChat(history);
    setInput("");
    setTutorLoading(true);
    const res = await aiTutor({
      topic: q.topic,
      question: q.prompt,
      studentAnswer: userMsg.content,
      history,
    });
    setChat([
      ...history,
      {
        role: "assistant",
        content: res?.source === "ai" ? res.reply : t.study.offline,
      },
    ]);
    setTutorLoading(false);
  }

  function next() {
    setSelected(null);
    setChat([]);
    setInput("");
    setPos((p) => (p + 1) % Math.max(deck.length, 1));
  }

  const progressLabel = useMemo(
    () => (deck.length ? t.study.concept(pos + 1, deck.length) : "…"),
    [pos, deck.length, t],
  );

  return (
    <main className="min-h-screen pb-20">
      <Navbar />

      <div className="mx-auto max-w-2xl px-4 pt-10">
        <div className="mb-6 text-center">
          <span className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-brand-500/15 text-brand-300">
            <GraduationCap className="h-7 w-7" />
          </span>
          <h1 className="font-display text-3xl font-bold text-white">{t.study.title}</h1>
          <p className="mt-2 text-sm text-brand-100/60">{t.study.subtitle}</p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <AIBadge />
            <span className="text-xs text-brand-100/40">{progressLabel}</span>
          </div>
        </div>

        {!q ? (
          <div className="grid place-items-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-brand-300" />
          </div>
        ) : (
          <GlassCard strong className="p-6 sm:p-8">
            <p className="mb-1 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-brand-200/60">
              <BookOpen className="h-3.5 w-3.5" />
              {t.topics[q.topic]} · {t.exam.chShort} {q.chapter}
            </p>
            <h2 className="font-display text-xl font-semibold leading-snug text-white">
              {q.prompt}
            </h2>

            <div className="mt-6 space-y-3">
              {q.options.map((opt, i) => {
                const isCorrect = i === q.correctIndex;
                const isChosen = i === selected;
                let border = "rgba(255,255,255,0.1)";
                let bg = "rgba(255,255,255,0.03)";
                if (answered && isCorrect) {
                  border = "rgba(52,211,153,0.6)";
                  bg = "rgba(52,211,153,0.12)";
                } else if (answered && isChosen) {
                  border = "rgba(244,63,94,0.6)";
                  bg = "rgba(244,63,94,0.1)";
                }
                return (
                  <button
                    key={i}
                    onClick={() => choose(i)}
                    disabled={answered}
                    className="flex w-full items-center gap-3 rounded-2xl border p-4 text-start text-sm transition-all duration-200 enabled:hover:border-white/30 disabled:cursor-default"
                    style={{ borderColor: border, background: bg }}
                  >
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-white/20 text-xs font-bold text-brand-100">
                      {answered && isCorrect ? (
                        <Check className="h-3.5 w-3.5 text-success" />
                      ) : answered && isChosen ? (
                        <X className="h-3.5 w-3.5 text-danger" />
                      ) : (
                        String.fromCharCode(65 + i)
                      )}
                    </span>
                    <span className="text-white/90">{opt}</span>
                  </button>
                );
              })}
            </div>

            <AnimatePresence>
              {answered && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-5 overflow-hidden"
                >
                  <div
                    className={`rounded-2xl p-4 text-sm ${
                      correct ? "bg-success/10" : "bg-danger/10"
                    }`}
                  >
                    <p
                      className={`mb-1 font-semibold ${
                        correct ? "text-success" : "text-danger"
                      }`}
                    >
                      {correct ? t.study.correct : t.study.notQuite}
                    </p>
                    <p className="leading-relaxed text-brand-100/85">{q.explanation}</p>
                  </div>

                  {/* AI tutor conversation */}
                  <div className="mt-4 space-y-3">
                    {chat.map((m, i) => (
                      <div
                        key={i}
                        className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                            m.role === "user"
                              ? "bg-brand-500/25 text-white"
                              : "bg-white/5 text-brand-100/90"
                          }`}
                        >
                          {m.role === "assistant" && (
                            <span className="mb-1 flex items-center gap-1 text-[11px] font-semibold text-brand-300">
                              <Sparkles className="h-3 w-3" /> {t.study.tutor}
                            </span>
                          )}
                          {m.content}
                        </div>
                      </div>
                    ))}
                    {tutorLoading && (
                      <div className="flex items-center gap-2 text-xs text-brand-100/50">
                        <Loader2 className="h-3.5 w-3.5 animate-spin" /> {t.study.thinking}
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>

                  {/* Ask follow-up */}
                  <div className="mt-4 flex gap-2">
                    <input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && ask()}
                      placeholder={t.study.askPlaceholder}
                      className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-brand-100/30 focus:border-brand-400 focus:outline-none"
                    />
                    <Button onClick={ask} size="md" disabled={!input.trim() || tutorLoading}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="mt-5 text-center">
                    <Button onClick={next} variant="subtle" size="lg">
                      {t.study.next} <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </GlassCard>
        )}
      </div>
    </main>
  );
}
