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

export default function PreloadPage() {
  const router = useRouter();
  const teamA = useGameStore((s) => s.teamA);
  const teamB = useGameStore((s) => s.teamB);
  const setPreloaded = useGameStore((s) => s.setPreloadedQuestions);
  const setPhase = useGameStore((s) => s.setPhase);

  const allCategoryIds = [...teamA.selectedCategories, ...teamB.selectedCategories];

  const [statuses, setStatuses] = useState<Record<string, "pending" | "loading" | "done" | "error">>(
    Object.fromEntries(allCategoryIds.map((id) => [id, "pending"])),
  );
  const [allDone, setAllDone] = useState(false);
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    if (allCategoryIds.length === 0) {
      router.push("/setup");
      return;
    }

    const preloaded: PreloadedQuestions = {};

    const loadCategory = async (catId: string) => {
      const cat = CATEGORY_BY_ID[catId];
      if (!cat) return;

      // الـ party games (charades) ما تحتاج تحميل مسبق
      if (cat.gameMode === "charades") {
        setStatuses((s) => ({ ...s, [catId]: "done" }));
        return;
      }

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
          const question: Question = {
            id,
            categoryId: catId,
            difficulty: q.difficulty,
            idx: q.idx,
            text: q.text,
            answer: q.answer,
            acceptableAnswers: q.acceptableAnswers,
            hint: q.hint,
          };
          preloaded[id] = question;
        });
        setStatuses((s) => ({ ...s, [catId]: "done" }));
      } catch {
        setStatuses((s) => ({ ...s, [catId]: "error" }));
      }
    };

    Promise.all(allCategoryIds.map(loadCategory)).then(() => {
      setPreloaded(preloaded);
      setAllDone(true);
      setTimeout(() => {
        setPhase("board");
        router.push("/game");
      }, 600);
    });
  }, []); // eslint-disable-line

  const done = Object.values(statuses).filter((s) => s === "done").length;
  const total = allCategoryIds.length;
  const percent = Math.round((done / total) * 100);

  return (
    <main className="min-h-screen bg-mesh flex flex-col">
      <header className="px-6 py-5 max-w-7xl mx-auto w-full">
        <Logo size="md" />
      </header>

      <div className="flex-1 flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-md text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-500/10 rounded-full mb-6">
            {allDone ? (
              <Check className="w-10 h-10 text-primary-500 animate-pulse" />
            ) : (
              <Sparkles className="w-10 h-10 text-primary-500 animate-pulse" />
            )}
          </div>

          <h1 className="text-3xl md:text-4xl font-black mb-3">
            {allDone ? "جاهزون!" : "نحضّر اللعبة..."}
          </h1>
          <p className="text-ink-500 mb-8">
            {allDone
              ? "كل الأسئلة جاهزة، استمتعوا!"
              : "AI يولّد ٣٦ سؤال مميّز لكم"}
          </p>

          {/* شريط التقدم */}
          <div className="bg-white rounded-3xl border-2 border-ink-100 p-5 mb-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold text-ink-600">التقدم</span>
              <span className="text-sm font-black text-primary-600 tabular-nums">
                {done}/{total} ({percent}%)
              </span>
            </div>
            <div className="h-3 bg-ink-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-l from-primary-500 to-primary-400 transition-all duration-500"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>

          {/* قائمة التصنيفات */}
          <div className="bg-white rounded-3xl border-2 border-ink-100 p-3 space-y-1 text-right">
            {allCategoryIds.map((catId) => {
              const cat = CATEGORY_BY_ID[catId];
              const status = statuses[catId];
              if (!cat) return null;
              return (
                <div
                  key={catId}
                  className={cn(
                    "flex items-center justify-between p-2 rounded-xl transition",
                    status === "done" && "bg-primary-50",
                    status === "loading" && "bg-blue-50",
                    status === "error" && "bg-red-50",
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{cat.icon}</span>
                    <span className="font-bold text-sm">{cat.name}</span>
                  </div>
                  {status === "done" && (
                    <Check className="w-5 h-5 text-primary-600" />
                  )}
                  {status === "loading" && (
                    <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                  )}
                  {status === "pending" && (
                    <span className="w-5 h-5 rounded-full bg-ink-200" />
                  )}
                  {status === "error" && (
                    <span className="text-xs text-red-600 font-bold">!</span>
                  )}
                </div>
              );
            })}
          </div>

          <p className="text-xs text-ink-400 mt-6">
            ⚡ نحمّل كل شي مرة وحدة عشان اللعب يكون سريع بدون انتظار
          </p>
        </div>
      </div>
    </main>
  );
}
