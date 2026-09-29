import { query } from "./_generated/server";
import { KINDS } from "./seedData";

// One small public bundle: the whole site is a few dozen documents.
export const bundle = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query("settings").take(50);
    const settings: Record<string, unknown> = {};
    for (const row of rows) settings[row.key] = row.value;

    const items: Record<
      string,
      { _id: string; kind: string; order: number; visible: boolean; data: Record<string, unknown> }[]
    > = {};
    for (const kind of KINDS) {
      const list = await ctx.db
        .query("items")
        .withIndex("by_kind_and_order", (q) => q.eq("kind", kind))
        .take(300);
      items[kind] = list.filter((i) => i.visible);
    }
    return { seeded: rows.length > 0, settings, items };
  },
});
