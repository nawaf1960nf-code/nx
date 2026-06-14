"use client";

import { useState } from "react";
import { useLocale } from "@/lib/locale-context";
import { MUSCLES, type MuscleId } from "@/lib/muscles";
import { BODY, type Gender, type Side } from "@/lib/body-data";

/**
 * Map the anatomical dataset's muscle slugs onto our exercise taxonomy.
 * Slugs not present here (head, hair, neck, hands, feet, ankles, knees) are
 * drawn as a faint, non-interactive silhouette.
 */
const SLUG_TO_MUSCLE: Record<string, MuscleId> = {
  chest: "chest",
  deltoids: "shoulders",
  biceps: "biceps",
  triceps: "triceps",
  forearm: "forearms",
  abs: "abs",
  obliques: "obliques",
  trapezius: "traps",
  "upper-back": "lats",
  "lower-back": "lowerBack",
  gluteal: "glutes",
  quadriceps: "quads",
  adductors: "quads",
  hamstring: "hamstrings",
  calves: "calves",
  tibialis: "calves",
};

export function BodyMap({
  selected,
  onSelect,
}: {
  selected: MuscleId | null;
  onSelect: (m: MuscleId) => void;
}) {
  const { t, locale } = useLocale();
  const [gender, setGender] = useState<Gender>("male");
  const [side, setSide] = useState<Side>("front");

  const view = BODY[gender][side];

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Gender toggle */}
      <div className="inline-flex rounded-full border border-white/10 bg-white/[0.04] p-1">
        {(["male", "female"] as Gender[]).map((g) => (
          <button
            key={g}
            type="button"
            onClick={() => setGender(g)}
            aria-pressed={gender === g}
            className={`min-h-9 rounded-full px-5 text-sm font-semibold transition-colors ${
              gender === g ? "bg-energy-500 text-base-950" : "text-energy-100/70 hover:text-white"
            }`}
          >
            {g === "male" ? t.map.male : t.map.female}
          </button>
        ))}
      </div>

      {/* Front / Back toggle */}
      <div className="inline-flex rounded-full border border-white/10 bg-white/[0.04] p-1">
        {(["front", "back"] as Side[]).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setSide(s)}
            aria-pressed={side === s}
            className={`min-h-9 rounded-full px-5 text-sm font-semibold transition-colors ${
              side === s ? "bg-energy-500 text-base-950" : "text-energy-100/70 hover:text-white"
            }`}
          >
            {s === "front" ? t.map.front : t.map.back}
          </button>
        ))}
      </div>

      <p className="text-xs text-energy-100/55">{t.map.hint}</p>

      <div className="bodymap w-full max-w-[280px]">
        <svg
          viewBox={view.viewBox}
          className="h-auto w-full"
          role="img"
          aria-label={`${gender} body ${side} muscle map`}
        >
          {/* Body outline */}
          {view.outline && (
            <path className="body-outline" d={view.outline} fill="rgba(255,255,255,0.025)" />
          )}

          {/* Non-muscle parts (head, hands, feet…) as faint silhouette */}
          {view.parts.map((part) =>
            SLUG_TO_MUSCLE[part.slug] ? null : (
              <g key={part.slug} className="silhouette" style={{ pointerEvents: "none" }}>
                {part.paths.map((d, i) => (
                  <path key={i} d={d} />
                ))}
              </g>
            ),
          )}

          {/* Clickable muscle regions */}
          {view.parts.map((part) => {
            const muscle = SLUG_TO_MUSCLE[part.slug];
            if (!muscle) return null;
            return (
              <g
                key={part.slug}
                className={`region ${selected === muscle ? "is-active" : ""}`}
                role="button"
                tabIndex={0}
                aria-label={MUSCLES[muscle].label[locale]}
                aria-pressed={selected === muscle}
                onClick={() => onSelect(muscle)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelect(muscle);
                  }
                }}
              >
                {part.paths.map((d, i) => (
                  <path key={i} d={d} />
                ))}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
