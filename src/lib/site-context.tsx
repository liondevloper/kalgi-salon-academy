import { createContext, useContext, useMemo, type ReactNode } from "react";
import { rec, tr, ui, type Rec, type SiteData } from "./data-exports.ts";
import type { Locale } from "./i18n.ts";
import type { ThemeId, ThemeTokens } from "./themes.ts";

export type SiteCtx = {
  data: SiteData;
  site: Rec;
  locale: Locale;
  setLocale: (l: Locale) => void;
  tokens: ThemeTokens;
  themeId: ThemeId;
  // Present only when visitors may try themes; null resets to the salon's own theme
  setTheme?: (id: ThemeId | null) => void;
  demo: boolean;
  // preview = rendered inside a phone frame (no real navigation, nothing saved)
  preview: boolean;
  onPreviewGo?: (path: string) => void;
  activePath: string;
  t: (key: string) => string;
  L: (x: unknown) => string;
};

const Ctx = createContext<SiteCtx | null>(null);

type ProviderProps = {
  data: SiteData;
  locale: Locale;
  setLocale: (l: Locale) => void;
  tokens: ThemeTokens;
  themeId: ThemeId;
  setTheme?: (id: ThemeId | null) => void;
  demo: boolean;
  preview?: boolean;
  onPreviewGo?: (path: string) => void;
  activePath: string;
  children: ReactNode;
};

export function SiteProvider({ children, ...p }: ProviderProps) {
  const value = useMemo<SiteCtx>(
    () => ({
      ...p,
      preview: p.preview ?? false,
      site: rec(p.data.settings.site),
      t: (key) => ui(key, p.locale),
      L: (x) => tr(x, p.locale),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [p.data, p.locale, p.tokens, p.themeId, p.setTheme, p.demo, p.preview, p.activePath, p.onPreviewGo, p.setLocale],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSite(): SiteCtx {
  const v = useContext(Ctx);
  if (!v) throw new Error("useSite must be used inside SiteProvider");
  return v;
}
