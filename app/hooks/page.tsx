"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/Button";
import { useGameStore } from "@/lib/store";
import { HOOKS, HOOKS_PER_TEAM } from "@/lib/hooks-data";
import { TEAM_COLORS, cn } from "@/lib/utils";
import { ArrowLeft, ChevronLeft, Check, Clock, Zap } from "lucide-react";

export default function HooksPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const phase = useGameStore((s) => s.phase);
  const teamA = useGameStore((s) => s.teamA);
  const teamB = useGameStore((s) => s.teamB);
  const toggleHook = useGameStore((s) => s.toggleHook);
  const setPhase = useGameStore((s) => s.setPhase);

  useEffect(() => setMounted(true), []);

  const currentTeam: "team_a" | "team_b" =
    phase === "hooks_b" ? "team_b" : "team_a";
  const activeTeam = currentTeam === "team_a" ? teamA : teamB;
  const colorObj =
    TEAM_COLORS.find((c) => c.id === activeTeam.color) ?? TEAM_COLORS[0];

  if (!mounted) return null;

  const selectedCount = activeTeam.hooks.length;
  const canProceed = selectedCount === HOOKS_PER_TEAM;

  const handleNext = () => {
    if (currentTeam === "team_a") {
      setPhase("hooks_b");
    } else {
      setPhase("board");
      router.push("/game");
    }
  };

  return (
    <main className="min-h-screen bg-mesh">
      <header className="px-6 py-5 flex items-center justify-between max-w-7xl mx-auto">
        <Logo size="md" />
        <Link href="/categories">
          <Button variant="ghost" size="sm" icon={<ArrowLeft className="w-4 h-4" />}>
            رجوع
          </Button>
        </Link>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center gap-3 px-5 py-2 rounded-full font-bold text-white mb-4"
            style={{ backgroundColor: colorObj.hex }}
          >
            <span className="w-3 h-3 rounded-full bg-white" />
            دور: {activeTeam.name}
          </div>
          <h1 className="text-3xl md:text-4xl font-black mb-2">
            اختار <span style={{ color: colorObj.hex }}>٤ وسائل مساعدة</span>
          </h1>
          <p className="text-ink-500 text-lg">
            اخترت{" "}
            <span className="font-black text-ink-800">{selectedCount}</span>{" "}
            من {HOOKS_PER_TEAM}
          </p>
        </div>

        {/* شبكة الهوكات */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-32">
          {HOOKS.map((hook) => {
            const selected = activeTeam.hooks.includes(hook.id);
            const disabled =
              !selected && selectedCount >= HOOKS_PER_TEAM;

            return (
              <button
                key={hook.id}
                disabled={disabled}
                onClick={() => toggleHook(currentTeam, hook.id)}
                className={cn(
                  "p-5 rounded-3xl border-2 text-right transition-all relative",
                  selected
                    ? "shadow-xl scale-[1.02]"
                    : "border-ink-100 hover:border-ink-300 bg-white",
                  disabled && "opacity-40 cursor-not-allowed",
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

                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-3"
                  style={{ backgroundColor: `${hook.color}15` }}
                >
                  {hook.icon}
                </div>
                <div className="font-black text-lg mb-2">{hook.name}</div>
                <p className="text-sm text-ink-500 leading-snug mb-3">
                  {hook.description}
                </p>
                <span
                  className={cn(
                    "inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full",
                    hook.timing === "before_question"
                      ? "bg-warn-500/10 text-warn-500"
                      : "bg-primary-500/10 text-primary-700",
                  )}
                >
                  {hook.timing === "before_question" ? (
                    <>
                      <Zap className="w-3 h-3" />
                      قبل السؤال
                    </>
                  ) : (
                    <>
                      <Clock className="w-3 h-3" />
                      بعد السؤال
                    </>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* شريط سفلي */}
      <div className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-ink-100 shadow-2xl">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div>
            <div className="text-sm text-ink-500">المختار حالياً</div>
            <div className="font-black text-xl">
              {selectedCount}{" "}
              <span className="text-ink-300">/</span> {HOOKS_PER_TEAM}
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
              : "ابدأ اللعبة!"}
          </Button>
        </div>
      </div>
    </main>
  );
}
