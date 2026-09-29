import { SEED_ITEMS, SEED_SETTINGS, type L } from "./seed-data.ts";
import type { Locale } from "./i18n.ts";

// Content arrives as loosely-typed JSON; these helpers narrow it safely.
export type Rec = Record<string, unknown>;

export function isRec(x: unknown): x is Rec {
  return typeof x === "object" && x !== null && !Array.isArray(x);
}
export const rec = (x: unknown): Rec => (isRec(x) ? x : {});
export const str = (x: unknown): string =>
  typeof x === "string" ? x : typeof x === "number" ? String(x) : "";
export const num = (x: unknown, fallback = 0): number =>
  typeof x === "number" && Number.isFinite(x) ? x : fallback;

export function lo(x: unknown): L {
  const r = rec(x);
  return { en: str(r.en), hi: str(r.hi), gu: str(r.gu) };
}
// Dynamic content: chosen language, falling back to English
export function tr(x: unknown, locale: Locale): string {
  const v = lo(x);
  return v[locale] || v.en;
}

export type Item = { _id: string; order: number; data: Rec };
export type SiteData = {
  settings: Record<string, Rec>;
  items: Record<string, Item[]>;
};

export type Bundle = {
  seeded: boolean;
  settings: Record<string, unknown>;
  items: Record<string, { _id: string; order: number; data: Rec }[]>;
};

const SETTING_KEYS = ["site", "hero", "about", "theme", "sections", "seo"];

export function toSiteData(bundle: Bundle): SiteData {
  const settings: Record<string, Rec> = {};
  for (const key of SETTING_KEYS) {
    settings[key] = { ...rec(SEED_SETTINGS[key]), ...rec(bundle.settings[key]) };
  }
  const items: Record<string, Item[]> = {};
  for (const [kind, list] of Object.entries(bundle.items)) {
    items[kind] = list.map((i) => ({ _id: i._id, order: i.order, data: rec(i.data) }));
  }
  return { settings, items };
}

// Demo content for /preview and while the database is empty
export function seedSiteData(): SiteData {
  const settings: Record<string, Rec> = {};
  for (const key of SETTING_KEYS) settings[key] = rec(SEED_SETTINGS[key]);
  const items: Record<string, Item[]> = {};
  SEED_ITEMS.forEach((it, index) => {
    (items[it.kind] ??= []).push({
      _id: `${it.kind}-${index}`,
      order: index,
      data: rec(it.data),
    });
  });
  return { settings, items };
}

export const todayIso = (): string => new Date().toISOString().slice(0, 10);

export function waLink(number: string, text: string): string {
  const digits = number.replace(/\D/g, "");
  const full = digits.length === 10 ? `91${digits}` : digits;
  return `https://wa.me/${full}?text=${encodeURIComponent(text)}`;
}
export const telLink = (n: string): string => `tel:+91${n.replace(/\D/g, "").slice(-10)}`;
