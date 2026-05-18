"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/Button";
import { UserMenu } from "@/components/UserMenu";
import { useGameStore } from "@/lib/store";
import { TEAM_COLORS, cn } from "@/lib/utils";
import { ArrowLeft, ChevronLeft, Users, Brain, Hand, Layers } from "lucide-react";
import type { JudgingMode } from "@/lib/types";

export default function SetupPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const teamA = useGameStore((s) => s.teamA);
  const teamB = useGameStore((s) => s.teamB);
  const settings = useGameStore((s) => s.settings);

  const setTeamName = useGameStore((s) => s.setTeamName);
  const setTeamColor = useGameStore((s) => s.setTeamColor);
  const setTeamPlayersCount = useGameStore((s) => s.setTeamPlayersCount);
  const setJudgingMode = useGameStore((s) => s.setJudgingMode);
  const setPhase = useGameStore((s) => s.setPhase);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const canProceed =
    teamA.name.trim().length > 0 &&
    teamB.name.trim().length > 0 &&
    teamA.color !== teamB.color;

  const handleNext = () => {
    setPhase("categories_a");
    router.push("/pick");
  };

  return (
    <main className="min-h-screen bg-mesh">
      {/* الهيدر */}
      <header className="px-6 py-5 flex items-center justify-between max-w-7xl mx-auto">
        <Logo size="md" />
        <div className="flex items-center gap-3">
          <UserMenu />
          <Link href="/">
            <Button variant="ghost" size="sm" icon={<ArrowLeft className="w-4 h-4" />}>
              رجوع
            </Button>
          </Link>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black mb-3">
            جهّز <span className="text-primary-500">الفرق</span>
          </h1>
          <p className="text-ink-500 text-lg">
            اسم كل فريق، لونه، وعدد لاعبيه
          </p>
        </div>

        {/* بطاقتا الفريقين */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <TeamCard
            label="الفريق الأول"
            team={teamA}
            otherColor={teamB.color}
            onName={(v) => setTeamName("team_a", v)}
            onColor={(c) => setTeamColor("team_a", c)}
            onPlayers={(n) => setTeamPlayersCount("team_a", n)}
          />
          <TeamCard
            label="الفريق الثاني"
            team={teamB}
            otherColor={teamA.color}
            onName={(v) => setTeamName("team_b", v)}
            onColor={(c) => setTeamColor("team_b", c)}
            onPlayers={(n) => setTeamPlayersCount("team_b", n)}
          />
        </div>

        {/* وضع التحكيم */}
        <div className="bg-white border-2 border-ink-100 rounded-3xl p-6 mb-10">
          <h2 className="text-xl font-bold mb-1">وضع التحكيم</h2>
          <p className="text-ink-500 text-sm mb-5">
            مين يحكم على الإجابات؟
          </p>
          <div className="grid sm:grid-cols-3 gap-3">
            <JudgeOption
              id="ai"
              active={settings.judgingMode === "ai"}
              onClick={() => setJudgingMode("ai")}
              icon={<Brain className="w-5 h-5" />}
              title="ذكاء اصطناعي"
              desc="Claude يحكم تلقائياً"
            />
            <JudgeOption
              id="manual"
              active={settings.judgingMode === "manual"}
              onClick={() => setJudgingMode("manual")}
              icon={<Hand className="w-5 h-5" />}
              title="يدوي"
              desc="المضيف يقرر بنفسه"
            />
            <JudgeOption
              id="mixed"
              active={settings.judgingMode === "mixed"}
              onClick={() => setJudgingMode("mixed")}
              icon={<Layers className="w-5 h-5" />}
              title="مختلط"
              desc="AI يقترح والمضيف يأكد"
            />
          </div>
        </div>

        {/* زر التالي */}
        <div className="flex justify-end">
          <Button
            size="xl"
            onClick={handleNext}
            disabled={!canProceed}
            icon={<ChevronLeft className="w-5 h-5" />}
          >
            التالي: اختيار التصنيفات
          </Button>
        </div>

        {!canProceed && (
          <p className="text-center text-warn-500 mt-4 font-medium">
            {teamA.color === teamB.color
              ? "اختار لونين مختلفين للفرق"
              : "عبّي أسماء الفريقين"}
          </p>
        )}
      </div>
    </main>
  );
}

