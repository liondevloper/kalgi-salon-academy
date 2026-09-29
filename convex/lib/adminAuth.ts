import { ConvexError } from "convex/values";
import type { MutationCtx, QueryCtx } from "../_generated/server";

// Every admin function calls this first with the session token from the password login.
export async function requireAdmin(ctx: QueryCtx | MutationCtx, token: string): Promise<void> {
  const session = await ctx.db
    .query("adminSessions")
    .withIndex("by_token", (q) => q.eq("token", token))
    .unique();
  if (!session || session.expiresAt < new Date().toISOString()) {
    throw new ConvexError({ code: "UNAUTHENTICATED", message: "Please log in again" });
  }
}
