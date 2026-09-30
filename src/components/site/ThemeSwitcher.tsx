import { Check, Palette } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import { THEME_LIST } from "@/lib/themes.ts";
import { useSite } from "@/lib/site-context.tsx";

// Lets a visitor (e.g. the client) try each theme. The choice is only saved in their own browser.
export default function ThemeSwitcher() {
  const { themeId, setTheme } = useSite();
  if (!setTheme) return null;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="icon" aria-label="Change theme" className="size-8 rounded-full">
          <Palette className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Try a theme</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {THEME_LIST.map((t) => (
          <DropdownMenuItem key={t.id} onSelect={() => setTheme(t.id)} className="cursor-pointer gap-2">
            <span className="flex gap-0.5">
              {[t.tokens.primary, t.tokens.accent, t.tokens.background].map((c) => (
                <span key={c} className="size-3.5 rounded-full border" style={{ background: c }} />
              ))}
            </span>
            <span className="flex-1">{t.name}</span>
            {themeId === t.id && <Check className="size-4" />}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => setTheme(null)} className="cursor-pointer">
          Back to salon default
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
