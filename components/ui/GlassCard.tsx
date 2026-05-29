import { cn } from "@/lib/utils";

export function GlassCard({
  className,
  strong,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { strong?: boolean }) {
  return (
    <div
      className={cn(
        strong ? "glass-strong" : "glass",
        "rounded-3xl shadow-2xl shadow-black/40",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
