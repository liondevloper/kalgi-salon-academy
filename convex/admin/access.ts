import { ConvexError, v } from "convex/values";
import { mutation, query } from "../_generated/server";

const SESSION_DAYS = 14;

// Password comes from the ADMIN_PASSWORD secret. No password set means nobody can log in.
export const login = mutation({
  args: { password: v.string() },
  handler: async (ctx, args): Promise<string> => {
    const expected = process.env.ADMIN_PASSWORD;
    if (!expected) {
      throw new ConvexError({ code: "BAD_REQUEST", message: "ADMIN_PASSWORD secret is not set yet" });
    }
    if (args.password !== expected) {
      throw new ConvexError({ code: "FORBIDDEN", message: "Wrong password" });
    }
    const token = `${crypto.randomUUID()}${crypto.randomUUID()}`.replace(/-/g, "");
    const expiresAt = new Date(Date.now() + SESSION_DAYS * 86400000).toISOString();
    await ctx.db.insert("adminSessions", { token, expiresAt });
    return token;
  },
});

export const check = query({
  args: { token: v.string() },
  handler: async (ctx, args): Promise<boolean> => {
    const session = await ctx.db
      .query("adminSessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .unique();
    return session !== null && session.expiresAt >= new Date().toISOString();
  },
});

export const logout = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("adminSessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .unique();
    if (session) await ctx.db.delete("adminSessions", session._id);
    return null;
  },
});
