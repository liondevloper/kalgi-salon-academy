import { ConvexError, v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { requireAdmin } from "../lib/adminAuth";

// Tells the admin UI who is signed in and whether they may enter
export const me = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return { signedIn: false, isAdmin: false, canClaim: false, email: null };
    const admin = await ctx.db
      .query("admins")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();
    const anyAdmin = await ctx.db.query("admins").first();
    return {
      signedIn: true,
      isAdmin: admin !== null,
      canClaim: anyAdmin === null,
      email: identity.email ?? null,
    };
  },
});

// The very first signed-in account becomes the owner
export const claim = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError({ code: "UNAUTHENTICATED", message: "Please sign in" });
    }
    const anyAdmin = await ctx.db.query("admins").first();
    if (anyAdmin) {
      throw new ConvexError({ code: "FORBIDDEN", message: "An owner already exists" });
    }
    await ctx.db.insert("admins", {
      tokenIdentifier: identity.tokenIdentifier,
      email: identity.email,
      name: identity.name,
    });
    return null;
  },
});

export const listAdmins = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const rows = await ctx.db.query("admins").take(50);
    return rows.map((r) => ({ _id: r._id, email: r.email ?? "", name: r.name ?? "" }));
  },
});

// Add another admin by email; they must have signed in to the site once
export const addAdmin = mutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const email = args.email.trim().toLowerCase();
    const users = await ctx.db.query("users").take(2000);
    const user = users.find((u) => (u.email ?? "").toLowerCase() === email);
    if (!user) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "No account with this email yet. Ask them to sign in once at /admin first.",
      });
    }
    const existing = await ctx.db
      .query("admins")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", user.tokenIdentifier))
      .unique();
    if (existing) {
      throw new ConvexError({ code: "CONFLICT", message: "Already an admin" });
    }
    await ctx.db.insert("admins", {
      tokenIdentifier: user.tokenIdentifier,
      email: user.email,
      name: user.name,
    });
    return null;
  },
});

export const removeAdmin = mutation({
  args: { id: v.id("admins") },
  handler: async (ctx, args) => {
    const me = await requireAdmin(ctx);
    if (me._id === args.id) {
      throw new ConvexError({ code: "BAD_REQUEST", message: "You cannot remove yourself" });
    }
    await ctx.db.delete("admins", args.id);
    return null;
  },
});
