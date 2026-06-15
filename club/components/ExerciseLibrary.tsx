"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ListChecks, Search } from "lucide-react";
import { useLocale } from "@/lib/locale-context";
import { EXERCISES, type Level } from "@/lib/exercises";
import { MUSCLES, type MuscleId } from "@/lib/muscles";
import { ExerciseDemo } from "./ExerciseDemo";

const LEVEL_COLOR: Record<Level, string> = {
  beginner: "#34d399",
  intermediate: "#fbbf24",
  advanced: "#fb7185",
};

export function ExerciseLibrary() {
  const { t, locale } = useLocale();
  const [query, setQuery] = useState("");
  const [muscle, setMuscle] = useState<MuscleId | "all">("all");
  const [equip, setEquip] = useState<string>("all");
  const [level, setLevel] = useState<Level | "all">("all");

  // Unique equipment options (bilingual, keyed by English label).
  const equipment = useMemo(() => {
    const seen = new Map<string, { en: string; ar: string }>();
    for (const e of EXERCISES) if (!seen.has(e.equipment.en)) seen.set(e.equipment.en, e.equipment);
    return [...seen.values()];
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return EXERCISES.filter((e) => {
      if (q && !e.name.en.toLowerCase().includes(q) && !e.name.ar.includes(query.trim())) return false;
      if (muscle !== "all" && e.primary !== muscle && !e.secondary.includes(muscle)) return false;
      if (equip !== "all" && e.equipment.en !== equip) return false;
      if (level !== "all" && e.level !== level) return false;
      return true;
    });
  }, [query, muscle, equip, level]);

  const selectClass =
    "min-h-10 rounded-xl border border-white/10 bg-base-850 px-3 text-sm text-white outline-none focus:border-energy-400";

  return (
    <div>
      <div className="mb-6 text-center">
        <h1 className="font-display text-2xl font-bold text-white sm:text-3xl">{t.library.title}</h1>
        <p className="mt-2 text-energy-100/60">{t.library.subtitle}</p>
      </div>

      {/* Filters */}
      <div className="card-premium mb-6 p-4 sm:p-5">
        <div className="relative mb-3">
          <Search className="pointer-events-none absolute top-1/2 h-4 w-4 -translate-y-1/2 text-energy-100/40 ltr:left-3.5 rtl:right-3.5" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.library.search}
            className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-2.5 text-white outline-none transition-colors focus:border-energy-400 ltr:pl-10 ltr:pr-4 rtl:pr-10 rtl:pl-4"
          />
        </div>
        <div className="grid gap-2 sm:grid-cols-3">
          <select value={muscle} onChange={(e) => setMuscle(e.target.value as MuscleId | "all")} className={selectClass}>
            <option value="all">{t.library.allMuscles}</option>
            {Object.values(MUSCLES).map((m) => (
              <option key={m.id} value={m.id}>
                {m.label[locale]}
              </option>
            ))}
          </select>
          <select value={equip} onChange={(e) => setEquip(e.target.value)} className={selectClass}>
            <option value="all">{t.library.allEquip}</option>
            {equipment.map((eq) => (
              <option key={eq.en} value={eq.en}>
                {eq[locale]}
              </option>
            ))}
          </select>
          <select value={level} onChange={(e) => setLevel(e.target.value as Level | "all")} className={selectClass}>
            <option value="all">{t.library.allLevels}</option>
            <option value="beginner">{t.map.level.beginner}</option>
            <option value="intermediate">{t.map.level.intermediate}</option>
            <option value="advanced">{t.map.level.advanced}</option>
          </select>
        </div>
      </div>

      <p className="mb-4 text-sm text-energy-100/55">{t.library.results(filtered.length)}</p>

      {filtered.length === 0 ? (
        <p className="rounded-xl bg-white/[0.03] px-4 py-10 text-center text-sm text-energy-100/55">
          {t.library.none}
        </p>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {filtered.map((ex, i) => (
            <motion.details
              key={ex.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.015, 0.2) }}
              className="group card-premium p-5 open:bg-white/[0.05]"
            >
              <summary className="flex cursor-pointer list-none items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-white">{ex.name[locale]}</p>
                  <p className="mt-0.5 text-xs text-energy-100/50">
                    {MUSCLES[ex.primary].label[locale]} · {ex.equipment[locale]}
                  </p>
                </div>
                <span
                  className="shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
                  style={{ background: `${LEVEL_COLOR[ex.level]}22`, color: LEVEL_COLOR[ex.level] }}
                >
                  {t.map.level[ex.level]}
                </span>
              </summary>
              <div className="mt-3">
                <ExerciseDemo images={ex.images} alt={ex.name[locale]} className="mb-3 max-w-[220px]" />
                <p className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-energy-300">
                  <ListChecks className="h-3.5 w-3.5" /> {t.library.steps}
                </p>
                <ol className="space-y-1.5 text-sm">
                  {ex.steps[locale].map((s, si) => (
                    <li key={si} className="flex gap-2 text-energy-100/75">
                      <span className="font-display text-xs font-bold text-energy-400">{si + 1}.</span>
                      {s}
                    </li>
                  ))}
                </ol>
              </div>
            </motion.details>
          ))}
        </div>
      )}
    </div>
  );
}
