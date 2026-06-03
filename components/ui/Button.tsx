import { cn } from "@/lib/utils";

type Variant = "primary" | "ghost" | "outline" | "subtle";
type Size = "sm" | "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-gradient-to-r from-brand-500 to-accent-500 text-white shadow-lg shadow-brand-600/30 hover:shadow-brand-500/50 hover:brightness-110",
  ghost: "text-brand-200 hover:bg-white/5",
  outline:
    "border border-white/15 text-white hover:bg-white/10 hover:border-white/30",
  subtle: "bg-white/5 text-white hover:bg-white/10 border border-white/10",
};

const SIZES: Record<Size, string> = {
  sm: "min-h-11 px-4 py-2 text-sm rounded-xl",
  md: "min-h-11 px-6 py-3 text-sm rounded-2xl",
  lg: "min-h-12 px-8 py-4 text-base rounded-2xl",
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
}) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 font-semibold tracking-tight",
        "transition-all duration-300 active:scale-[0.97]",
        "disabled:opacity-50 disabled:pointer-events-none cursor-pointer",
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
