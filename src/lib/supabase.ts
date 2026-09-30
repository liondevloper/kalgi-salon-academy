import { createClient } from "@supabase/supabase-js";

// Publishable keys are meant for the browser; row level security protects the data.
const FALLBACK_URL = "https://hdpkwjdkpaspwpilucbo.supabase.co";
const FALLBACK_KEY = "sb_publishable_GRkul6RRZU2-knj-KkeTgg_QH-9GshO";

// A badly pasted env value (spaces, new line, broken URL) must never blank the whole site
function cleanUrl(v: unknown): string {
  if (typeof v !== "string") return FALLBACK_URL;
  const s = v.trim();
  try {
    return new URL(s).protocol.startsWith("http") ? s : FALLBACK_URL;
  } catch {
    return FALLBACK_URL;
  }
}

function cleanKey(v: unknown): string {
  if (typeof v !== "string") return FALLBACK_KEY;
  const s = v.replace(/\s+/g, "");
  return /^[\w.\-]{20,}$/.test(s) ? s : FALLBACK_KEY;
}

export const supabase = createClient(
  cleanUrl(import.meta.env.VITE_SUPABASE_URL),
  cleanKey(import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY),
);
