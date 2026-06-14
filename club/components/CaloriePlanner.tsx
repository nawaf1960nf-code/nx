"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Flame } from "lucide-react";
import { useLocale } from "@/lib/locale-context";
import { calcPlan, type Activity, type CalGoal, type CalorieResult, type Sex } from "@/lib/calories";
import { NumberField, Segmented } from "./ui";

export function CaloriePlanner() {
  const { t } = useLocale();
  const [sex, setSex] = useState<Sex>("male");
  const [age, setAge] = useState("25");
  const [weight, setWeight] = useState("75");
  const [height, setHeight] = useState("175");
  const [bodyFat, setBodyFat] = useState("");
  const [activity, setActivity] = useState<Activity>("moderate");
  const [goal, setGoal] = useState<CalGoal>("maintain");
  const [result, setResult] = useState<CalorieResult | null>(null);

  function calculate() {
    const a = Number(age);
    const w = Number(weight);
    const h = Number(height);
    if (!a || !w || !h) return;
    setResult(
      calcPlan({
        sex,
        age: a,
        weightKg: w,
        heightCm: h,
        bodyFat: bodyFat ? Number(bodyFat) : undefined,
        activity,
        goal,
      }),
    );
  }

  return (
    <div className="grid items-start gap-8 lg:grid-cols-2">
      {/* Inputs */}
      <div className="card-premium p-6 sm:p-8">
        <div className="mb-6 flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-flame-500/15 text-flame-400">
            <Flame className="h-5 w-5" />
          </span>
          <div>
            <h2 className="font-display text-xl font-bold text-white">{t.calories.title}</h2>
            <p className="text-sm text-energy-100/55">{t.calories.subtitle}</p>
          </div>
        </div>

        <div className="space-y-5">
          <Segmented
            label={t.calories.gender}
            value={sex}
            onChange={setSex}
            options={[
              { value: "male", label: t.calories.male },
              { value: "female", label: t.calories.female },
            ]}
          />
          <div className="grid gap-4 sm:grid-cols-3">
            <NumberField label={t.calories.age} value={age} onChange={setAge} min={12} max={90} />
            <NumberField label={t.calories.weight} value={weight} onChange={setWeight} min={30} max={250} />
            <NumberField label={t.calories.height} value={height} onChange={setHeight} min={120} max={220} />
          </div>
          <NumberField
            label={t.calories.bodyFat}
            value={bodyFat}
            onChange={setBodyFat}
            min={3}
            max={60}
            placeholder="—"
          />
          <Segmented
            label={t.calories.activityQ}
            value={activity}
            onChange={setActivity}
            options={[
              { value: "sedentary", label: t.calories.activities.sedentary },
              { value: "light", label: t.calories.activities.light },
              { value: "moderate", label: t.calories.activities.moderate },
              { value: "active", label: t.calories.activities.active },
              { value: "athlete", label: t.calories.activities.athlete },
            ]}
          />
          <Segmented
            label={t.calories.goalQ}
            value={goal}
            onChange={setGoal}
            options={[
              { value: "cut", label: t.calories.goals.cut },
              { value: "maintain", label: t.calories.goals.maintain },
              { value: "bulk", label: t.calories.goals.bulk },
            ]}
          />
        </div>

        <button
          type="button"
          onClick={calculate}
          className="mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-energy-500 font-semibold text-base-950 transition-transform hover:scale-[1.01]"
        >
          {t.calories.calculate}
        </button>
      </div>

      {/* Results */}
      <div className="card-premium p-6 sm:p-8">
        {result ? (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <h3 className="font-display text-lg font-bold text-white">{t.calories.results}</h3>

            <div className="mt-5 rounded-2xl bg-flame-500/10 p-6 text-center">
              <p className="font-display text-5xl font-extrabold text-white tabular-nums">{result.calories}</p>
              <p className="mt-1 text-sm text-energy-100/60">{t.calories.perDay}</p>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3">
              <Macro label={t.calories.protein} value={result.protein} unit={t.calories.grams} color="#34d399" />
              <Macro label={t.calories.carbs} value={result.carbs} unit={t.calories.grams} color="#22d3ee" />
              <Macro label={t.calories.fat} value={result.fat} unit={t.calories.grams} color="#fbbf24" />
            </div>

            <div className="mt-5 flex justify-between rounded-2xl bg-white/[0.03] px-5 py-3 text-sm">
              <span className="text-energy-100/60">
                {t.calories.bmr}: <b className="text-white">{result.bmr}</b>
              </span>
              <span className="text-energy-100/60">
                {t.calories.tdee}: <b className="text-white">{result.tdee}</b>
              </span>
            </div>

            <p className="mt-4 text-xs leading-relaxed text-energy-100/45">{t.calories.note}</p>
          </motion.div>
        ) : (
          <div className="flex h-full min-h-[16rem] flex-col items-center justify-center gap-3 text-center">
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-flame-500/15 text-flame-400">
              <Flame className="h-7 w-7" />
            </span>
            <p className="max-w-xs text-sm text-energy-100/60">{t.calories.fillPrompt}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function Macro({ label, value, unit, color }: { label: string; value: number; unit: string; color: string }) {
  return (
    <div className="rounded-2xl bg-white/[0.03] p-4 text-center">
      <p className="font-display text-2xl font-bold text-white tabular-nums">
        {value}
        <span className="text-sm font-medium text-energy-100/50"> {unit}</span>
      </p>
      <p className="mt-1 text-xs font-semibold" style={{ color }}>
        {label}
      </p>
    </div>
  );
}
