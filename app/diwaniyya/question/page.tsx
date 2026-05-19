"use client";

import { useEffect, useState, useRef, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/Button";
import { useGameStore } from "@/lib/store";
import { CATEGORY_BY_ID } from "@/lib/categories-data";
import { TEAM_COLORS, cn, formatPoints } from "@/lib/utils";
import { Clock, Loader2, Check, X, Lightbulb, ArrowLeft } from "lucide-react";
import type { QuestionDifficulty } from "@/lib/types";
import {
  pickComment,
  PERSONALITY_BY_ID,
  type Outcome,
} from "@/lib/personalities";

interface ParsedCell {
  playerId: string;
  difficulty: QuestionDifficulty;
}

function parseCellId(cellId: string | null): ParsedCell | null {
  if (!cellId) return null;
  const parts = cellId.split("_");
  if (parts.length < 2) return null;
  const lastPart = parts[parts.length - 1];
  const diff = Number(lastPart);
  if (!diff || ![200, 400, 600].includes(diff)) return null;
  const playerId = parts.slice(0, -1).join("_");
  return { playerId, difficulty: diff as QuestionDifficulty };
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

function DiwaniyyaQuestion() {
  const router = useRouter();
  const params = useSearchParams();
  const cellId = params.get("cell");
  const parsed = parseCellId(cellId);

  const players = useGameStore((s) => s.diwaniyyaPlayers);
  const settings = useGameStore((s) => s.settings);
  const preloaded = useGameStore((s) => s.preloadedQuestions);
  const addDiwaniyyaScore = useGameStore((s) => s.addDiwaniyyaScore);
  const markQuestionAnswered = useGameStore((s) => s.markQuestionAnswered);
  const answered = useGameStore((s) => s.answeredQuestions);
  const nextPlayer = useGameStore((s) => s.nextDiwaniyyaPlayer);

  const activePlayer = players.find((p) => p.id === parsed?.playerId);
  const otherPlayers = players.filter((p) => p.id !== parsed?.playerId);
  const colorObj =
    TEAM_COLORS.find((c) => c.id === activePlayer?.color) ?? TEAM_COLORS[0];

  const [questionData, setQuestionData] = useState<QuestionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [stage, setStage] = useState<Stage>("answering");
  const [timeLeft, setTimeLeft] = useState(ANSWER_TIME);
  const [userAnswer, setUserAnswer] = useState("");
  const [stealAnswer, setStealAnswer] = useState("");
  const [stealingPlayerId, setStealingPlayerId] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [judgment, setJudgment] = useState<{
    isCorrect: boolean;
    feedback: string;
    forPlayer: string;
  } | null>(null);
  const [judging, setJudging] = useState(false);
  const [comment, setComment] = useState<string | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // اختيار سؤال غير مستخدم من الأسئلة المُحمّلة لتصنيف اللاعب
  const fetchQuestion = useCallback(() => {
    if (!parsed || !activePlayer) return;
    setLoading(true);

    // ابحث عن الأسئلة المحملة لهذي الفئة + الصعوبة (idx 0 و 1)
    const candidates = [0, 1]
      .map((idx) => preloaded[`${activePlayer.categoryId}_${parsed.difficulty}_${idx}`])
      .filter(Boolean);

    // تجنّب الأسئلة المستخدمة في هذي اللعبة
    const usedQuestionTexts = new Set(
      answered
        .map((cid) => {
          // كل خلية فيها سؤال؛ نبحث في preloaded
          const cellParts = cid.split("_");
          const cellDiff = Number(cellParts[cellParts.length - 1]);
          const cellPlayerId = cellParts.slice(0, -1).join("_");
          const cellPlayer = players.find((p) => p.id === cellPlayerId);
          if (!cellPlayer) return null;
          const used = [0, 1].map((idx) =>
            preloaded[`${cellPlayer.categoryId}_${cellDiff}_${idx}`]?.text,
          );
          return used.filter(Boolean);
        })
        .flat()
        .filter(Boolean),
    );

    const unused = candidates.find((q) => !usedQuestionTexts.has(q.text)) ?? candidates[0];

    if (unused) {
      setQuestionData({
        text: unused.text,
        answer: unused.answer,
        acceptableAnswers: unused.acceptableAnswers ?? [],
        hint: unused.hint ?? "",
      });
    }
    setLoading(false);
  }, [parsed, activePlayer, preloaded, answered, players]);

  useEffect(() => {
    fetchQuestion();
  }, [parsed?.playerId, parsed?.difficulty]); // eslint-disable-line

  // مؤقت
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

  const submitAnswer = async (playerId: string, answer: string) => {
    if (!questionData || !parsed) return;
    setJudging(true);

    if (settings.judgingMode === "manual") {
      setJudgment({ isCorrect: false, feedback: "", forPlayer: playerId });
      setJudging(false);
      setStage("reveal");
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
    const result = (await res.json()) as { isCorrect: boolean; feedback: string };

    setJudgment({ ...result, forPlayer: playerId });
    setJudging(false);

    // الفريق الأول لو غلط، الباقين عندهم فرصة سرقة
    if (playerId === activePlayer?.id && !result.isCorrect) {
      setStage("stealing");
      setTimeLeft(STEAL_TIME);
      setStealAnswer("");
      setStealingPlayerId(null);
    } else {
      setStage("reveal");
    }
  };

  const applyScore = (correct: boolean, playerId: string) => {
    if (!parsed) return;
    if (correct) {
      addDiwaniyyaScore(playerId, parsed.difficulty);
    }
  };

  const handleManualJudge = (correct: boolean) => {
    if (!judgment) return;
    const updated = { ...judgment, isCorrect: correct };
    setJudgment(updated);

    // نفس منطق السرقة في الوضع اليدوي
    if (
      updated.forPlayer === activePlayer?.id &&
      !correct &&
      stage === "reveal"
    ) {
      // المضيف قال غلط → نعطي الباقين فرصة سرقة
      setStage("stealing");
      setTimeLeft(STEAL_TIME);
      setStealAnswer("");
      setStealingPlayerId(null);
      return;
    }

    applyScore(correct, updated.forPlayer);
    finishQuestion();
  };

  const handleAutoFinish = () => {
    if (judgment) applyScore(judgment.isCorrect, judgment.forPlayer);
    finishQuestion();
  };

  const finishQuestion = () => {
    if (!cellId || !parsed) return;
    markQuestionAnswered(cellId);
    nextPlayer();
    setStage("judged");
    setTimeout(() => router.push("/diwaniyya/game"), 1200);
  };

  // تعليق الشخصية
  useEffect(() => {
    if (stage !== "reveal" || comment) return;
    let outcome: Outcome = "all_wrong";
    if (judgment) {
      if (judgment.isCorrect && judgment.forPlayer === activePlayer?.id) {
        outcome = "first_correct";
      } else if (judgment.isCorrect) {
        outcome = "stolen_correct";
      } else {
        outcome = "all_wrong";
      }
    } else {
      outcome = "timeout";
    }
    setComment(pickComment(settings.personality, outcome));
  }, [stage, judgment, comment, settings.personality, activePlayer?.id]);

  if (!parsed || !activePlayer) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <Button onClick={() => router.push("/diwaniyya/game")}>
          رجوع للوحة
        </Button>
      </main>
    );
  }

  const cat = CATEGORY_BY_ID[activePlayer.categoryId];
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
        <Button
          variant="ghost"
          size="sm"
          icon={<ArrowLeft className="w-4 h-4" />}
          onClick={() => router.push("/diwaniyya/game")}
        >
          عودة
        </Button>
      </header>

      <div className="max-w-3xl mx-auto px-5 py-5">
        {/* شريط معلومات */}
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{activePlayer.avatar}</span>
            <div>
              <div className="text-[10px] text-ink-400 font-bold uppercase">
                {cat?.icon} {cat?.name}
              </div>
              <div className="font-bold text-sm">{activePlayer.name}</div>
            </div>
          </div>
          <div className="bg-gold-500/15 text-gold-700 px-3 py-1.5 rounded-full font-black text-sm">
            {formatPoints(parsed.difficulty)} نقطة
          </div>
        </div>

        {/* الدور والمؤقت */}
        <div className="bg-white rounded-2xl border border-ink-100 p-3 mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: colorObj.hex }}
            />
            <div>
              <div className="text-[10px] text-ink-400 font-bold uppercase">
                {stage === "stealing" ? "محاولة الباقين" : "الدور"}
              </div>
              <div className="font-bold text-sm">
                {stage === "stealing" ? "أول من يجاوب يأخذ النقاط" : activePlayer.name}
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
            {loading ? (
              <div className="flex flex-col items-center gap-2 text-ink-500">
                <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
                <p className="font-bold text-sm">جارٍ تحضير السؤال…</p>
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
                      "rounded-xl p-3 border-2",
                      judgment.isCorrect
                        ? "bg-green-50 border-green-300 text-green-800"
                        : "bg-red-50 border-red-300 text-red-800",
                    )}
                  >
                    <div className="flex items-center gap-2 font-black text-sm">
                      {judgment.isCorrect ? (
                        <>
                          <Check className="w-4 h-4" />
                          إجابة صحيحة من{" "}
                          {players.find((p) => p.id === judgment.forPlayer)?.name}
                        </>
                      ) : (
                        <>
                          <X className="w-4 h-4" /> إجابة غير صحيحة
                        </>
                      )}
                    </div>
                  </div>
                )}

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
        {!loading && stage === "answering" && (
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

        {/* حقل الإجابة للاعب الأساسي */}
        {!loading && stage === "answering" && (
          <div className="bg-white rounded-2xl border border-ink-100 p-4">
            <label className="block text-xs font-bold text-ink-500 mb-2">
              {activePlayer.name} — اكتب إجابتك
            </label>
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              className="w-full px-4 py-3 border-2 border-ink-200 rounded-xl text-base font-bold focus:border-primary-500 focus:outline-none mb-2.5"
              placeholder="اكتب الإجابة..."
              autoFocus
            />
            <div className="flex gap-2">
              <Button
                size="md"
                className="flex-1"
                disabled={judging || userAnswer.trim().length === 0}
                loading={judging}
                onClick={() => submitAnswer(activePlayer.id, userAnswer)}
              >
                تأكيد الإجابة
              </Button>
              <Button size="md" variant="secondary" onClick={handleTimeUp}>
                ما أعرف
              </Button>
            </div>
          </div>
        )}

        {/* مرحلة السرقة - أي لاعب من الباقين */}
        {!loading && stage === "stealing" && (
          <div className="bg-white rounded-2xl border border-ink-100 p-4 space-y-3">
            <div className="text-center">
              <div className="text-xs font-bold text-warn-700 bg-warn-500/10 inline-block px-3 py-1 rounded-full mb-2">
                ⚡ السرقة مفتوحة!
              </div>
              <p className="text-sm text-ink-600 mb-3">
                مين من الباقين يسرق النقاط؟ اختار اسمك واكتب جوابك
              </p>
            </div>

            {/* اختيار اللاعب اللي يحاول السرقة */}
            <div>
              <label className="block text-xs font-bold text-ink-500 mb-2">
                مين يحاول السرقة؟
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                {otherPlayers.map((p) => {
                  const c = TEAM_COLORS.find((x) => x.id === p.color) ?? TEAM_COLORS[0];
                  const active = stealingPlayerId === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => setStealingPlayerId(p.id)}
                      className={cn(
                        "p-2 rounded-lg border-2 transition flex items-center gap-1.5 text-right",
                        active
                          ? "shadow-md scale-105"
                          : "border-ink-200 hover:border-ink-300",
                      )}
                      style={
                        active
                          ? { borderColor: c.hex, backgroundColor: `${c.hex}10` }
                          : undefined
                      }
                    >
                      <span className="text-lg">{p.avatar}</span>
                      <span className="text-xs font-bold truncate">{p.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <input
              type="text"
              value={stealAnswer}
              onChange={(e) => setStealAnswer(e.target.value)}
              className="w-full px-4 py-3 border-2 border-ink-200 rounded-xl text-base font-bold focus:border-primary-500 focus:outline-none"
              placeholder="إجابة السرقة..."
              disabled={!stealingPlayerId}
            />
            <div className="flex gap-2">
              <Button
                size="md"
                className="flex-1"
                disabled={
                  judging ||
                  !stealingPlayerId ||
                  stealAnswer.trim().length === 0
                }
                loading={judging}
                onClick={() =>
                  submitAnswer(stealingPlayerId!, stealAnswer)
                }
              >
                تأكيد السرقة
              </Button>
              <Button size="md" variant="secondary" onClick={handleTimeUp}>
                ما عرف أحد
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
                {players.find((p) => p.id === judgment.forPlayer)?.name} صحيحة؟
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

        {!loading &&
          stage === "reveal" &&
          settings.judgingMode !== "manual" && (
            <div className="text-center">
              <Button size="md" onClick={handleAutoFinish}>
                التالي
              </Button>
            </div>
          )}
      </div>
    </main>
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

export default function DiwaniyyaQuestionPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
        </div>
      }
    >
      <DiwaniyyaQuestion />
    </Suspense>
  );
}
