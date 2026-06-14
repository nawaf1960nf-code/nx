"use client";

import { useEffect, useState } from "react";
import { Activity, Flame, Scale, TrendingDown, TrendingUp } from "lucide-react";
import { useLocale } from "@/lib/locale-context";
import { getStats, getWorkoutDays, type ActivityStats } from "@/lib/activity";
import { addWeight, getWeights, getWeightSummary, type WeightEntry, type WeightSummary } from "@/lib/progress";
import { WeightChart } from "./WeightChart";
import { ActivityHeatmap } from "./ActivityHeatmap";
import { OneRepMax } from "./OneRepMax";
import { NumberField } from "./ui";

export function ProgressDashboard() {
  const { t } = useLocale();
  const [entries, setEntries] = useState<WeightEntry[]>([]);
  const [summary, setSummary] = useState<WeightSummary>({ latest: null, start: null, change: null, count: 0 });
  const [stats, setStats] = useState<ActivityStats>({ total: 0, thisWeek: 0, dayStreak: 0, lastWorkout: null });
  const [workoutDays, setWorkoutDays] = useState<number[]>([]);
  const [input, setInput] = useState("");

  function refresh() {
    setEntries(getWeights());
    setSummary(getWeightSummary());
    setStats(getStats());
    setWorkoutDays(getWorkoutDays());
  }

  useEffect(() => {
    refresh();
    window.addEventListener("club:activity-changed", refresh);
    return () => window.removeEventListener("club:activity-changed", refresh);
  }, []);

  function save() {
    const kg = Number(input);
    if (!kg) return;
    addWeight(kg);
    setInput("");
    refresh();
  }

  const losing = summary.change !== null && summary.change < 0;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="font-display text-2xl font-bold text-white sm:text-3xl">{t.progress.title}</h1>
        <p className="mt-2 text-energy-100/60">{t.progress.subtitle}</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard icon={Flame} color="#fb923c" value={stats.dayStreak} label={t.progress.streak} />
        <StatCard icon={Activity} color="#34d399" value={stats.thisWeek} label={t.progress.thisWeek} />
        <StatCard icon={Activity} color="#22d3ee" value={stats.total} label={t.progress.total} />
        <StatCard
          icon={Scale}
          color="#a3e635"
          value={summary.latest ?? "—"}
          label={t.progress.latest}
          suffix={summary.latest ? t.progress.kg : ""}
        />
      </div>

      {/* Bodyweight */}
      <div className="card-premium p-6 sm:p-8">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-lg font-bold text-white">{t.progress.weightTitle}</h2>
          {summary.change !== null && (
            <span
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${
                losing ? "bg-energy-500/15 text-energy-300" : "bg-flame-500/15 text-flame-400"
              }`}
            >
              {losing ? <TrendingDown className="h-3.5 w-3.5" /> : <TrendingUp className="h-3.5 w-3.5" />}
              {summary.change > 0 ? "+" : ""}
              {summary.change} {t.progress.kg}
            </span>
          )}
        </div>

        <div className="mb-5 flex items-end gap-3">
          <div className="flex-1 sm:max-w-xs">
            <NumberField label={t.progress.addWeight} value={input} onChange={setInput} min={30} max={250} placeholder="—" />
          </div>
          <button
            type="button"
            onClick={save}
            className="inline-flex min-h-11 items-center rounded-xl bg-energy-500 px-5 font-semibold text-base-950"
          >
            {t.progress.save}
          </button>
        </div>

        {entries.length >= 2 ? (
          <WeightChart entries={entries} />
        ) : (
          <p className="rounded-xl bg-white/[0.03] px-4 py-6 text-center text-sm text-energy-100/55">
            {t.progress.noWeights}
          </p>
        )}
      </div>

      {/* Consistency heatmap */}
      <div className="card-premium p-6 sm:p-8">
        <h2 className="font-display text-lg font-bold text-white">{t.progress.consistency}</h2>
        <p className="mb-4 text-xs text-energy-100/55">{t.progress.heatmapHint}</p>
        <ActivityHeatmap workoutDays={workoutDays} />
      </div>

      {/* 1RM calculator */}
      <OneRepMax />
    </div>
  );
}

function StatCard({
  icon: Icon,
  color,
  value,
  label,
  suffix,
}: {
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  value: React.ReactNode;
  label: string;
  suffix?: string;
}) {
  return (
    <div className="card-premium flex flex-col items-center gap-1 p-4 text-center">
      <span className="mb-1 grid h-9 w-9 place-items-center rounded-xl" style={{ background: `${color}22`, color }}>
        <Icon className="h-4 w-4" />
      </span>
      <span className="font-display text-2xl font-bold text-white tabular-nums">
        {value}
        {suffix ? <span className="text-sm font-medium text-energy-100/50"> {suffix}</span> : null}
      </span>
      <span className="text-[11px] text-energy-100/55">{label}</span>
    </div>
  );
}
