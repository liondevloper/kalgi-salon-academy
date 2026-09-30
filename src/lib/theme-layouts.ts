import type { ThemeId } from "./themes.ts";

// Each theme changes structure, not just colors
export type HeroLayout = "split" | "split-reverse" | "centered" | "fullbleed" | "stacked";
export type CardLayout = "grid" | "list" | "bold";

export type ThemeLayout = {
  hero: HeroLayout;
  // Alternate tinted bands behind home sections
  bands: boolean;
  cards: CardLayout;
  // Section title alignment
  center: boolean;
};

export const THEME_LAYOUTS: Record<ThemeId, ThemeLayout> = {
  "royal-luxe": { hero: "centered", bands: true, cards: "grid", center: true },
  "blush-glass": { hero: "split-reverse", bands: false, cards: "grid", center: true },
  "modern-minimal": { hero: "split", bands: true, cards: "list", center: false },
  "bold-glam": { hero: "fullbleed", bands: false, cards: "bold", center: false },
  "nature-spa": { hero: "stacked", bands: true, cards: "grid", center: true },
};

export const layoutFor = (id: ThemeId): ThemeLayout => THEME_LAYOUTS[id];
