import type { CSSProperties } from "react";
import { rec, type Rec } from "./data.ts";

export type ButtonStyle = "raised" | "glass" | "neu" | "hard" | "soft";

export type ThemeTokens = {
  background: string;
  surface: string;
  primary: string;
  primaryFg: string;
  secondary: string;
  accent: string;
  text: string;
  muted: string;
  border: string;
  headingFont: string;
  bodyFont: string;
  radius: string;
  shadow: string;
  blur: string;
  tilt: number;
  animSpeed: number;
  buttonStyle: ButtonStyle;
  dark: boolean;
};

export type ThemeId =
  | "royal-luxe"
  | "blush-glass"
  | "modern-minimal"
  | "bold-glam"
  | "nature-spa";

export type ThemePreset = {
  id: ThemeId;
  name: string;
  blurb: string;
  tokens: ThemeTokens;
};

export const DEFAULT_THEME: ThemeId = "modern-minimal";

// All pairs below were chosen for WCAG AA text contrast (4.5:1+)
export const THEMES: Record<ThemeId, ThemePreset> = {
  "royal-luxe": {
    id: "royal-luxe",
    name: "Royal Luxe",
    blurb: "Ivory, burgundy and gold, elegant and warm",
    tokens: {
      background: "#fbf6ee",
      surface: "#ffffff",
      primary: "#8a1c3a",
      primaryFg: "#ffffff",
      secondary: "#f3e7d3",
      accent: "#c9a227",
      text: "#2a1218",
      muted: "#6b5a55",
      border: "#e6d8bf",
      headingFont: "Cormorant Garamond",
      bodyFont: "Manrope",
      radius: "0.75rem",
      shadow:
        "inset 0 1px 0 rgba(255,255,255,.6), 0 18px 34px -14px rgba(138,28,58,.35), 0 3px 8px rgba(0,0,0,.08)",
      blur: "0px",
      tilt: 10,
      animSpeed: 1,
      buttonStyle: "raised",
      dark: false,
    },
  },
  "blush-glass": {
    id: "blush-glass",
    name: "Blush Glass",
    blurb: "Soft pastel gradients and frosted glass",
    tokens: {
      background: "#fdeef3",
      surface: "rgba(255,255,255,0.68)",
      primary: "#b03a6f",
      primaryFg: "#ffffff",
      secondary: "#ead9f7",
      accent: "#6d4bb5",
      text: "#3a1f2d",
      muted: "#6e5560",
      border: "rgba(176,58,111,0.22)",
      headingFont: "Playfair Display",
      bodyFont: "DM Sans",
      radius: "1.5rem",
      shadow: "0 12px 40px -10px rgba(176,58,111,.32), inset 0 1px 0 rgba(255,255,255,.8)",
      blur: "14px",
      tilt: 8,
      animSpeed: 1,
      buttonStyle: "glass",
      dark: false,
    },
  },
  "modern-minimal": {
    id: "modern-minimal",
    name: "Modern Minimal",
    blurb: "Clean whitespace with soft neumorphic buttons",
    tokens: {
      background: "#eef0f3",
      surface: "#f6f7f9",
      primary: "#1f2937",
      primaryFg: "#ffffff",
      secondary: "#e2e5ea",
      accent: "#0f766e",
      text: "#111827",
      muted: "#4b5563",
      border: "#dbdee4",
      headingFont: "Jost",
      bodyFont: "Jost",
      radius: "1rem",
      shadow: "8px 8px 18px #d3d7dd, -8px -8px 18px #ffffff",
      blur: "0px",
      tilt: 4,
      animSpeed: 1,
      buttonStyle: "neu",
      dark: false,
    },
  },
  "bold-glam": {
    id: "bold-glam",
    name: "Bold Glam",
    blurb: "Vibrant, oversized type, dramatic shadows",
    tokens: {
      background: "#0d0d0d",
      surface: "#1c1c1c",
      primary: "#ff2d95",
      primaryFg: "#0d0d0d",
      secondary: "#2b1b3a",
      accent: "#ffe14d",
      text: "#ffffff",
      muted: "#c9c9c9",
      border: "#ff2d95",
      headingFont: "Anton",
      bodyFont: "Poppins",
      radius: "0.25rem",
      shadow: "8px 8px 0 #ff2d95",
      blur: "0px",
      tilt: 14,
      animSpeed: 0.8,
      buttonStyle: "hard",
      dark: true,
    },
  },
  "nature-spa": {
    id: "nature-spa",
    name: "Nature Spa",
    blurb: "Organic, earthy tones with a soft grain feel",
    tokens: {
      background: "#f1eadb",
      surface: "#faf6ec",
      primary: "#3f6b4b",
      primaryFg: "#ffffff",
      secondary: "#e2d5b8",
      accent: "#a94f33",
      text: "#2b2a1f",
      muted: "#5a5745",
      border: "#d6caac",
      headingFont: "Fraunces",
      bodyFont: "Nunito",
      radius: "1.25rem",
      shadow: "0 14px 30px -12px rgba(63,107,75,.4), 0 2px 6px rgba(43,42,31,.08)",
      blur: "0px",
      tilt: 6,
      animSpeed: 1.2,
      buttonStyle: "soft",
      dark: false,
    },
  },
};

