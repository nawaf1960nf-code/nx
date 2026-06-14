"use client";

import { useState } from "react";
import { BodyMap } from "./BodyMap";
import { ExercisePanel } from "./ExercisePanel";
import type { MuscleId } from "@/lib/muscles";

/** Pairs the interactive body map with the exercise list for the selected muscle. */
export function MuscleExplorer() {
  const [muscle, setMuscle] = useState<MuscleId | null>(null);
  return (
    <div className="grid items-start gap-8 lg:grid-cols-2">
      <div className="card-premium bg-grid p-6 sm:p-8">
        <BodyMap selected={muscle} onSelect={setMuscle} />
      </div>
      <ExercisePanel muscle={muscle} />
    </div>
  );
}
