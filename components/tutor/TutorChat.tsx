"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Send, RotateCcw, Lightbulb, Loader2 } from "lucide-react";
import { streamTutor, type TutorMessage, type TutorMode } from "@/lib/ai-client";
import { useLocale } from "@/lib/locale-context";
import { cn } from "@/lib/utils";

export interface TutorSeed {
  subjectId: string;
  topic: string;
  question?: string;
  studentAnswer?: string;
  correctAnswer?: string;
}

/**
 * Reusable streaming tutor chat. Used both on the exam review screen
 * ("explain why I got this wrong") and in Study Mode. Handles streaming,
 * a typing state with send disabled in-flight, quick actions, a Socratic
 * toggle, and graceful error/offline states with retry.
 */
export function TutorChat({
  seed,
  /** When true, immediately ask the tutor to explain the wrong answer. */
  autoExplainWrong = false,
}: {
  seed: TutorSeed;
  autoExplainWrong?: boolean;
}) {
  const { t, locale } = useLocale();
  const [messages, setMessages] = useState<TutorMessage[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [status, setStatus] = useState<"idle" | "error" | "offline">("idle");
  const [socratic, setSocratic] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const startedRef = useRef(false);
  // Remember the last send so "Retry" can replay it after an error.
  const lastSend = useRef<{ message?: string; mode: TutorMode } | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streaming]);

  const run = useCallback(
    async (opts: { message?: string; mode: TutorMode; historyOverride?: TutorMessage[] }) => {
      lastSend.current = { message: opts.message, mode: opts.mode };
      setStatus("idle");
      setStreaming(true);

      const history = opts.historyOverride ?? messages;
      // Add the user's visible bubble (skip for the auto explain-wrong kickoff).
      if (opts.message) {
        setMessages((m) => [...m, { role: "user", content: opts.message! }]);
      }
      // Placeholder assistant bubble we stream into.
      setMessages((m) => [...m, { role: "assistant", content: "" }]);

      const ctrl = new AbortController();
      abortRef.current = ctrl;
      // Safety timeout so a stalled stream surfaces a retry.
      const timeout = window.setTimeout(() => ctrl.abort(), 30000);

      const result = await streamTutor(
        {
          subjectId: seed.subjectId,
          topic: seed.topic,
          locale,
          mode: opts.mode,
          question: seed.question,
          studentAnswer: seed.studentAnswer,
          correctAnswer: seed.correctAnswer,
          message: opts.message,
          history,
        },
        (chunk) => {
          setMessages((m) => {
            const next = [...m];
            const last = next[next.length - 1];
            if (last && last.role === "assistant") {
              next[next.length - 1] = { ...last, content: last.content + chunk };
            }
            return next;
          });
        },
        ctrl.signal,
      );

      window.clearTimeout(timeout);
      setStreaming(false);

      if (result !== "ai") {
        // Remove the empty assistant placeholder and show a status banner.
        setMessages((m) => {
          const next = [...m];
          const last = next[next.length - 1];
          if (last && last.role === "assistant" && last.content === "") next.pop();
          return next;
        });
        setStatus(result === "fallback" ? "offline" : "error");
      }
    },
    [messages, seed, locale],
  );

  // Kick off the explain-wrong flow once.
  useEffect(() => {
    if (autoExplainWrong && !startedRef.current) {
      startedRef.current = true;
      run({ mode: "explain-wrong", historyOverride: [] });
    }
  }, [autoExplainWrong, run]);

  function send(message: string, mode: TutorMode = socratic ? "socratic" : "chat") {
    const text = message.trim();
    if (!text || streaming) return;
    setInput("");
    run({ message: text, mode });
  }

  function retry() {
    const last = lastSend.current;
    if (!last) return;
    // Replay the last attempt with current history (placeholder already removed).
    run({ message: last.message, mode: last.mode, historyOverride: messages });
  }

  const quick = t.tutor.quick;

  return (
    <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
      {/* header */}
      <div className="mb-3 flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-300">
          <Sparkles className="h-3.5 w-3.5" /> {t.tutor.title}
        </span>
        <button
          type="button"
          onClick={() => setSocratic((s) => !s)}
          aria-pressed={socratic}
          className={cn(
            "inline-flex min-h-8 items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-medium transition-all",
            socratic
              ? "bg-brand-500/25 text-white"
              : "bg-white/5 text-brand-100/70 hover:bg-white/10",
          )}
        >
          <Lightbulb className="h-3 w-3" /> {t.tutor.socratic}
        </button>
      </div>

      {/* messages */}
      <div className="max-h-80 space-y-3 overflow-y-auto pe-1">
        {socratic && messages.length === 0 && !streaming && (
          <p className="rounded-xl bg-brand-500/8 px-3 py-2 text-xs text-brand-100/70">
            {t.tutor.socraticOn}
          </p>
        )}

        {messages.map((m, i) => (
          <div
            key={i}
            className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}
          >
            <div
              className={cn(
                "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                m.role === "user"
                  ? "bg-brand-500/25 text-white"
                  : "bg-white/5 text-brand-100/90",
              )}
            >
              {m.role === "assistant" && (
                <span className="mb-1 flex items-center gap-1 text-[11px] font-semibold text-brand-300">
                  <Sparkles className="h-3 w-3" /> {t.tutor.title}
                </span>
              )}
              {m.content || (
                <span className="inline-flex items-center gap-1.5 text-brand-100/60">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> {t.tutor.thinking}
                </span>
              )}
            </div>
          </div>
        ))}

        {status === "error" && (
          <div className="rounded-xl bg-danger/10 p-3 text-center">
            <p className="text-xs text-danger">{t.tutor.errorMsg}</p>
            <button
              type="button"
              onClick={retry}
              className="mt-2 inline-flex min-h-9 items-center gap-1.5 rounded-xl bg-white/10 px-3 py-1.5 text-xs font-semibold text-white transition-all hover:bg-white/15"
            >
              <RotateCcw className="h-3.5 w-3.5" /> {t.tutor.retry}
            </button>
          </div>
        )}
        {status === "offline" && (
          <p className="rounded-xl bg-white/5 px-3 py-2.5 text-xs leading-relaxed text-brand-100/70">
            {t.tutor.offlineMsg}
          </p>
        )}
        <div ref={endRef} />
      </div>

      {/* quick actions */}
      {status !== "offline" && (
        <div className="mt-3 flex flex-wrap gap-2">
          {[
            { label: quick.simpler, msg: quick.simpler },
            { label: quick.analogy, msg: quick.analogy },
            { label: quick.example, msg: quick.example },
          ].map((q) => (
            <button
              key={q.label}
              type="button"
              disabled={streaming}
              onClick={() => send(q.msg)}
              className="min-h-8 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium text-brand-100/80 transition-all hover:bg-white/10 disabled:opacity-40"
            >
              {q.label}
            </button>
          ))}
        </div>
      )}

      {/* composer */}
      {status !== "offline" && (
        <div className="mt-3 flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send(input)}
            placeholder={t.tutor.placeholder}
            disabled={streaming}
            className="min-h-11 flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white placeholder:text-brand-100/45 focus:border-brand-400 focus:outline-none disabled:opacity-60"
          />
          <motion.button
            type="button"
            whileTap={{ scale: 0.95 }}
            onClick={() => send(input)}
            disabled={streaming || !input.trim()}
            aria-label={t.tutor.send}
            className="grid min-h-11 w-11 place-items-center rounded-2xl bg-gradient-to-r from-brand-500 to-accent-500 text-white transition-all hover:brightness-110 disabled:opacity-40"
          >
            {streaming ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4 rtl:-scale-x-100" />}
          </motion.button>
        </div>
      )}
    </div>
  );
}
