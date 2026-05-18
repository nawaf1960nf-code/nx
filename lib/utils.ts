import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const TEAM_COLORS = [
  { id: "green", name: "أخضر", hex: "#00c853" },
  { id: "red", name: "أحمر", hex: "#e53935" },
  { id: "blue", name: "أزرق", hex: "#1e88e5" },
  { id: "purple", name: "بنفسجي", hex: "#7c4dff" },
  { id: "orange", name: "برتقالي", hex: "#ff6f00" },
  { id: "pink", name: "وردي", hex: "#ec407a" },
  { id: "teal", name: "تركواز", hex: "#009688" },
  { id: "indigo", name: "نيلي", hex: "#3f51b5" },
  { id: "yellow", name: "أصفر", hex: "#f9a825" },
  { id: "cyan", name: "سماوي", hex: "#00acc1" },
  { id: "lime", name: "ليموني", hex: "#7cb342" },
  { id: "rose", name: "وردي عميق", hex: "#d81b60" },
] as const;

export type TeamColorId = (typeof TEAM_COLORS)[number]["id"];

export function getTeamColor(id: string) {
  return TEAM_COLORS.find((c) => c.id === id) ?? TEAM_COLORS[0];
}

// أفاتارات حيوانية للفرق
export const TEAM_AVATARS = [
  "🦁", "🐺", "🦅", "🐉", "🦈", "🐅",
  "🦏", "🐯", "🐲", "🐧", "🦒", "🦘",
  "🦌", "🐎", "🐻", "🦝", "🐊", "🦄",
];

// أسماء جاهزة للفرق
export const TEAM_NAME_PRESETS = [
  "الأبطال",
  "الفرسان",
  "النينجا",
  "الصقور",
  "الذئاب",
  "النسور",
  "التنانين",
  "المحاربون",
  "الأساطير",
  "الفهود",
  "العمالقة",
  "المردة",
  "الأسود",
  "الصاعقة",
  "الإعصار",
  "العقبان",
];

export function formatPoints(points: number): string {
  return points.toLocaleString("ar-EG");
}
