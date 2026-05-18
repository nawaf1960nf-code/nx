"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/Button";
import { useGameStore } from "@/lib/store";
import { TEAM_COLORS, cn, formatPoints } from "@/lib/utils";
import { Trophy, RotateCw, Home } from "lucide-react";

const CONFETTI_COLORS = [
  "#00c853",
  "#ffd700",
  "#1e88e5",
  "#e53935",
  "#7c4dff",
  "#ff6f00",
];

export default function ResultsPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const teamA = useGameStore((s) => s.teamA);
  const teamB = useGameStore((s) => s.teamB);
  const resetGame = useGameStore((s) => s.resetGame);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const winner = teamA.score === teamB.score ? null : teamA.score > teamB.score ? teamA : teamB;
  const loser = winner ? (winner.id === teamA.id ? teamB : teamA) : null;
  const winnerColor = winner
    ? (TEAM_COLORS.find((c) => c.id === winner.color) ?? TEAM_COLORS[0])
    : TEAM_COLORS[0];

  const handlePlayAgain = () => {
    resetGame();
    router.push("/setup");
  };

  const handleHome = () => {
    resetGame();
    router.push("/");
  };

  return (
    <main className="min-h-screen bg-mesh relative overflow-hidden">
      {/* الكونفيتي */}
      <Confetti />

      <header className="px-6 py-5 max-w-7xl mx-auto">
        <Logo size="md" />
      </header>

      <div className="max-w-3xl mx-auto px-6 py-8 text-center relative z-10">
        {winner ? (
          <>
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gold-500/20 mb-6 animate-float-up">
              <Trophy className="w-12 h-12 text-gold-600" />
            </div>
            <h1
              className="text-4xl md:text-6xl font-black mb-3 animate-float-up"
              style={{ animationDelay: "100ms" }}
            >
              مبروك الفوز!
            </h1>
            <p
              className="text-2xl md:text-4xl font-black mb-10 animate-float-up"
              style={{ color: winnerColor.hex, animationDelay: "200ms" }}
            >
              {winner.name}
            </p>
          </>
        ) : (
          <>
            <h1 className="text-4xl md:text-6xl font-black mb-3">تعادل!</h1>
            <p className="text-xl text-ink-500 mb-10">
              نتيجة مدهشة، الفريقان متساويان تماماً
            </p>
          </>
        )}

        {/* بطاقات النتائج */}
        <div className="grid sm:grid-cols-2 gap-4 mb-10">
          <ResultCard
            team={teamA}
            isWinner={winner?.id === teamA.id}
            isLoser={loser?.id === teamA.id}
          />
          <ResultCard
            team={teamB}
            isWinner={winner?.id === teamB.id}
            isLoser={loser?.id === teamB.id}
          />
        </div>

        {/* الأزرار */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            size="xl"
            onClick={handlePlayAgain}
            icon={<RotateCw className="w-5 h-5" />}
          >
            العب مرة ثانية
          </Button>
          <Button
            size="xl"
            variant="secondary"
            onClick={handleHome}
            icon={<Home className="w-5 h-5" />}
          >
            الصفحة الرئيسية
          </Button>
        </div>
      </div>
    </main>
  );
}

function ResultCard({
  team,
  isWinner,
  isLoser,
}: {
  team: { name: string; color: string; score: number };
  isWinner: boolean;
  isLoser: boolean;
}) {
  const color = TEAM_COLORS.find((c) => c.id === team.color) ?? TEAM_COLORS[0];
  return (
    <div
      className={cn(
        "rounded-3xl p-6 border-2 transition-all",
        isWinner && "shadow-2xl scale-105",
      )}
      style={{
        backgroundColor: isWinner ? color.hex : "white",
        borderColor: color.hex,
      }}
    >
      <div
        className={cn(
          "text-sm font-bold mb-2",
          isWinner ? "text-white/80" : "text-ink-500",
        )}
      >
        {isWinner ? "🏆 الفائز" : isLoser ? "الثاني" : "النتيجة"}
      </div>
      <div
        className={cn(
          "text-2xl font-black mb-3",
          isWinner ? "text-white" : "text-ink-800",
        )}
      >
        {team.name}
      </div>
      <div
        className={cn(
          "text-5xl font-black tabular-nums",
          isWinner ? "text-white" : "",
        )}
        style={isWinner ? undefined : { color: color.hex }}
      >
        {formatPoints(team.score)}
      </div>
      <div
        className={cn(
          "text-xs font-bold mt-1",
          isWinner ? "text-white/80" : "text-ink-400",
        )}
      >
        نقطة
      </div>
    </div>
  );
}

function Confetti() {
  const [pieces, setPieces] = useState<
    {
      id: number;
      left: number;
      delay: number;
      duration: number;
      color: string;
    }[]
  >([]);

  useEffect(() => {
    const list = Array.from({ length: 80 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 3 + Math.random() * 3,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    }));
    setPieces(list);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="absolute w-2 h-3 rounded-sm"
          style={{
            left: `${p.left}%`,
            top: "-20px",
            backgroundColor: p.color,
            animation: `confetti-fall ${p.duration}s ${p.delay}s ease-in infinite`,
          }}
        />
      ))}
    </div>
  );
}
