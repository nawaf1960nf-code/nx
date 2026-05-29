"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Trophy,
  Target,
  TrendingUp,
  ListChecks,
  BookOpenCheck,
  Sparkles,
  ArrowRight,
  Trash2,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import {
  getResults,
  getAverageScore,
  getBestScore,
  getAttemptCount,
  getImprovement,
  getTopicMastery,
  clearAll,
} from "@/lib/storage";
import { topicLabel, topicChapter, CHAPTER_TITLES } from "@/lib/topics";
import { GRADE_COLORS } from "@/lib/grading";
import type { ExamResult, TopicId, Chapter } from "@/lib/types";

export default function DashboardPage() {
  const [results, setResults] = useState<ExamResult[]>([]);
  const [avg, setAvg] = useState(0);
  const [best, setBest] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [improvement, setImprovement] = useState<number | null>(null);
  const [strong, setStrong] = useState<{ topic: TopicId; ratio: number }[]>([]);
  const [weak, setWeak] = useState<{ topic: TopicId; ratio: number }[]>([]);
  const [chapterNeeds, setChapterNeeds] = useState<{ chapter: Chapter; ratio: number }[]>([]);

  function refresh() {
    setResults(getResults());
    setAvg(getAverageScore());
    setBest(getBestScore()?.percentage ?? 0);
    setAttempts(getAttemptCount());
    setImprovement(getImprovement());

    const mastery = getTopicMastery();
    const arr = Object.entries(mastery).map(([t, v]) => ({
      topic: t as TopicId,
      ratio: v.total ? v.correct / v.total : 0,
      total: v.total,
    }));
    setStrong(
      arr.filter((a) => a.total >= 1 && a.ratio >= 0.75).sort((a, b) => b.ratio - a.ratio).slice(0, 5),
    );
    setWeak(
      arr.filter((a) => a.total >= 1 && a.ratio < 0.6).sort((a, b) => a.ratio - b.ratio).slice(0, 5),
    );

    // Aggregate by chapter.
    const chMap = new Map<Chapter, { correct: number; total: number }>();
    for (const [t, v] of Object.entries(mastery)) {
      const ch = topicChapter(t as TopicId);
      const e = chMap.get(ch) ?? { correct: 0, total: 0 };
      e.correct += v.correct;
      e.total += v.total;
      chMap.set(ch, e);
    }
    setChapterNeeds(
      [...chMap.entries()]
        .map(([chapter, v]) => ({ chapter, ratio: v.total ? v.correct / v.total : 0 }))
        .sort((a, b) => a.ratio - b.ratio),
    );
  }

  useEffect(() => {
    refresh();
  }, []);

  const hasData = attempts > 0;
  const history = [...results].reverse(); // oldest → newest for the chart

  return (
    <main className="min-h-screen pb-20">
      <Navbar />
      <div className="mx-auto max-w-5xl px-4 pt-10">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-white">Dashboard</h1>
            <p className="mt-1 text-sm text-brand-100/60">
              Track your progress across every attempt.
            </p>
          </div>
          {hasData && (
            <button
              onClick={() => {
                if (confirm("Clear all saved progress? This cannot be undone.")) {
                  clearAll();
                  refresh();
                }
              }}
              className="flex items-center gap-1.5 text-xs text-brand-100/40 transition-colors hover:text-danger"
            >
              <Trash2 className="h-3.5 w-3.5" /> Reset progress
            </button>
          )}
        </div>

        {!hasData ? (
          <GlassCard className="p-12 text-center">
            <span className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-brand-500/15 text-brand-300">
              <Sparkles className="h-8 w-8" />
            </span>
            <h2 className="font-display text-xl font-semibold text-white">
              No attempts yet
            </h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-brand-100/60">
              Take your first exam to unlock detailed analytics — scores over time,
              strong and weak areas, and chapters to review.
            </p>
            <Link href="/#levels" className="mt-6 inline-block">
              <Button size="lg">
                Start your first exam <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </GlassCard>
        ) : (
          <>
            {/* Stat cards */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <StatCard icon={ListChecks} label="Exams Completed" value={attempts} color="#818cf8" />
              <StatCard icon={Target} label="Average Score" value={`${avg}%`} color="#22d3ee" />
              <StatCard icon={Trophy} label="Best Score" value={`${best}%`} color="#fbbf24" />
              <StatCard
                icon={TrendingUp}
                label="Improvement"
                value={improvement === null ? "—" : `${improvement >= 0 ? "+" : ""}${improvement}%`}
                color={improvement !== null && improvement >= 0 ? "#34d399" : "#fb7185"}
              />
            </div>

            {/* Score history chart */}
            <GlassCard className="mt-6 p-6 sm:p-8">
              <h2 className="mb-5 font-display text-lg font-semibold text-white">
                Scores Over Time
              </h2>
              <ScoreChart history={history} />
            </GlassCard>

            {/* Strong / Weak */}
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <TopicPanel
                title="Your Strengths"
                icon={TrendingUp}
                color="#34d399"
                items={strong}
                empty="Keep practicing to build strengths."
              />
              <TopicPanel
                title="Needs Review"
                icon={Target}
                color="#fb7185"
                items={weak}
                empty="No weak spots detected — excellent!"
              />
            </div>

            {/* Chapters to review */}
            <GlassCard className="mt-6 p-6 sm:p-8">
              <div className="mb-4 flex items-center gap-2">
                <BookOpenCheck className="h-5 w-5 text-brand-300" />
                <h2 className="font-display text-lg font-semibold text-white">
                  Chapters to Review
                </h2>
              </div>
              <div className="space-y-3">
                {chapterNeeds.map(({ chapter, ratio }) => (
                  <div key={chapter}>
                    <div className="mb-1 flex justify-between text-xs">
                      <span className="text-brand-100/80">
                        Ch. {chapter} · {CHAPTER_TITLES[chapter]}
                      </span>
                      <span className="text-brand-100/50">{Math.round(ratio * 100)}%</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/8">
                      <motion.div
                        className="h-full rounded-full"
                        style={{
                          background:
                            ratio >= 0.7 ? "#34d399" : ratio >= 0.5 ? "#fbbf24" : "#fb7185",
                        }}
                        initial={{ width: 0 }}
                        animate={{ width: `${ratio * 100}%` }}
                        transition={{ duration: 0.8 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>

            <div className="mt-8 flex justify-center gap-3">
              <Link href="/#levels">
                <Button size="lg">
                  New Exam <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/study">
                <Button variant="outline" size="lg">
                  Study Mode
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: React.ReactNode;
  color: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-5"
    >
      <span
        className="mb-3 grid h-10 w-10 place-items-center rounded-xl"
        style={{ background: `${color}1f`, color }}
      >
        <Icon className="h-5 w-5" />
      </span>
      <p className="font-display text-2xl font-bold text-white">{value}</p>
      <p className="text-xs text-brand-100/50">{label}</p>
    </motion.div>
  );
}

function TopicPanel({
  title,
  icon: Icon,
  color,
  items,
  empty,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  items: { topic: TopicId; ratio: number }[];
  empty: string;
}) {
  return (
    <GlassCard className="p-6">
      <div className="mb-4 flex items-center gap-2" style={{ color }}>
        <Icon className="h-5 w-5" />
        <h2 className="font-display text-base font-semibold text-white">{title}</h2>
      </div>
      {items.length ? (
        <ul className="space-y-2.5">
          {items.map(({ topic, ratio }) => (
            <li key={topic} className="flex items-center justify-between text-sm">
              <span className="text-brand-100/80">{topicLabel(topic)}</span>
              <span className="font-semibold" style={{ color }}>
                {Math.round(ratio * 100)}%
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-brand-100/40">{empty}</p>
      )}
    </GlassCard>
  );
}

function ScoreChart({ history }: { history: ExamResult[] }) {
  if (history.length === 0) return null;
  const w = 600;
  const h = 160;
  const pad = 20;
  const max = 100;
  const pts = history.map((r, i) => {
    const x =
      history.length === 1
        ? w / 2
        : pad + (i / (history.length - 1)) * (w - pad * 2);
    const y = pad + (1 - r.percentage / max) * (h - pad * 2);
    return { x, y, r };
  });
  const path = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const area = `${path} L ${pts[pts.length - 1].x} ${h - pad} L ${pts[0].x} ${h - pad} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="scoreFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#818cf8" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 50, 100].map((g) => {
        const y = pad + (1 - g / max) * (h - pad * 2);
        return (
          <line
            key={g}
            x1={pad}
            x2={w - pad}
            y1={y}
            y2={y}
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="1"
          />
        );
      })}
      <path d={area} fill="url(#scoreFill)" />
      <path d={path} fill="none" stroke="#818cf8" strokeWidth="2.5" strokeLinecap="round" />
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="4" fill={GRADE_COLORS[p.r.grade]} stroke="#0a0c1b" strokeWidth="2" />
      ))}
    </svg>
  );
}
