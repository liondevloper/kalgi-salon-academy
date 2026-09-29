import { ConvexError, v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { requireAdmin } from "../lib/adminAuth";

export const generateUploadUrl = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, args.token);
    return await ctx.storage.generateUploadUrl();
  },
});

export const saveMedia = mutation({
  args: { token: v.string(), storageId: v.id("_storage"), name: v.string(), alt: v.string() },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, args.token);
    const url = await ctx.storage.getUrl(args.storageId);
    if (!url) throw new ConvexError({ code: "NOT_FOUND", message: "Upload failed" });
    await ctx.db.insert("media", { storageId: args.storageId, name: args.name, alt: args.alt, url });
    return url;
  },
});

export const listMedia = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, args.token);
    return await ctx.db.query("media").order("desc").take(300);
  },
});

export const updateAlt = mutation({
  args: { token: v.string(), id: v.id("media"), alt: v.string() },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, args.token);
    await ctx.db.patch("media", args.id, { alt: args.alt });
    return null;
  },
});

export const removeMedia = mutation({
  args: { token: v.string(), id: v.id("media") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, args.token);
    const row = await ctx.db.get("media", args.id);
    if (!row) return null;
    await ctx.storage.delete(row.storageId);
    await ctx.db.delete("media", args.id);
    return null;
  },
});
