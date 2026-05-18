import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const TEAM_COLORS = [
  { id: "green", name: "أخضر", hex: "#00c853", bg: "bg-primary-500", text: "text-primary-500", border: "border-primary-500" },
  { id: "red", name: "أحمر", hex: "#e53935", bg: "bg-danger-500", text: "text-danger-500", border: "border-danger-500" },
  { id: "blue", name: "أزرق", hex: "#1e88e5", bg: "bg-[#1e88e5]", text: "text-[#1e88e5]", border: "border-[#1e88e5]" },
  { id: "purple", name: "بنفسجي", hex: "#7c4dff", bg: "bg-[#7c4dff]", text: "text-[#7c4dff]", border: "border-[#7c4dff]" },
  { id: "orange", name: "برتقالي", hex: "#ff6f00", bg: "bg-warn-500", text: "text-warn-500", border: "border-warn-500" },
  { id: "pink", name: "وردي", hex: "#ec407a", bg: "bg-[#ec407a]", text: "text-[#ec407a]", border: "border-[#ec407a]" },
] as const;

export type TeamColorId = (typeof TEAM_COLORS)[number]["id"];

export function getTeamColor(id: string) {
  return TEAM_COLORS.find((c) => c.id === id) ?? TEAM_COLORS[0];
}

export function formatPoints(points: number): string {
  return points.toLocaleString("ar-EG");
}
