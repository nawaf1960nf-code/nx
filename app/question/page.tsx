"use client";

import { useEffect, useState, useRef, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/Button";
import { useGameStore } from "@/lib/store";
import { CATEGORY_BY_ID } from "@/lib/categories-data";
import { HOOK_BY_ID } from "@/lib/hooks-data";
import { TEAM_COLORS, cn, formatPoints } from "@/lib/utils";
import { speak, stopSpeaking, isSupported } from "@/lib/speech";
import { Volume2, VolumeX } from "lucide-react";
import {
  Clock,
  Loader2,
  Check,
  X,
  Lightbulb,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import type { QuestionDifficulty, HookId } from "@/lib/types";

interface ParsedCell {
  categoryId: string;
  difficulty: QuestionDifficulty;
}

function parseCellId(cellId: string | null): ParsedCell | null {
  if (!cellId) return null;
  const parts = cellId.split("_");
  if (parts.length < 2) return null;
  const lastPart = parts[parts.length - 1];
  const diff = Number(lastPart);
  if (!diff || ![200, 400, 600].includes(diff)) return null;
  const categoryId = parts.slice(0, -1).join("_");
  return {
    categoryId,
    difficulty: diff as QuestionDifficulty,
  };
}

interface QuestionData {
  text: string;
  answer: string;
  acceptableAnswers: string[];
  hint: string;
}

const ANSWER_TIME = 60;
const STEAL_TIME = 15;

type Stage = "answering" | "stealing" | "reveal" | "judged";

function QuestionScreen() {
  const router = useRouter();
  const params = useSearchParams();
  const cellId = params.get("cell");
  const parsed = parseCellId(cellId);

  // إعادة التوجيه لنمط charades للفئات الخاصة
  useEffect(() => {
    if (!parsed) return;
    const cat = CATEGORY_BY_ID[parsed.categoryId];
    if (cat?.gameMode === "charades") {
      router.replace(`/charades?cell=${cellId}`);
    }
  }, [parsed?.categoryId, cellId, router]); // eslint-disable-line

  const teamA = useGameStore((s) => s.teamA);
  const teamB = useGameStore((s) => s.teamB);
  const currentTurn = useGameStore((s) => s.currentTurn);
  const settings = useGameStore((s) => s.settings);
  const addScore = useGameStore((s) => s.addScore);
  const subtractScore = useGameStore((s) => s.subtractScore);
  const useHookStore = useGameStore((s) => s.useHook);
  const markQuestionAnswered = useGameStore((s) => s.markQuestionAnswered);
  const setCurrentTurn = useGameStore((s) => s.setCurrentTurn);

  const [questionData, setQuestionData] = useState<QuestionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [switching, setSwitching] = useState(false);
  const [stage, setStage] = useState<Stage>("answering");
  const [timeLeft, setTimeLeft] = useState(ANSWER_TIME);
  const [userAnswer, setUserAnswer] = useState("");
  const [userAnswer2, setUserAnswer2] = useState("");
  const [stealAnswer, setStealAnswer] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [judgment, setJudgment] = useState<{
    isCorrect: boolean;
    feedback: string;
    forTeam: "team_a" | "team_b";
  } | null>(null);
  const [judging, setJudging] = useState(false);

  // القدرات النشطة للسؤال الحالي
  const [activeHooks, setActiveHooks] = useState<HookId[]>([]);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // الفريق صاحب الدور = الفريق الفعّال (مو من الـ cellId)
  const activeTeam = currentTurn === "team_a" ? teamA : teamB;
  const otherTeam = currentTurn === "team_a" ? teamB : teamA;
  const colorObj =
    TEAM_COLORS.find((c) => c.id === activeTeam.color) ?? TEAM_COLORS[0];

  const isMultiplier = activeHooks.includes("multiplier");
  const isPit = activeHooks.includes("pit");
  const isSteal = activeHooks.includes("steal");
  const isDoubleAnswer = activeHooks.includes("double_answer");

  const fetchQuestion = useCallback(async () => {
    if (!parsed) return;
    setLoading(true);
    try {
      const res = await fetch("/api/question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categoryId: parsed.categoryId,
          difficulty: parsed.difficulty,
        }),
      });
      const data = await res.json();
      setQuestionData(data);
    } finally {
      setLoading(false);
    }
  }, [parsed]); // eslint-disable-line

  useEffect(() => {
    fetchQuestion();
  }, [parsed?.categoryId, parsed?.difficulty]); // eslint-disable-line

  // الراوي الصوتي: يقرأ السؤال تلقائياً لما يجي
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  useEffect(() => {
    if (!questionData || loading || switching) return;
    if (stage !== "answering") return;
    if (!voiceEnabled || !isSupported()) return;
    // تأخير صغير قبل القراءة
    const t = setTimeout(() => speak(questionData.text), 600);
    return () => {
      clearTimeout(t);
      stopSpeaking();
    };
  }, [questionData, loading, switching, voiceEnabled, stage]);

  // أوقف الصوت عند المغادرة
  useEffect(() => () => stopSpeaking(), []);

  // مؤقت العد
  useEffect(() => {
    if (loading || stage === "reveal" || stage === "judged") return;
    if (timeLeft <= 0) {
      handleTimeUp();
      return;
    }
    timerRef.current = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [timeLeft, loading, stage]); // eslint-disable-line

  const handleTimeUp = useCallback(() => {
    if (stage === "answering") {
      setStage("stealing");
      setTimeLeft(STEAL_TIME);
    } else if (stage === "stealing") {
      setStage("reveal");
    }
  }, [stage]);

  const submitAnswer = async (team: "team_a" | "team_b", answer: string) => {
    if (!questionData || !parsed) return;
    setJudging(true);

    if (settings.judgingMode === "manual") {
      setJudgment({ isCorrect: false, feedback: "", forTeam: team });
      setJudging(false);
      setStage("reveal");
      return;
    }

    // في حالة double_answer للفريق النشط، نجرّب الإجابتين
    let result = { isCorrect: false, feedback: "" };
    const tryAnswer = async (ans: string) => {
      const res = await fetch("/api/judge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: questionData.text,
          correctAnswer: questionData.answer,
          acceptableAnswers: questionData.acceptableAnswers,
          userAnswer: ans,
        }),
      });
      return (await res.json()) as { isCorrect: boolean; feedback: string };
    };

    result = await tryAnswer(answer);

    // لو فعّل جاوب جوابين وكانت الأولى غلط، جرّب الثانية
    if (
      isDoubleAnswer &&
      team === activeTeam.id &&
      !result.isCorrect &&
      userAnswer2.trim()
    ) {
      const second = await tryAnswer(userAnswer2);
      if (second.isCorrect) result = second;
    }

    setJudgment({ ...result, forTeam: team });
    setJudging(false);
    setStage("reveal");
  };

  const applyScore = (correct: boolean, team: "team_a" | "team_b") => {
    if (!parsed) return;
    const multiplier = isMultiplier ? 3 : 1;
    const points = parsed.difficulty * multiplier;

    if (correct) {
      addScore(team, points);

      // قدرة "الحفرة" - تخصم من الفريق الثاني
      if (isPit && team === activeTeam.id) {
        const other = team === "team_a" ? "team_b" : "team_a";
        subtractScore(other, parsed.difficulty);
      }
    } else {
      // غلط: لو فعّل المضاعف يخسر × 3
      if (team === activeTeam.id && isMultiplier) {
        subtractScore(team, parsed.difficulty);
      }

      // قدرة "السرقة" - لو الفريق الثاني غلط في السرقة، النقاط تروح للأول
      if (isSteal && team === otherTeam.id && stage === "reveal") {
        addScore(activeTeam.id, parsed.difficulty);
      }
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
    setCurrentTurn(currentTurn === "team_a" ? "team_b" : "team_a");
    setStage("judged");
    setTimeout(() => router.push("/game"), 800);
  };

  const handleUseHook = async (hookId: HookId) => {
    useHookStore(activeTeam.id, hookId);
    setActiveHooks((prev) => [...prev, hookId]);

    if (hookId === "ai_hint") {
      setShowHint(true);
    }
    if (hookId === "switch") {
      // جلب سؤال جديد
      setSwitching(true);
      setShowHint(false);
      setStage("answering");
      setTimeLeft(ANSWER_TIME);
      setUserAnswer("");
      setUserAnswer2("");
      setStealAnswer("");
      await fetchQuestion();
      setSwitching(false);
    }
    if (hookId === "trap") {
      // الفريق الثاني يجاوب مباشرة
      setStage("stealing");
      setTimeLeft(STEAL_TIME);
    }
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
  const effectivePoints = parsed.difficulty * (isMultiplier ? 3 : 1);
  const timeColor =
    timeLeft <= 5
      ? "text-danger-500"
      : timeLeft <= 15
        ? "text-warn-500"
        : "text-ink-800";
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
        <div className="flex items-center gap-2">
          {isSupported() && (
            <button
              onClick={() => {
                setVoiceEnabled((v) => !v);
                if (voiceEnabled) stopSpeaking();
                else if (questionData) speak(questionData.text);
              }}
              className="w-10 h-10 rounded-full bg-white border-2 border-ink-200 hover:border-ink-400 flex items-center justify-center transition"
              title={voiceEnabled ? "أوقف الراوي" : "شغّل الراوي"}
            >
              {voiceEnabled ? (
                <Volume2 className="w-4 h-4 text-primary-600" />
              ) : (
                <VolumeX className="w-4 h-4 text-ink-400" />
              )}
            </button>
          )}
          <Button
            variant="ghost"
            size="sm"
            icon={<ArrowLeft className="w-4 h-4" />}
            onClick={() => router.push("/game")}
          >
            عودة
          </Button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-6">
        {/* شريط معلومات */}
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="text-3xl">{cat?.icon}</div>
            <div>
              <div className="text-xs text-ink-500 font-bold">الفئة</div>
              <div className="font-black text-lg">{cat?.name}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isMultiplier && (
              <div className="bg-gold-500 text-ink-900 px-3 py-1 rounded-full font-black text-sm flex items-center gap-1 animate-pulse">
                <Sparkles className="w-4 h-4" />×٣ مضاعف
              </div>
            )}
            <div className="bg-gold-500/15 text-gold-600 px-4 py-2 rounded-full font-black text-lg">
              {formatPoints(effectivePoints)} نقطة
            </div>
          </div>
        </div>

        {/* قدرات نشطة */}
        {activeHooks.length > 0 && (
          <div className="bg-gold-500/10 border-2 border-gold-500/30 rounded-2xl p-3 mb-4">
            <div className="text-xs font-bold text-gold-700 mb-2">
              ✨ القدرات النشطة:
            </div>
            <div className="flex flex-wrap gap-2">
              {activeHooks.map((hookId) => {
                const h = HOOK_BY_ID[hookId];
                if (!h) return null;
                return (
                  <span
                    key={hookId}
                    className="bg-white border border-gold-500/40 rounded-full px-2.5 py-1 text-xs font-bold flex items-center gap-1"
                  >
                    {h.icon} {h.name}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* الدور والمؤقت */}
        <div className="bg-white rounded-3xl border-2 border-ink-100 p-4 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span
              className="w-3 h-3 rounded-full"
              style={{
                backgroundColor:
                  stage === "stealing"
                    ? TEAM_COLORS.find((c) => c.id === otherTeam.color)?.hex
                    : colorObj.hex,
              }}
            />
            <div>
              <div className="text-xs text-ink-500 font-bold">
                {stage === "stealing" ? "محاولة الفريق الثاني" : "دور"}
              </div>
              <div className="font-black text-lg">
                {stage === "stealing" ? otherTeam.name : activeTeam.name}
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
        <div className="bg-white rounded-3xl border-2 border-ink-100 overflow-hidden mb-4 min-h-[280px]">
          <div className="p-6 md:p-10 flex items-center justify-center text-center">
            {loading || switching ? (
              <div className="flex flex-col items-center gap-3 text-ink-500">
                <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
                <p className="font-bold">
                  {switching ? "جاري تبديل السؤال…" : "جارٍ توليد السؤال…"}
                </p>
              </div>
            ) : stage === "reveal" || stage === "judged" ? (
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
        {!loading && !switching && stage === "answering" && (
          <div className="mb-4">
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
        {!loading &&
          !switching &&
          (stage === "answering" || stage === "stealing") && (
            <div className="bg-white rounded-3xl border-2 border-ink-100 p-6">
              <label className="block text-sm font-bold text-ink-500 mb-2">
                {stage === "stealing"
                  ? `${otherTeam.name} - حاول الإجابة`
                  : `${activeTeam.name} - اكتب إجابتك`}
              </label>
              <input
                type="text"
                value={stage === "stealing" ? stealAnswer : userAnswer}
                onChange={(e) =>
                  stage === "stealing"
                    ? setStealAnswer(e.target.value)
                    : setUserAnswer(e.target.value)
                }
                className="w-full px-5 py-4 border-2 border-ink-200 rounded-2xl text-xl font-bold focus:border-primary-500 focus:outline-none mb-3"
                placeholder="اكتب الإجابة..."
                autoFocus
              />
              {isDoubleAnswer && stage === "answering" && (
                <>
                  <label className="block text-sm font-bold text-ink-500 mb-2">
                    الإجابة الثانية (جاوب جوابين)
                  </label>
                  <input
                    type="text"
                    value={userAnswer2}
                    onChange={(e) => setUserAnswer2(e.target.value)}
                    className="w-full px-5 py-4 border-2 border-blue-200 bg-blue-50/50 rounded-2xl text-xl font-bold focus:border-blue-500 focus:outline-none mb-3"
                    placeholder="بديل للإجابة الأولى..."
                  />
                </>
              )}
              <div className="flex gap-3">
                <Button
                  size="lg"
                  className="flex-1"
                  disabled={
                    judging ||
                    (stage === "answering"
                      ? userAnswer.trim().length === 0
                      : stealAnswer.trim().length === 0)
                  }
                  loading={judging}
                  onClick={() =>
                    submitAnswer(
                      stage === "stealing" ? otherTeam.id : activeTeam.id,
                      stage === "stealing" ? stealAnswer : userAnswer,
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
                  {stage === "answering" ? "ما أعرف" : "تجاوز"}
                </Button>
              </div>
            </div>
          )}

        {/* التحكيم اليدوي */}
        {!loading &&
          stage === "reveal" &&
          settings.judgingMode === "manual" &&
          judgment && (
            <div className="bg-white rounded-3xl border-2 border-ink-100 p-6">
              <div className="text-center mb-4 font-bold">
                هل إجابة{" "}
                {judgment.forTeam === "team_a" ? teamA.name : teamB.name} صحيحة؟
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
          stage === "reveal" &&
          settings.judgingMode !== "manual" && (
            <div className="text-center">
              <Button size="lg" onClick={handleAutoFinish}>
                التالي
              </Button>
            </div>
          )}

        {/* القدرات */}
        {!loading && !switching && (stage === "answering" || stage === "stealing") && (
          <HooksRow
            team={activeTeam}
            stage={stage}
            activeHooks={activeHooks}
            onUseHook={handleUseHook}
          />
        )}
      </div>
    </main>
  );
}

function HooksRow({
  team,
  stage,
  activeHooks,
  onUseHook,
}: {
  team: { hooks: HookId[]; usedHooks: HookId[]; name: string };
  stage: Stage;
  activeHooks: HookId[];
  onUseHook: (hookId: HookId) => void;
}) {
  return (
    <div className="mt-6">
      <div className="text-sm font-bold text-ink-500 mb-3 text-center">
        قدرات {team.name}
      </div>
      <div className="flex gap-2 flex-wrap justify-center">
        {team.hooks.map((hookId) => {
          const hook = HOOK_BY_ID[hookId];
          if (!hook) return null;
          const used = team.usedHooks.includes(hookId);
          const active = activeHooks.includes(hookId);
          // قدرات "قبل السؤال" متاحة دائماً قبل تقديم الإجابة
          // قدرات "بعد السؤال" متاحة بعد ظهور السؤال
          const available =
            !used &&
            (hook.timing === "before_question" ? stage === "answering" : true);

          return (
            <button
              key={hookId}
              disabled={!available}
              onClick={() => onUseHook(hookId)}
              className={cn(
                "px-4 py-3 rounded-2xl border-2 font-bold flex items-center gap-2 transition",
                active
                  ? "border-gold-500 bg-gold-500/10 shadow-md"
                  : !available
                    ? "opacity-30 grayscale cursor-not-allowed border-ink-100"
                    : "border-ink-200 hover:border-ink-400 hover:scale-105 bg-white",
              )}
            >
              <span className="text-2xl">{hook.icon}</span>
              <span className="text-sm">{hook.name}</span>
              {active && (
                <span className="text-xs bg-gold-500 text-white px-2 py-0.5 rounded-full">
                  نشطة
                </span>
              )}
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
