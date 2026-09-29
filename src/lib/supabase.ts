import { createClient } from "@supabase/supabase-js";

// The publishable key is safe to ship in the browser; row access is controlled by RLS policies.
const url = import.meta.env.VITE_SUPABASE_URL ?? "https://hdpkwjdkpaspwpilucbo.supabase.co";
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? "sb_publishable_GRkul6RRZU2-knj-KkeTgg_QH-9GshO";

export const supabase = createClient(url, key);
