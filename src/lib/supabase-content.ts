import { useEffect, useState } from "react";
import { supabase } from "./supabase.ts";
import { isRec, type Rec } from "./data.ts";

export type Bundle = {
  seeded: boolean;
  settings: Record<string, unknown>;
  items: Record<string, { _id: string; order: number; data: Rec }[]>;
};

type ItemRow = { id: string; kind: string; order: number; data: unknown };
type SettingRow = { key: string; value: unknown };

// Reads public site content from Supabase (RLS allows anonymous reads)
async function fetchBundle(): Promise<Bundle> {
  const [settingsRes, itemsRes] = await Promise.all([
    supabase.from("settings").select("key, value"),
    supabase.from("items").select("id, kind, order, data").eq("visible", true).order("order", { ascending: true }),
  ]);
  if (settingsRes.error) throw settingsRes.error;
  if (itemsRes.error) throw itemsRes.error;

  const settings: Record<string, unknown> = {};
  for (const row of settingsRes.data as SettingRow[]) settings[row.key] = row.value;

  const items: Bundle["items"] = {};
  for (const row of itemsRes.data as ItemRow[]) {
    (items[row.kind] ??= []).push({ _id: row.id, order: row.order, data: isRec(row.data) ? row.data : {} });
  }
  return { seeded: settingsRes.data.length > 0, settings, items };
}

// undefined = loading
export function useSupabaseBundle(): Bundle | undefined {
  const [bundle, setBundle] = useState<Bundle | undefined>(undefined);
  useEffect(() => {
    let alive = true;
    fetchBundle()
      .then((b) => alive && setBundle(b))
      .catch(() => alive && setBundle({ seeded: false, settings: {}, items: {} }));
    return () => {
      alive = false;
    };
  }, []);
  return bundle;
}
