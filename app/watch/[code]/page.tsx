"use client";

import { use, useEffect, useState } from "react";
import { Logo } from "@/components/Logo";
import { CATEGORY_BY_ID } from "@/lib/categories-data";
import { TEAM_COLORS, cn, formatPoints } from "@/lib/utils";
import { useSessionWatch } from "@/lib/session-sync";
import { Clock, Loader2, Trophy, Eye, RefreshCw } from "lucide-react";

interface WatchPlayer {
  id: string;
  name: string;
  color: string;
  avatar: string;
  categoryId: string;
  score: number;
}

interface WatchState {
  mode?: string;
  players?: WatchPlayer[];
  activePlayerId?: string;
  difficulty?: number;
  stage?: string;
  timeLeft?: number;
  answered?: string[];
  questionText?: string;
  correctAnswer?: string;
  judgment?: { isCorrect: boolean; forPlayer: string } | null;
  comment?: string | null;
  updatedAt?: number;
}

export default function WatchPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = use(params);
  const { state, error, loading } = useSessionWatch(code);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-mesh">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-primary-500 animate-spin mx-auto mb-3" />
          <p className="text-ink-500 text-sm">جارٍ الاتصال بالجلسة...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-mesh">
        <div className="text-center max-w-sm px-6">
          <div className="text-5xl mb-3">😕</div>
          <h1 className="text-xl font-black mb-2">{error}</h1>
          <p className="text-ink-500 text-sm mb-4">
            الكود <span className="font-mono font-bold">{code}</span> غير صحيح
            أو الجلسة انتهت.
          </p>
          <a
            href="/"
            className="inline-block bg-primary-500 text-white font-bold rounded-xl px-5 py-2"
          >
            الرئيسية
          </a>
        </div>
      </main>
    );
  }

  const s = (state ?? {}) as WatchState;
  const players = s.players ?? [];
  const activePlayer = players.find((p) => p.id === s.activePlayerId);
  const ranked = [...players].sort((a, b) => b.score - a.score);

  // أحدث ثانية لحساب آخر تحديث
  const stale = s.updatedAt ? now - s.updatedAt > 8000 : false;

  return (
    <main className="min-h-screen bg-mesh">
      <header className="px-5 py-3 flex items-center justify-between max-w-7xl mx-auto">
        <Logo size="sm" />
        <div className="flex items-center gap-2 text-xs">
          <div
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold",
              stale
                ? "bg-red-100 text-red-600"
                : "bg-primary-100 text-primary-700",
            )}
          >
            {stale ? (
              <RefreshCw className="w-3 h-3" />
            ) : (
              <span className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-pulse" />
            )}
            {stale ? "متأخر" : "مباشر"}
          </div>
          <div className="bg-ink-100 text-ink-600 px-2.5 py-1 rounded-full font-bold flex items-center gap-1">
            <Eye className="w-3 h-3" />
            مشاهدة
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 pb-10">
        {/* بطاقات اللاعبين */}
        {players.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 mb-4">
            {ranked.map((p, idx) => (
              <PlayerScoreMini
                key={p.id}
                player={p}
                rank={idx + 1}
                isActive={p.id === s.activePlayerId}
              />
            ))}
          </div>
        )}

        {/* مرحلة السؤال أو اللوحة */}
        {s.questionText && activePlayer ? (
          <QuestionDisplay state={s} activePlayer={activePlayer} />
        ) : players.length === 0 ? (
          <EmptyState />
        ) : (
          <BoardWaiting state={s} />
        )}
      </div>
    </main>
  );
}

function PlayerScoreMini({
  player,
  rank,
  isActive,
}: {
  player: WatchPlayer;
  rank: number;
  isActive: boolean;
}) {
  const color = TEAM_COLORS.find((c) => c.id === player.color) ?? TEAM_COLORS[0];
  return (
    <div
      className={cn(
        "rounded-xl p-2 transition",
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
                "w-3 h-3 shrink-0",
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
            "text-sm font-black tabular-nums shrink-0",
            isActive ? "text-white" : "",
          )}
          style={isActive ? undefined : { color: color.hex }}
        >
          {formatPoints(player.score)}
        </div>
      </div>
    </div>
  );
}

