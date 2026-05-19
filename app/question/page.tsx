"use client";

import { useEffect, useState, useRef, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/Button";
import { useGameStore } from "@/lib/store";
import { CATEGORY_BY_ID } from "@/lib/categories-data";
import { HOOK_BY_ID } from "@/lib/hooks-data";
import { TEAM_COLORS, cn, formatPoints } from "@/lib/utils";
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
import {
  pickComment,
  PERSONALITY_BY_ID,
  type Outcome,
} from "@/lib/personalities";

interface ParsedCell {
  categoryId: string;
  difficulty: QuestionDifficulty;
  idx: number;
}

function parseCellId(cellId: string | null): ParsedCell | null {
  if (!cellId) return null;
  const parts = cellId.split("_");
  // التنسيق الجديد: categoryId_diff_idx (مثال: one_piece_400_1)
  if (parts.length < 3) return null;
  const idx = Number(parts[parts.length - 1]);
  const diff = Number(parts[parts.length - 2]);
  if (!diff || ![200, 400, 600].includes(diff)) return null;
  if (isNaN(idx)) return null;
  const categoryId = parts.slice(0, -2).join("_");
  return {
    categoryId,
    difficulty: diff as QuestionDifficulty,
    idx,
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
  const preloadedQuestions = useGameStore((s) => s.preloadedQuestions);

  const [questionData, setQuestionData] = useState<QuestionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [switching, setSwitching] = useState(false);
  const [stage, setStage] = useState<Stage>("answering");
  const [comment, setComment] = useState<string | null>(null);
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
    if (!parsed || !cellId) return;
    // أولاً: تحقق من الأسئلة المحملة مسبقاً
    const preloaded = preloadedQuestions[cellId];
    if (preloaded) {
      setQuestionData({
        text: preloaded.text,
        answer: preloaded.answer,
        acceptableAnswers: preloaded.acceptableAnswers ?? [],
        hint: preloaded.hint ?? "",
      });
      setLoading(false);
      return;
    }
    // احتياطي: جلب من API لو ما كان محملاً
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
  }, [parsed, cellId, preloadedQuestions]); // eslint-disable-line

  useEffect(() => {
    fetchQuestion();
  }, [parsed?.categoryId, parsed?.difficulty]); // eslint-disable-line

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

    // منطق جديد: الفريق الأول لو جاوب غلط، الفريق الثاني ياخذ فرصة سرقة
    if (team === activeTeam.id && !result.isCorrect) {
      // الفريق الأول غلط → ننتقل للسرقة (الفريق الثاني عنده فرصة)
      setStage("stealing");
      setTimeLeft(STEAL_TIME);
    } else {
      // إما الفريق الأول جاوب صح، أو الفريق الثاني جاوب (محاولة سرقة)
      setStage("reveal");
    }
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
    setTimeout(() => router.push("/game"), 1200);
  };

  // حدّد التعليق بناءً على نتيجة السؤال
  useEffect(() => {
    if (stage !== "reveal" || comment) return;
    let outcome: Outcome = "all_wrong";
    if (judgment) {
      if (judgment.isCorrect && judgment.forTeam === activeTeam.id) {
        outcome = "first_correct";
      } else if (judgment.isCorrect && judgment.forTeam === otherTeam.id) {
        outcome = "stolen_correct";
      } else {
        outcome = "all_wrong";
      }
    } else {
      outcome = "timeout";
    }
    setComment(pickComment(settings.personality, outcome));
  }, [stage, judgment, comment, settings.personality, activeTeam.id, otherTeam.id]);

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

      <div className="max-w-3xl mx-auto px-5 py-5">
        {/* شريط معلومات */}
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <div className="text-2xl">{cat?.icon}</div>
            <div>
              <div className="text-[10px] text-ink-400 font-bold uppercase">الفئة</div>
              <div className="font-bold text-sm">{cat?.name}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isMultiplier && (
              <div className="bg-gold-500 text-ink-900 px-2.5 py-1 rounded-full font-black text-xs flex items-center gap-1 animate-pulse">
                <Sparkles className="w-3 h-3" />×٣
              </div>
            )}
            <div className="bg-gold-500/15 text-gold-700 px-3 py-1.5 rounded-full font-black text-sm">
              {formatPoints(effectivePoints)} نقطة
            </div>
          </div>
        </div>

        {/* قدرات نشطة */}
        {activeHooks.length > 0 && (
          <div className="bg-gold-500/10 border border-gold-500/30 rounded-xl p-2.5 mb-3">
            <div className="text-[10px] font-bold text-gold-700 mb-1.5 uppercase">
              القدرات النشطة
            </div>
            <div className="flex flex-wrap gap-1.5">
              {activeHooks.map((hookId) => {
                const h = HOOK_BY_ID[hookId];
                if (!h) return null;
                return (
                  <span
                    key={hookId}
                    className="bg-white border border-gold-500/40 rounded-full px-2 py-0.5 text-[11px] font-bold flex items-center gap-1"
                  >
                    {h.icon} {h.name}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* الدور والمؤقت */}
        <div className="bg-white rounded-2xl border border-ink-100 p-3 mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{
                backgroundColor:
                  stage === "stealing"
                    ? TEAM_COLORS.find((c) => c.id === otherTeam.color)?.hex
                    : colorObj.hex,
              }}
            />
            <div>
              <div className="text-[10px] text-ink-400 font-bold uppercase">
                {stage === "stealing" ? "محاولة الفريق الثاني" : "الدور"}
              </div>
              <div className="font-bold text-sm">
                {stage === "stealing" ? otherTeam.name : activeTeam.name}
              </div>
            </div>
          </div>
          <div
            className={cn(
              "px-4 py-2 rounded-xl flex items-center gap-1.5 font-black text-xl tabular-nums transition",
              timeBg,
              timeColor,
            )}
          >
            <Clock className="w-4 h-4" />
            {String(Math.floor(timeLeft / 60)).padStart(2, "0")}:
            {String(timeLeft % 60).padStart(2, "0")}
          </div>
        </div>

        {/* بطاقة السؤال */}
        <div className="bg-white rounded-2xl border border-ink-100 overflow-hidden mb-3 min-h-[200px]">
          <div className="p-5 md:p-8 flex items-center justify-center text-center">
            {loading || switching ? (
              <div className="flex flex-col items-center gap-2.5 text-ink-500">
                <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
                <p className="font-bold text-sm">
                  {switching ? "جاري تبديل السؤال…" : "جارٍ توليد السؤال…"}
                </p>
              </div>
            ) : stage === "reveal" || stage === "judged" ? (
              <div className="space-y-4 w-full">
                <p className="text-base md:text-lg font-medium text-ink-700 leading-relaxed">
                  {questionData?.text}
                </p>
                <div className="bg-primary-50 border border-primary-200 rounded-xl p-4">
                  <div className="text-[10px] text-primary-700 font-bold mb-1 uppercase">
                    الإجابة الصحيحة
                  </div>
                  <div className="text-xl md:text-2xl font-black text-primary-900">
                    {questionData?.answer}
                  </div>
                </div>
                {judgment && settings.judgingMode !== "manual" && (
                  <div
                    className={cn(
                      "rounded-2xl p-3 border-2",
                      judgment.isCorrect
                        ? "bg-green-50 border-green-300 text-green-800"
                        : "bg-red-50 border-red-300 text-red-800",
                    )}
                  >
                    <div className="flex items-center gap-2 font-black text-sm mb-0.5">
                      {judgment.isCorrect ? (
                        <>
                          <Check className="w-4 h-4" />
                          إجابة صحيحة!
                        </>
                      ) : (
                        <>
                          <X className="w-4 h-4" />
                          إجابة غير صحيحة
                        </>
                      )}
                    </div>
                    <p className="text-xs">{judgment.feedback}</p>
                  </div>
                )}

                {/* تعليق شخصية AI */}
                {comment && (
                  <PersonalityComment
                    comment={comment}
                    personality={settings.personality}
                    correct={!!judgment?.isCorrect}
                  />
                )}
              </div>
            ) : (
              <p className="text-xl md:text-2xl font-bold text-ink-800 leading-relaxed">
                {questionData?.text}
              </p>
            )}
          </div>
        </div>

        {/* التلميح */}
        {!loading && !switching && stage === "answering" && (
          <div className="mb-3">
            {!showHint ? (
              <button
                onClick={() => setShowHint(true)}
                className="text-warn-500 text-sm font-bold hover:underline flex items-center gap-1.5 mx-auto"
              >
                <Lightbulb className="w-3.5 h-3.5" />
                إظهار تلميح
              </button>
            ) : (
              <div className="bg-warn-500/10 border border-warn-500/30 rounded-xl p-3 text-warn-700 text-sm font-medium flex items-start gap-2">
                <Lightbulb className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{questionData?.hint}</span>
              </div>
            )}
          </div>
        )}

        {/* حقل الإجابة */}
        {!loading &&
          !switching &&
          (stage === "answering" || stage === "stealing") && (
            <div className="bg-white rounded-2xl border border-ink-100 p-4">
              <label className="block text-xs font-bold text-ink-500 mb-2">
                {stage === "stealing"
                  ? `${otherTeam.name} — حاول الإجابة`
                  : `${activeTeam.name} — اكتب إجابتك`}
              </label>
              <input
                type="text"
                value={stage === "stealing" ? stealAnswer : userAnswer}
                onChange={(e) =>
                  stage === "stealing"
                    ? setStealAnswer(e.target.value)
                    : setUserAnswer(e.target.value)
                }
                className="w-full px-4 py-3 border-2 border-ink-200 rounded-xl text-base font-bold focus:border-primary-500 focus:outline-none mb-2.5"
                placeholder="اكتب الإجابة..."
                autoFocus
              />
              {isDoubleAnswer && stage === "answering" && (
                <>
                  <label className="block text-xs font-bold text-ink-500 mb-2">
                    الإجابة الثانية (جاوب جوابين)
                  </label>
                  <input
                    type="text"
                    value={userAnswer2}
                    onChange={(e) => setUserAnswer2(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-blue-200 bg-blue-50/50 rounded-xl text-base font-bold focus:border-blue-500 focus:outline-none mb-2.5"
                    placeholder="بديل للإجابة الأولى..."
                  />
                </>
              )}
              <div className="flex gap-2">
                <Button
                  size="md"
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
                  size="md"
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
            <div className="bg-white rounded-2xl border border-ink-100 p-4">
              <div className="text-center mb-3 text-sm font-bold">
                هل إجابة{" "}
                {judgment.forTeam === "team_a" ? teamA.name : teamB.name} صحيحة؟
              </div>
              <div className="flex gap-2">
                <Button
                  size="md"
                  variant="danger"
                  className="flex-1"
                  icon={<X className="w-4 h-4" />}
                  onClick={() => handleManualJudge(false)}
                >
                  خطأ
                </Button>
                <Button
                  size="md"
                  className="flex-1"
                  icon={<Check className="w-4 h-4" />}
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
              <Button size="md" onClick={handleAutoFinish}>
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
    <div className="mt-4">
      <div className="text-[10px] font-bold text-ink-400 mb-2 text-center uppercase tracking-wider">
        قدرات {team.name}
      </div>
      <div className="flex gap-1.5 flex-wrap justify-center">
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
                "px-3 py-2 rounded-xl border font-bold flex items-center gap-1.5 transition text-xs",
                active
                  ? "border-gold-500 bg-gold-500/10 shadow-sm"
                  : !available
                    ? "opacity-30 grayscale cursor-not-allowed border-ink-100"
                    : "border-ink-200 hover:border-ink-400 hover:scale-105 bg-white",
              )}
            >
              <span className="text-base">{hook.icon}</span>
              <span>{hook.name}</span>
              {active && (
                <span className="text-[9px] bg-gold-500 text-white px-1.5 py-0.5 rounded-full">
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

function PersonalityComment({
  comment,
  personality,
  correct,
}: {
  comment: string;
  personality: keyof typeof PERSONALITY_BY_ID;
  correct: boolean;
}) {
  const p = PERSONALITY_BY_ID[personality];
  return (
    <div
      className={cn(
        "rounded-2xl border-2 p-4 flex items-start gap-3 animate-float-up",
        correct ? "shadow-md" : "",
      )}
      style={{
        borderColor: p.color,
        backgroundColor: `${p.color}10`,
      }}
    >
      <div
        className="w-12 h-12 shrink-0 rounded-xl flex items-center justify-center text-3xl"
        style={{ backgroundColor: `${p.color}25` }}
      >
        {p.emoji}
      </div>
      <div className="flex-1">
        <div
          className="text-[10px] font-black uppercase tracking-wider mb-1"
          style={{ color: p.color }}
        >
          {p.name}
        </div>
        <p className="text-base md:text-lg font-bold text-ink-800 leading-snug">
          {comment}
        </p>
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
