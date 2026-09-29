import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { requireAdmin } from "../lib/adminAuth";

export const listAppointments = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    return await ctx.db.query("appointments").order("desc").take(500);
  },
});

export const updateAppointment = mutation({
  args: {
    id: v.id("appointments"),
    status: v.optional(
      v.union(
        v.literal("New"),
        v.literal("Confirmed"),
        v.literal("Completed"),
        v.literal("Cancelled"),
      ),
    ),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.patch("appointments", args.id, {
      ...(args.status ? { status: args.status } : {}),
      ...(args.notes === undefined ? {} : { notes: args.notes }),
    });
    return null;
  },
});

export const removeAppointment = mutation({
  args: { id: v.id("appointments") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.delete("appointments", args.id);
    return null;
  },
});

export const listEnquiries = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    return await ctx.db.query("enquiries").order("desc").take(500);
  },
});

export const removeEnquiry = mutation({
  args: { id: v.id("enquiries") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.delete("enquiries", args.id);
    return null;
  },
});
