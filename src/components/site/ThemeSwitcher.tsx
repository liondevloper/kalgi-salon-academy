import { useState } from "react";
import { Check, Palette } from "lucide-react";
import { THEME_LIST } from "@/lib/themes.ts";
import { useSite } from "@/lib/site-context.tsx";
import { cn } from "@/lib/utils.ts";

// Floating theme button, stacked just above the WhatsApp button. Visitors (e.g. the client) can try each theme;
// the choice is only saved in their own browser. Rendered inline so the panel keeps the site's current theme colors.
export default function ThemeSwitcher() {
  const { themeId, setTheme, preview } = useSite();
  const [open, setOpen] = useState(false);
  if (!setTheme || preview) return null;

  const pick = (id: (typeof THEME_LIST)[number]["id"] | null) => {
    setTheme(id);
    setOpen(false);
  };

  return (
    <div className="fixed bottom-[10.5rem] right-4 z-40">
      <button
        type="button"
        aria-label="Change theme"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="cursor-pointer text-primary transition-transform hover:-translate-y-0.5 active:translate-y-[2px]"
      >
        <Palette className="size-10" />
      </button>
      {open && (
        <>
          <button type="button" aria-label="Close" className="fixed inset-0 -z-10 cursor-default" onClick={() => setOpen(false)} />
          <div className="absolute bottom-full right-0 mb-2 w-60 rounded-[var(--radius)] border border-border bg-card p-2 text-card-foreground shadow-[var(--t-shadow)]">
            <p className="px-2 pb-1 pt-1 text-xs font-semibold text-muted-foreground">Try a theme</p>
            {THEME_LIST.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => pick(t.id)}
                className={cn(
                  "flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-left text-sm hover:bg-secondary",
                  themeId === t.id && "font-semibold",
                )}
              >
                <span className="flex gap-0.5">
                  {[t.tokens.primary, t.tokens.accent, t.tokens.background].map((c) => (
                    <span key={c} className="size-3.5 rounded-full border border-border" style={{ background: c }} />
                  ))}
                </span>
                <span className="flex-1">{t.name}</span>
                {themeId === t.id && <Check className="size-4" />}
              </button>
            ))}
            <button
              type="button"
              onClick={() => pick(null)}
              className="mt-1 w-full cursor-pointer rounded-md border-t border-border px-2 py-2 text-left text-xs text-muted-foreground hover:bg-secondary"
            >
              Back to salon default
            </button>
          </div>
        </>
      )}
    </div>
  );
}
