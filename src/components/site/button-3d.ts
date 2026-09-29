import { cn } from "@/lib/utils.ts";

type Variant = "primary" | "secondary" | "ghost";

// Raised 3D button look, driven by the theme's --t-btn-shadow variable
export function btnClass(variant: Variant = "primary", extra?: string): string {
  return cn(
    "inline-flex cursor-pointer select-none items-center justify-center gap-2 rounded-[var(--radius)] px-5 py-3 text-sm font-semibold transition-transform duration-150 hover:-translate-y-0.5 active:translate-y-[2px] disabled:pointer-events-none disabled:opacity-60",
    variant === "primary" &&
      "bg-primary text-primary-foreground shadow-[var(--t-btn-shadow)]",
    variant === "secondary" &&
      "border border-border bg-card text-foreground shadow-[var(--t-btn-shadow)] [backdrop-filter:blur(var(--t-blur))]",
    variant === "ghost" && "text-foreground hover:bg-secondary",
    extra,
  );
}
