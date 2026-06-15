"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Dumbbell } from "lucide-react";

/**
 * Animated exercise demonstration. Cross-fades between the start and end
 * frames on a loop to mimic the movement (the dataset ships two stills per
 * exercise). Images are served through next/image (proxied by the app's own
 * domain) so they load even when the source CDN is blocked client-side.
 * Always renders a framed box so there's a clear slot even while loading or
 * if an image fails.
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
          <Image
            key={src}
            src={src}
            alt={alt}
            fill
            sizes="(max-width: 768px) 80vw, 240px"
            onError={() => i === 0 && setFailed(true)}
            className="object-contain transition-opacity duration-500"
            style={{ opacity: i === frame ? 1 : 0 }}
          />
        ))
      )}
    </div>
  );
}
