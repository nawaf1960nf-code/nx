"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CalendarRange, CheckCircle2, Dumbbell, PlayCircle, RefreshCw, Sparkles } from "lucide-react";
import { useLocale } from "@/lib/locale-context";
import { MUSCLES } from "@/lib/muscles";
import {
  generatePlan,
  type Env,
  type Goal,
  type WorkoutPlan,
} from "@/lib/generator";
import type { Level } from "@/lib/exercises";
import { logWorkout } from "@/lib/activity";
import { Segmented } from "./ui";

const PLAN_KEY = "club:plan";

export function WorkoutGenerator() {
  const { t, locale } = useLocale();
  const [days, setDays] = useState<"3" | "4" | "5" | "6">("4");
  const [goal, setGoal] = useState<Goal>("muscle");
  const [level, setLevel] = useState<Level>("beginner");
  const [env, setEnv] = useState<Env>("gym");
  const [plan, setPlan] = useState<WorkoutPlan | null>(null);
  const [logged, setLogged] = useState(false);

  // Restore a previously generated plan.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(PLAN_KEY);
      if (raw) setPlan(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  function build() {
    const p = generatePlan({ perWeek: Number(days), goal, env, level });
    setPlan(p);
    setLogged(false);
    try {
      localStorage.setItem(PLAN_KEY, JSON.stringify(p));
    } catch {
      /* ignore */
    }
  }

  function markDone() {
    logWorkout();
    setLogged(true);
    window.dispatchEvent(new Event("club:activity-changed"));
  }

  return (
    <div className="space-y-8">
      {/* Configurator */}
      <div className="card-premium p-6 sm:p-8">
        <div className="mb-6 flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-cyan-500/15 text-cyan-400">
            <CalendarRange className="h-5 w-5" />
          </span>
          <div>
            <h2 className="font-display text-xl font-bold text-white">{t.workout.title}</h2>
            <p className="text-sm text-energy-100/55">{t.workout.subtitle}</p>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <Segmented
            label={t.workout.daysQ}
            value={days}
            onChange={setDays}
            options={(["3", "4", "5", "6"] as const).map((d) => ({ value: d, label: d }))}
          />
          <Segmented
            label={t.workout.envQ}
            value={env}
            onChange={setEnv}
            options={[
              { value: "gym", label: t.workout.envs.gym },
              { value: "home", label: t.workout.envs.home },
            ]}
          />
          <Segmented
            label={t.workout.goalQ}
            value={goal}
            onChange={setGoal}
            options={[
              { value: "muscle", label: t.workout.goals.muscle },
              { value: "fatloss", label: t.workout.goals.fatloss },
              { value: "strength", label: t.workout.goals.strength },
              { value: "general", label: t.workout.goals.general },
            ]}
          />
          <Segmented
            label={t.workout.levelQ}
            value={level}
            onChange={setLevel}
            options={[
              { value: "beginner", label: t.workout.levels.beginner },
              { value: "intermediate", label: t.workout.levels.intermediate },
              { value: "advanced", label: t.workout.levels.advanced },
            ]}
          />
        </div>

        <button
          type="button"
          onClick={build}
          className="mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-energy-500 font-semibold text-base-950 transition-transform hover:scale-[1.01]"
        >
          {plan ? <RefreshCw className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
          {plan ? t.workout.regenerate : t.workout.generate}
        </button>
      </div>

      {/* Plan */}
      {plan && (
        <div>
          <h3 className="mb-4 font-display text-lg font-bold text-white">{t.workout.yourPlan}</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {plan.days.map((day, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="card-premium p-5"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-energy-100/50">
                    {t.workout.dayLabel(i + 1)}
                  </span>
                  <span className="rounded-full bg-energy-500/15 px-3 py-0.5 text-xs font-bold text-energy-300">
                    {t.workout.splitNames[day.key]}
                  </span>
                </div>
                <ul className="space-y-2.5">
                  {day.exercises.map((ex) => (
                    <li key={ex.id} className="flex items-start justify-between gap-3">
                      <span className="flex items-start gap-2 text-sm text-white">
                        <Dumbbell className="mt-0.5 h-3.5 w-3.5 shrink-0 text-energy-400" />
                        <span>
                          {ex.name[locale]}
                          <span className="block text-[11px] text-energy-100/45">
                            {MUSCLES[ex.muscle].label[locale]} · {ex.equipment[locale]}
                          </span>
                        </span>
                      </span>
                      <span className="shrink-0 whitespace-nowrap text-xs font-semibold text-energy-200/80 tabular-nums">
                        {ex.sets} × {ex.reps}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/session"
              className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-energy-500 px-5 font-semibold text-base-950 transition-transform hover:scale-[1.02]"
            >
              <PlayCircle className="h-5 w-5" /> {t.session.start}
            </Link>
            {logged ? (
              <span className="inline-flex items-center gap-2 rounded-xl bg-energy-500/15 px-5 py-3 font-semibold text-energy-300">
                <CheckCircle2 className="h-5 w-5" /> {t.workout.doneToday}
              </span>
            ) : (
              <button
                type="button"
                onClick={markDone}
                className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-energy-400/40 bg-energy-500/10 px-5 font-semibold text-energy-200 transition-colors hover:bg-energy-500/20"
              >
                <CheckCircle2 className="h-5 w-5" /> {t.workout.markDone}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
