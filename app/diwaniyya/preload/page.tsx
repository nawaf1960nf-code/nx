"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";
import { useGameStore } from "@/lib/store";
import { CATEGORY_BY_ID } from "@/lib/categories-data";
import { cn } from "@/lib/utils";
import type { Question, PreloadedQuestions, QuestionDifficulty } from "@/lib/types";
import { Check, Loader2, Sparkles } from "lucide-react";

interface BatchResponse {
  questions: Array<{
    text: string;
    answer: string;
    acceptableAnswers: string[];
    hint: string;
    difficulty: QuestionDifficulty;
    idx: number;
  }>;
}

export default function DiwaniyyaPreloadPage() {
  const router = useRouter();
  const players = useGameStore((s) => s.diwaniyyaPlayers);
  const setPreloaded = useGameStore((s) => s.setPreloadedQuestions);
  const setPhase = useGameStore((s) => s.setPhase);

  // التصنيفات الفريدة فقط (نفس التصنيف ممكن يختاره أكثر من لاعب)
  const uniqueCategoryIds = Array.from(new Set(players.map((p) => p.categoryId).filter(Boolean)));

  const [statuses, setStatuses] = useState<Record<string, "pending" | "loading" | "done" | "error">>(
    Object.fromEntries(uniqueCategoryIds.map((id) => [id, "pending"])),
  );
  const [allDone, setAllDone] = useState(false);
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    if (uniqueCategoryIds.length === 0) {
      router.push("/diwaniyya/setup");
      return;
    }

    const preloaded: PreloadedQuestions = {};

    const loadCategory = async (catId: string) => {
      setStatuses((s) => ({ ...s, [catId]: "loading" }));
      try {
        const res = await fetch("/api/questions/batch", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ categoryId: catId }),
        });
        if (!res.ok) throw new Error("batch failed");
        const data = (await res.json()) as BatchResponse;
        data.questions.forEach((q) => {
          const id = `${catId}_${q.difficulty}_${q.idx}`;
          preloaded[id] = {
            id,
            categoryId: catId,
            difficulty: q.difficulty,
            idx: q.idx,
            text: q.text,
            answer: q.answer,
            acceptableAnswers: q.acceptableAnswers,
            hint: q.hint,
          } as Question;
        });
        setStatuses((s) => ({ ...s, [catId]: "done" }));
      } catch {
        setStatuses((s) => ({ ...s, [catId]: "error" }));
      }
    };

    Promise.all(uniqueCategoryIds.map(loadCategory)).then(() => {
      setPreloaded(preloaded);
      setAllDone(true);
      setTimeout(() => {
        setPhase("board");
        router.push("/diwaniyya/game");
      }, 600);
    });
  }, []); // eslint-disable-line

  const done = Object.values(statuses).filter((s) => s === "done").length;
  const total = uniqueCategoryIds.length;
  const percent = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <main className="min-h-screen bg-mesh flex flex-col">
      <header className="px-6 py-5 max-w-7xl mx-auto w-full">
        <Logo size="md" />
      </header>

      <div className="flex-1 flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-md text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-500/10 rounded-full mb-6">
            {allDone ? (
              <Check className="w-10 h-10 text-primary-500" />
            ) : (
              <Sparkles className="w-10 h-10 text-primary-500 animate-pulse" />
            )}
          </div>

          <h1 className="text-2xl md:text-3xl font-black mb-2">
            {allDone ? "الديوانية جاهزة!" : "نحضّر الديوانية..."}
          </h1>
          <p className="text-ink-500 text-sm mb-6">
            {allDone
              ? "كل الأسئلة جاهزة، يبدأ التحدي!"
              : "AI يولّد أسئلة لكل تصنيف اخترتموه"}
          </p>

          <div className="bg-white rounded-2xl border border-ink-100 p-4 mb-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-ink-600">التقدم</span>
              <span className="text-xs font-black text-primary-600 tabular-nums">
                {done}/{total} ({percent}%)
              </span>
            </div>
            <div className="h-2 bg-ink-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-l from-primary-500 to-primary-400 transition-all duration-500"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-ink-100 p-2 space-y-1 text-right">
            {uniqueCategoryIds.map((catId) => {
              const cat = CATEGORY_BY_ID[catId];
              const status = statuses[catId];
              if (!cat) return null;
              return (
                <div
                  key={catId}
                  className={cn(
                    "flex items-center justify-between p-2 rounded-lg transition",
                    status === "done" && "bg-primary-50",
                    status === "loading" && "bg-blue-50",
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{cat.icon}</span>
                    <span className="font-bold text-xs">{cat.name}</span>
                  </div>
                  {status === "done" && (
                    <Check className="w-4 h-4 text-primary-600" />
                  )}
                  {status === "loading" && (
                    <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                  )}
                  {status === "pending" && (
                    <span className="w-4 h-4 rounded-full bg-ink-200" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}