function TeamCard({
  label,
  team,
  otherColor,
  onName,
  onColor,
  onPlayers,
}: {
  label: string;
  team: { name: string; color: string; playersCount: number };
  otherColor: string;
  onName: (v: string) => void;
  onColor: (c: string) => void;
  onPlayers: (n: number) => void;
}) {
  const colorObj = TEAM_COLORS.find((c) => c.id === team.color) ?? TEAM_COLORS[0];

  return (
    <div className="bg-white border-2 border-ink-100 rounded-3xl p-6 space-y-5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-ink-400">{label}</span>
        <span
          className="w-8 h-8 rounded-full shrink-0 ring-4 ring-offset-2 ring-offset-white"
          style={{ backgroundColor: colorObj.hex, boxShadow: `0 0 0 4px ${colorObj.hex}30` }}
        />
      </div>

      {/* اسم الفريق */}
      <div>
        <label className="block text-sm font-bold text-ink-600 mb-2">
          اسم الفريق
        </label>
        <input
          type="text"
          value={team.name}
          onChange={(e) => onName(e.target.value)}
          className="w-full px-4 py-3 border-2 border-ink-200 rounded-xl text-lg font-bold focus:border-primary-500 focus:outline-none transition"
          placeholder="مثلاً: الأبطال"
          maxLength={20}
        />
      </div>

      {/* اللون */}
      <div>
        <label className="block text-sm font-bold text-ink-600 mb-2">
          اللون
        </label>
        <div className="flex flex-wrap gap-2">
          {TEAM_COLORS.map((c) => {
            const isUsed = c.id === otherColor;
            const isActive = c.id === team.color;
            return (
              <button
                key={c.id}
                onClick={() => onColor(c.id)}
                disabled={isUsed}
                title={isUsed ? "مستخدم من الفريق الثاني" : c.name}
                className={cn(
                  "w-12 h-12 rounded-2xl transition-all relative",
                  "disabled:opacity-30 disabled:cursor-not-allowed",
                  isActive && "scale-110 ring-4 ring-offset-2 ring-ink-300",
                )}
                style={{ backgroundColor: c.hex }}
              >
                {isActive && (
                  <span className="absolute inset-0 flex items-center justify-center text-white text-xl font-black">
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* عدد اللاعبين */}
      <div>
        <label className="block text-sm font-bold text-ink-600 mb-2">
          <Users className="inline w-4 h-4 ml-1" />
          عدد اللاعبين
        </label>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onPlayers(Math.max(1, team.playersCount - 1))}
            className="w-12 h-12 rounded-xl border-2 border-ink-200 hover:bg-ink-50 font-black text-xl transition"
          >
            −
          </button>
          <div className="flex-1 text-center text-3xl font-black text-ink-800 tabular-nums">
            {team.playersCount}
          </div>
          <button
            onClick={() => onPlayers(Math.min(20, team.playersCount + 1))}
            className="w-12 h-12 rounded-xl border-2 border-ink-200 hover:bg-ink-50 font-black text-xl transition"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}

function JudgeOption({
  active,
  onClick,
  icon,
  title,
  desc,
}: {
  id: JudgingMode;
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "p-4 rounded-2xl border-2 text-right transition-all",
        active
          ? "border-primary-500 bg-primary-50 shadow-lg shadow-primary-500/20"
          : "border-ink-200 hover:border-ink-300 bg-white",
      )}
    >
      <div
        className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center mb-3",
          active ? "bg-primary-500 text-white" : "bg-ink-100 text-ink-600",
        )}
      >
        {icon}
      </div>
      <div className="font-bold text-ink-800 mb-1">{title}</div>
      <div className="text-sm text-ink-500">{desc}</div>
    </button>
  );
}
