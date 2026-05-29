"use client";

import { motion } from "framer-motion";

export function ScoreRing({
  percentage,
  color,
  label,
}: {
  percentage: number;
  color: string;
  label: string;
}) {
  const r = 70;
  const c = 2 * Math.PI * r;
  const offset = c - (percentage / 100) * c;

  return (
    <div className="relative grid place-items-center">
      <svg width="180" height="180" className="-rotate-90">
        <circle
          cx="90"
          cy="90"
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="12"
        />
        <motion.circle
          cx="90"
          cy="90"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.4, ease: "easeOut" }}
          style={{ filter: `drop-shadow(0 0 8px ${color})` }}
        />
      </svg>
      <div className="absolute text-center">
        <motion.p
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="font-display text-5xl font-extrabold text-white"
        >
          {label}
        </motion.p>
        <p className="text-xs uppercase tracking-wider text-brand-100/50">
          {percentage}%
        </p>
      </div>
    </div>
  );
}
