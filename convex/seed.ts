import { mutation } from "./_generated/server";
import { SEED_ITEMS, SEED_SETTINGS } from "./seedData";

// Idempotent: only fills an empty database, called automatically by the site.
export const ensureSeeded = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db
      .query("settings")
      .withIndex("by_key", (q) => q.eq("key", "site"))
      .unique();
    if (existing) return false;
    for (const [key, value] of Object.entries(SEED_SETTINGS)) {
      await ctx.db.insert("settings", { key, value });
    }
    const counters: Record<string, number> = {};
    for (const item of SEED_ITEMS) {
      counters[item.kind] = (counters[item.kind] ?? 0) + 1;
      await ctx.db.insert("items", { ...item, order: counters[item.kind] });
    }
    return true;
  },
});
