"use client";

import { useState } from "react";
import { useLocale } from "@/lib/locale-context";
import { MUSCLES, type MuscleId } from "@/lib/muscles";

type View = "front" | "back";

/**
 * Interactive front/back muscle map. Each muscle group is a clickable SVG
 * region. Clicking (or pressing Enter/Space on) a region calls `onSelect`.
 * Stylised — recognisable body silhouette with distinct, tappable regions.
 */
export function BodyMap({
  selected,
  onSelect,
}: {
  selected: MuscleId | null;
  onSelect: (m: MuscleId) => void;
}) {
  const { t, locale } = useLocale();
  const [view, setView] = useState<View>("front");

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Front / Back toggle */}
      <div className="inline-flex rounded-full border border-white/10 bg-white/[0.04] p-1">
        {(["front", "back"] as View[]).map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => setView(v)}
            aria-pressed={view === v}
            className={`min-h-9 rounded-full px-5 text-sm font-semibold transition-colors ${
              view === v ? "bg-energy-500 text-base-950" : "text-energy-100/70 hover:text-white"
            }`}
          >
            {v === "front" ? t.map.front : t.map.back}
          </button>
        ))}
      </div>

      <p className="text-xs text-energy-100/55">{t.map.hint}</p>

      <div className="bodymap w-full max-w-[300px]">
        {view === "front" ? (
          <FrontBody selected={selected} onSelect={onSelect} locale={locale} />
        ) : (
          <BackBody selected={selected} onSelect={onSelect} locale={locale} />
        )}
      </div>
    </div>
  );
}

interface RegionProps {
  id: MuscleId;
  selected: MuscleId | null;
  onSelect: (m: MuscleId) => void;
  locale: "ar" | "en";
  children: React.ReactNode;
}

function Region({ id, selected, onSelect, locale, children }: RegionProps) {
  return (
    <g
      className={`region ${selected === id ? "is-active" : ""}`}
      role="button"
      tabIndex={0}
      aria-label={MUSCLES[id].label[locale]}
      aria-pressed={selected === id}
      onClick={() => onSelect(id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(id);
        }
      }}
    >
      {children}
    </g>
  );
}

/** Anterior (front) view. */
function FrontBody({
  selected,
  onSelect,
  locale,
}: {
  selected: MuscleId | null;
  onSelect: (m: MuscleId) => void;
  locale: "ar" | "en";
}) {
  const rp = (id: MuscleId) => ({ id, selected, onSelect, locale });
  return (
    <svg viewBox="0 0 240 460" className="h-auto w-full" role="img" aria-label="Front body muscle map">
      {/* Head + neck (non-interactive) */}
      <ellipse className="silhouette" cx="120" cy="34" rx="21" ry="25" />
      <path className="silhouette" d="M108 56 h24 v18 q-12 8 -24 0 z" />

      {/* Shoulders */}
      <Region {...rp("shoulders")}>
        <ellipse cx="74" cy="118" rx="22" ry="19" />
        <ellipse cx="166" cy="118" rx="22" ry="19" />
      </Region>

      {/* Chest */}
      <Region {...rp("chest")}>
        <path d="M96 102 q24 -10 0 0 q-2 0 -2 2 v30 q0 10 11 13 q13 3 15 -10 v-33 q-1 -3 -4 -3 q-12 0 -20 1 z" />
        <path d="M144 102 q-24 -10 0 0 q2 0 2 2 v30 q0 10 -11 13 q-13 3 -15 -10 v-33 q1 -3 4 -3 q12 0 20 1 z" />
      </Region>

      {/* Biceps (front of upper arm) */}
      <Region {...rp("biceps")}>
        <ellipse cx="58" cy="166" rx="13" ry="32" />
        <ellipse cx="182" cy="166" rx="13" ry="32" />
      </Region>

      {/* Forearms */}
      <Region {...rp("forearms")}>
        <ellipse cx="47" cy="226" rx="11" ry="34" />
        <ellipse cx="193" cy="226" rx="11" ry="34" />
      </Region>

      {/* Abs */}
      <Region {...rp("abs")}>
        <rect x="100" y="150" width="40" height="74" rx="12" />
      </Region>

      {/* Obliques */}
      <Region {...rp("obliques")}>
        <path d="M92 156 q-6 30 6 64 q-12 -6 -14 -30 q-1 -22 8 -34 z" />
        <path d="M148 156 q6 30 -6 64 q12 -6 14 -30 q1 -22 -8 -34 z" />
      </Region>

      {/* Quads */}
      <Region {...rp("quads")}>
        <path d="M96 234 q-12 50 -4 92 q4 14 16 14 q10 0 10 -16 v-86 q-9 -6 -22 -4 z" />
        <path d="M144 234 q12 50 4 92 q-4 14 -16 14 q-10 0 -10 -16 v-86 q9 -6 22 -4 z" />
      </Region>

      {/* Calves (front / shin) */}
      <Region {...rp("calves")}>
        <ellipse cx="102" cy="398" rx="13" ry="40" />
        <ellipse cx="138" cy="398" rx="13" ry="40" />
      </Region>
    </svg>
  );
}

