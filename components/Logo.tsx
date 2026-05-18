import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const SIZES = {
  sm: "text-2xl",
  md: "text-4xl",
  lg: "text-6xl",
  xl: "text-8xl",
};

export function Logo({ size = "md", className }: LogoProps) {
  return (
    <div
      className={cn(
        "font-black tracking-tight select-none inline-flex items-baseline gap-1",
        SIZES[size],
        className,
      )}
    >
      <span className="text-primary-500">نون</span>
      <span className="text-ink-800">عين</span>
    </div>
  );
}
