import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";
import PhonePreview from "@/components/preview/PhonePreview.tsx";
import { rec, str, type Rec } from "@/lib/data.ts";
import { FONT_OPTIONS, THEME_LIST, isThemeId, resolveTokens, type ThemeId } from "@/lib/themes.ts";
import { setSetting, useSiteData, withToast } from "@/lib/supabase-admin.ts";
import { cn } from "@/lib/utils.ts";
import PageHeader from "../_components/PageHeader.tsx";

const COLORS = ["primary", "accent", "background", "surface", "text"] as const;
const FONTS = ["headingFont", "bodyFont"] as const;

function Editor({ active, overrides }: { active: ThemeId; overrides: Rec }) {
  const [theme, setTheme] = useState<ThemeId>(active);
  const [o, setO] = useState<Rec>(overrides);
  const { tokens } = resolveTokens(theme, o);
  const pick = (id: ThemeId) => {
    setTheme(id);
    setO({});
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_auto]">
      <div className="space-y-6">
        <div className="grid gap-3 sm:grid-cols-2">
          {THEME_LIST.map((t) => (
            <button key={t.id} type="button" onClick={() => pick(t.id)}
              className={cn("cursor-pointer rounded-lg border p-3 text-left transition-colors", theme === t.id ? "border-primary ring-2 ring-primary/30" : "hover:bg-muted")}>
              <div className="mb-2 flex gap-1">
                {[t.tokens.primary, t.tokens.accent, t.tokens.background, t.tokens.text].map((c) => (
                  <span key={c} className="size-5 rounded-full border" style={{ background: c }} />
                ))}
              </div>
              <p className="flex items-center gap-1 font-medium">{t.name} {theme === t.id && <Check className="size-4" />}</p>
              <p className="text-xs text-muted-foreground">{t.blurb}</p>
            </button>
          ))}
        </div>
        <div className="grid gap-4 rounded-lg border p-4 sm:grid-cols-2">
          <p className="font-medium sm:col-span-2">Fine-tune (optional)</p>
          {COLORS.map((k) => (
            <div key={k} className="grid gap-1.5">
              <Label htmlFor={`c-${k}`} className="capitalize">{k}</Label>
              <div className="flex gap-2">
                <input id={`c-${k}`} type="color" value={tokens[k].startsWith("#") ? tokens[k].slice(0, 7) : "#000000"}
                  onChange={(e) => setO({ ...o, [k]: e.target.value })} className="h-9 w-12 cursor-pointer rounded border" />
                <Input value={str(o[k]) || tokens[k]} onChange={(e) => setO({ ...o, [k]: e.target.value })} />
              </div>
            </div>
          ))}
          {FONTS.map((k) => (
            <div key={k} className="grid gap-1.5">
              <Label>{k === "headingFont" ? "Heading font" : "Body font"}</Label>
              <Select value={tokens[k]} onValueChange={(v) => setO({ ...o, [k]: v })}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>{FONT_OPTIONS.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          ))}
          <Button variant="ghost" className="w-fit" onClick={() => setO({})}>Reset to theme defaults</Button>
        </div>
        <Button onClick={() => void withToast(() => setSetting("theme", { active: theme, overrides: o }), "Theme published")}>
          Publish theme
        </Button>
      </div>
      <PhonePreview themeId={theme} overrides={o} screen="/" navigable key={theme} />
    </div>
  );
}

export default function ThemePage() {
  const data = useSiteData();
  const row = data?.settings.theme;
  return (
    <>
      <PageHeader title="Theme" />
      {row === undefined ? (
        <Skeleton className="h-[640px] w-full" />
      ) : (
        <Editor active={isThemeId(row.active) ? row.active : "modern-minimal"} overrides={rec(row.overrides)} />
      )}
    </>
  );
}
