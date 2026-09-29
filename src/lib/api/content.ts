import { supabase } from "@/lib/supabase.ts";
import { KINDS } from "@/lib/seed-data.ts";
import { num, rec, str, type Bundle } from "@/lib/data.ts";
import { asRows, check } from "./util.ts";

// Everything the public site needs: a few dozen small rows, fetched once.
export async function fetchBundle(): Promise<Bundle> {
  const [settingsRes, itemsRes] = await Promise.all([
    supabase.from("settings").select("key,value"),
    supabase
      .from("items")
      .select("id,kind,order,data")
      .eq("visible", true)
      .order("order", { ascending: true })
      .limit(1000),
  ]);
  check(settingsRes.error);
  check(itemsRes.error);

  const settings: Record<string, unknown> = {};
  for (const r of asRows(settingsRes.data)) settings[str(r.key)] = r.value;

  const items: Bundle["items"] = {};
  for (const kind of KINDS) items[kind] = [];
  for (const r of asRows(itemsRes.data)) {
    (items[str(r.kind)] ??= []).push({ _id: str(r.id), order: num(r.order), data: rec(r.data) });
  }
  return { seeded: Object.keys(settings).length > 0, settings, items };
}
