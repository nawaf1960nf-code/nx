"use client";

import { motion } from "framer-motion";

export function ProgressBar({
  value,
  accent = "#818cf8",
}: {
  /** 0–100 */
  value: number;
  accent?: string;
}) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
      <motion.div
        className="h-full rounded-full"
        style={{
          background: `linear-gradient(90deg, ${accent}, #22d3ee)`,
          boxShadow: `0 0 16px ${accent}`,
        }}
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
      />
    </div>
  );
}