export const THEME_LIST: ThemePreset[] = Object.values(THEMES);

export const FONT_OPTIONS = [
  "Cormorant Garamond",
  "Playfair Display",
  "Fraunces",
  "Anton",
  "Jost",
  "Manrope",
  "DM Sans",
  "Poppins",
  "Nunito",
];

export const BUTTON_STYLES: ButtonStyle[] = ["raised", "glass", "neu", "hard", "soft"];

export function isThemeId(x: unknown): x is ThemeId {
  return typeof x === "string" && x in THEMES;
}

const pickStr = (o: Rec, k: string, d: string): string => {
  const v = o[k];
  return typeof v === "string" && v.trim() ? v : d;
};
const pickNum = (o: Rec, k: string, d: number): number => {
  const v = o[k];
  return typeof v === "number" && Number.isFinite(v) ? v : d;
};

// Missing or invalid theme falls back to the default theme; overrides are validated per key
export function resolveTokens(id: unknown, overrides: unknown): { id: ThemeId; tokens: ThemeTokens } {
  const themeId = isThemeId(id) ? id : DEFAULT_THEME;
  const d = THEMES[themeId].tokens;
  const o = rec(overrides);
  const bs = o.buttonStyle;
  const buttonStyle = BUTTON_STYLES.find((s) => s === bs) ?? d.buttonStyle;
  return {
    id: themeId,
    tokens: {
      background: pickStr(o, "background", d.background),
      surface: pickStr(o, "surface", d.surface),
      primary: pickStr(o, "primary", d.primary),
      primaryFg: pickStr(o, "primaryFg", d.primaryFg),
      secondary: pickStr(o, "secondary", d.secondary),
      accent: pickStr(o, "accent", d.accent),
      text: pickStr(o, "text", d.text),
      muted: pickStr(o, "muted", d.muted),
      border: pickStr(o, "border", d.border),
      headingFont: pickStr(o, "headingFont", d.headingFont),
      bodyFont: pickStr(o, "bodyFont", d.bodyFont),
      radius: pickStr(o, "radius", d.radius),
      shadow: pickStr(o, "shadow", d.shadow),
      blur: pickStr(o, "blur", d.blur),
      tilt: pickNum(o, "tilt", d.tilt),
      animSpeed: pickNum(o, "animSpeed", d.animSpeed),
      buttonStyle,
      dark: typeof o.dark === "boolean" ? o.dark : d.dark,
    },
  };
}

function buttonShadow(t: ThemeTokens): string {
  switch (t.buttonStyle) {
    case "raised":
      return `0 4px 0 color-mix(in oklab, ${t.primary} 55%, black), 0 10px 18px rgba(0,0,0,.28)`;
    case "glass":
      return `inset 0 1px 0 rgba(255,255,255,.7), 0 8px 24px color-mix(in oklab, ${t.primary} 35%, transparent)`;
    case "neu":
      return "6px 6px 12px #cbcfd6, -6px -6px 12px #ffffff";
    case "hard":
      return `5px 5px 0 ${t.accent}`;
    default:
      return "0 6px 14px rgba(0,0,0,.18)";
  }
}

export type CssVars = CSSProperties & { [key: `--${string}`]: string };

const stack = (font: string, fallback: string) =>
  `"${font}", "Noto Sans Devanagari", "Noto Sans Gujarati", ${fallback}`;

// Maps tokens onto the semantic variables every UI component already reads
export function themeStyle(t: ThemeTokens): CssVars {
  const s: CssVars = {};
  s["--background"] = t.background;
  s["--foreground"] = t.text;
  s["--card"] = t.surface;
  s["--card-foreground"] = t.text;
  s["--popover"] = t.surface;
  s["--popover-foreground"] = t.text;
  s["--primary"] = t.primary;
  s["--primary-foreground"] = t.primaryFg;
  s["--secondary"] = t.secondary;
  s["--secondary-foreground"] = t.text;
  s["--muted"] = t.secondary;
  s["--muted-foreground"] = t.muted;
  s["--accent"] = t.accent;
  s["--accent-foreground"] = t.primaryFg;
  s["--border"] = t.border;
  s["--input"] = t.border;
  s["--ring"] = t.primary;
  s["--radius"] = t.radius;
  s["--t-shadow"] = t.shadow;
  s["--t-btn-shadow"] = buttonShadow(t);
  s["--t-blur"] = t.blur;
  s["--t-tilt"] = String(t.tilt);
  s["--t-speed"] = String(t.animSpeed);
  s["--t-heading"] = stack(t.headingFont, "serif");
  s["--t-body"] = stack(t.bodyFont, "sans-serif");
  s.colorScheme = t.dark ? "dark" : "light";
  return s;
}

// Tailwind class for headings that follow the theme's heading font
export const HEADING = "[font-family:var(--t-heading)]";
