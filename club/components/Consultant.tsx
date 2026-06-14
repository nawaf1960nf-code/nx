"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { BrainCircuit, RotateCcw, Send } from "lucide-react";
import { useLocale } from "@/lib/locale-context";
import { streamConsultant } from "@/lib/ai-client";
import type { ConsultProfile } from "@/app/api/consultant/route";
import { NumberField, Segmented } from "./ui";

type Goal = "muscle" | "fatloss" | "strength" | "general";
type Exp = "beginner" | "intermediate" | "advanced";

interface Msg {
  role: "user" | "assistant";
  content: string;
}

export function Consultant() {
  const { t, locale } = useLocale();
  const [goal, setGoal] = useState<Goal>("muscle");
  const [exp, setExp] = useState<Exp>("beginner");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [bodyFat, setBodyFat] = useState("");

  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<"idle" | "streaming" | "offline" | "error">("idle");
  const [started, setStarted] = useState(false);
  const lastUserRef = useRef<string | undefined>(undefined);
  const abortRef = useRef<AbortController | null>(null);

  function profile(): ConsultProfile {
    return {
      goal: t.consultant.goals[goal],
      experience: t.consultant.experiences[exp],
      age: age ? Number(age) : undefined,
      weightKg: weight ? Number(weight) : undefined,
      heightCm: height ? Number(height) : undefined,
      bodyFat: bodyFat ? Number(bodyFat) : undefined,
    };
  }

  async function run(message: string | undefined, history: Msg[]) {
    setStatus("streaming");
    lastUserRef.current = message;
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    const timeout = window.setTimeout(() => ctrl.abort(), 30000);

    // Add a placeholder assistant bubble to stream into.
    setMessages([...history, { role: "assistant", content: "" }]);

    const result = await streamConsultant(
      { profile: profile(), locale, history: history.slice(-8), message },
      (chunk) =>
        setMessages((prev) => {
          const next = [...prev];
          next[next.length - 1] = {
            role: "assistant",
            content: next[next.length - 1].content + chunk,
          };
          return next;
        }),
      ctrl.signal,
    );

    window.clearTimeout(timeout);
    if (result === "fallback") {
      setMessages(history);
      setStatus("offline");
    } else if (result === "error") {
      setMessages(history);
      setStatus("error");
    } else {
      setStatus("idle");
    }
  }

  function begin() {
    setStarted(true);
    run(undefined, []);
  }

  function send(text: string) {
    const msg = text.trim();
    if (!msg || status === "streaming") return;
    const history = [...messages, { role: "user" as const, content: msg }];
    setMessages(history);
    setInput("");
    run(msg, history);
  }

  return (
    <div className="space-y-6">
      {/* Profile */}
      <div className="card-premium p-6 sm:p-8">
        <div className="mb-5 flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-energy-500/15 text-energy-400">
            <BrainCircuit className="h-5 w-5" />
          </span>
          <div>
            <h2 className="font-display text-xl font-bold text-white">{t.consultant.title}</h2>
            <p className="text-sm text-energy-100/55">{t.consultant.subtitle}</p>
          </div>
        </div>

        <div className="space-y-5">
          <Segmented
            label={t.consultant.goalQ}
            value={goal}
            onChange={setGoal}
            options={[
              { value: "muscle", label: t.consultant.goals.muscle },
              { value: "fatloss", label: t.consultant.goals.fatloss },
              { value: "strength", label: t.consultant.goals.strength },
              { value: "general", label: t.consultant.goals.general },
            ]}
          />
          <Segmented
            label={t.consultant.experienceQ}
            value={exp}
            onChange={setExp}
            options={[
              { value: "beginner", label: t.consultant.experiences.beginner },
              { value: "intermediate", label: t.consultant.experiences.intermediate },
              { value: "advanced", label: t.consultant.experiences.advanced },
            ]}
          />
          <div className="grid gap-4 sm:grid-cols-4">
            <NumberField label="Age / العمر" value={age} onChange={setAge} placeholder="—" />
            <NumberField label="Weight / الوزن" value={weight} onChange={setWeight} placeholder="—" />
            <NumberField label="Height / الطول" value={height} onChange={setHeight} placeholder="—" />
            <NumberField label="Fat % / الدهون" value={bodyFat} onChange={setBodyFat} placeholder="—" />
          </div>
        </div>

        {!started && (
          <button
            type="button"
            onClick={begin}
            className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-energy-500 font-semibold text-base-950 transition-transform hover:scale-[1.01]"
          >
            <BrainCircuit className="h-4 w-4" /> {t.consultant.start}
          </button>
        )}
      </div>

      {/* Chat */}
      {started && (
        <div className="card-premium p-6 sm:p-8">
          <div className="space-y-4">
            {messages.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-energy-500 text-base-950"
                      : "bg-white/[0.05] text-energy-100/90"
                  }`}
                >
                  {m.content || (status === "streaming" ? t.consultant.thinking : "")}
                </div>
              </motion.div>
            ))}
          </div>

          {status === "offline" && (
            <p className="mt-4 rounded-xl bg-flame-500/10 px-4 py-3 text-sm text-flame-300">
              {t.consultant.offline}
            </p>
          )}
          {status === "error" && (
            <div className="mt-4 flex items-center gap-3 rounded-xl bg-danger/10 px-4 py-3 text-sm text-danger">
              {t.consultant.error}
              <button
                type="button"
                onClick={() => run(lastUserRef.current, messages)}
                className="inline-flex items-center gap-1 font-semibold underline"
              >
                <RotateCcw className="h-3.5 w-3.5" /> {t.consultant.retry}
              </button>
            </div>
          )}

          {/* Quick actions */}
          <div className="mt-5 flex flex-wrap gap-2">
            {[t.consultant.quick.plan, t.consultant.quick.meals, t.consultant.quick.form].map((q) => (
              <button
                key={q}
                type="button"
                disabled={status === "streaming"}
                onClick={() => send(q)}
                className="rounded-full border border-white/12 bg-white/[0.04] px-3.5 py-1.5 text-xs font-medium text-energy-100/75 transition-colors hover:text-white disabled:opacity-40"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="mt-4 flex items-end gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              rows={1}
              placeholder={t.consultant.placeholder}
              className="max-h-32 flex-1 resize-none rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition-colors focus:border-energy-400"
            />
            <button
              type="button"
              onClick={() => send(input)}
              disabled={status === "streaming" || !input.trim()}
              aria-label={t.consultant.send}
              className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-energy-500 text-base-950 transition-opacity disabled:opacity-40"
            >
              <Send className="h-4 w-4 rtl:rotate-180" />
            </button>
          </div>

          <p className="mt-3 text-center text-[11px] text-energy-100/40">{t.consultant.disclaimer}</p>
        </div>
      )}
    </div>
  );
}
