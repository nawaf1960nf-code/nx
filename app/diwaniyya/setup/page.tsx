"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/Button";
import { UserMenu } from "@/components/UserMenu";
import { useGameStore } from "@/lib/store";
import {
  CATEGORIES,
  CATEGORY_GROUPS,
} from "@/lib/categories-data";
import {
  TEAM_COLORS,
  TEAM_AVATARS,
  TEAM_NAME_PRESETS,
  cn,
} from "@/lib/utils";
import {
  ArrowLeft,
  ChevronLeft,
  Brain,
  Hand,
  Layers,
  Plus,
  Trash2,
  Shuffle,
} from "lucide-react";
import type {
  DiwaniyyaPlayer,
  JudgingMode,
  CategoryGroup,
} from "@/lib/types";
import { PERSONALITIES, type PersonalityId } from "@/lib/personalities";

const MIN_PLAYERS = 2;
const MAX_PLAYERS = 6;

function makeId() {
  return `p_${Math.random().toString(36).slice(2, 9)}`;
}

function makePlayer(idx: number, takenColors: string[], takenAvatars: string[]): DiwaniyyaPlayer {
  const color =
    TEAM_COLORS.find((c) => !takenColors.includes(c.id))?.id ??
    TEAM_COLORS[idx % TEAM_COLORS.length].id;
  const avatar =
    TEAM_AVATARS.find((a) => !takenAvatars.includes(a)) ??
    TEAM_AVATARS[idx % TEAM_AVATARS.length];
  return {
    id: makeId(),
    name: TEAM_NAME_PRESETS[idx % TEAM_NAME_PRESETS.length],
    color,
    avatar,
    categoryId: "",
    score: 0,
  };
}

