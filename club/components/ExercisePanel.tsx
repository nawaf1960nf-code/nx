"use client";

import { motion } from "framer-motion";
import { Dumbbell, ListChecks, MousePointerClick } from "lucide-react";
import { useLocale } from "@/lib/locale-context";
import { MUSCLES, type MuscleId } from "@/lib/muscles";
import { exercisesForMuscle, type Level } from "@/lib/exercises";
import { ExerciseDemo } from "./ExerciseDemo";

const LEVEL_COLOR: Record<Level, string> = {
  beginner: "#34d399",
  intermediate: "#fbbf24",
  advanced: "#fb7185",
};

export function ExercisePanel({ muscle }: { muscle: MuscleId | null }) {
  const { t, locale } = useLocale();

  if (!muscle) {
    return (
      <div className="card-premium flex min-h-[20rem] flex-col items-center justify-center gap-3 p-8 text-center">
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-energy-500/15 text-energy-400">
          <MousePointerClick className="h-7 w-7" />
        </span>
        <h3 className="font-display text-lg font-semibold text-white">{t.map.none}</h3>
        <p className="max-w-xs text-sm text-energy-100/60">{t.map.nonePrompt}</p>
      </div>
    );
  }

  const list = exercisesForMuscle(muscle);
  const name = MUSCLES[muscle].label[locale];

  return (
    <div className="card-premium p-6 sm:p-7">
      <div className="mb-5 flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-energy-500/15 text-energy-400">
          <Dumbbell className="h-5 w-5" />
        </span>
        <div>
          <h3 className="font-display text-xl font-bold text-white">{t.map.exercisesFor(name)}</h3>
          <p className="text-xs text-energy-100/55">{t.map.count(list.length)}</p>
        </div>
      </div>

      <div className="space-y-3">
        {list.map((ex, i) => (
          <motion.details
            key={ex.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(i * 0.03, 0.3) }}
            className="group rounded-2xl border border-white/8 bg-white/[0.03] p-4 open:bg-white/[0.05]"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
              <span className="font-semibold text-white">{ex.name[locale]}</span>
              <span
                className="shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
                style={{ background: `${LEVEL_COLOR[ex.level]}22`, color: LEVEL_COLOR[ex.level] }}
              >
                {t.map.level[ex.level]}
              </span>
            </summary>

            <div className="mt-3 space-y-3 text-sm">
              <ExerciseDemo images={ex.images} alt={ex.name[locale]} className="max-w-[220px]" />
              <p className="text-energy-100/70">
                <span className="font-medium text-energy-100/90">{t.map.equipment}:</span>{" "}
                {ex.equipment[locale]}
              </p>
              <div>
                <p className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-energy-300">
                  <ListChecks className="h-3.5 w-3.5" /> {t.map.steps}
                </p>
                <ol className="space-y-1.5">
                  {ex.steps[locale].map((s, si) => (
                    <li key={si} className="flex gap-2 text-energy-100/75">
                      <span className="font-display text-xs font-bold text-energy-400">{si + 1}.</span>
                      {s}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </motion.details>
        ))}
      </div>
    </div>
  );
}
