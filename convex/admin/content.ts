import { ConvexError, v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { requireAdmin } from "../lib/adminAuth";

export const listItems = query({
  args: { token: v.string(), kind: v.string() },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, args.token);
    return await ctx.db
      .query("items")
      .withIndex("by_kind_and_order", (q) => q.eq("kind", args.kind))
      .take(500);
  },
});

export const upsertItem = mutation({
  args: {
    token: v.string(),
    id: v.optional(v.id("items")),
    kind: v.string(),
    data: v.any(),
    visible: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, args.token);
    if (args.id) {
      await ctx.db.patch("items", args.id, {
        data: args.data,
        ...(args.visible === undefined ? {} : { visible: args.visible }),
      });
      return args.id;
    }
    const last = await ctx.db
      .query("items")
      .withIndex("by_kind_and_order", (q) => q.eq("kind", args.kind))
      .order("desc")
      .first();
    return await ctx.db.insert("items", {
      kind: args.kind,
      order: (last?.order ?? 0) + 1,
      visible: args.visible ?? true,
      data: args.data,
    });
  },
});

export const setVisible = mutation({
  args: { token: v.string(), id: v.id("items"), visible: v.boolean() },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, args.token);
    await ctx.db.patch("items", args.id, { visible: args.visible });
    return null;
  },
});

export const removeItem = mutation({
  args: { token: v.string(), id: v.id("items") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, args.token);
    await ctx.db.delete("items", args.id);
    return null;
  },
});

// Swap order with the neighbour above or below
export const moveItem = mutation({
  args: { token: v.string(), id: v.id("items"), direction: v.union(v.literal("up"), v.literal("down")) },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, args.token);
    const item = await ctx.db.get("items", args.id);
    if (!item) throw new ConvexError({ code: "NOT_FOUND", message: "Item not found" });
    const neighbour =
      args.direction === "up"
        ? await ctx.db
            .query("items")
            .withIndex("by_kind_and_order", (q) =>
              q.eq("kind", item.kind).lt("order", item.order),
            )
            .order("desc")
            .first()
        : await ctx.db
            .query("items")
            .withIndex("by_kind_and_order", (q) =>
              q.eq("kind", item.kind).gt("order", item.order),
            )
            .order("asc")
            .first();
    if (!neighbour) return null;
    await ctx.db.patch("items", item._id, { order: neighbour.order });
    await ctx.db.patch("items", neighbour._id, { order: item.order });
    return null;
  },
});

export const setSetting = mutation({
  args: { token: v.string(), key: v.string(), value: v.any() },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, args.token);
    const existing = await ctx.db
      .query("settings")
      .withIndex("by_key", (q) => q.eq("key", args.key))
      .unique();
    if (existing) await ctx.db.patch("settings", existing._id, { value: args.value });
    else await ctx.db.insert("settings", { key: args.key, value: args.value });
    return null;
  },
});

export const stats = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, args.token);
    const appointments = await ctx.db.query("appointments").order("desc").take(500);
    const enquiries = await ctx.db.query("enquiries").order("desc").take(500);
    const services = await ctx.db
      .query("items")
      .withIndex("by_kind_and_order", (q) => q.eq("kind", "service"))
      .take(500);
    return {
      newBookings: appointments.filter((a) => a.status === "New").length,
      totalBookings: appointments.length,
      enquiries: enquiries.length,
      services: services.length,
      latest: appointments.slice(0, 6),
    };
  },
});
