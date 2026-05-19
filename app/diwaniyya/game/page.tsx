"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/Button";
import { UserMenu } from "@/components/UserMenu";
import { useGameStore } from "@/lib/store";
import { CATEGORY_BY_ID } from "@/lib/categories-data";
import { TEAM_COLORS, cn, formatPoints } from "@/lib/utils";
import { Home, X, ArrowRight, Plus, Minus, Trophy } from "lucide-react";
import type { QuestionDifficulty } from "@/lib/types";

const DIFFICULTIES: QuestionDifficulty[] = [200, 400, 600];

export default function DiwaniyyaGamePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [categoryImages, setCategoryImages] = useState<Record<string, string | null>>({});

  const players = useGameStore((s) => s.diwaniyyaPlayers);
  const currentIdx = useGameStore((s) => s.currentPlayerIdx);
  const answered = useGameStore((s) => s.answeredQuestions);
  const setSelectedCell = useGameStore((s) => s.setSelectedCell);
  const resetGame = useGameStore((s) => s.resetGame);
  const addDiwaniyyaScore = useGameStore((s) => s.addDiwaniyyaScore);
  const setPhase = useGameStore((s) => s.setPhase);

  useEffect(() => setMounted(true), []);

  const totalCells = players.length * DIFFICULTIES.length;
  const finishedCells = answered.length;

  useEffect(() => {
    if (mounted && totalCells > 0 && finishedCells >= totalCells) {
      setPhase("results");
      router.push("/diwaniyya/results");
    }
  }, [mounted, finishedCells, totalCells, router, setPhase]);

  // جلب صور التصنيفات
  useEffect(() => {
    const ids = players.map((p) => p.categoryId);
    ids.forEach((catId) => {
      if (categoryImages[catId] !== undefined) return;
      setCategoryImages((prev) => ({ ...prev, [catId]: null }));
      fetch(`/api/category-image?id=${catId}`)
        .then((r) => r.json())
        .then((data: { url: string | null }) => {
          setCategoryImages((prev) => ({ ...prev, [catId]: data.url }));
        })
        .catch(() => undefined);
    });
  }, [players]); // eslint-disable-line

  if (!mounted) return null;
  if (players.length === 0) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <Button onClick={() => router.push("/diwaniyya/setup")}>
          ابدأ من البداية
        </Button>
      </main>
    );
  }

  const activePlayer = players[currentIdx];
  const activeColor =
    TEAM_COLORS.find((c) => c.id === activePlayer?.color) ?? TEAM_COLORS[0];

  const onCellClick = (playerId: string, diff: QuestionDifficulty) => {
    if (playerId !== activePlayer.id) return; // فقط اللاعب صاحب الدور
    const cellId = `${playerId}_${diff}`;
    if (answered.includes(cellId)) return;
    setSelectedCell(cellId);
    router.push(`/diwaniyya/question?cell=${cellId}`);
  };

  const handleQuit = () => {
    resetGame();
    router.push("/");
  };

  // ترتيب اللاعبين حسب النقاط
  const ranked = [...players].sort((a, b) => b.score - a.score);

  return (
    <main className="min-h-screen bg-mesh">
      <header className="px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <Logo size="sm" />
        <div className="flex items-center gap-2">
          <UserMenu />
          <Button
            variant="ghost"
            size="sm"
            icon={<X className="w-4 h-4" />}
            onClick={() => setShowExitConfirm(true)}
          >
            إنهاء
          </Button>
        </div>
      </header>

      {/* مؤشر الدور */}
      <div className="max-w-7xl mx-auto px-5 mb-3">
        <div
          className="rounded-2xl px-4 py-2.5 flex items-center justify-between shadow-md"
          style={{ backgroundColor: activeColor.hex }}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <span className="text-2xl">{activePlayer.avatar}</span>
            <div>
              <div className="text-white/70 text-[10px] font-bold uppercase tracking-wider">
                دور
              </div>
              <div className="text-white text-base font-bold">
                {activePlayer.name}
              </div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-white/50 animate-bounce" />
        </div>
      </div>

      {/* بطاقات اللاعبين */}
      <div className="max-w-7xl mx-auto px-5 mb-5">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          {ranked.map((player, idx) => (
            <MiniScoreCard
              key={player.id}
              player={player}
              rank={idx + 1}
              isActive={player.id === activePlayer.id}
              onAdd={() => addDiwaniyyaScore(player.id, 100)}
              onSub={() => addDiwaniyyaScore(player.id, -100)}
            />
          ))}
        </div>
      </div>

      {/* بطاقات اللاعبين الكاملة - تصنيف + خلايا النقاط */}
      <div className="max-w-7xl mx-auto px-4 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {players.map((player) => (
            <PlayerCard
              key={player.id}
              player={player}
              isActive={player.id === activePlayer.id}
              activeColor={activeColor.hex}
              answered={answered}
              coverImage={categoryImages[player.categoryId]}
              onCellClick={onCellClick}
            />
          ))}
        </div>
      </div>

      {/* نافذة تأكيد الخروج */}
      {showExitConfirm && (
        <div className="fixed inset-0 bg-ink-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full">
            <h3 className="text-xl font-black mb-2">تأكيد الخروج</h3>
            <p className="text-ink-500 text-sm mb-5">
              لو خرجت الحين، راح تنحذف اللعبة. متأكد؟
            </p>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => setShowExitConfirm(false)}
              >
                لا، رجوع
              </Button>
              <Button
                variant="danger"
                className="flex-1"
                onClick={handleQuit}
                icon={<Home className="w-4 h-4" />}
              >
                نعم، اخرج
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function MiniScoreCard({
  player,
  rank,
  isActive,
  onAdd,
  onSub,
}: {
  player: { id: string; name: string; color: string; avatar: string; score: number };
  rank: number;
  isActive: boolean;
  onAdd: () => void;
  onSub: () => void;
}) {
  const color = TEAM_COLORS.find((c) => c.id === player.color) ?? TEAM_COLORS[0];
  return (
    <div
      className={cn(
        "rounded-xl p-2 transition-all",
        isActive ? "shadow-md" : "opacity-80",
      )}
      style={{
        backgroundColor: isActive ? color.hex : "white",
        border: `1.5px solid ${color.hex}`,
      }}
    >
      <div className="flex items-center justify-between gap-1.5">
        <div className="flex items-center gap-1.5 min-w-0">
          {rank === 1 && (
            <Trophy
              className={cn(
                "w-3.5 h-3.5 shrink-0",
                isActive ? "text-gold-200" : "text-gold-500",
              )}
            />
          )}
          <span className="text-lg shrink-0">{player.avatar}</span>
          <div
            className={cn(
              "text-xs font-bold truncate",
              isActive ? "text-white" : "text-ink-800",
            )}
          >
            {player.name}
          </div>
        </div>
        <div
          className={cn(
            "text-base font-black tabular-nums shrink-0",
            isActive ? "text-white" : "",
          )}
          style={isActive ? undefined : { color: color.hex }}
        >
          {formatPoints(player.score)}
        </div>
      </div>
      <div className="flex gap-1 mt-1">
        <button
          onClick={onSub}
          className={cn(
            "flex-1 h-5 rounded text-xs font-black flex items-center justify-center transition active:scale-90",
            isActive
              ? "bg-white/20 hover:bg-white/30 text-white"
              : "bg-ink-100 hover:bg-ink-200 text-ink-600",
          )}
        >
          <Minus className="w-3 h-3" strokeWidth={3} />
        </button>
        <button
          onClick={onAdd}
          className={cn(
            "flex-1 h-5 rounded text-xs font-black flex items-center justify-center transition active:scale-90",
            isActive
              ? "bg-white/20 hover:bg-white/30 text-white"
              : "bg-ink-100 hover:bg-ink-200 text-ink-600",
          )}
        >
          <Plus className="w-3 h-3" strokeWidth={3} />
        </button>
      </div>
    </div>
  );
}

function PlayerCard({
  player,
  isActive,
  activeColor,
  answered,
  coverImage,
  onCellClick,
}: {
  player: { id: string; name: string; color: string; avatar: string; categoryId: string };
  isActive: boolean;
  activeColor: string;
  answered: string[];
  coverImage: string | null | undefined;
  onCellClick: (playerId: string, diff: QuestionDifficulty) => void;
}) {
  const cat = CATEGORY_BY_ID[player.categoryId];
  const color = TEAM_COLORS.find((c) => c.id === player.color) ?? TEAM_COLORS[0];
  if (!cat) return null;

  return (
    <div
      className={cn(
        "bg-white rounded-2xl overflow-hidden border-2 transition",
        isActive ? "shadow-xl scale-[1.02]" : "border-ink-100 opacity-90",
      )}
      style={isActive ? { borderColor: color.hex } : undefined}
    >
      <div
        className={cn(
          "relative h-24 flex items-end p-3 overflow-hidden bg-gradient-to-br",
          cat.gradient,
        )}
      >
        {coverImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverImage}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-50"
            loading="lazy"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/10" />
        <div className="relative flex items-center gap-2 w-full">
          <span className="text-2xl">{player.avatar}</span>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] text-white/70 font-bold uppercase">
              {player.name}
            </div>
            <div className="font-black text-sm text-white truncate">
              {cat.name}
            </div>
          </div>
          {isActive && (
            <span className="text-[10px] bg-white text-ink-900 px-1.5 py-0.5 rounded-full font-black animate-pulse">
              دوره
            </span>
          )}
        </div>
      </div>

      <div className="p-2 grid grid-cols-3 gap-1.5">
        {DIFFICULTIES.map((diff) => {
          const cellId = `${player.id}_${diff}`;
          const isAnswered = answered.includes(cellId);
          const canClick = isActive && !isAnswered;
          return (
            <button
              key={diff}
              onClick={() => onCellClick(player.id, diff)}
              disabled={!canClick}
              className={cn(
                "py-2.5 rounded-lg font-black text-sm transition-all",
                isAnswered && "opacity-25 line-through cursor-not-allowed",
                !canClick && !isAnswered && "opacity-50 cursor-not-allowed",
                canClick && "hover:scale-105 active:scale-95",
              )}
              style={
                isAnswered
                  ? { backgroundColor: "#f4f5f8", color: "#9aa1b8" }
                  : canClick
                    ? { backgroundColor: `${activeColor}15`, color: activeColor }
                    : { backgroundColor: `${color.hex}10`, color: color.hex }
              }
            >
              {formatPoints(diff)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
