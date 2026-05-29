"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const COLORS = ["#818cf8", "#22d3ee", "#34d399", "#fbbf24", "#e879f9", "#fb7185"];

interface Piece {
  id: number;
  x: number;
  delay: number;
  duration: number;
  color: string;
  rotate: number;
  size: number;
}

/** Lightweight celebratory confetti burst (no external deps). */
export function Confetti({ count = 90 }: { count?: number }) {
  const [pieces, setPieces] = useState<Piece[]>([]);

  useEffect(() => {
    setPieces(
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 0.6,
        duration: 2.5 + Math.random() * 2,
        color: COLORS[i % COLORS.length],
        rotate: Math.random() * 360,
        size: 6 + Math.random() * 8,
      })),
    );
  }, [count]);

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden>
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          className="absolute top-[-5%] rounded-sm"
          style={{
            left: `${p.x}%`,
            width: p.size,
            height: p.size * 0.6,
            background: p.color,
          }}
          initial={{ y: "-10vh", opacity: 1, rotate: 0 }}
          animate={{ y: "110vh", opacity: [1, 1, 0], rotate: p.rotate + 360 }}
          transition={{ duration: p.duration, delay: p.delay, ease: "easeIn" }}
        />
      ))}
    </div>
  );
}
