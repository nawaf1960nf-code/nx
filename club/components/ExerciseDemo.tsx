"use client";

import { useEffect, useRef, useState } from "react";
import { Dumbbell } from "lucide-react";

/**
 * Animated exercise demonstration. Cross-fades between the start and end
 * frames on a loop to mimic the movement (two stills per exercise). Images
 * are self-hosted under /public/exercises, so they load from this app's own
 * origin with no external CDN dependency. Always renders a framed box with a
 * dumbbell placeholder so there's a clear slot while loading or on failure.
 */
export function ExerciseDemo({
  images,
  alt,
  className = "",
}: {
  images?: string[];
  alt: string;
  className?: string;
}) {
  const [frame, setFrame] = useState(0);
  const [failed, setFailed] = useState(false);
  const timer = useRef<number | null>(null);

  const valid = (images ?? []).filter(Boolean);

  useEffect(() => {
    if (valid.length < 2) return;
    timer.current = window.setInterval(() => {
      setFrame((f) => (f + 1) % valid.length);
    }, 900);
    return () => {
      if (timer.current) window.clearInterval(timer.current);
    };
  }, [valid.length]);

  const showPlaceholder = valid.length === 0 || failed;

  return (
    <div
      className={`relative aspect-square w-full overflow-hidden rounded-xl border border-white/10 bg-white ${className}`}
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
