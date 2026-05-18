"use client";

import { useEffect, useState, useRef, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/Button";
import { useGameStore } from "@/lib/store";
import { CATEGORY_BY_ID } from "@/lib/categories-data";
import { TEAM_COLORS, cn, formatPoints } from "@/lib/utils";
import {
  Clock,
  Loader2,
  Check,
  X,
  ArrowLeft,
  Eye,
  EyeOff,
  SkipForward,
} from "lucide-react";
import type { QuestionDifficulty } from "@/lib/types";

interface ParsedCell {
  categoryId: string;
  difficulty: QuestionDifficulty;
  team: "team_a" | "team_b";
}

function parseCellId(cellId: string | null): ParsedCell | null {
  if (!cellId) return null;
  const parts = cellId.split("_");
  if (parts.length < 4) return null;
  const teamSuffix = parts.slice(-2).join("_");
  const diff = Number(parts[parts.length - 3]) as QuestionDifficulty;
  const categoryId = parts.slice(0, parts.length - 3).join("_");
  return {
    categoryId,
    difficulty: diff,
    team: teamSuffix as "team_a" | "team_b",
  };
}

interface CharadesWord {
  word: string;
  category: string;
  hint?: string;
}

const ROUND_TIME = 90;

function CharadesScreen() {
  const router = useRouter();
  const params = useSearchParams();
  const cellId = params.get("cell");
  const parsed = parseCellId(cellId);

  const teamA = useGameStore((s) => s.teamA);
  const teamB = useGameStore((s) => s.teamB);
  const addScore = useGameStore((s) => s.addScore);
  const markQuestionAnswered = useGameStore((s) => s.markQuestionAnswered);
  const setCurrentTurn = useGameStore((s) => s.setCurrentTurn);

  const [stage, setStage] = useState<"intro" | "preview" | "playing" | "done">(
    "intro",
  );
  const [currentWord, setCurrentWord] = useState<CharadesWord | null>(null);
  const [usedWords, setUsedWords] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [revealed, setRevealed] = useState(true);
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME);
  const [score, setScore] = useState({ correct: 0, skipped: 0 });
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const team = parsed?.team === "team_a" ? teamA : teamB;
  const colorObj =
    TEAM_COLORS.find((c) => c.id === team?.color) ?? TEAM_COLORS[0];
  const cat = parsed ? CATEGORY_BY_ID[parsed.categoryId] : null;
  const drawMode = cat?.id === "draw_guess";

  const fetchWord = useCallback(async () => {
    if (!parsed) return;
    setLoading(true);
    try {
      const res = await fetch("/api/charades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          difficulty: parsed.difficulty,
          drawMode,
          recentlyAsked: usedWords,
        }),
      });
      const data = (await res.json()) as CharadesWord;
      setCurrentWord(data);
      setUsedWords((prev) => [...prev, data.word]);
    } finally {
      setLoading(false);
    }
  }, [parsed, drawMode, usedWords]);

  // مؤقت
  useEffect(() => {
    if (stage !== "playing") return;
    if (timeLeft <= 0) {
      setStage("done");
      return;
    }
    timerRef.current = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [timeLeft, stage]);

  const startGame = async () => {
    setStage("preview");
    await fetchWord();
  };

  const startTimer = () => {
    setRevealed(true);
    setStage("playing");
  };

  const handleCorrect = async () => {
    setScore((s) => ({ ...s, correct: s.correct + 1 }));
    await fetchWord();
    setRevealed(true);
  };

  const handleSkip = async () => {
    setScore((s) => ({ ...s, skipped: s.skipped + 1 }));
    await fetchWord();
    setRevealed(true);
  };

  const finishRound = () => {
    if (!parsed || !cellId) return;
    // كل كلمة صحيحة تساوي نسبة من نقاط الخلية
    const pointsPerWord = Math.round(parsed.difficulty / 4);
    const totalEarned = score.correct * pointsPerWord;
    addScore(parsed.team, totalEarned);
    markQuestionAnswered(cellId);
    setCurrentTurn(parsed.team === "team_a" ? "team_b" : "team_a");
    router.push("/game");
  };

  if (!parsed || !cat) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <Button onClick={() => router.push("/game")}>رجوع للوحة</Button>
      </main>
    );
  }

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
          عودة
        </Button>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-6">
        {/* شريط معلومات */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="text-3xl">{cat.icon}</div>
            <div>
              <div className="text-xs text-ink-500 font-bold">الفئة</div>
              <div className="font-black text-lg">{cat.name}</div>
            </div>
          </div>
          <div className="bg-gold-500/15 text-gold-600 px-4 py-2 rounded-full font-black">
            {formatPoints(parsed.difficulty)} نقطة
          </div>
        </div>

        {/* مرحلة المقدمة */}
        {stage === "intro" && (
          <div className="bg-white rounded-3xl border-2 border-ink-100 p-8 text-center">
            <div
              className="w-20 h-20 rounded-full mx-auto mb-5 flex items-center justify-center text-4xl"
              style={{ backgroundColor: `${colorObj.hex}20` }}
            >
              {drawMode ? "✏️" : "🤐"}
            </div>
            <h1 className="text-2xl md:text-3xl font-black mb-3">
              {drawMode ? "ارسم وخمّن!" : "اشرح بدون كلام!"}
            </h1>
            <p className="text-ink-500 mb-6 leading-relaxed">
              {drawMode
                ? "لاعب يرسم الكلمة على ورقة، الباقي يخمّنون."
                : "لاعب يمثّل الكلمة بدون كلام، الباقي يخمّنون."}
            </p>

            <div className="bg-ink-50 rounded-2xl p-5 mb-6 text-right space-y-3">
              <Rule
                num="1"
                text={`اختاروا لاعب من فريق ${team.name} ${drawMode ? "للرسم" : "للتمثيل"}.`}
              />
              <Rule num="2" text="هذا اللاعب يشوف الكلمة لوحده." />
              <Rule
                num="3"
                text={`${drawMode ? "يرسم" : "يمثّل"} بدون استخدام أي كلمة أو حرف.`}
              />
              <Rule
                num="4"
                text={`عندكم ${ROUND_TIME} ثانية لأكبر عدد ممكن من الكلمات.`}
              />
              <Rule
                num="5"
                text={`كل كلمة صح = ${Math.round(parsed.difficulty / 4)} نقطة.`}
              />
            </div>

            <Button size="xl" className="w-full" onClick={startGame}>
              بسم الله، فهمنا!
            </Button>
          </div>
        )}

        {/* مرحلة معاينة الكلمة */}
        {stage === "preview" && (
          <div className="bg-white rounded-3xl border-2 border-ink-100 p-8 text-center">
            {loading ? (
              <div className="py-10">
                <Loader2 className="w-10 h-10 animate-spin text-primary-500 mx-auto mb-3" />
                <p className="font-bold text-ink-500">
                  جاري تجهيز الكلمات...
                </p>
              </div>
            ) : (
              <>
                <p className="text-ink-500 mb-5">
                  {drawMode
                    ? "👀 الراسم فقط يشوف الكلمة"
                    : "👀 الممثل فقط يشوف الكلمة"}
                </p>

                <div className="bg-ink-900 text-white rounded-2xl p-8 mb-5">
                  {revealed ? (
                    <div>
                      <div className="text-xs text-ink-400 font-bold mb-2">
                        {currentWord?.category}
                      </div>
                      <div className="text-3xl md:text-5xl font-black">
                        {currentWord?.word}
                      </div>
                    </div>
                  ) : (
                    <div className="text-5xl">🫣</div>
                  )}
                </div>

                <button
                  onClick={() => setRevealed((r) => !r)}
                  className="text-ink-500 mb-5 font-bold flex items-center gap-2 mx-auto hover:text-ink-700 transition"
                >
                  {revealed ? (
                    <>
                      <EyeOff className="w-4 h-4" /> إخفاء الكلمة
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4" /> إظهار الكلمة
                    </>
                  )}
                </button>

                <Button size="xl" className="w-full" onClick={startTimer}>
                  جاهز، بدّ المؤقت!
                </Button>
              </>
            )}
          </div>
        )}

        {/* مرحلة اللعب */}
        {stage === "playing" && (
          <div>
            {/* مؤقت كبير */}
            <div
              className={cn(
                "rounded-3xl p-6 mb-4 text-center transition",
                timeLeft <= 10
                  ? "bg-red-500 text-white animate-pulse"
                  : timeLeft <= 30
                    ? "bg-warn-500 text-white"
                    : "bg-white border-2 border-ink-100",
              )}
            >
              <div className="text-sm font-bold opacity-80 mb-1">
                <Clock className="inline w-4 h-4 ml-1" />
                الوقت المتبقي
              </div>
              <div className="text-5xl md:text-6xl font-black tabular-nums">
                {String(Math.floor(timeLeft / 60)).padStart(2, "0")}:
                {String(timeLeft % 60).padStart(2, "0")}
              </div>
            </div>

            {/* الكلمة */}
            <div className="bg-ink-900 text-white rounded-3xl p-8 mb-4 text-center">
              {loading ? (
                <Loader2 className="w-8 h-8 animate-spin mx-auto" />
              ) : revealed ? (
                <div>
                  <div className="text-xs text-ink-400 font-bold mb-2">
                    {currentWord?.category}
                  </div>
                  <div className="text-3xl md:text-5xl font-black">
                    {currentWord?.word}
                  </div>
                </div>
              ) : (
                <div className="text-6xl">🫣</div>
              )}
              <button
                onClick={() => setRevealed((r) => !r)}
                className="mt-4 text-sm text-ink-400 font-bold hover:text-white transition"
              >
                {revealed ? "إخفاء" : "إظهار الكلمة للممثل فقط"}
              </button>
            </div>

            {/* النقاط الحالية */}
            <div className="bg-white rounded-2xl border-2 border-ink-100 p-3 mb-4 flex justify-around">
              <div className="text-center">
                <div className="text-xs text-ink-500 font-bold">صحيح</div>
                <div className="text-2xl font-black text-primary-600">
                  {score.correct}
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-ink-500 font-bold">تخطى</div>
                <div className="text-2xl font-black text-ink-400">
                  {score.skipped}
                </div>
              </div>
            </div>

            {/* أزرار التحكم */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                size="xl"
                variant="secondary"
                disabled={loading}
                onClick={handleSkip}
                icon={<SkipForward className="w-5 h-5" />}
              >
                تخطى
              </Button>
              <Button
                size="xl"
                disabled={loading}
                onClick={handleCorrect}
                icon={<Check className="w-5 h-5" />}
              >
                خمّنوها!
              </Button>
            </div>
          </div>
        )}

        {/* مرحلة النهاية */}
        {stage === "done" && (
          <div className="bg-white rounded-3xl border-2 border-ink-100 p-8 text-center">
            <div className="text-6xl mb-3">🎉</div>
            <h1 className="text-3xl font-black mb-1">انتهت الجولة!</h1>
            <p className="text-ink-500 mb-6">
              {team.name} يحصل على نقاطه
            </p>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <Stat
                label="صحيح"
                value={score.correct}
                color="text-primary-600"
              />
              <Stat
                label="تخطى"
                value={score.skipped}
                color="text-ink-400"
              />
            </div>

            <div className="bg-gold-500/10 border-2 border-gold-500/30 rounded-2xl p-5 mb-6">
              <div className="text-sm font-bold text-gold-600 mb-1">
                النقاط المكتسبة
              </div>
              <div className="text-4xl font-black text-gold-600">
                {formatPoints(
                  score.correct * Math.round(parsed.difficulty / 4),
                )}
              </div>
            </div>

            <Button size="xl" className="w-full" onClick={finishRound}>
              تمام، العودة للوحة
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}

function Rule({ num, text }: { num: string; text: string }) {
  return (
    <div className="flex gap-3">
      <span className="w-6 h-6 shrink-0 bg-ink-800 text-white rounded-full text-xs font-black flex items-center justify-center">
        {num}
      </span>
      <span className="text-sm text-ink-700">{text}</span>
    </div>
  );
}

function Stat({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="bg-ink-50 rounded-2xl p-4">
      <div className="text-xs text-ink-500 font-bold mb-1">{label}</div>
      <div className={cn("text-3xl font-black tabular-nums", color)}>
        {value}
      </div>
    </div>
  );
}

export default function CharadesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
        </div>
      }
    >
      <CharadesScreen />
    </Suspense>
  );
}
