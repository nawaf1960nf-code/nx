"use client";

import { useState } from "react";
import { useLocale } from "@/lib/locale-context";
import { MUSCLES, type MuscleId } from "@/lib/muscles";

type View = "front" | "back";

/**
 * Interactive front/back muscle map. Each muscle group is a clickable SVG
 * region drawn with anatomical-ish contoured paths over a connected body
 * silhouette. Clicking (or pressing Enter/Space on) a region calls `onSelect`.
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

/** Shared faint head + body outline so regions read as one connected figure. */
function Silhouette({ back = false }: { back?: boolean }) {
  return (
    <g className="silhouette">
      {/* head */}
      <ellipse cx="120" cy="30" rx="19" ry="23" />
      {/* neck */}
      <path d="M110 50 h20 v14 q-10 6 -20 0 z" />
      {/* torso outline (shoulders → waist) */}
      <path d="M120 60 C150 60 168 70 172 96 C176 130 168 176 150 214 L90 214 C72 176 64 130 68 96 C72 70 90 60 120 60 Z" />
      {/* hips + legs */}
      <path d="M92 212 H148 C156 250 154 300 150 350 C147 392 142 426 134 452 H106 C98 426 93 392 90 350 C86 300 84 250 92 212 Z" />
      {/* arms */}
      <path d="M70 96 C52 104 44 150 40 198 C38 224 40 250 46 268 L62 268 C64 240 66 206 70 176 C73 146 74 118 78 100 Z" />
      <path d="M170 96 C188 104 196 150 200 198 C202 224 200 250 194 268 L178 268 C176 240 174 206 170 176 C167 146 166 118 162 100 Z" />
      {back && null}
    </g>
  );
}

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
    <svg viewBox="0 0 240 470" className="h-auto w-full" role="img" aria-label="Front body muscle map">
      <Silhouette />

      {/* Shoulders (deltoid caps) */}
      <Region {...rp("shoulders")}>
        <path d="M86 92 C74 88 62 94 58 110 C56 122 60 132 70 134 C80 130 86 116 88 102 Z" />
        <path d="M154 92 C166 88 178 94 182 110 C184 122 180 132 170 134 C160 130 154 116 152 102 Z" />
      </Region>

      {/* Chest (pectorals, angled toward sternum) */}
      <Region {...rp("chest")}>
        <path d="M118 92 C104 88 90 92 84 102 C80 116 84 134 98 142 C112 148 118 138 119 124 Z" />
        <path d="M122 92 C136 88 150 92 156 102 C160 116 156 134 142 142 C128 148 122 138 121 124 Z" />
      </Region>

      {/* Biceps */}
      <Region {...rp("biceps")}>
        <path d="M70 138 C60 140 54 156 52 178 C51 196 55 210 64 210 C72 206 74 184 75 162 Z" />
        <path d="M170 138 C180 140 186 156 188 178 C189 196 185 210 176 210 C168 206 166 184 165 162 Z" />
      </Region>

      {/* Forearms */}
      <Region {...rp("forearms")}>
        <path d="M62 212 C54 216 49 240 47 262 C46 276 49 286 56 286 C61 268 63 240 65 218 Z" />
        <path d="M178 212 C186 216 191 240 193 262 C194 276 191 286 184 286 C179 268 177 240 175 218 Z" />
      </Region>

      {/* Abs (with six-pack detail lines drawn on top, non-interactive) */}
      <Region {...rp("abs")}>
        <path d="M104 146 C100 168 100 192 106 210 L134 210 C140 192 140 168 136 146 C128 142 112 142 104 146 Z" />
      </Region>
      <g className="silhouette" style={{ pointerEvents: "none" }}>
        <line x1="120" y1="150" x2="120" y2="206" />
        <line x1="106" y1="166" x2="134" y2="166" />
        <line x1="105" y1="182" x2="135" y2="182" />
        <line x1="107" y1="197" x2="133" y2="197" />
      </g>

      {/* Obliques */}
      <Region {...rp("obliques")}>
        <path d="M98 150 C90 168 90 192 98 210 C92 206 86 196 84 180 C83 168 86 156 92 148 Z" />
        <path d="M142 150 C150 168 150 192 142 210 C148 206 154 196 156 180 C157 168 154 156 148 148 Z" />
      </Region>

      {/* Quads */}
      <Region {...rp("quads")}>
        <path d="M96 220 C88 260 88 308 98 344 C104 356 116 354 118 340 C119 300 117 256 114 222 C108 218 102 218 96 220 Z" />
        <path d="M144 220 C152 260 152 308 142 344 C136 356 124 354 122 340 C121 300 123 256 126 222 C132 218 138 218 144 220 Z" />
      </Region>

      {/* Calves (front shin/lower leg) */}
      <Region {...rp("calves")}>
        <path d="M100 352 C95 380 95 412 102 442 C108 444 114 442 115 430 C116 404 114 376 112 354 Z" />
        <path d="M140 352 C145 380 145 412 138 442 C132 444 126 442 125 430 C124 404 126 376 128 354 Z" />
      </Region>
    </svg>
  );
}

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
    <svg viewBox="0 0 240 470" className="h-auto w-full" role="img" aria-label="Back body muscle map">
      <Silhouette back />

      {/* Shoulders (rear delts) */}
      <Region {...rp("shoulders")}>
        <path d="M86 92 C74 88 62 94 58 110 C56 122 60 132 70 134 C80 130 86 116 88 102 Z" />
        <path d="M154 92 C166 88 178 94 182 110 C184 122 180 132 170 134 C160 130 154 116 152 102 Z" />
      </Region>

      {/* Traps (diamond between neck and mid-back) */}
      <Region {...rp("traps")}>
        <path d="M120 66 C104 68 92 74 88 86 C92 100 104 110 120 112 C136 110 148 100 152 86 C148 74 136 68 120 66 Z" />
      </Region>

      {/* Triceps */}
      <Region {...rp("triceps")}>
        <path d="M70 138 C60 140 54 156 52 178 C51 196 55 210 64 210 C72 206 74 184 75 162 Z" />
        <path d="M170 138 C180 140 186 156 188 178 C189 196 185 210 176 210 C168 206 166 184 165 162 Z" />
      </Region>

      {/* Forearms */}
      <Region {...rp("forearms")}>
        <path d="M62 212 C54 216 49 240 47 262 C46 276 49 286 56 286 C61 268 63 240 65 218 Z" />
        <path d="M178 212 C186 216 191 240 193 262 C194 276 191 286 184 286 C179 268 177 240 175 218 Z" />
      </Region>

      {/* Lats (V-taper) */}
      <Region {...rp("lats")}>
        <path d="M94 114 C84 134 82 162 92 184 C104 192 116 190 118 178 L118 116 C110 112 100 112 94 114 Z" />
        <path d="M146 114 C156 134 158 162 148 184 C136 192 124 190 122 178 L122 116 C130 112 140 112 146 114 Z" />
      </Region>

      {/* Lower back */}
      <Region {...rp("lowerBack")}>
        <path d="M104 186 C100 196 100 206 104 214 L136 214 C140 206 140 196 136 186 C128 182 112 182 104 186 Z" />
      </Region>

      {/* Glutes */}
      <Region {...rp("glutes")}>
        <path d="M118 216 C104 216 94 226 94 242 C94 258 104 266 118 264 Z" />
        <path d="M122 216 C136 216 146 226 146 242 C146 258 136 266 122 264 Z" />
      </Region>

      {/* Hamstrings */}
      <Region {...rp("hamstrings")}>
        <path d="M98 266 C90 300 90 332 100 360 C106 372 116 370 118 356 C119 326 117 292 114 268 C108 264 104 264 98 266 Z" />
        <path d="M142 266 C150 300 150 332 140 360 C134 372 124 370 122 356 C121 326 123 292 126 268 C132 264 136 264 142 266 Z" />
      </Region>

      {/* Calves */}
      <Region {...rp("calves")}>
        <path d="M100 366 C95 392 95 420 102 446 C108 448 114 446 115 434 C116 408 114 384 112 368 Z" />
        <path d="M140 366 C145 392 145 420 138 446 C132 448 126 446 125 434 C124 408 126 384 128 368 Z" />
      </Region>
    </svg>
  );
}
