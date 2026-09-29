import { createClient } from "@supabase/supabase-js";

// Supabase client for the kalgi-salon-academy project (tables: settings, items, appointments, enquiries, media)
const url = import.meta.env.VITE_SUPABASE_URL as string;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

export const supabase = createClient(url, key);