/** Posterior (back) view. */
function BackBody({
  selected,
  onSelect,
  locale,
}: {
  selected: MuscleId | null;
  onSelect: (m: MuscleId) => void;
  locale: "ar" | "en";
}) {
  const rp = (id: MuscleId) => ({ id, selected, onSelect, locale });
  return (
    <svg viewBox="0 0 240 460" className="h-auto w-full" role="img" aria-label="Back body muscle map">
      {/* Head + neck */}
      <ellipse className="silhouette" cx="120" cy="34" rx="21" ry="25" />
      <path className="silhouette" d="M108 56 h24 v18 q-12 8 -24 0 z" />

      {/* Shoulders (rear delts) */}
      <Region {...rp("shoulders")}>
        <ellipse cx="74" cy="118" rx="22" ry="19" />
        <ellipse cx="166" cy="118" rx="22" ry="19" />
      </Region>

      {/* Traps */}
      <Region {...rp("traps")}>
        <path d="M104 92 q16 -8 32 0 q6 4 4 16 q-20 8 -40 0 q-2 -12 4 -16 z" />
      </Region>

      {/* Triceps (back of upper arm) */}
      <Region {...rp("triceps")}>
        <ellipse cx="58" cy="166" rx="13" ry="32" />
        <ellipse cx="182" cy="166" rx="13" ry="32" />
      </Region>

      {/* Forearms */}
      <Region {...rp("forearms")}>
        <ellipse cx="47" cy="226" rx="11" ry="34" />
        <ellipse cx="193" cy="226" rx="11" ry="34" />
      </Region>

      {/* Lats / back */}
      <Region {...rp("lats")}>
        <path d="M98 124 q-12 26 -2 56 q14 6 24 0 v-58 q-10 -4 -22 2 z" />
        <path d="M142 124 q12 26 2 56 q-14 6 -24 0 v-58 q10 -4 22 2 z" />
      </Region>

      {/* Lower back */}
      <Region {...rp("lowerBack")}>
        <rect x="104" y="182" width="32" height="34" rx="10" />
      </Region>

      {/* Glutes */}
      <Region {...rp("glutes")}>
        <path d="M100 220 q-12 8 -10 28 q2 16 18 16 q12 0 12 -14 v-28 q-10 -6 -20 -2 z" />
        <path d="M140 220 q12 8 10 28 q-2 16 -18 16 q-12 0 -12 -14 v-28 q10 -6 20 -2 z" />
      </Region>

      {/* Hamstrings */}
      <Region {...rp("hamstrings")}>
        <path d="M98 268 q-10 44 -2 78 q4 12 14 12 q10 0 10 -14 v-72 q-9 -6 -22 -4 z" />
        <path d="M142 268 q10 44 2 78 q-4 12 -14 12 q-10 0 -10 -14 v-72 q9 -6 22 -4 z" />
      </Region>

      {/* Calves */}
      <Region {...rp("calves")}>
        <ellipse cx="102" cy="398" rx="13" ry="40" />
        <ellipse cx="138" cy="398" rx="13" ry="40" />
      </Region>
    </svg>
  );
}
