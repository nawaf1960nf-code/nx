import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "gold";
type Size = "sm" | "md" | "lg" | "xl";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  loading?: boolean;
}

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white shadow-md shadow-primary-500/20",
  secondary:
    "bg-white hover:bg-ink-50 text-ink-800 border border-ink-200 hover:border-ink-300",
  ghost: "bg-transparent hover:bg-ink-100 text-ink-700",
  danger: "bg-danger-500 hover:bg-red-600 text-white shadow-md shadow-red-500/20",
  gold: "bg-gold-500 hover:bg-gold-600 text-ink-900 shadow-md shadow-yellow-400/20",
};

const SIZES: Record<Size, string> = {
  sm: "px-3 py-1.5 text-xs rounded-lg",
  md: "px-4 py-2 text-sm rounded-xl",
  lg: "px-6 py-2.5 text-sm rounded-xl",
  xl: "px-8 py-3 text-base rounded-2xl",
};

export function Button({
  variant = "primary",
  size = "md",
  icon,
  loading,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "font-bold inline-flex items-center justify-center gap-2 transition-all duration-200",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "active:scale-95 hover:scale-[1.02]",
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="inline-block w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        icon
      )}
      {children}
    </button>
  );
}
