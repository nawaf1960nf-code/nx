"use client";

import { useEffect, useRef, useState } from "react";
import { Dumbbell } from "lucide-react";

/**
 * Animated exercise demonstration. Cross-fades between the start and end
 * frames to mimic the movement (two stills per exercise). Images are
 * self-hosted under /public/exercises (same origin, no external CDN).
 *
 * `playOnHover` keeps grids cheap: thumbnails stay on frame 0 until hovered/
 * focused, so we don't run hundreds of timers at once.
 */
export function ExerciseDemo({
  images,
  alt,
  className = "",
  playOnHover = false,
}: {
  images?: string[];
  alt: string;
  className?: string;
  playOnHover?: boolean;
}) {
  const [frame, setFrame] = useState(0);
  const [failed, setFailed] = useState(false);
  const [hovered, setHovered] = useState(false);
  const timer = useRef<number | null>(null);

  const valid = (images ?? []).filter(Boolean);
  const playing = valid.length >= 2 && (!playOnHover || hovered);

  useEffect(() => {
    if (!playing) {
      setFrame(0);
      return;
    }
    timer.current = window.setInterval(() => {
      setFrame((f) => (f + 1) % valid.length);
    }, 850);
    return () => {
      if (timer.current) window.clearInterval(timer.current);
    };
  }, [playing, valid.length]);

  const showPlaceholder = valid.length === 0 || failed;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      className={`relative aspect-square w-full overflow-hidden bg-white ${className}`}
    >
      {showPlaceholder ? (
        <div className="absolute inset-0 grid place-items-center bg-base-850 text-energy-100/30">
          <Dumbbell className="h-10 w-10" />
        </div>
      ) : (
        valid.map((src, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={src}
            src={src}
            alt={alt}
            loading="lazy"
            onError={() => i === 0 && setFailed(true)}
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
            style={{ opacity: i === frame ? 1 : 0 }}
          />
        ))
      )}
    </div>
  );
}
