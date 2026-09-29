import { ConvexError, v } from "convex/values";
import { mutation } from "./_generated/server";
import type { QueryCtx } from "./_generated/server";

async function isDemo(ctx: QueryCtx): Promise<boolean> {
  const row = await ctx.db
    .query("settings")
    .withIndex("by_key", (q) => q.eq("key", "site"))
    .unique();
  const value: unknown = row?.value;
  if (typeof value === "object" && value !== null && "demoMode" in value) {
    return value.demoMode !== false;
  }
  return true;
}

function check(name: string, phone: string, max = 200) {
  if (name.trim().length < 2 || name.length > max) {
    throw new ConvexError({ code: "BAD_REQUEST", message: "Please enter a valid name" });
  }
  if (!/^\d{10}$/.test(phone.replace(/\D/g, "").slice(-10))) {
    throw new ConvexError({ code: "BAD_REQUEST", message: "Please enter a valid phone" });
  }
}

export const createAppointment = mutation({
  args: {
    name: v.string(),
    phone: v.string(),
    service: v.string(),
    date: v.string(),
    time: v.string(),
    message: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    check(args.name, args.phone);
    if ((args.message ?? "").length > 1000) {
      throw new ConvexError({ code: "BAD_REQUEST", message: "Message too long" });
    }
    await ctx.db.insert("appointments", {
      ...args,
      status: "New",
      isDemo: await isDemo(ctx),
      createdAt: new Date().toISOString(),
    });
    return null;
  },
});

export const createEnquiry = mutation({
  args: {
    name: v.string(),
    phone: v.string(),
    course: v.optional(v.string()),
    message: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    check(args.name, args.phone);
    if ((args.message ?? "").length > 1000) {
      throw new ConvexError({ code: "BAD_REQUEST", message: "Message too long" });
    }
    await ctx.db.insert("enquiries", {
      ...args,
      isDemo: await isDemo(ctx),
      createdAt: new Date().toISOString(),
    });
    return null;
  },
});
