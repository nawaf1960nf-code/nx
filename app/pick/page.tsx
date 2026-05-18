"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/Button";
import { UserMenu } from "@/components/UserMenu";
import { useGameStore } from "@/lib/store";
import {
  CATEGORIES,
  CATEGORY_GROUPS,
  CATEGORIES_PER_TEAM,
} from "@/lib/categories-data";
import { HOOKS, HOOKS_PER_TEAM } from "@/lib/hooks-data";
import { TEAM_COLORS, cn } from "@/lib/utils";
import type { CategoryGroup, HookId } from "@/lib/types";
import {
  ArrowLeft,
  ChevronLeft,
  Check,
  Clock,
  Zap,
  Image as ImageIcon,
  Volume2,
} from "lucide-react";

type ActiveTeam = "team_a" | "team_b";

export default function PickPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const teamA = useGameStore((s) => s.teamA);
  const teamB = useGameStore((s) => s.teamB);
  const toggleCategory = useGameStore((s) => s.toggleCategory);
  const toggleHook = useGameStore((s) => s.toggleHook);
  const setPhase = useGameStore((s) => s.setPhase);

  const [activeTeam, setActiveTeam] = useState<ActiveTeam>("team_a");
  const [activeGroup, setActiveGroup] = useState<CategoryGroup>("party_games");

  useEffect(() => setMounted(true), []);

  const team = activeTeam === "team_a" ? teamA : teamB;
  const otherTeam = activeTeam === "team_a" ? teamB : teamA;
  const colorObj =
    TEAM_COLORS.find((c) => c.id === team.color) ?? TEAM_COLORS[0];

  const visibleCats = useMemo(
    () => CATEGORIES.filter((c) => c.group === activeGroup),
    [activeGroup],
  );

  if (!mounted) return null;

  const aDone =
    teamA.selectedCategories.length === CATEGORIES_PER_TEAM &&
    teamA.hooks.length === HOOKS_PER_TEAM;
  const bDone =
    teamB.selectedCategories.length === CATEGORIES_PER_TEAM &&
    teamB.hooks.length === HOOKS_PER_TEAM;
  const canStart = aDone && bDone;

  const handleStart = () => {
    setPhase("board");
    router.push("/game");
  };

  return (
    <main className="min-h-screen bg-mesh pb-44">
      {/* الهيدر */}
      <header className="px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <Logo size="md" />
        <div className="flex items-center gap-3">
          <UserMenu />
          <Link href="/setup">
            <Button
              variant="ghost"
              size="sm"
              icon={<ArrowLeft className="w-4 h-4" />}
            >
              رجوع
            </Button>
          </Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 md:px-6">
        {/* تبويبات الفرق */}
        <div className="bg-white rounded-3xl border-2 border-ink-100 p-2 mb-6 grid grid-cols-2 gap-2">
          <TeamTab
            team={teamA}
            isActive={activeTeam === "team_a"}
            isDone={aDone}
            onClick={() => setActiveTeam("team_a")}
          />
          <TeamTab
            team={teamB}
            isActive={activeTeam === "team_b"}
            isDone={bDone}
            onClick={() => setActiveTeam("team_b")}
          />
        </div>

        {/* مؤشر التقدم للفريق النشط */}
        <div className="bg-white rounded-3xl border-2 border-ink-100 p-4 mb-6 flex items-center gap-4">
          <ProgressDot
            label="تصنيفات"
            current={team.selectedCategories.length}
            target={CATEGORIES_PER_TEAM}
            color={colorObj.hex}
          />
          <div className="w-px h-10 bg-ink-100" />
          <ProgressDot
            label="قدرات"
            current={team.hooks.length}
            target={HOOKS_PER_TEAM}
            color={colorObj.hex}
          />
        </div>

        {/* قسم: التصنيفات */}
        <Section
          title="اختار ٣ تصنيفات"
          subtitle={`${team.selectedCategories.length}/${CATEGORIES_PER_TEAM} مختار`}
        >
          {/* تابات المجموعات */}
          <div className="flex overflow-x-auto gap-2 pb-3 mb-4 -mx-2 px-2 scrollbar-hide">
            {(
              Object.entries(CATEGORY_GROUPS) as [
                CategoryGroup,
                { name: string; icon: string },
              ][]
            )
              .filter(([k]) => k !== "special_daily")
              .map(([key, info]) => {
                const isActive = activeGroup === key;
                return (
                  <button
                    key={key}
                    onClick={() => setActiveGroup(key as CategoryGroup)}
                    className={cn(
                      "shrink-0 px-4 py-2 rounded-full font-bold transition whitespace-nowrap text-sm",
                      isActive
                        ? "bg-ink-800 text-white shadow-lg"
                        : "bg-white text-ink-600 border border-ink-200 hover:border-ink-400",
                    )}
                  >
                    <span className="ml-1.5">{info.icon}</span>
                    {info.name}
                  </button>
                );
              })}
          </div>

          {/* شبكة التصنيفات */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {visibleCats.map((cat) => {
              const selected = team.selectedCategories.includes(cat.id);
              const usedByOther = otherTeam.selectedCategories.includes(cat.id);
              const blocked =
                !selected &&
                team.selectedCategories.length >= CATEGORIES_PER_TEAM;

              return (
                <button
                  key={cat.id}
                  disabled={usedByOther || blocked}
                  onClick={() => toggleCategory(activeTeam, cat.id)}
                  className={cn(
                    "group relative aspect-[3/4] rounded-2xl overflow-hidden text-right transition-all",
                    "disabled:cursor-not-allowed",
                    !selected && !usedByOther && !blocked && "hover:scale-105 hover:shadow-2xl",
                    selected && "scale-105 shadow-2xl ring-4 ring-offset-2",
                    (usedByOther || blocked) && "opacity-40 grayscale",
                  )}
                  style={
                    selected
                      ? ({ "--tw-ring-color": colorObj.hex } as React.CSSProperties)
                      : undefined
                  }
                >
                  {/* خلفية بتدرج لوني */}
                  <div
                    className={cn(
                      "absolute inset-0 bg-gradient-to-br",
                      cat.gradient,
                    )}
                  />
                  {/* تأثير زجاجي */}
                  <div className="absolute inset-0 bg-black/10" />

                  {/* المحتوى */}
                  <div className="relative h-full flex flex-col justify-between p-3">
                    <div className="flex items-start justify-between">
                      <div className="text-4xl md:text-5xl drop-shadow-lg">
                        {cat.icon}
                      </div>
                      {selected && (
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center text-white shadow-lg"
                          style={{ backgroundColor: colorObj.hex }}
                        >
                          <Check className="w-4 h-4" strokeWidth={3} />
                        </div>
                      )}
                      {usedByOther && (
                        <span className="text-[10px] font-bold bg-black/60 text-white px-2 py-0.5 rounded-full backdrop-blur">
                          مأخوذ
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="font-black text-sm md:text-base text-white leading-tight drop-shadow-md">
                        {cat.name}
                      </div>
                      <div className="flex gap-1 mt-1.5">
                        {cat.hasImages && (
                          <span className="inline-flex items-center bg-white/20 backdrop-blur text-white px-1.5 py-0.5 rounded-full text-[10px] font-bold">
                            <ImageIcon className="w-2.5 h-2.5" />
                          </span>
                        )}
                        {cat.hasAudio && (
                          <span className="inline-flex items-center bg-white/20 backdrop-blur text-white px-1.5 py-0.5 rounded-full text-[10px] font-bold">
                            <Volume2 className="w-2.5 h-2.5" />
                          </span>
                        )}
                        {cat.gameMode === "charades" && (
                          <span className="bg-yellow-400 text-zinc-900 px-1.5 py-0.5 rounded-full text-[10px] font-black">
                            جديد ✨
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </Section>

        {/* قسم: القدرات */}
        <Section
          title="اختار ٤ قدرات"
          subtitle={`${team.hooks.length}/${HOOKS_PER_TEAM} مختار`}
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {HOOKS.map((hook) => {
              const selected = team.hooks.includes(hook.id);
              const blocked = !selected && team.hooks.length >= HOOKS_PER_TEAM;

              return (
                <button
                  key={hook.id}
                  disabled={blocked}
                  onClick={() => toggleHook(activeTeam, hook.id as HookId)}
                  className={cn(
                    "relative p-4 rounded-2xl border-2 text-right transition-all bg-white",
                    selected && "shadow-lg scale-105",
                    blocked && "opacity-40 cursor-not-allowed",
                  )}
                  style={
                    selected
                      ? {
                          borderColor: colorObj.hex,
                          backgroundColor: `${colorObj.hex}10`,
                        }
                      : { borderColor: "#e5e7ef" }
                  }
                >
                  {selected && (
                    <div
                      className="absolute top-2 left-2 w-6 h-6 rounded-full flex items-center justify-center text-white shadow"
                      style={{ backgroundColor: colorObj.hex }}
                    >
                      <Check className="w-4 h-4" strokeWidth={3} />
                    </div>
                  )}

                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-2"
                    style={{ backgroundColor: `${hook.color}15` }}
                  >
                    {hook.icon}
                  </div>
                  <div className="font-black text-sm mb-1">{hook.name}</div>
                  <p className="text-xs text-ink-500 leading-snug mb-2 line-clamp-2">
                    {hook.description}
                  </p>
                  <span
                    className={cn(
                      "inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full",
                      hook.timing === "before_question"
                        ? "bg-warn-500/10 text-warn-500"
                        : "bg-primary-500/10 text-primary-700",
                    )}
                  >
                    {hook.timing === "before_question" ? (
                      <>
                        <Zap className="w-2.5 h-2.5" />
                        قبل
                      </>
                    ) : (
                      <>
                        <Clock className="w-2.5 h-2.5" />
                        بعد
                      </>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </Section>
      </div>

      {/* شريط سفلي */}
      <div className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-ink-100 shadow-2xl">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex gap-3">
            <TeamSummary team={teamA} done={aDone} />
            <TeamSummary team={teamB} done={bDone} />
          </div>
          <Button
            size="lg"
            onClick={handleStart}
            disabled={!canStart}
            icon={<ChevronLeft className="w-5 h-5" />}
          >
            {canStart ? "ابدأ اللعبة!" : "أكمل الاختيارات"}
          </Button>
        </div>
      </div>
    </main>
  );
}

function TeamTab({
  team,
  isActive,
  isDone,
  onClick,
}: {
  team: { name: string; color: string; selectedCategories: string[]; hooks: HookId[] };
  isActive: boolean;
  isDone: boolean;
  onClick: () => void;
}) {
  const color = TEAM_COLORS.find((c) => c.id === team.color) ?? TEAM_COLORS[0];
  return (
    <button
      onClick={onClick}
      className={cn(
        "p-3 rounded-2xl border-2 transition-all text-right",
        isActive ? "shadow-lg" : "border-transparent hover:bg-ink-50",
      )}
      style={
        isActive
          ? { borderColor: color.hex, backgroundColor: `${color.hex}10` }
          : undefined
      }
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className="w-3 h-3 rounded-full shrink-0"
            style={{ backgroundColor: color.hex }}
          />
          <div className="font-black truncate text-base md:text-lg">
            {team.name}
          </div>
        </div>
        {isDone && (
          <span className="bg-primary-500 text-white rounded-full w-6 h-6 flex items-center justify-center shrink-0">
            <Check className="w-4 h-4" strokeWidth={3} />
          </span>
        )}
      </div>
      <div className="text-xs text-ink-500 mt-1">
        {team.selectedCategories.length}/{CATEGORIES_PER_TEAM} تصنيفات •{" "}
        {team.hooks.length}/{HOOKS_PER_TEAM} قدرات
      </div>
    </button>
  );
}

function ProgressDot({
  label,
  current,
  target,
  color,
}: {
  label: string;
  current: number;
  target: number;
  color: string;
}) {
  const done = current === target;
  return (
    <div className="flex items-center gap-3 flex-1">
      <div
        className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center font-black text-sm transition",
          done ? "text-white" : "bg-ink-100 text-ink-600",
        )}
        style={done ? { backgroundColor: color } : undefined}
      >
        {done ? <Check className="w-5 h-5" strokeWidth={3} /> : `${current}/${target}`}
      </div>
      <div>
        <div className="text-xs text-ink-400 font-bold">{label}</div>
        <div className="text-sm font-bold">{done ? "اكتمل" : "جارٍ الاختيار..."}</div>
      </div>
    </div>
  );
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-8">
      <div className="flex items-baseline justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-black">{title}</h2>
        <span className="text-sm font-bold text-ink-500">{subtitle}</span>
      </div>
      {children}
    </section>
  );
}

function TeamSummary({
  team,
  done,
}: {
  team: { name: string; color: string };
  done: boolean;
}) {
  const color = TEAM_COLORS.find((c) => c.id === team.color) ?? TEAM_COLORS[0];
  return (
    <div
      className={cn(
        "px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5",
        done ? "text-white" : "text-ink-600 bg-ink-100",
      )}
      style={done ? { backgroundColor: color.hex } : undefined}
    >
      {done && <Check className="w-3 h-3" strokeWidth={3} />}
      <span className="hidden sm:inline">{team.name}</span>
      <span className="sm:hidden">
        {team.name.slice(0, 8)}
        {team.name.length > 8 ? "…" : ""}
      </span>
    </div>
  );
}
