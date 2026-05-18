import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const SIZES = {
  sm: "text-xl",
  md: "text-2xl",
  lg: "text-4xl",
  xl: "text-5xl md:text-6xl",
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
