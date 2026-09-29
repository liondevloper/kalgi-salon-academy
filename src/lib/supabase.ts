import { createClient } from "@supabase/supabase-js";

// Publishable keys are meant for the browser; row level security protects the data.
const FALLBACK_URL = "https://hdpkwjdkpaspwpilucbo.supabase.co";
const FALLBACK_KEY = "sb_publishable_GRkul6RRZU2-knj-KkeTgg_QH-9GshO";

const envUrl: unknown = import.meta.env.VITE_SUPABASE_URL;
const envKey: unknown = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const supabase = createClient(
  typeof envUrl === "string" && envUrl ? envUrl : FALLBACK_URL,
  typeof envKey === "string" && envKey ? envKey : FALLBACK_KEY,
);
