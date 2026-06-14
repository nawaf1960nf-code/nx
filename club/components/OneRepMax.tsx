"use client";

import { useState } from "react";
import { Calculator } from "lucide-react";
import { useLocale } from "@/lib/locale-context";
import { epley1RM } from "@/lib/progress";
import { NumberField } from "./ui";

const PERCENTS = [
  { pct: 100, reps: "1" },
  { pct: 90, reps: "3–4" },
  { pct: 80, reps: "6–8" },
  { pct: 70, reps: "10–12" },
  { pct: 60, reps: "15+" },
];

export function OneRepMax() {
  const { t } = useLocale();
  const [weight, setWeight] = useState("60");
  const [reps, setReps] = useState("5");

  const orm = epley1RM(Number(weight), Number(reps));

  return (
    <div className="card-premium p-6 sm:p-7">
      <div className="mb-5 flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-cyan-500/15 text-cyan-400">
          <Calculator className="h-5 w-5" />
        </span>
        <div>
          <h3 className="font-display text-lg font-bold text-white">{t.progress.strengthTitle}</h3>
          <p className="text-xs text-energy-100/55">{t.progress.strengthHint}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <NumberField label={t.progress.weightLifted} value={weight} onChange={setWeight} min={1} max={500} />
        <NumberField label={t.progress.reps} value={reps} onChange={setReps} min={1} max={20} />
      </div>

      <div className="mt-5 rounded-2xl bg-cyan-500/10 p-5 text-center">
        <p className="text-xs text-energy-100/60">{t.progress.your1rm}</p>
        <p className="font-display text-4xl font-extrabold text-white tabular-nums">
          {orm} <span className="text-lg font-medium text-energy-100/50">{t.progress.kg}</span>
        </p>
      </div>

      {orm > 0 && (
        <div className="mt-5">
          <p className="mb-2 text-xs font-semibold text-energy-100/70">{t.progress.percentTable}</p>
          <div className="space-y-1.5">
            {PERCENTS.map((r) => (
              <div
                key={r.pct}
                className="flex items-center justify-between rounded-lg bg-white/[0.03] px-3.5 py-2 text-sm"
              >
                <span className="text-energy-100/60">
                  {r.pct}% · {r.reps} {t.progress.reps}
                </span>
                <span className="font-semibold text-white tabular-nums">
                  {Math.round((orm * r.pct) / 100)} {t.progress.kg}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
