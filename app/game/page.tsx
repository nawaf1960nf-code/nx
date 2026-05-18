"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/Button";
import { UserMenu } from "@/components/UserMenu";
import { useGameStore } from "@/lib/store";
import { CATEGORY_BY_ID } from "@/lib/categories-data";
import { HOOK_BY_ID } from "@/lib/hooks-data";
import { TEAM_COLORS, cn, formatPoints } from "@/lib/utils";
import { Home, X, ArrowRight } from "lucide-react";
import type { QuestionDifficulty } from "@/lib/types";

const DIFFICULTIES: QuestionDifficulty[] = [200, 400, 600];
const QUESTIONS_PER_DIFFICULTY = 2;

export default function GameBoardPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [categoryImages, setCategoryImages] = useState<Record<string, string | null>>({});

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

  // كل تصنيف = ٦ خلايا (سؤالين لكل صعوبة)
  const totalCells = allCategories.length * 3 * QUESTIONS_PER_DIFFICULTY;
  const finishedCells = answeredQuestions.length;

  useEffect(() => {
    if (mounted && totalCells > 0 && finishedCells >= totalCells) {
      setPhase("results");
      router.push("/results");
    }
  }, [mounted, finishedCells, totalCells, router, setPhase]);

  // جلب صور التصنيفات
  useEffect(() => {
    allCategories.forEach((catId) => {
      if (categoryImages[catId] !== undefined) return;
      setCategoryImages((prev) => ({ ...prev, [catId]: null }));
      fetch(`/api/category-image?id=${catId}`)
        .then((r) => r.json())
        .then((data: { url: string | null }) => {
          setCategoryImages((prev) => ({ ...prev, [catId]: data.url }));
        })
        .catch(() => undefined);
    });
  }, [allCategories]); // eslint-disable-line

  if (!mounted) return null;

  const activeTeam = currentTurn === "team_a" ? teamA : teamB;
  const activeColor =
    TEAM_COLORS.find((c) => c.id === activeTeam.color) ?? TEAM_COLORS[0];

  const onCellClick = (
    categoryId: string,
    diff: QuestionDifficulty,
    idx: number,
  ) => {
    const cellId = `${categoryId}_${diff}_${idx}`;
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
        </div>
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

      {/* مؤشر الدور البارز */}
      <div className="max-w-7xl mx-auto px-6 mb-4">
        <div
          className="rounded-3xl p-4 flex items-center justify-between shadow-lg"
          style={{
            backgroundColor: activeColor.hex,
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
            <div>
              <div className="text-white/80 text-xs font-bold">دور الآن</div>
              <div className="text-white text-xl md:text-2xl font-black">
                {activeTeam.name}
              </div>
            </div>
          </div>
          <ArrowRight className="w-6 h-6 text-white/50 animate-bounce" />
        </div>
      </div>

      {/* لوحة النتائج */}
      <div className="max-w-7xl mx-auto px-6 mb-6">
        <div className="grid grid-cols-2 gap-3">
          <TeamBar team={teamA} active={currentTurn === "team_a"} />
          <TeamBar team={teamB} active={currentTurn === "team_b"} />
        </div>
      </div>

      {/* شبكة التصنيفات */}
      <div className="max-w-7xl mx-auto px-4 pb-40">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {allCategories.map((catId) => (
            <CategoryCard
              key={catId}
              categoryId={catId}
              answeredQuestions={answeredQuestions}
              activeColor={activeColor.hex}
              coverImage={categoryImages[catId]}
              onCellClick={onCellClick}
            />
          ))}
        </div>
      </div>

      {/* شريط الهوكات */}
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
  team: { name: string; color: string; avatar: string; score: number };
  active: boolean;
}) {
  const color = TEAM_COLORS.find((c) => c.id === team.color) ?? TEAM_COLORS[0];
  return (
    <div
      className={cn(
        "rounded-2xl p-3 md:p-4 transition-all",
        active ? "shadow-xl scale-[1.02]" : "opacity-80",
      )}
      style={{
        backgroundColor: active ? color.hex : "white",
        border: `2px solid ${color.hex}`,
      }}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div
            className={cn(
              "w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center text-2xl md:text-3xl shrink-0",
              active ? "bg-white/20" : "",
            )}
            style={active ? undefined : { backgroundColor: `${color.hex}20` }}
          >
            {team.avatar || "🎯"}
          </div>
          <div className="min-w-0">
            <div
              className={cn(
                "text-[10px] md:text-xs font-bold mb-0.5 truncate",
                active ? "text-white/80" : "text-ink-500",
              )}
            >
              {active ? "يلعب الآن" : "بانتظار"}
            </div>
            <div
              className={cn(
                "text-sm md:text-lg font-black truncate",
                active ? "text-white" : "text-ink-800",
              )}
            >
              {team.name}
            </div>
          </div>
        </div>
        <div
          className={cn(
            "text-xl md:text-3xl font-black tabular-nums shrink-0",
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

function CategoryCard({
  categoryId,
  answeredQuestions,
  activeColor,
  coverImage,
  onCellClick,
}: {
  categoryId: string;
  answeredQuestions: string[];
  activeColor: string;
  coverImage: string | null | undefined;
  onCellClick: (catId: string, diff: QuestionDifficulty, idx: number) => void;
}) {
  const cat = CATEGORY_BY_ID[categoryId];
  if (!cat) return null;

  return (
    <div className="bg-white rounded-3xl border-2 border-ink-100 overflow-hidden shadow-sm">
      <div
        className={cn(
          "relative h-20 md:h-24 flex items-end p-3 overflow-hidden bg-gradient-to-br",
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
        <div className="relative flex items-center gap-2">
          <span className="text-2xl drop-shadow-lg">{cat.icon}</span>
          <span className="font-black text-sm md:text-base text-white leading-tight drop-shadow-md">
            {cat.name}
          </span>
        </div>
      </div>

      {/* الخلايا: ٣ صفوف × سؤالين لكل صعوبة */}
      <div className="p-2 space-y-1.5">
        {DIFFICULTIES.map((diff) => (
          <div key={diff} className="grid grid-cols-2 gap-1.5">
            {Array.from({ length: QUESTIONS_PER_DIFFICULTY }).map((_, idx) => {
              const cellId = `${categoryId}_${diff}_${idx}`;
              const answered = answeredQuestions.includes(cellId);
              return (
                <button
                  key={idx}
                  onClick={() => onCellClick(categoryId, diff, idx)}
                  disabled={answered}
                  className={cn(
                    "py-2.5 md:py-3 rounded-xl font-black text-sm md:text-base transition-all",
                    "disabled:opacity-25 disabled:cursor-not-allowed disabled:line-through",
                    !answered && "hover:scale-105 active:scale-95 hover:shadow-md",
                  )}
                  style={
                    answered
                      ? { backgroundColor: "#f4f5f8", color: "#9aa1b8" }
                      : { backgroundColor: `${activeColor}15`, color: activeColor }
                  }
                >
                  {formatPoints(diff)}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
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
      <div className="text-xs font-bold text-ink-500 mb-1 px-1 truncate">
        {team.name}
      </div>
      <div className="flex gap-1.5 flex-wrap">
        {team.hooks.map((hookId) => {
          const hook = HOOK_BY_ID[hookId];
          if (!hook) return null;
          const used = team.usedHooks.includes(hookId);
          return (
            <div
              key={hookId}
              title={hook.name}
              className={cn(
                "w-9 h-9 rounded-xl flex items-center justify-center text-lg transition",
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
