"use client";

import { useEffect, useState, useRef, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/Button";
import { useGameStore } from "@/lib/store";
import { CATEGORY_BY_ID } from "@/lib/categories-data";
import { HOOK_BY_ID } from "@/lib/hooks-data";
import { TEAM_COLORS, cn, formatPoints } from "@/lib/utils";
import { Clock, Loader2, Check, X, Lightbulb, ArrowLeft } from "lucide-react";
import type { QuestionDifficulty, HookId } from "@/lib/types";

interface ParsedCell {
  categoryId: string;
  difficulty: QuestionDifficulty;
  team: "team_a" | "team_b";
}

function parseCellId(cellId: string | null): ParsedCell | null {
  if (!cellId) return null;
  const parts = cellId.split("_");
  // التنسيق: <categoryId>_<diff>_team_<a|b>
  // categoryId قد يحتوي _ داخله، لذا نأخذ الأجزاء الأخيرة من النهاية
  if (parts.length < 4) return null;
  const teamSuffix = parts.slice(-2).join("_"); // team_a / team_b
  const diff = Number(parts[parts.length - 3]) as QuestionDifficulty;
  const categoryId = parts.slice(0, parts.length - 3).join("_");
  return {
    categoryId,
    difficulty: diff,
    team: teamSuffix as "team_a" | "team_b",
  };
}

interface QuestionData {
  text: string;
  answer: string;
  acceptableAnswers: string[];
  hint: string;
  imageUrl?: string | null;
}

const ANSWER_TIME = 60;
const STEAL_TIME = 15;

function QuestionScreen() {
  const router = useRouter();
  const params = useSearchParams();
  const cellId = params.get("cell");

  const parsed = parseCellId(cellId);

  // إعادة التوجيه لنمط الـ charades للفئات المخصصة
  useEffect(() => {
    if (!parsed) return;
    const cat = CATEGORY_BY_ID[parsed.categoryId];
    if (cat?.gameMode === "charades") {
      router.replace(`/charades?cell=${cellId}`);
    }
  }, [parsed?.categoryId, cellId, router]); // eslint-disable-line

  const teamA = useGameStore((s) => s.teamA);
  const teamB = useGameStore((s) => s.teamB);
  const settings = useGameStore((s) => s.settings);
  const addScore = useGameStore((s) => s.addScore);
  const subtractScore = useGameStore((s) => s.subtractScore);
  const useHook = useGameStore((s) => s.useHook);
  const markQuestionAnswered = useGameStore((s) => s.markQuestionAnswered);
  const setCurrentTurn = useGameStore((s) => s.setCurrentTurn);

  const [questionData, setQuestionData] = useState<QuestionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [phase, setPhaseLocal] = useState<
    "answering" | "stealing" | "reveal" | "judged"
  >("answering");
  const [timeLeft, setTimeLeft] = useState(ANSWER_TIME);
  const [userAnswer, setUserAnswer] = useState("");
  const [stealAnswer, setStealAnswer] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [judgment, setJudgment] = useState<{
    isCorrect: boolean;
    feedback: string;
    forTeam: "team_a" | "team_b";
  } | null>(null);
  const [judging, setJudging] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const activeTeam = parsed?.team === "team_a" ? teamA : teamB;
  const otherTeam = parsed?.team === "team_a" ? teamB : teamA;
  const colorObj = TEAM_COLORS.find((c) => c.id === activeTeam.color) ?? TEAM_COLORS[0];

  // تحميل السؤال
  useEffect(() => {
    if (!parsed) return;
    let cancelled = false;
    setLoading(true);
    fetch("/api/question", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        categoryId: parsed.categoryId,
        difficulty: parsed.difficulty,
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        setQuestionData(data);
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [parsed?.categoryId, parsed?.difficulty]); // eslint-disable-line

  // مؤقت العد التنازلي
  useEffect(() => {
    if (loading || phase === "reveal" || phase === "judged") return;
    if (timeLeft <= 0) {
      handleTimeUp();
      return;
    }
    timerRef.current = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [timeLeft, loading, phase]); // eslint-disable-line

  const handleTimeUp = useCallback(() => {
    if (phase === "answering") {
      // ينتهي وقت الفريق الأساسي → الفريق الثاني يحاول
      setPhaseLocal("stealing");
      setTimeLeft(STEAL_TIME);
    } else if (phase === "stealing") {
      // انتهى وقت الفريق الثاني، نكشف الإجابة
      setPhaseLocal("reveal");
    }
  }, [phase]);

  const submitAnswer = async (team: "team_a" | "team_b", answer: string) => {
    if (!questionData || !parsed) return;
    setJudging(true);

    const isManual = settings.judgingMode === "manual";

    if (isManual) {
      setJudgment({ isCorrect: false, feedback: "", forTeam: team });
      setJudging(false);
      setPhaseLocal("reveal");
      return;
    }

    const res = await fetch("/api/judge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question: questionData.text,
        correctAnswer: questionData.answer,
        acceptableAnswers: questionData.acceptableAnswers,
        userAnswer: answer,
      }),
    });
    const j = (await res.json()) as {
      isCorrect: boolean;
      feedback: string;
    };
    setJudgment({ ...j, forTeam: team });
    setJudging(false);
    setPhaseLocal("reveal");
  };

  const applyScore = (correct: boolean, team: "team_a" | "team_b") => {
    if (!parsed) return;
    if (correct) {
      addScore(team, parsed.difficulty);
    }
  };

  const handleManualJudge = (correct: boolean) => {
    if (!judgment) return;
    setJudgment({ ...judgment, isCorrect: correct });
    applyScore(correct, judgment.forTeam);
    finishQuestion();
  };

  const handleAutoFinish = () => {
    if (judgment) applyScore(judgment.isCorrect, judgment.forTeam);
    finishQuestion();
  };

  const finishQuestion = () => {
    if (!cellId || !parsed) return;
    markQuestionAnswered(cellId);
    setCurrentTurn(parsed.team === "team_a" ? "team_b" : "team_a");
    setPhaseLocal("judged");
    setTimeout(() => router.push("/game"), 800);
  };

  if (!parsed) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="mb-4">رابط غير صحيح</p>
          <Button onClick={() => router.push("/game")}>رجوع للوحة</Button>
        </div>
      </main>
    );
  }

  const cat = CATEGORY_BY_ID[parsed.categoryId];
  const timeColor =
    timeLeft <= 5 ? "text-danger-500" : timeLeft <= 15 ? "text-warn-500" : "text-ink-800";
  const timeBg =
    timeLeft <= 5
      ? "bg-danger-500/10 animate-pulse"
      : timeLeft <= 15
        ? "bg-warn-500/10"
        : "bg-ink-100";

  return (
    <main className="min-h-screen bg-mesh">
      <header className="px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <Logo size="sm" />
        <Button
          variant="ghost"
          size="sm"
          icon={<ArrowLeft className="w-4 h-4" />}
          onClick={() => router.push("/game")}
        >
          عودة للوحة
        </Button>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-6">
        {/* شريط المعلومات */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="text-3xl">{cat?.icon}</div>
            <div>
              <div className="text-xs text-ink-500 font-bold">الفئة</div>
              <div className="font-black text-lg">{cat?.name}</div>
            </div>
          </div>
          <div className="bg-gold-500/15 text-gold-600 px-4 py-2 rounded-full font-black text-lg">
            {formatPoints(parsed.difficulty)} نقطة
          </div>
        </div>

        {/* مؤشر الدور والمؤقت */}
        <div className="bg-white rounded-3xl border-2 border-ink-100 p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: colorObj.hex }}
            />
            <div>
              <div className="text-xs text-ink-500 font-bold">
                {phase === "stealing" ? "محاولة السرقة" : "دور"}
              </div>
              <div className="font-black text-lg">
                {phase === "stealing" ? otherTeam.name : activeTeam.name}
              </div>
            </div>
          </div>
          <div
            className={cn(
              "px-5 py-3 rounded-2xl flex items-center gap-2 font-black text-2xl tabular-nums transition",
              timeBg,
              timeColor,
            )}
          >
            <Clock className="w-5 h-5" />
            {String(Math.floor(timeLeft / 60)).padStart(2, "0")}:
            {String(timeLeft % 60).padStart(2, "0")}
          </div>
        </div>

        {/* بطاقة السؤال */}
        <div className="bg-white rounded-3xl border-2 border-ink-100 overflow-hidden mb-6 min-h-[280px]">
          {/* الصورة المرفقة (إن وُجدت) */}
          {!loading && questionData?.imageUrl && (
            <div className="relative w-full aspect-[16/9] bg-ink-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={questionData.imageUrl}
                alt="صورة موضوعية للسؤال"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          )}

          <div className="p-6 md:p-10 flex items-center justify-center text-center">
          {loading ? (
            <div className="flex flex-col items-center gap-3 text-ink-500">
              <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
              <p className="font-bold">جارٍ توليد السؤال من الذكاء الاصطناعي…</p>
            </div>
          ) : phase === "reveal" || phase === "judged" ? (
            <div className="space-y-6 w-full">
              <p className="text-lg md:text-2xl font-bold text-ink-700 leading-relaxed">
                {questionData?.text}
              </p>
              <div className="bg-primary-50 border-2 border-primary-200 rounded-2xl p-5">
                <div className="text-sm text-primary-700 font-bold mb-1">
                  الإجابة الصحيحة
                </div>
                <div className="text-2xl md:text-3xl font-black text-primary-900">
                  {questionData?.answer}
                </div>
              </div>
              {judgment && settings.judgingMode !== "manual" && (
                <div
                  className={cn(
                    "rounded-2xl p-4 border-2",
                    judgment.isCorrect
                      ? "bg-green-50 border-green-300 text-green-800"
                      : "bg-red-50 border-red-300 text-red-800",
                  )}
                >
                  <div className="flex items-center gap-2 font-black text-lg mb-1">
                    {judgment.isCorrect ? (
                      <>
                        <Check className="w-5 h-5" />
                        إجابة صحيحة!
                      </>
                    ) : (
                      <>
                        <X className="w-5 h-5" />
                        إجابة غير صحيحة
                      </>
                    )}
                  </div>
                  <p className="text-sm">{judgment.feedback}</p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-2xl md:text-4xl font-bold text-ink-800 leading-relaxed">
              {questionData?.text}
            </p>
          )}
          </div>
        </div>

        {/* التلميح */}
        {!loading && phase === "answering" && (
          <div className="mb-6">
            {!showHint ? (
              <button
                onClick={() => setShowHint(true)}
                className="text-warn-500 font-bold hover:underline flex items-center gap-2 mx-auto"
              >
                <Lightbulb className="w-4 h-4" />
                إظهار تلميح
              </button>
            ) : (
              <div className="bg-warn-500/10 border-2 border-warn-500/30 rounded-2xl p-4 text-warn-500 font-bold flex items-start gap-2">
                <Lightbulb className="w-5 h-5 shrink-0 mt-0.5" />
                <span>{questionData?.hint}</span>
              </div>
            )}
          </div>
        )}

        {/* حقل الإجابة */}
        {!loading && (phase === "answering" || phase === "stealing") && (
          <div className="bg-white rounded-3xl border-2 border-ink-100 p-6">
            <label className="block text-sm font-bold text-ink-500 mb-2">
              {phase === "stealing"
                ? `${otherTeam.name} - حاول السرقة`
                : `${activeTeam.name} - اكتب إجابتك`}
            </label>
            <input
              type="text"
              value={phase === "stealing" ? stealAnswer : userAnswer}
              onChange={(e) =>
                phase === "stealing"
                  ? setStealAnswer(e.target.value)
                  : setUserAnswer(e.target.value)
              }
              className="w-full px-5 py-4 border-2 border-ink-200 rounded-2xl text-xl font-bold focus:border-primary-500 focus:outline-none"
              placeholder="اكتب الإجابة هنا..."
              autoFocus
            />
            <div className="flex gap-3 mt-4">
              <Button
                size="lg"
                className="flex-1"
                disabled={
                  judging ||
                  (phase === "answering"
                    ? userAnswer.trim().length === 0
                    : stealAnswer.trim().length === 0)
                }
                loading={judging}
                onClick={() =>
                  submitAnswer(
                    phase === "stealing" ? otherTeam.id : activeTeam.id,
                    phase === "stealing" ? stealAnswer : userAnswer,
                  )
                }
              >
                تأكيد الإجابة
              </Button>
              <Button
                size="lg"
                variant="secondary"
                onClick={() => handleTimeUp()}
              >
                {phase === "answering" ? "ما أعرف" : "تجاوز"}
              </Button>
            </div>
          </div>
        )}

        {/* أزرار التحكيم اليدوي */}
        {!loading &&
          phase === "reveal" &&
          settings.judgingMode === "manual" &&
          judgment && (
            <div className="bg-white rounded-3xl border-2 border-ink-100 p-6">
              <div className="text-center mb-4 font-bold">
                هل إجابة {judgment.forTeam === "team_a" ? teamA.name : teamB.name} صحيحة؟
              </div>
              <div className="flex gap-3">
                <Button
                  size="lg"
                  variant="danger"
                  className="flex-1"
                  icon={<X className="w-5 h-5" />}
                  onClick={() => handleManualJudge(false)}
                >
                  خطأ
                </Button>
                <Button
                  size="lg"
                  className="flex-1"
                  icon={<Check className="w-5 h-5" />}
                  onClick={() => handleManualJudge(true)}
                >
                  صحيح
                </Button>
              </div>
            </div>
          )}

        {/* زر التالي بعد الكشف */}
        {!loading &&
          phase === "reveal" &&
          settings.judgingMode !== "manual" && (
            <div className="text-center">
              <Button size="lg" onClick={handleAutoFinish}>
                التالي
              </Button>
            </div>
          )}

        {/* الهوكات */}
        {!loading && phase === "answering" && (
          <HooksRow
            team={activeTeam}
            onUseHook={(hookId) => {
              useHook(activeTeam.id, hookId);
              if (hookId === "ai_hint") {
                setShowHint(true);
              }
            }}
          />
        )}
      </div>
    </main>
  );
}

function HooksRow({
  team,
  onUseHook,
}: {
  team: { hooks: HookId[]; usedHooks: HookId[]; name: string };
  onUseHook: (hookId: HookId) => void;
}) {
  return (
    <div className="mt-6">
      <div className="text-sm font-bold text-ink-500 mb-3 text-center">
        وسائل {team.name}
      </div>
      <div className="flex gap-2 flex-wrap justify-center">
        {team.hooks.map((hookId) => {
          const hook = HOOK_BY_ID[hookId];
          if (!hook) return null;
          const used = team.usedHooks.includes(hookId);
          return (
            <button
              key={hookId}
              disabled={used}
              onClick={() => onUseHook(hookId)}
              className={cn(
                "px-4 py-3 rounded-2xl border-2 font-bold flex items-center gap-2 transition",
                used
                  ? "opacity-30 grayscale cursor-not-allowed border-ink-100"
                  : "border-ink-200 hover:border-ink-400 hover:scale-105 bg-white",
              )}
            >
              <span className="text-2xl">{hook.icon}</span>
              <span className="text-sm">{hook.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function QuestionPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
        </div>
      }
    >
      <QuestionScreen />
    </Suspense>
  );
}
