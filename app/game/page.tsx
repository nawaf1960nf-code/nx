"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/Button";
import { useGameStore } from "@/lib/store";
import { CATEGORY_BY_ID } from "@/lib/categories-data";
import { HOOK_BY_ID } from "@/lib/hooks-data";
import { TEAM_COLORS, cn, formatPoints } from "@/lib/utils";
import { Home, X } from "lucide-react";
import type { QuestionDifficulty } from "@/lib/types";

const DIFFICULTIES: QuestionDifficulty[] = [200, 400, 600];

export default function GameBoardPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const teamA = useGameStore((s) => s.teamA);
  const teamB = useGameStore((s) => s.teamB);
  const currentTurn = useGameStore((s) => s.currentTurn);
  const answeredQuestions = useGameStore((s) => s.answeredQuestions);
  const setSelectedCell = useGameStore((s) => s.setSelectedCell);
  const resetGame = useGameStore((s) => s.resetGame);
  const setPhase = useGameStore((s) => s.setPhase);

  useEffect(() => setMounted(true), []);

  const allCategories = useMemo(
    () => [...teamA.selectedCategories, ...teamB.selectedCategories],
    [teamA.selectedCategories, teamB.selectedCategories],
  );

  const totalCells = allCategories.length * 6; // 6 خلايا لكل تصنيف (3 نقاط × فريقين)
  const finishedCells = answeredQuestions.length;

  useEffect(() => {
    if (mounted && totalCells > 0 && finishedCells >= totalCells) {
      setPhase("results");
      router.push("/results");
    }
  }, [mounted, finishedCells, totalCells, router, setPhase]);

  if (!mounted) return null;

  const activeTeam = currentTurn === "team_a" ? teamA : teamB;
  const activeColor =
    TEAM_COLORS.find((c) => c.id === activeTeam.color) ?? TEAM_COLORS[0];

  const onCellClick = (categoryId: string, diff: QuestionDifficulty, team: "team_a" | "team_b") => {
    const cellId = `${categoryId}_${diff}_${team}`;
    if (answeredQuestions.includes(cellId)) return;
    setSelectedCell(cellId);
    router.push(`/question?cell=${cellId}`);
  };

  const handleQuit = () => {
    resetGame();
    router.push("/");
  };

  return (
    <main className="min-h-screen bg-mesh">
      {/* الهيدر */}
      <header className="px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <Logo size="sm" />
          <div
            className="hidden sm:flex items-center gap-2 px-4 py-1.5 rounded-full font-bold text-white text-sm"
            style={{ backgroundColor: activeColor.hex }}
          >
            دور: {activeTeam.name}
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          icon={<X className="w-4 h-4" />}
          onClick={() => setShowExitConfirm(true)}
        >
          إنهاء اللعبة
        </Button>
      </header>

      {/* لوحة النتائج العلوية */}
      <div className="max-w-7xl mx-auto px-6 mb-6">
        <div className="grid grid-cols-2 gap-3">
          <TeamBar team={teamA} active={currentTurn === "team_a"} />
          <TeamBar team={teamB} active={currentTurn === "team_b"} />
        </div>
      </div>

      {/* شبكة التصنيفات */}
      <div className="max-w-7xl mx-auto px-4 pb-32">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {allCategories.map((catId) => (
            <CategoryColumn
              key={catId}
              categoryId={catId}
              answeredQuestions={answeredQuestions}
              teamA={teamA}
              teamB={teamB}
              onCellClick={onCellClick}
            />
          ))}
        </div>
      </div>

      {/* شريط الهوكات السفلي */}
      <div className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-ink-100">
        <div className="max-w-7xl mx-auto px-4 py-3 grid grid-cols-2 gap-3">
          <TeamHooksBar team={teamA} active={currentTurn === "team_a"} />
          <TeamHooksBar team={teamB} active={currentTurn === "team_b"} />
        </div>
      </div>

      {/* نافذة تأكيد الخروج */}
      {showExitConfirm && (
        <div className="fixed inset-0 bg-ink-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-black mb-2">تأكيد الخروج</h3>
            <p className="text-ink-500 mb-6">
              لو خرجت الحين، راح تنحذف اللعبة كلها. متأكد؟
            </p>
            <div className="flex gap-3">
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

function TeamBar({
  team,
  active,
}: {
  team: { name: string; color: string; score: number };
  active: boolean;
}) {
  const color = TEAM_COLORS.find((c) => c.id === team.color) ?? TEAM_COLORS[0];
  return (
    <div
      className={cn(
        "rounded-2xl p-4 transition-all",
        active ? "shadow-xl scale-[1.02]" : "opacity-70",
      )}
      style={{
        backgroundColor: active ? color.hex : "white",
        border: `2px solid ${color.hex}`,
      }}
    >
      <div className="flex items-center justify-between">
        <div>
          <div
            className={cn(
              "text-sm font-bold mb-1",
              active ? "text-white/80" : "text-ink-500",
            )}
          >
            {active ? "🎯 دور الآن" : "بانتظار"}
          </div>
          <div
            className={cn(
              "text-xl font-black",
              active ? "text-white" : "text-ink-800",
            )}
          >
            {team.name}
          </div>
        </div>
        <div
          className={cn(
            "text-4xl font-black tabular-nums",
            active ? "text-white" : "",
          )}
          style={active ? undefined : { color: color.hex }}
        >
          {formatPoints(team.score)}
        </div>
      </div>
    </div>
  );
}

function CategoryColumn({
  categoryId,
  answeredQuestions,
  teamA,
  teamB,
  onCellClick,
}: {
  categoryId: string;
  answeredQuestions: string[];
  teamA: { color: string };
  teamB: { color: string };
  onCellClick: (
    catId: string,
    diff: QuestionDifficulty,
    team: "team_a" | "team_b",
  ) => void;
}) {
  const cat = CATEGORY_BY_ID[categoryId];
  if (!cat) return null;

  return (
    <div className="bg-white rounded-3xl border-2 border-ink-100 overflow-hidden">
      {/* رأس البطاقة */}
      <div className="p-3 text-center bg-gradient-to-br from-primary-50 to-white border-b border-ink-100">
        <div className="text-3xl mb-1">{cat.icon}</div>
        <div className="font-black text-sm md:text-base text-ink-800 leading-tight">
          {cat.name}
        </div>
      </div>

      {/* الخلايا */}
      <div className="p-2 space-y-1">
        {DIFFICULTIES.map((diff) => (
          <div key={diff} className="grid grid-cols-2 gap-1">
            <Cell
              answered={answeredQuestions.includes(
                `${categoryId}_${diff}_team_a`,
              )}
              points={diff}
              color={TEAM_COLORS.find((c) => c.id === teamA.color)?.hex || "#00c853"}
              onClick={() => onCellClick(categoryId, diff, "team_a")}
            />
            <Cell
              answered={answeredQuestions.includes(
                `${categoryId}_${diff}_team_b`,
              )}
              points={diff}
              color={TEAM_COLORS.find((c) => c.id === teamB.color)?.hex || "#e53935"}
              onClick={() => onCellClick(categoryId, diff, "team_b")}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function Cell({
  answered,
  points,
  color,
  onClick,
}: {
  answered: boolean;
  points: number;
  color: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={answered}
      className={cn(
        "py-3 rounded-xl font-black text-base md:text-lg transition-all",
        "disabled:opacity-25 disabled:cursor-not-allowed disabled:line-through",
        !answered && "hover:scale-105 active:scale-95",
      )}
      style={
        answered
          ? { backgroundColor: "#f4f5f8", color: "#9aa1b8" }
          : { backgroundColor: `${color}15`, color }
      }
    >
      {formatPoints(points)}
    </button>
  );
}

function TeamHooksBar({
  team,
  active,
}: {
  team: { name: string; color: string; hooks: string[]; usedHooks: string[] };
  active: boolean;
}) {
  const color = TEAM_COLORS.find((c) => c.id === team.color) ?? TEAM_COLORS[0];
  return (
    <div
      className={cn(
        "rounded-2xl p-2 border-2",
        active ? "border-current" : "border-ink-100 opacity-60",
      )}
      style={active ? { borderColor: color.hex } : undefined}
    >
      <div className="text-xs font-bold text-ink-500 mb-1 px-1">
        {team.name}
      </div>
      <div className="flex gap-2 flex-wrap">
        {team.hooks.map((hookId) => {
          const hook = HOOK_BY_ID[hookId];
          if (!hook) return null;
          const used = team.usedHooks.includes(hookId);
          return (
            <div
              key={hookId}
              title={hook.name}
              className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center text-lg transition",
                used ? "bg-ink-100 opacity-40 grayscale" : "",
              )}
              style={used ? undefined : { backgroundColor: `${hook.color}20` }}
            >
              {hook.icon}
            </div>
          );
        })}
      </div>
    </div>
  );
}
