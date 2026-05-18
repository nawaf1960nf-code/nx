"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/Button";
import { useGameStore } from "@/lib/store";
import {
  CATEGORIES,
  CATEGORY_GROUPS,
  CATEGORIES_PER_TEAM,
} from "@/lib/categories-data";
import { TEAM_COLORS, cn } from "@/lib/utils";
import {
  ArrowLeft,
  ChevronLeft,
  Check,
  Image as ImageIcon,
  Volume2,
} from "lucide-react";
import type { CategoryGroup } from "@/lib/types";

export default function CategoriesPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const phase = useGameStore((s) => s.phase);
  const teamA = useGameStore((s) => s.teamA);
  const teamB = useGameStore((s) => s.teamB);
  const toggleCategory = useGameStore((s) => s.toggleCategory);
  const setPhase = useGameStore((s) => s.setPhase);

  useEffect(() => setMounted(true), []);

  // أي فريق يختار حالياً؟
  const currentTeam: "team_a" | "team_b" =
    phase === "categories_b" ? "team_b" : "team_a";
  const activeTeam = currentTeam === "team_a" ? teamA : teamB;
  const otherTeam = currentTeam === "team_a" ? teamB : teamA;
  const otherSelected = otherTeam.selectedCategories;

  const colorObj = useMemo(
    () => TEAM_COLORS.find((c) => c.id === activeTeam.color) ?? TEAM_COLORS[0],
    [activeTeam.color],
  );

  const [activeGroup, setActiveGroup] = useState<CategoryGroup>("movies_shows");

  if (!mounted) return null;

  const selectedCount = activeTeam.selectedCategories.length;
  const canProceed = selectedCount === CATEGORIES_PER_TEAM;

  const handleNext = () => {
    if (currentTeam === "team_a") {
      setPhase("categories_b");
    } else {
      setPhase("hooks_a");
      router.push("/hooks");
    }
  };

  const visibleCategories = CATEGORIES.filter((c) => c.group === activeGroup);

  return (
    <main className="min-h-screen bg-mesh">
      {/* الهيدر */}
      <header className="px-6 py-5 flex items-center justify-between max-w-7xl mx-auto">
        <Logo size="md" />
        <Link href="/setup">
          <Button
            variant="ghost"
            size="sm"
            icon={<ArrowLeft className="w-4 h-4" />}
          >
            رجوع
          </Button>
        </Link>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* عنوان وتقدم */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center gap-3 px-5 py-2 rounded-full font-bold text-white mb-4"
            style={{ backgroundColor: colorObj.hex }}
          >
            <span className="w-3 h-3 rounded-full bg-white" />
            دور: {activeTeam.name}
          </div>
          <h1 className="text-3xl md:text-4xl font-black mb-2">
            اختار <span style={{ color: colorObj.hex }}>٣ تصنيفات</span>
          </h1>
          <p className="text-ink-500 text-lg">
            اختار {CATEGORIES_PER_TEAM} تصنيفات بالضبط — اخترت{" "}
            <span className="font-black text-ink-800">{selectedCount}</span>{" "}
            حتى الآن
          </p>
        </div>

        {/* تابات المجموعات */}
        <div className="flex overflow-x-auto gap-2 pb-3 mb-6 -mx-2 px-2 scrollbar-hide">
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
                    "shrink-0 px-5 py-2.5 rounded-full font-bold transition whitespace-nowrap",
                    isActive
                      ? "bg-ink-800 text-white"
                      : "bg-white text-ink-600 border-2 border-ink-100 hover:border-ink-300",
                  )}
                >
                  <span className="ml-2">{info.icon}</span>
                  {info.name}
                </button>
              );
            })}
        </div>

        {/* شبكة التصنيفات */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-32">
          {visibleCategories.map((cat) => {
            const selected = activeTeam.selectedCategories.includes(cat.id);
            const usedByOther = otherSelected.includes(cat.id);
            const disabled =
              usedByOther || (!selected && selectedCount >= CATEGORIES_PER_TEAM);

            return (
              <button
                key={cat.id}
                disabled={disabled}
                onClick={() => toggleCategory(currentTeam, cat.id)}
                className={cn(
                  "p-5 rounded-3xl border-2 text-right transition-all relative overflow-hidden",
                  selected
                    ? "shadow-xl scale-[1.02]"
                    : "border-ink-100 hover:border-ink-300 bg-white",
                  disabled && !selected && "opacity-40 cursor-not-allowed",
                )}
                style={
                  selected
                    ? {
                        borderColor: colorObj.hex,
                        backgroundColor: `${colorObj.hex}10`,
                        boxShadow: `0 12px 30px -8px ${colorObj.hex}50`,
                      }
                    : undefined
                }
              >
                {selected && (
                  <div
                    className="absolute top-3 left-3 w-8 h-8 rounded-full flex items-center justify-center text-white"
                    style={{ backgroundColor: colorObj.hex }}
                  >
                    <Check className="w-5 h-5" />
                  </div>
                )}

                {usedByOther && (
                  <div className="absolute top-3 left-3 text-xs font-bold bg-ink-200 text-ink-600 px-2 py-1 rounded-full">
                    مأخوذ
                  </div>
                )}

                <div className="text-5xl mb-3">{cat.icon}</div>
                <div className="font-black text-lg mb-1">{cat.name}</div>
                <div className="text-sm text-ink-500 leading-snug mb-3">
                  {cat.description}
                </div>
                <div className="flex gap-2 text-xs">
                  {cat.hasImages && (
                    <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-600 px-2 py-1 rounded-full font-bold">
                      <ImageIcon className="w-3 h-3" />
                      صور
                    </span>
                  )}
                  {cat.hasAudio && (
                    <span className="inline-flex items-center gap-1 bg-orange-50 text-warn-500 px-2 py-1 rounded-full font-bold">
                      <Volume2 className="w-3 h-3" />
                      صوت
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* شريط سفلي ثابت */}
      <div className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-ink-100 shadow-2xl">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div>
            <div className="text-sm text-ink-500">المختار حالياً</div>
            <div className="font-black text-xl">
              {selectedCount}{" "}
              <span className="text-ink-300">/</span> {CATEGORIES_PER_TEAM}
            </div>
          </div>
          <Button
            size="lg"
            onClick={handleNext}
            disabled={!canProceed}
            icon={<ChevronLeft className="w-5 h-5" />}
          >
            {currentTeam === "team_a"
              ? "التالي: دور الفريق الثاني"
              : "التالي: وسائل المساعدة"}
          </Button>
        </div>
      </div>
    </main>
  );
}
