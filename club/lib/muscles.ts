import type { Bilingual } from "./i18n";

/**
 * Muscle groups used across the body map and exercise library. Ids are stable
 * keys; labels are bilingual. `views` says which side(s) of the body the muscle
 * is shown/clickable on.
 */
export type MuscleId =
  | "chest"
  | "shoulders"
  | "biceps"
  | "triceps"
  | "forearms"
  | "abs"
  | "obliques"
  | "traps"
  | "lats"
  | "lowerBack"
  | "glutes"
  | "quads"
  | "hamstrings"
  | "calves";

export interface Muscle {
  id: MuscleId;
  label: Bilingual;
  views: ("front" | "back")[];
}

export const MUSCLES: Record<MuscleId, Muscle> = {
  chest: { id: "chest", label: { en: "Chest", ar: "الصدر" }, views: ["front"] },
  shoulders: { id: "shoulders", label: { en: "Shoulders", ar: "الأكتاف" }, views: ["front", "back"] },
  biceps: { id: "biceps", label: { en: "Biceps", ar: "العضلة الأمامية" }, views: ["front"] },
  triceps: { id: "triceps", label: { en: "Triceps", ar: "العضلة الخلفية" }, views: ["back"] },
  forearms: { id: "forearms", label: { en: "Forearms", ar: "الساعد" }, views: ["front", "back"] },
  abs: { id: "abs", label: { en: "Abs", ar: "البطن" }, views: ["front"] },
  obliques: { id: "obliques", label: { en: "Obliques", ar: "الخصر الجانبي" }, views: ["front"] },
  traps: { id: "traps", label: { en: "Traps", ar: "شبه المنحرف" }, views: ["back"] },
  lats: { id: "lats", label: { en: "Lats / Back", ar: "الظهر العريض" }, views: ["back"] },
  lowerBack: { id: "lowerBack", label: { en: "Lower Back", ar: "أسفل الظهر" }, views: ["back"] },
  glutes: { id: "glutes", label: { en: "Glutes", ar: "المؤخرة" }, views: ["back"] },
  quads: { id: "quads", label: { en: "Quads", ar: "الفخذ الأمامي" }, views: ["front"] },
  hamstrings: { id: "hamstrings", label: { en: "Hamstrings", ar: "الفخذ الخلفي" }, views: ["back"] },
  calves: { id: "calves", label: { en: "Calves", ar: "السمانة" }, views: ["front", "back"] },
};

export function muscleLabel(id: MuscleId, locale: "ar" | "en"): string {
  return MUSCLES[id].label[locale];
}
