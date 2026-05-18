"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/Button";
import { UserMenu } from "@/components/UserMenu";
import { useGameStore } from "@/lib/store";
import {
  TEAM_COLORS,
  TEAM_AVATARS,
  TEAM_NAME_PRESETS,
  cn,
} from "@/lib/utils";
import {
  ArrowLeft,
  ChevronLeft,
  Users,
  Brain,
  Hand,
  Layers,
  Shuffle,
} from "lucide-react";
import type { JudgingMode } from "@/lib/types";

export default function SetupPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const teamA = useGameStore((s) => s.teamA);
  const teamB = useGameStore((s) => s.teamB);
  const settings = useGameStore((s) => s.settings);

  const setTeamName = useGameStore((s) => s.setTeamName);
  const setTeamColor = useGameStore((s) => s.setTeamColor);
  const setTeamAvatar = useGameStore((s) => s.setTeamAvatar);
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

  // عشوائي للفريق
  const randomize = (team: "team_a" | "team_b") => {
    const usedColor = team === "team_a" ? teamB.color : teamA.color;
    const availableColors = TEAM_COLORS.filter((c) => c.id !== usedColor);
    const randomColor = availableColors[Math.floor(Math.random() * availableColors.length)];
    const randomAvatar = TEAM_AVATARS[Math.floor(Math.random() * TEAM_AVATARS.length)];
    const randomName = TEAM_NAME_PRESETS[Math.floor(Math.random() * TEAM_NAME_PRESETS.length)];

    setTeamName(team, randomName);
    setTeamColor(team, randomColor.id);
    setTeamAvatar(team, randomAvatar);
  };

  return (
    <main className="min-h-screen bg-mesh">
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
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-black mb-3">
            جهّز <span className="text-primary-500">الفرق</span>
          </h1>
          <p className="text-ink-500 text-lg">
            اختر شخصية لكل فريق ولونه واسمه
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-5 mb-10">
          <TeamCard
            label="الفريق الأول"
            team={teamA}
            otherColor={teamB.color}
            otherAvatar={teamB.avatar}
            onName={(v) => setTeamName("team_a", v)}
            onColor={(c) => setTeamColor("team_a", c)}
            onAvatar={(a) => setTeamAvatar("team_a", a)}
            onPlayers={(n) => setTeamPlayersCount("team_a", n)}
            onRandomize={() => randomize("team_a")}
          />
          <TeamCard
            label="الفريق الثاني"
            team={teamB}
            otherColor={teamA.color}
            otherAvatar={teamA.avatar}
            onName={(v) => setTeamName("team_b", v)}
            onColor={(c) => setTeamColor("team_b", c)}
            onAvatar={(a) => setTeamAvatar("team_b", a)}
            onPlayers={(n) => setTeamPlayersCount("team_b", n)}
            onRandomize={() => randomize("team_b")}
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
              desc="AI يحكم تلقائياً"
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
  otherAvatar,
  onName,
  onColor,
  onAvatar,
  onPlayers,
  onRandomize,
}: {
  label: string;
  team: { name: string; color: string; avatar: string; playersCount: number };
  otherColor: string;
  otherAvatar: string;
  onName: (v: string) => void;
  onColor: (c: string) => void;
  onAvatar: (a: string) => void;
  onPlayers: (n: number) => void;
  onRandomize: () => void;
}) {
  const colorObj = TEAM_COLORS.find((c) => c.id === team.color) ?? TEAM_COLORS[0];

  return (
    <div
      className="rounded-3xl p-5 space-y-4 border-2 shadow-lg transition-all"
      style={{
        borderColor: colorObj.hex,
        background: `linear-gradient(135deg, white 0%, ${colorObj.hex}08 100%)`,
      }}
    >
      <div className="flex items-center justify-between">
        <span
          className="px-3 py-1 rounded-full text-xs font-black text-white"
          style={{ backgroundColor: colorObj.hex }}
        >
          {label}
        </span>
        <button
          onClick={onRandomize}
          className="text-ink-400 hover:text-ink-700 transition flex items-center gap-1 text-sm font-bold"
        >
          <Shuffle className="w-4 h-4" />
          عشوائي
        </button>
      </div>

      {/* الأفاتار الكبير */}
      <div className="flex justify-center">
        <div
          className="w-24 h-24 rounded-3xl flex items-center justify-center text-6xl shadow-lg"
          style={{ backgroundColor: `${colorObj.hex}25` }}
        >
          {team.avatar}
        </div>
      </div>

      {/* اختيار الأفاتار */}
      <div>
        <label className="block text-xs font-bold text-ink-500 mb-2">
          الشخصية
        </label>
        <div className="grid grid-cols-6 gap-2">
          {TEAM_AVATARS.map((a) => {
            const usedByOther = a === otherAvatar;
            const isActive = a === team.avatar;
            return (
              <button
                key={a}
                onClick={() => onAvatar(a)}
                disabled={usedByOther}
                className={cn(
                  "aspect-square rounded-xl text-2xl transition flex items-center justify-center",
                  isActive
                    ? "scale-110 shadow-md"
                    : "hover:scale-105 bg-white/50",
                  usedByOther && "opacity-25 cursor-not-allowed grayscale",
                )}
                style={
                  isActive
                    ? { backgroundColor: colorObj.hex, color: "white" }
                    : undefined
                }
              >
                {a}
              </button>
            );
          })}
        </div>
      </div>

      {/* الاسم مع اقتراحات */}
      <div>
        <label className="block text-xs font-bold text-ink-500 mb-2">
          اسم الفريق
        </label>
        <input
          type="text"
          value={team.name}
          onChange={(e) => onName(e.target.value)}
          className="w-full px-4 py-3 border-2 border-ink-200 rounded-xl text-lg font-bold focus:outline-none transition"
          style={{
            borderColor: team.name ? colorObj.hex : undefined,
          }}
          placeholder="اكتب اسم"
          maxLength={20}
        />
        <div className="flex gap-1.5 mt-2 overflow-x-auto pb-1">
          {TEAM_NAME_PRESETS.slice(0, 8).map((name) => (
            <button
              key={name}
              onClick={() => onName(name)}
              className="shrink-0 text-xs bg-white border border-ink-200 hover:border-ink-400 rounded-full px-3 py-1 font-bold text-ink-600 transition"
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      {/* الألوان */}
      <div>
        <label className="block text-xs font-bold text-ink-500 mb-2">
          اللون
        </label>
        <div className="flex flex-wrap gap-1.5">
          {TEAM_COLORS.map((c) => {
            const isUsed = c.id === otherColor;
            const isActive = c.id === team.color;
            return (
              <button
                key={c.id}
                onClick={() => onColor(c.id)}
                disabled={isUsed}
                title={isUsed ? "مستخدم" : c.name}
                className={cn(
                  "w-10 h-10 rounded-xl transition-all relative",
                  "disabled:opacity-20 disabled:cursor-not-allowed",
                  isActive && "scale-110 ring-4 ring-offset-2 ring-ink-900/30",
                )}
                style={{ backgroundColor: c.hex }}
              >
                {isActive && (
                  <span className="absolute inset-0 flex items-center justify-center text-white text-lg font-black">
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
        <label className="block text-xs font-bold text-ink-500 mb-2">
          <Users className="inline w-3 h-3 ml-1" />
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
