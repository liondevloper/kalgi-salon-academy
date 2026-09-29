import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs.tsx";
import { THEME_LIST, type ThemeId } from "@/lib/themes.ts";
import PhonePreview, { SCREENS } from "./PhonePreview.tsx";

// Shared by /preview and the admin Theme Templates module
export default function ThemeShowcase({ initial = "royal-luxe" }: { initial?: ThemeId }) {
  const [theme, setTheme] = useState<ThemeId>(initial);
  const meta = THEME_LIST.find((t) => t.id === theme);
  return (
    <div className="space-y-6">
      <Tabs value={theme} onValueChange={(v) => setTheme(v as ThemeId)}>
        <TabsList className="h-auto w-full flex-wrap justify-start gap-1">
          {THEME_LIST.map((t) => (
            <TabsTrigger key={t.id} value={t.id} className="cursor-pointer">{t.name}</TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      {meta && <p className="text-sm text-muted-foreground">{meta.blurb}</p>}
      <div className="-mx-4 flex gap-6 overflow-x-auto px-4 pb-4">
        {SCREENS.map((s) => (
          <div key={s.path} className="shrink-0">
            <p className="mb-2 text-center text-sm font-semibold">{s.label}</p>
            <PhonePreview themeId={theme} screen={s.path} />
          </div>
        ))}
      </div>
    </div>
  );
}
