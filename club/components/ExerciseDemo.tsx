"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Animated exercise demonstration. Cross-fades between the start and end
 * frames on a loop to mimic the movement (the dataset ships two stills per
 * exercise). Falls back to a single image, or nothing if none exist.
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

  if (!valid.length || failed) return null;

  return (
    <div
      className={`relative aspect-square w-full overflow-hidden rounded-xl bg-white ${className}`}
    >
      {valid.map((src, i) => (
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
      ))}
    </div>
  );
}