function QuestionDisplay({
  state,
  activePlayer,
}: {
  state: WatchState;
  activePlayer: WatchPlayer;
}) {
  const cat = CATEGORY_BY_ID[activePlayer.categoryId];
  const color = TEAM_COLORS.find((c) => c.id === activePlayer.color) ?? TEAM_COLORS[0];
  const tLeft = state.timeLeft ?? 0;
  const timeColor =
    tLeft <= 5
      ? "text-danger-500"
      : tLeft <= 15
        ? "text-warn-500"
        : "text-ink-800";
  const timeBg =
    tLeft <= 5
      ? "bg-danger-500/10 animate-pulse"
      : tLeft <= 15
        ? "bg-warn-500/10"
        : "bg-ink-100";

  const isRevealed = state.stage === "reveal" || state.stage === "judged";

  return (
    <div className="space-y-3">
      {/* اللاعب الحالي والمؤقت */}
      <div className="bg-white rounded-2xl border border-ink-100 p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{activePlayer.avatar}</span>
          <div>
            <div className="text-[10px] text-ink-400 font-bold uppercase">
              {cat?.icon} {cat?.name}
            </div>
            <div className="font-bold text-sm">{activePlayer.name}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {state.difficulty && (
            <div className="bg-gold-500/15 text-gold-700 px-2.5 py-1 rounded-full font-black text-xs">
              {formatPoints(state.difficulty)}
            </div>
          )}
          <div
            className={cn(
              "px-3 py-1.5 rounded-lg flex items-center gap-1 font-black text-lg tabular-nums",
              timeBg,
              timeColor,
            )}
          >
            <Clock className="w-3.5 h-3.5" />
            {String(Math.floor(tLeft / 60)).padStart(2, "0")}:
            {String(tLeft % 60).padStart(2, "0")}
          </div>
        </div>
      </div>

      {/* مرحلة السرقة */}
      {state.stage === "stealing" && (
        <div className="bg-warn-500/10 border-2 border-warn-500/30 rounded-xl p-3 text-warn-700 text-center text-sm font-bold animate-pulse">
          ⚡ السرقة مفتوحة - أي لاعب يقدر يحاول!
        </div>
      )}

      {/* السؤال */}
      <div className="bg-white rounded-2xl border border-ink-100 overflow-hidden">
        <div
          className="h-2"
          style={{ backgroundColor: color.hex }}
        />
        <div className="p-6 text-center">
          <div className="text-[10px] text-ink-400 font-bold uppercase mb-2">
            السؤال
          </div>
          <p className="text-lg md:text-2xl font-bold text-ink-800 leading-relaxed">
            {state.questionText}
          </p>

          {isRevealed && state.correctAnswer && (
            <div className="bg-primary-50 border border-primary-200 rounded-xl p-3 mt-4 animate-float-up">
              <div className="text-[10px] text-primary-700 font-bold mb-1 uppercase">
                الإجابة الصحيحة
              </div>
              <div className="text-xl md:text-2xl font-black text-primary-900">
                {state.correctAnswer}
              </div>
            </div>
          )}

          {isRevealed && state.judgment && (
            <div
              className={cn(
                "rounded-xl p-2.5 mt-3 border text-sm font-bold animate-float-up",
                state.judgment.isCorrect
                  ? "bg-green-50 border-green-300 text-green-800"
                  : "bg-red-50 border-red-300 text-red-800",
              )}
            >
              {state.judgment.isCorrect
                ? "✅ صح! النقاط للاعب"
                : "❌ ما عرفوا"}
            </div>
          )}

          {state.comment && (
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-3 mt-3 text-purple-900 font-bold text-sm animate-float-up">
              💬 {state.comment}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function BoardWaiting({ state }: { state: WatchState }) {
  return (
    <div className="bg-white rounded-2xl border border-ink-100 p-8 text-center">
      <div className="text-6xl mb-3">⏳</div>
      <h2 className="text-xl font-black mb-1">في انتظار سؤال</h2>
      <p className="text-ink-500 text-sm">
        المضيف بيختار سؤال جديد...
      </p>
      {state.answered && state.answered.length > 0 && (
        <p className="text-xs text-ink-400 mt-3">
          ✅ {state.answered.length} سؤال مكتمل
        </p>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="bg-white rounded-2xl border border-ink-100 p-8 text-center">
      <div className="text-6xl mb-3">👀</div>
      <h2 className="text-xl font-black mb-1">في انتظار المضيف</h2>
      <p className="text-ink-500 text-sm">
        لما يبدأ المضيف اللعبة، راح تشوفها هنا لحظياً
      </p>
    </div>
  );
}
