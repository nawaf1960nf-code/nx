"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/Button";
import { useGameStore } from "@/lib/store";
import { TEAM_COLORS, cn, formatPoints } from "@/lib/utils";
import { Trophy, RotateCw, Home, Crown, Sparkles, Medal } from "lucide-react";

const CONFETTI_COLORS = [
  "#00c853",
  "#ffd700",
  "#1e88e5",
  "#e53935",
  "#7c4dff",
  "#ff6f00",
  "#ff4081",
  "#00bcd4",
];

export default function DiwaniyyaResultsPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const players = useGameStore((s) => s.diwaniyyaPlayers);
  const resetGame = useGameStore((s) => s.resetGame);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    const t = setTimeout(() => setRevealed(true), 800);
    return () => clearTimeout(t);
  }, [mounted]);

  if (!mounted) return null;

  const ranked = [...players].sort((a, b) => b.score - a.score);
  const winner = ranked[0];
  const winnerColor =
    TEAM_COLORS.find((c) => c.id === winner?.color) ?? TEAM_COLORS[0];
  const isTie =
    ranked.length >= 2 && ranked[0].score === ranked[1].score && ranked[0].score > 0;

  const handlePlayAgain = () => {
    resetGame();
    router.push("/mode");
  };

  const handleHome = () => {
    resetGame();
    router.push("/");
  };

  return (
    <main className="min-h-screen bg-mesh relative overflow-hidden">
      {winner && revealed && !isTie && (
        <div
          className="absolute inset-0 opacity-20 pointer-events-none transition-opacity duration-1000"
          style={{
            background: `radial-gradient(circle at center, ${winnerColor.hex}80 0%, transparent 60%)`,
          }}
        />
      )}

      {revealed && winner && !isTie && <Confetti />}

      <header className="px-6 py-4 max-w-7xl mx-auto relative">
        <Logo size="sm" />
      </header>

      <div className="max-w-2xl mx-auto px-6 py-6 text-center relative z-10">
        {!revealed && (
          <div className="py-20 animate-pulse">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gold-500/20 mb-6">
              <Sparkles className="w-12 h-12 text-gold-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-black mb-3 text-ink-700">
              النتيجة بعد لحظات...
            </h1>
          </div>
        )}

        {revealed && winner && !isTie && (
          <>
            <div className="relative inline-flex flex-col items-center mb-6 animate-float-up">
              <div className="relative">
                <div className="absolute -inset-3 bg-gold-400/30 rounded-full blur-2xl animate-pulse" />
                <Crown
                  className="relative w-16 h-16 md:w-20 md:h-20 text-gold-500 drop-shadow-lg animate-bounce"
                  style={{ animationDuration: "2s" }}
                  strokeWidth={1.5}
                />
              </div>
              <div
                className="mt-3 w-28 h-28 md:w-32 md:h-32 rounded-3xl flex items-center justify-center text-6xl md:text-7xl shadow-2xl"
                style={{
                  backgroundColor: winnerColor.hex,
                  boxShadow: `0 0 60px ${winnerColor.hex}80`,
                }}
              >
                {winner.avatar}
              </div>
            </div>

            <div
              className="inline-flex items-center gap-2 bg-gold-500/15 text-gold-700 px-4 py-1.5 rounded-full font-bold text-xs mb-3 animate-float-up"
              style={{ animationDelay: "100ms" }}
            >
              <Trophy className="w-4 h-4" />
              بطل الديوانية
            </div>

            <h1
              className="text-3xl md:text-5xl font-black mb-2 animate-float-up"
              style={{ animationDelay: "150ms" }}
            >
              مبروووك! 🎉
            </h1>

            <p
              className="text-2xl md:text-4xl font-black mb-8 animate-float-up"
              style={{ color: winnerColor.hex, animationDelay: "250ms" }}
            >
              {winner.name}
            </p>
          </>
        )}

        {revealed && isTie && (
          <>
            <div className="text-7xl mb-4 animate-float-up">🤝</div>
            <h1 className="text-3xl md:text-4xl font-black mb-2">تعادل!</h1>
            <p className="text-ink-500 mb-8">
              لاعبان أو أكثر متعادلون في الصدارة
            </p>
          </>
        )}

        {/* ترتيب اللاعبين */}
        {revealed && (
          <div
            className="space-y-2 mb-8 text-right animate-float-up"
            style={{ animationDelay: "350ms" }}
          >
            {ranked.map((player, idx) => (
              <RankRow key={player.id} player={player} rank={idx + 1} />
            ))}
          </div>
        )}

        {revealed && (
          <div
            className="flex flex-col sm:flex-row gap-2 justify-center animate-float-up"
            style={{ animationDelay: "450ms" }}
          >
            <Button
              size="lg"
              onClick={handlePlayAgain}
              icon={<RotateCw className="w-4 h-4" />}
            >
              العب مرة ثانية
            </Button>
            <Button
              size="lg"
              variant="secondary"
              onClick={handleHome}
              icon={<Home className="w-4 h-4" />}
            >
              الرئيسية
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}

function RankRow({
  player,
  rank,
}: {
  player: { name: string; color: string; avatar: string; score: number };
  rank: number;
}) {
  const color = TEAM_COLORS.find((c) => c.id === player.color) ?? TEAM_COLORS[0];
  const isFirst = rank === 1;
  const medalColor =
    rank === 1
      ? "#FFD700"
      : rank === 2
        ? "#C0C0C0"
        : rank === 3
          ? "#CD7F32"
          : "#9aa1b8";

  return (
    <div
      className={cn(
        "flex items-center gap-3 p-3 rounded-2xl border-2 transition",
        isFirst && "shadow-lg",
      )}
      style={{
        backgroundColor: isFirst ? color.hex : "white",
        borderColor: color.hex,
      }}
    >
      <div
        className={cn(
          "w-9 h-9 rounded-full flex items-center justify-center text-sm font-black shrink-0",
          isFirst ? "bg-white/20" : "",
        )}
        style={
          isFirst
            ? undefined
            : { backgroundColor: `${medalColor}25`, color: medalColor }
        }
      >
        {rank <= 3 ? <Medal className="w-4 h-4" /> : `#${rank}`}
      </div>

      <span className="text-2xl shrink-0">{player.avatar}</span>

      <div
        className={cn(
          "flex-1 min-w-0 text-right",
          isFirst ? "text-white" : "text-ink-800",
        )}
      >
        <div className="font-bold text-sm truncate">{player.name}</div>
      </div>

      <div
        className={cn(
          "text-2xl font-black tabular-nums",
          isFirst ? "text-white" : "",
        )}
        style={isFirst ? undefined : { color: color.hex }}
      >
        {formatPoints(player.score)}
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
    const list = Array.from({ length: 100 }).map((_, i) => ({
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
