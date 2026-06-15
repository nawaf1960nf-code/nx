"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, ChevronRight, Dumbbell, PartyPopper, Timer, X } from "lucide-react";
import { useLocale } from "@/lib/locale-context";
import { MUSCLES } from "@/lib/muscles";
import type { Goal, WorkoutPlan } from "@/lib/generator";
import { logWorkout } from "@/lib/activity";
import { EXERCISES } from "@/lib/exercises";
import { ExerciseDemo } from "./ExerciseDemo";

const PLAN_KEY = "club:plan";

/** Rest seconds between sets, scaled by training goal. */
const REST_BY_GOAL: Record<Goal, number> = {
  strength: 120,
  muscle: 75,
  fatloss: 45,
  general: 60,
};

type Phase = "pick" | "active" | "rest" | "done";

export function SessionPlayer() {
  const { t, locale } = useLocale();
  const [plan, setPlan] = useState<WorkoutPlan | null>(null);
  const [dayIndex, setDayIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("pick");
  const [exIndex, setExIndex] = useState(0);
  const [setNum, setSetNum] = useState(1);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const restTotal = useRef(60);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(PLAN_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw) as WorkoutPlan;
      // Drop plans saved before the exercise library changed (stale ids with
      // no demo images) so the member regenerates a fresh, illustrated plan.
      const known = new Set(EXERCISES.map((e) => e.id));
      const stale = saved.days?.some((d) => d.exercises.some((e) => !known.has(e.id) && !e.images));
      if (stale) {
        localStorage.removeItem(PLAN_KEY);
        return;
      }
      setPlan(saved);
    } catch {
      /* ignore */
    }
  }, []);

  // Rest countdown.
  useEffect(() => {
    if (phase !== "rest") return;
    if (secondsLeft <= 0) {
      advanceAfterRest();
      return;
    }
    const id = window.setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, secondsLeft]);

  if (!plan) {
    return (
      <Empty
        title={t.session.noPlan}
        cta={t.session.noPlanCta}
        href="/workout"
      />
    );
  }

  const day = plan.days[dayIndex];
  const exercise = day?.exercises[exIndex];
  const rest = REST_BY_GOAL[plan.goal];

  function startSession(i: number) {
    setDayIndex(i);
    setExIndex(0);
    setSetNum(1);
    setPhase("active");
  }

  function completeSet() {
    if (!exercise) return;
    if (setNum < exercise.sets) {
      restTotal.current = rest;
      setSecondsLeft(rest);
      setPhase("rest");
    } else {
      goNextExercise();
    }
  }

  function advanceAfterRest() {
    setSetNum((n) => n + 1);
    setPhase("active");
  }

  function goNextExercise() {
    if (exIndex + 1 < day.exercises.length) {
      setExIndex((i) => i + 1);
      setSetNum(1);
      setPhase("active");
    } else {
      logWorkout();
      window.dispatchEvent(new Event("club:activity-changed"));
      setPhase("done");
    }
  }

  // ── Day picker ──────────────────────────────────────────────────────
  if (phase === "pick") {
    return (
      <div>
        <Heading title={t.session.title} subtitle={t.session.subtitle} />
        <p className="mb-3 text-sm font-medium text-energy-100/70">{t.session.pickDay}</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {plan.days.map((d, i) => (
            <button
              key={i}
              type="button"
              onClick={() => startSession(i)}
              className="card-premium flex items-center justify-between p-5 text-start transition-colors hover:border-energy-400/40"
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-energy-100/50">
                  {t.workout.dayLabel(i + 1)}
                </p>
                <p className="mt-0.5 font-display text-lg font-bold text-white">
                  {t.workout.splitNames[d.key]}
                </p>
                <p className="text-xs text-energy-100/55">
                  {d.exercises.length} · {t.workout.title}
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-energy-400 rtl:rotate-180" />
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ── Completion ──────────────────────────────────────────────────────
  if (phase === "done") {
    return (
      <div className="card-premium flex flex-col items-center gap-4 p-10 text-center">
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="grid h-16 w-16 place-items-center rounded-2xl bg-energy-500/15 text-energy-400"
        >
          <PartyPopper className="h-8 w-8" />
        </motion.span>
        <h2 className="font-display text-2xl font-bold text-white">{t.session.complete}</h2>
        <p className="text-energy-100/65">{t.session.completeDesc}</p>
        <div className="mt-2 flex gap-3">
          <Link
            href="/progress"
            className="inline-flex min-h-11 items-center rounded-xl bg-energy-500 px-5 font-semibold text-base-950"
          >
            {t.session.backToProgress}
          </Link>
          <button
            type="button"
            onClick={() => setPhase("pick")}
            className="inline-flex min-h-11 items-center rounded-xl border border-white/12 px-5 font-semibold text-energy-100/80"
          >
            {t.session.title}
          </button>
        </div>
      </div>
    );
  }

  // ── Active / rest ───────────────────────────────────────────────────
  const totalEx = day.exercises.length;
  const progress = ((exIndex + (setNum - 1) / exercise.sets) / totalEx) * 100;

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <span className="text-sm font-semibold text-energy-300">
          {t.workout.splitNames[day.key]}
        </span>
        <button
          type="button"
          onClick={() => setPhase("pick")}
          className="inline-flex items-center gap-1 text-sm text-energy-100/55 hover:text-white"
        >
          <X className="h-4 w-4" /> {t.session.exit}
        </button>
      </div>

      {/* progress bar */}
      <div className="mb-6 h-1.5 w-full overflow-hidden rounded-full bg-white/8">
        <motion.div
          className="h-full rounded-full bg-energy-500"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>

      <p className="mb-2 text-center text-xs font-semibold uppercase tracking-wider text-energy-100/45">
        {t.session.exerciseN(exIndex + 1, totalEx)}
      </p>

      <AnimatePresence mode="wait">
        {phase === "rest" ? (
          <motion.div
            key="rest"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="card-premium flex flex-col items-center gap-5 p-10 text-center"
          >
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-cyan-500/15 text-cyan-400">
              <Timer className="h-7 w-7" />
            </span>
            <p className="text-sm font-semibold uppercase tracking-wider text-energy-100/55">
              {t.session.rest}
            </p>
            <p className="font-display text-6xl font-extrabold text-white tabular-nums">
              {secondsLeft}
            </p>
            <button
              type="button"
              onClick={() => {
                setSecondsLeft(0);
                advanceAfterRest();
              }}
              className="inline-flex min-h-11 items-center rounded-xl border border-white/12 px-5 font-semibold text-energy-100/80 hover:text-white"
            >
              {t.session.skipRest}
            </button>
          </motion.div>
        ) : (
          <motion.div
            key={`ex-${exIndex}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="card-premium p-8 text-center"
          >
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-energy-500/15 text-energy-400">
              <Dumbbell className="h-7 w-7" />
            </span>
            <h2 className="mt-4 font-display text-2xl font-bold text-white">
              {exercise.name[locale]}
            </h2>
            <p className="mt-1 text-sm text-energy-100/55">
              {MUSCLES[exercise.muscle].label[locale]} · {exercise.equipment[locale]}
            </p>
            <div className="mx-auto mt-4 max-w-[240px]">
              <ExerciseDemo
                images={exercise.images ?? EXERCISES.find((e) => e.id === exercise.id)?.images}
                alt={exercise.name[locale]}
              />
            </div>

            <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/[0.05] px-5 py-2">
              <span className="text-sm text-energy-100/60">{t.session.set}</span>
              <span className="font-display text-xl font-bold text-white tabular-nums">
                {setNum}
              </span>
              <span className="text-sm text-energy-100/40">
                {t.session.of} {exercise.sets}
              </span>
              <span className="ms-2 rounded-full bg-energy-500/15 px-2.5 py-0.5 text-sm font-bold text-energy-300 tabular-nums">
                × {exercise.reps}
              </span>
            </div>

            <button
              type="button"
              onClick={completeSet}
              className="mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-energy-500 font-semibold text-base-950 transition-transform hover:scale-[1.01]"
            >
              <CheckCircle2 className="h-5 w-5" />
              {setNum < exercise.sets
                ? t.session.setDone
                : exIndex + 1 < totalEx
                  ? t.session.next
                  : t.session.finish}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Heading({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-6 text-center">
      <h1 className="font-display text-2xl font-bold text-white sm:text-3xl">{title}</h1>
      <p className="mt-2 text-energy-100/60">{subtitle}</p>
    </div>
  );
}

function Empty({ title, cta, href }: { title: string; cta: string; href: string }) {
  return (
    <div className="card-premium flex flex-col items-center gap-4 p-10 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white/[0.05] text-energy-100/50">
        <Dumbbell className="h-7 w-7" />
      </span>
      <p className="text-energy-100/70">{title}</p>
      <Link
        href={href}
        className="inline-flex min-h-11 items-center rounded-xl bg-energy-500 px-5 font-semibold text-base-950"
      >
        {cta}
      </Link>
    </div>
  );
}
