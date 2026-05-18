"use client";

import { useEffect, useState, useRef, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
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
  QrCode,
} from "lucide-react";
import type { QuestionDifficulty } from "@/lib/types";

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
  return { categoryId, difficulty: diff as QuestionDifficulty };
}

interface CharadesWord {
  word: string;
  category: string;
  englishName: string;
  imageUrl: string | null;
  hint?: string;
}

// التوقيت حسب الصعوبة
const TIME_BY_DIFFICULTY: Record<QuestionDifficulty, number> = {
  200: 90,
  400: 50,
  600: 30,
};

type Stage = "intro" | "loading" | "qr" | "playing" | "done";

function CharadesScreen() {
  const router = useRouter();
  const params = useSearchParams();
  const cellId = params.get("cell");
  const parsed = parseCellId(cellId);

  const teamA = useGameStore((s) => s.teamA);
  const teamB = useGameStore((s) => s.teamB);
  const currentTurn = useGameStore((s) => s.currentTurn);
  const addScore = useGameStore((s) => s.addScore);
  const markQuestionAnswered = useGameStore((s) => s.markQuestionAnswered);
  const setCurrentTurn = useGameStore((s) => s.setCurrentTurn);

  const [stage, setStage] = useState<Stage>("intro");
  const [currentWord, setCurrentWord] = useState<CharadesWord | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [result, setResult] = useState<"correct" | "skip" | "timeout" | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [cardUrl, setCardUrl] = useState<string>("");

  const team = currentTurn === "team_a" ? teamA : teamB;
  const colorObj =
    TEAM_COLORS.find((c) => c.id === team?.color) ?? TEAM_COLORS[0];
  const cat = parsed ? CATEGORY_BY_ID[parsed.categoryId] : null;

  const totalTime = parsed ? TIME_BY_DIFFICULTY[parsed.difficulty] : 60;

  const fetchWord = useCallback(async () => {
    if (!parsed) return;
    setStage("loading");
    try {
      const res = await fetch("/api/charades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ difficulty: parsed.difficulty }),
      });
      const data = (await res.json()) as CharadesWord;
      setCurrentWord(data);

      // ابنِ URL بطاقة الجوال
      const origin = window.location.origin;
      const url = `${origin}/card?w=${encodeURIComponent(data.word)}&c=${encodeURIComponent(data.category)}${
        data.imageUrl ? `&img=${encodeURIComponent(data.imageUrl)}` : ""
      }`;
      setCardUrl(url);

      setStage("qr");
      setTimeLeft(totalTime);
    } catch {
      setStage("intro");
    }
  }, [parsed, totalTime]);

  // مؤقت
  useEffect(() => {
    if (stage !== "playing") return;
    if (timeLeft <= 0) {
      setResult("timeout");
      setStage("done");
      return;
    }
    timerRef.current = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [timeLeft, stage]);

  const startTimer = () => setStage("playing");

  const handleCorrect = () => {
    setResult("correct");
    setStage("done");
  };

  const handleSkip = () => {
    setResult("skip");
    setStage("done");
  };

  const finishRound = () => {
    if (!parsed || !cellId) return;
    // كلمة وحدة بس - لو خمنوها صح، يأخذ الفريق كامل النقاط
    if (result === "correct") {
      addScore(currentTurn, parsed.difficulty);
    }
    markQuestionAnswered(cellId);
    setCurrentTurn(currentTurn === "team_a" ? "team_b" : "team_a");
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

      <div className="max-w-2xl mx-auto px-6 py-6">
        {/* شريط المعلومات */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="text-3xl">{cat.icon}</div>
            <div>
              <div className="text-xs text-ink-500 font-bold">الفئة</div>
              <div className="font-black text-lg">{cat.name}</div>
            </div>
          </div>
          <div
            className="px-4 py-2 rounded-full font-black text-white"
            style={{ backgroundColor: colorObj.hex }}
          >
            {team.name} • {formatPoints(parsed.difficulty)}
          </div>
        </div>

        {/* مرحلة المقدمة */}
        {stage === "intro" && (
          <div className="bg-white rounded-3xl border-2 border-ink-100 p-8 text-center">
            <div
              className="w-20 h-20 rounded-full mx-auto mb-5 flex items-center justify-center text-4xl"
              style={{ backgroundColor: `${colorObj.hex}20` }}
            >
              🤐
            </div>
            <h1 className="text-2xl md:text-3xl font-black mb-3">
              اشرح بدون كلام!
            </h1>
            <p className="text-ink-500 mb-6 leading-relaxed">
              لاعب من {team.name} يمسح الـ QR ويشوف الكلمة على جواله،
              ثم يمثّلها بدون كلام والباقي يخمّنون.
            </p>

            <div className="bg-ink-50 rounded-2xl p-5 mb-6 text-right space-y-3">
              <Rule num="1" text="اختاروا لاعب من الفريق للتمثيل." />
              <Rule
                num="2"
                text="هو يمسح QR بكاميرا جواله ويشوف الكلمة + صورة."
              />
              <Rule num="3" text="يمثّل بدون أي كلمة أو صوت." />
              <Rule
                num="4"
                text={`الباقي عندهم ${totalTime} ثانية للتخمين.`}
              />
              <Rule
                num="5"
                text={`لو خمّنوا صح = ${formatPoints(parsed.difficulty)} نقطة. غلط أو وقت = صفر.`}
              />
            </div>

            <Button size="xl" className="w-full" onClick={fetchWord}>
              ابدأ - جهّز QR
            </Button>
          </div>
        )}

        {/* مرحلة التحميل */}
        {stage === "loading" && (
          <div className="bg-white rounded-3xl border-2 border-ink-100 p-12 text-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary-500 mx-auto mb-4" />
            <p className="font-bold text-ink-500">جاري تجهيز الكلمة...</p>
          </div>
        )}

        {/* مرحلة QR */}
        {stage === "qr" && currentWord && (
          <div className="bg-white rounded-3xl border-2 border-ink-100 p-6 md:p-8 text-center">
            <div className="inline-flex items-center gap-2 bg-fuchsia-500/10 text-fuchsia-700 px-4 py-2 rounded-full font-bold text-sm mb-4">
              <QrCode className="w-4 h-4" />
              امسح QR من جوال الممثّل فقط
            </div>

            <div className="bg-white p-4 rounded-2xl border-4 border-ink-900 inline-block mb-5">
              <QRCodeSVG
                value={cardUrl}
                size={220}
                level="M"
                includeMargin={false}
              />
            </div>

            <p className="text-ink-500 mb-1 text-sm">
              📸 افتح كاميرا جوالك واتجه للـ QR
            </p>
            <p className="text-ink-400 text-xs mb-6">
              راح يفتح صفحة فيها الكلمة + الصورة
            </p>

            <div className="bg-warn-500/10 border-2 border-warn-500/30 rounded-2xl p-3 mb-6 text-warn-700 text-sm font-bold">
              ⚠️ ما يمسح إلا اللاعب اللي بيمثّل!
            </div>

            <Button size="xl" className="w-full" onClick={startTimer}>
              مسحته - بدّ المؤقت! ⏱️
            </Button>
          </div>
        )}

        {/* مرحلة اللعب */}
        {stage === "playing" && (
          <div>
            <div
              className={cn(
                "rounded-3xl p-8 mb-4 text-center transition",
                timeLeft <= 10
                  ? "bg-red-500 text-white animate-pulse"
                  : timeLeft <= totalTime * 0.4
                    ? "bg-warn-500 text-white"
                    : "bg-white border-2 border-ink-100",
              )}
            >
              <div className="text-sm font-bold opacity-80 mb-2">
                <Clock className="inline w-4 h-4 ml-1" />
                الوقت المتبقي
              </div>
              <div className="text-7xl md:text-8xl font-black tabular-nums">
                {String(Math.floor(timeLeft / 60)).padStart(2, "0")}:
                {String(timeLeft % 60).padStart(2, "0")}
              </div>
            </div>

            <div className="bg-ink-900 text-white rounded-3xl p-6 text-center mb-4">
              <p className="text-lg md:text-xl">
                🎭 الممثّل يمثّل بدون كلام
                <br />
                <span className="opacity-60 text-sm">الباقي يخمّنون!</span>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                size="xl"
                variant="secondary"
                onClick={handleSkip}
                icon={<X className="w-5 h-5" />}
              >
                ما عرفوا
              </Button>
              <Button
                size="xl"
                onClick={handleCorrect}
                icon={<Check className="w-5 h-5" />}
              >
                خمّنوها!
              </Button>
            </div>
          </div>
        )}

        {/* مرحلة النهاية */}
        {stage === "done" && currentWord && (
          <div className="bg-white rounded-3xl border-2 border-ink-100 p-8 text-center">
            <div className="text-7xl mb-3">
              {result === "correct" ? "🎉" : result === "skip" ? "😅" : "⏱️"}
            </div>
            <h1 className="text-3xl font-black mb-2">
              {result === "correct"
                ? "أحسنتم!"
                : result === "skip"
                  ? "ما عرفوا"
                  : "انتهى الوقت"}
            </h1>

            <div className="bg-ink-50 rounded-2xl p-5 mb-5 mt-4">
              <div className="text-xs text-ink-500 font-bold mb-1">
                الكلمة كانت
              </div>
              <div className="text-3xl font-black text-ink-900">
                {currentWord.word}
              </div>
            </div>

            <div
              className={cn(
                "rounded-2xl p-5 mb-6 border-2",
                result === "correct"
                  ? "bg-primary-50 border-primary-300"
                  : "bg-ink-100 border-ink-200",
              )}
            >
              <div className="text-sm font-bold text-ink-500 mb-1">
                النقاط المكتسبة
              </div>
              <div
                className={cn(
                  "text-4xl font-black",
                  result === "correct"
                    ? "text-primary-600"
                    : "text-ink-400",
                )}
              >
                {result === "correct"
                  ? `+${formatPoints(parsed.difficulty)}`
                  : "0"}
              </div>
            </div>

            <Button size="xl" className="w-full" onClick={finishRound}>
              العودة للوحة
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