export default function DiwaniyyaSetupPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const players = useGameStore((s) => s.diwaniyyaPlayers);
  const setPlayers = useGameStore((s) => s.setDiwaniyyaPlayers);
  const updatePlayer = useGameStore((s) => s.updateDiwaniyyaPlayer);
  const settings = useGameStore((s) => s.settings);
  const setJudgingMode = useGameStore((s) => s.setJudgingMode);
  const setPersonality = useGameStore((s) => s.setPersonality);
  const setPhase = useGameStore((s) => s.setPhase);

  const [editingCategoryFor, setEditingCategoryFor] = useState<string | null>(null);
  const [activeGroup, setActiveGroup] = useState<CategoryGroup>("movies_shows");

  useEffect(() => {
    setMounted(true);
    if (players.length === 0) {
      setPlayers([
        makePlayer(0, [], []),
        makePlayer(1, [TEAM_COLORS[0].id], [TEAM_AVATARS[0]]),
      ]);
    }
  }, []); // eslint-disable-line

  if (!mounted) return null;

  const handleAdd = () => {
    if (players.length >= MAX_PLAYERS) return;
    const taken = players.map((p) => p.color);
    const takenAv = players.map((p) => p.avatar);
    setPlayers([...players, makePlayer(players.length, taken, takenAv)]);
  };

  const handleRemove = (id: string) => {
    if (players.length <= MIN_PLAYERS) return;
    setPlayers(players.filter((p) => p.id !== id));
  };

  const handleRandomize = (id: string) => {
    const others = players.filter((p) => p.id !== id);
    const takenColors = others.map((p) => p.color);
    const takenAvatars = others.map((p) => p.avatar);
    const newColor =
      TEAM_COLORS.filter((c) => !takenColors.includes(c.id))[
        Math.floor(Math.random() * (TEAM_COLORS.length - takenColors.length))
      ]?.id ?? TEAM_COLORS[0].id;
    const newAvatar =
      TEAM_AVATARS.filter((a) => !takenAvatars.includes(a))[
        Math.floor(Math.random() * (TEAM_AVATARS.length - takenAvatars.length))
      ] ?? TEAM_AVATARS[0];
    const newName =
      TEAM_NAME_PRESETS[Math.floor(Math.random() * TEAM_NAME_PRESETS.length)];
    updatePlayer(id, {
      name: newName,
      color: newColor,
      avatar: newAvatar,
    });
  };

  const allReady =
    players.length >= MIN_PLAYERS &&
    players.every((p) => p.name.trim() && p.categoryId);

  const handleNext = () => {
    setPhase("preloading");
    router.push("/diwaniyya/preload");
  };

  return (
    <main className="min-h-screen bg-mesh pb-32">
      <header className="px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <Logo size="sm" />
        <div className="flex items-center gap-2">
          <UserMenu />
          <Link href="/mode">
            <Button variant="ghost" size="sm" icon={<ArrowLeft className="w-4 h-4" />}>
              رجوع
            </Button>
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-5 py-6">
        <div className="text-center mb-6">
          <span className="inline-block bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-black mb-3">
            👑 وضع الديوانية
          </span>
          <h1 className="text-2xl md:text-3xl font-black mb-1">
            من <span className="text-primary-500">{MIN_PLAYERS}-{MAX_PLAYERS}</span> لاعبين
          </h1>
          <p className="text-ink-500 text-sm">
            كل لاعب يختار تصنيفه. ٣ أسئلة لكل واحد، والأعلى نقاطاً يفوز.
          </p>
        </div>

        {/* قائمة اللاعبين */}
        <div className="space-y-3 mb-4">
          {players.map((player, idx) => (
            <PlayerRow
              key={player.id}
              player={player}
              index={idx}
              canRemove={players.length > MIN_PLAYERS}
              otherColors={players.filter((p) => p.id !== player.id).map((p) => p.color)}
              otherAvatars={players.filter((p) => p.id !== player.id).map((p) => p.avatar)}
              onChange={(patch) => updatePlayer(player.id, patch)}
              onRemove={() => handleRemove(player.id)}
              onRandomize={() => handleRandomize(player.id)}
              onPickCategory={() => setEditingCategoryFor(player.id)}
            />
          ))}
        </div>

        {/* زر إضافة لاعب */}
        {players.length < MAX_PLAYERS && (
          <button
            onClick={handleAdd}
            className="w-full p-4 border-2 border-dashed border-ink-200 hover:border-primary-400 rounded-2xl text-ink-500 hover:text-primary-600 transition flex items-center justify-center gap-2 text-sm font-bold mb-6"
          >
            <Plus className="w-4 h-4" />
            أضف لاعب ({players.length}/{MAX_PLAYERS})
          </button>
        )}

        {/* وضع التحكيم */}
        <div className="bg-white border border-ink-100 rounded-2xl p-4 mb-4">
          <h2 className="text-sm font-bold mb-1">وضع التحكيم</h2>
          <p className="text-xs text-ink-500 mb-3">مين يحكم على الإجابات؟</p>
          <div className="grid grid-cols-3 gap-2">
            <JudgeMini
              id="ai"
              active={settings.judgingMode === "ai"}
              onClick={() => setJudgingMode("ai")}
              icon={<Brain className="w-4 h-4" />}
              title="AI"
            />
            <JudgeMini
              id="manual"
              active={settings.judgingMode === "manual"}
              onClick={() => setJudgingMode("manual")}
              icon={<Hand className="w-4 h-4" />}
              title="يدوي"
            />
            <JudgeMini
              id="mixed"
              active={settings.judgingMode === "mixed"}
              onClick={() => setJudgingMode("mixed")}
              icon={<Layers className="w-4 h-4" />}
              title="مختلط"
            />
          </div>
        </div>

        {/* شخصية المعلّق */}
        <div className="bg-white border border-ink-100 rounded-2xl p-4">
          <h2 className="text-sm font-bold mb-1">شخصية المعلّق</h2>
          <p className="text-xs text-ink-500 mb-3">تعليقات بعد كل سؤال</p>
          <div className="grid grid-cols-4 gap-2">
            {PERSONALITIES.map((p) => {
              const isActive = settings.personality === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setPersonality(p.id as PersonalityId)}
                  className={cn(
                    "p-2.5 rounded-xl border-2 transition text-center",
                    isActive ? "shadow-md scale-105" : "border-ink-200 bg-white",
                  )}
                  style={
                    isActive
                      ? { borderColor: p.color, backgroundColor: `${p.color}10` }
                      : undefined
                  }
                >
                  <div className="text-2xl mb-0.5">{p.emoji}</div>
                  <div className="font-bold text-xs">{p.name}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* شريط سفلي */}
      <div className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-ink-100 shadow-2xl">
        <div className="max-w-4xl mx-auto px-5 py-3 flex items-center justify-between gap-3">
          <span className="text-xs font-bold text-ink-500">
            {players.length} لاعبين •{" "}
            {players.filter((p) => p.categoryId).length} اختاروا تصنيف
          </span>
          <Button
            size="lg"
            onClick={handleNext}
            disabled={!allReady}
            icon={<ChevronLeft className="w-4 h-4" />}
          >
            {allReady ? "ابدأ الديوانية!" : "أكمل البيانات"}
          </Button>
        </div>
      </div>

      {/* مودال اختيار التصنيف */}
      {editingCategoryFor && (
        <CategoryPickerModal
          activeGroup={activeGroup}
          setActiveGroup={setActiveGroup}
          takenIds={players
            .filter((p) => p.id !== editingCategoryFor)
            .map((p) => p.categoryId)
            .filter(Boolean)}
          currentId={
            players.find((p) => p.id === editingCategoryFor)?.categoryId ?? ""
          }
          onPick={(catId) => {
            updatePlayer(editingCategoryFor, { categoryId: catId });
            setEditingCategoryFor(null);
          }}
          onClose={() => setEditingCategoryFor(null)}
        />
      )}
    </main>
  );
}

