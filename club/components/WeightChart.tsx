"use client";

import type { WeightEntry } from "@/lib/progress";

/** Minimal responsive SVG line chart of bodyweight over time. */
export function WeightChart({ entries }: { entries: WeightEntry[] }) {
  if (entries.length < 2) return null;

  const W = 600;
  const H = 200;
  const pad = 28;

  const kgs = entries.map((e) => e.kg);
  const min = Math.min(...kgs);
  const max = Math.max(...kgs);
  const range = max - min || 1;

  const x = (i: number) => pad + (i / (entries.length - 1)) * (W - pad * 2);
  const y = (kg: number) => pad + (1 - (kg - min) / range) * (H - pad * 2);

  const line = entries.map((e, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(e.kg)}`).join(" ");
  const area = `${line} L${x(entries.length - 1)},${H - pad} L${x(0)},${H - pad} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Bodyweight chart">
      <defs>
        <linearGradient id="wfill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#34d399" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* baseline */}
      <line x1={pad} y1={H - pad} x2={W - pad} y2={H - pad} stroke="rgba(255,255,255,0.08)" />
      <path d={area} fill="url(#wfill)" />
      <path d={line} fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      {entries.map((e, i) => (
        <circle key={i} cx={x(i)} cy={y(e.kg)} r={i === entries.length - 1 ? 4.5 : 2.5} fill="#34d399" />
      ))}
      {/* min / max labels */}
      <text x={pad} y={pad - 8} fill="rgba(255,255,255,0.5)" fontSize="11">{max} kg</text>
      <text x={pad} y={H - pad + 16} fill="rgba(255,255,255,0.5)" fontSize="11">{min} kg</text>
    </svg>
  );
}
