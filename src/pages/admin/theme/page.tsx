import { useState } from "react";
import type { CSSProperties } from "react";
import { Check } from "lucide-react";
import { setSetting } from "@/lib/api/admin.ts";
import { Button } from "@/components/ui/button.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";
import PhonePreview from "@/components/preview/PhonePreview.tsx";
import { rec, str, type Rec } from "@/lib/data.ts";
import { FONT_OPTIONS, THEME_LIST, isThemeId, resolveTokens, themeStyle, type ThemeId } from "@/lib/themes.ts";
import { cn } from "@/lib/utils.ts";
import PageHeader from "../_components/PageHeader.tsx";
import { useAct } from "../_lib/use-admin.ts";
import { useSiteData } from "../_lib/use-site-data.ts";

const COLORS = ["primary", "accent", "background", "surface", "text"] as const;
const FONTS = ["headingFont", "bodyFont"] as const;

// ─── Site Theme Editor ────────────────────────────────────────────────────────

function SiteEditor({ active, overrides }: { active: ThemeId; overrides: Rec }) {
  const act = useAct();
  const [theme, setTheme] = useState<ThemeId>(active);
  const [o, setO] = useState<Rec>(overrides);
  const { tokens } = resolveTokens(theme, o);
  const pick = (id: ThemeId) => { setTheme(id); setO({}); };

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
        <Button onClick={() => void act(() => setSetting("theme", { active: theme, overrides: o }), "Theme published")}>
          Publish site theme
        </Button>
      </div>
      <PhonePreview themeId={theme} overrides={o} screen="/" navigable key={theme} />
    </div>
  );
}

// ─── Admin Theme Editor ───────────────────────────────────────────────────────

function AdminEditor({ active, overrides }: { active: ThemeId; overrides: Rec }) {
  const act = useAct();
  const [theme, setTheme] = useState<ThemeId>(active);
  const [o, setO] = useState<Rec>(overrides);
  const { tokens } = resolveTokens(theme, o);
  const pick = (id: ThemeId) => { setTheme(id); setO({}); };

  const previewStyle: CSSProperties = {
    ...(themeStyle(tokens) as CSSProperties),
    background: "var(--background)",
    color: "var(--foreground)",
  };

  return (
    <div className="space-y-6">
      {/* Live preview of the selected admin colors */}
      <div style={previewStyle} className="rounded-xl border p-6 [font-family:var(--t-body)]">
        <p className="mb-3 text-sm font-semibold" style={{ color: "var(--muted-foreground)" }}>Admin panel preview</p>
        <div className="flex flex-wrap gap-2">
          <span className="rounded px-3 py-1 text-sm font-medium" style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}>Primary</span>
          <span className="rounded px-3 py-1 text-sm font-medium" style={{ background: "var(--secondary)", color: "var(--secondary-foreground)" }}>Secondary</span>
          <span className="rounded px-3 py-1 text-sm font-medium" style={{ background: "var(--accent)", color: "var(--accent-foreground)" }}>Accent</span>
          <span className="rounded px-3 py-1 text-sm" style={{ color: "var(--muted-foreground)" }}>Sidebar nav item</span>
        </div>
      </div>

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
            <Label htmlFor={`ac-${k}`} className="capitalize">{k}</Label>
            <div className="flex gap-2">
              <input id={`ac-${k}`} type="color" value={tokens[k].startsWith("#") ? tokens[k].slice(0, 7) : "#000000"}
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

      <Button onClick={() => void act(() => setSetting("adminTheme", { active: theme, overrides: o }), "Admin theme saved")}>
        Save admin theme
      </Button>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ThemePage() {
  const data = useSiteData();
  const siteRow = data?.settings.theme;
  const adminRow = data?.settings.adminTheme;

  return (
    <div className="space-y-12">
      {/* ── Site Theme ── */}
      <section>
        <PageHeader title="Site Theme" />
        <p className="mb-6 text-sm text-muted-foreground">
          This theme is applied to the public website that visitors see.
        </p>
        {siteRow === undefined ? (
          <Skeleton className="h-[640px] w-full" />
        ) : (
          <SiteEditor
            active={isThemeId(siteRow.active) ? siteRow.active : "modern-minimal"}
            overrides={rec(siteRow.overrides)}
          />
        )}
      </section>

      {/* ── Admin Panel Theme ── */}
      <section>
        <PageHeader title="Admin Panel Theme" />
        <p className="mb-6 text-sm text-muted-foreground">
          Admin panel ka alag theme — public website ke theme se bilkul independent.
        </p>
        {adminRow === undefined ? (
          <Skeleton className="h-[400px] w-full" />
        ) : (
          <AdminEditor
            active={isThemeId(adminRow.active) ? adminRow.active : "modern-minimal"}
            overrides={rec(adminRow.overrides)}
          />
        )}
      </section>
    </div>
  );
}