function PlayerRow({
  player,
  index,
  canRemove,
  otherColors,
  otherAvatars,
  onChange,
  onRemove,
  onRandomize,
  onPickCategory,
}: {
  player: DiwaniyyaPlayer;
  index: number;
  canRemove: boolean;
  otherColors: string[];
  otherAvatars: string[];
  onChange: (patch: Partial<DiwaniyyaPlayer>) => void;
  onRemove: () => void;
  onRandomize: () => void;
  onPickCategory: () => void;
}) {
  const colorObj = TEAM_COLORS.find((c) => c.id === player.color) ?? TEAM_COLORS[0];
  const category = player.categoryId
    ? CATEGORIES.find((c) => c.id === player.categoryId)
    : null;

  return (
    <div
      className="bg-white border-2 rounded-2xl p-3 flex items-center gap-3"
      style={{ borderColor: colorObj.hex }}
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
        style={{ backgroundColor: `${colorObj.hex}25` }}
      >
        {player.avatar}
      </div>

      <div className="flex-1 min-w-0 space-y-1.5">
        <div className="flex items-center gap-2">
          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white shrink-0"
            style={{ backgroundColor: colorObj.hex }}
          >
            لاعب {index + 1}
          </span>
          <input
            type="text"
            value={player.name}
            onChange={(e) => onChange({ name: e.target.value })}
            className="flex-1 text-sm font-bold bg-transparent border-b border-ink-200 focus:border-primary-500 focus:outline-none py-0.5"
            placeholder="اسم اللاعب"
            maxLength={15}
          />
        </div>

        <button
          onClick={onPickCategory}
          className={cn(
            "w-full text-right flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs transition",
            category
              ? "bg-primary-50 border-primary-200 text-primary-700"
              : "bg-ink-50 border-ink-200 text-ink-500 hover:bg-ink-100",
          )}
        >
          {category ? (
            <>
              <span className="text-base">{category.icon}</span>
              <span className="font-bold flex-1 truncate">{category.name}</span>
              <span className="text-[10px]">تغيير</span>
            </>
          ) : (
            <span className="font-bold">اختار تصنيفك ←</span>
          )}
        </button>
      </div>

      <div className="flex flex-col gap-1 shrink-0">
        <button
          onClick={onRandomize}
          aria-label="عشوائي"
          className="w-7 h-7 rounded-md hover:bg-ink-100 text-ink-400 hover:text-ink-700 flex items-center justify-center transition"
        >
          <Shuffle className="w-3.5 h-3.5" />
        </button>
        {canRemove && (
          <button
            onClick={onRemove}
            aria-label="حذف"
            className="w-7 h-7 rounded-md hover:bg-red-50 text-ink-400 hover:text-red-600 flex items-center justify-center transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

function CategoryPickerModal({
  activeGroup,
  setActiveGroup,
  takenIds,
  currentId,
  onPick,
  onClose,
}: {
  activeGroup: CategoryGroup;
  setActiveGroup: (g: CategoryGroup) => void;
  takenIds: string[];
  currentId: string;
  onPick: (id: string) => void;
  onClose: () => void;
}) {
  const visibleCats = CATEGORIES.filter(
    (c) => c.group === activeGroup && c.gameMode !== "charades",
  );

  return (
    <div className="fixed inset-0 bg-ink-900/60 backdrop-blur-sm flex items-end md:items-center justify-center p-3 z-50">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col">
        <div className="p-4 border-b border-ink-100 flex items-center justify-between">
          <h3 className="font-black text-base">اختار تصنيف اللاعب</h3>
          <button
            onClick={onClose}
            className="text-ink-400 hover:text-ink-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="px-3 py-2 border-b border-ink-100 overflow-x-auto">
          <div className="flex gap-1.5">
            {(
              Object.entries(CATEGORY_GROUPS) as [
                CategoryGroup,
                { name: string; icon: string },
              ][]
            )
              .filter(([k]) => k !== "special_daily" && k !== "party_games")
              .map(([key, info]) => {
                const isActive = activeGroup === key;
                return (
                  <button
                    key={key}
                    onClick={() => setActiveGroup(key as CategoryGroup)}
                    className={cn(
                      "shrink-0 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition",
                      isActive
                        ? "bg-ink-800 text-white"
                        : "bg-white text-ink-600 border border-ink-200",
                    )}
                  >
                    <span className="ml-1">{info.icon}</span>
                    {info.name}
                  </button>
                );
              })}
          </div>
        </div>

        <div className="overflow-y-auto p-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
          {visibleCats.map((cat) => {
            const taken = takenIds.includes(cat.id);
            const isCurrent = cat.id === currentId;
            return (
              <button
                key={cat.id}
                disabled={taken && !isCurrent}
                onClick={() => onPick(cat.id)}
                className={cn(
                  "p-3 rounded-xl border-2 text-right transition",
                  isCurrent && "border-primary-500 bg-primary-50",
                  !isCurrent && taken && "opacity-30 cursor-not-allowed",
                  !taken && !isCurrent && "border-ink-100 hover:border-ink-400 bg-white",
                )}
              >
                <div className="text-2xl mb-1">{cat.icon}</div>
                <div className="font-bold text-xs leading-tight">{cat.name}</div>
                {taken && !isCurrent && (
                  <div className="text-[9px] text-ink-400 mt-1">مأخوذ</div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function JudgeMini({
  active,
  onClick,
  icon,
  title,
}: {
  id: JudgingMode;
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "p-2.5 rounded-xl border-2 transition flex flex-col items-center gap-1",
        active
          ? "border-primary-500 bg-primary-50"
          : "border-ink-200 bg-white hover:border-ink-300",
      )}
    >
      <div
        className={cn(
          "w-7 h-7 rounded-lg flex items-center justify-center",
          active ? "bg-primary-500 text-white" : "bg-ink-100 text-ink-600",
        )}
      >
        {icon}
      </div>
      <div className="text-xs font-bold">{title}</div>
    </button>
  );
}
