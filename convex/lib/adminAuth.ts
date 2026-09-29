import { ConvexError } from "convex/values";
import type { MutationCtx, QueryCtx } from "../_generated/server";
import type { Doc } from "../_generated/dataModel";

// Every admin function calls this first. Identity always comes from Hercules Auth.
export async function requireAdmin(ctx: QueryCtx | MutationCtx): Promise<Doc<"admins">> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new ConvexError({ code: "UNAUTHENTICATED", message: "Please sign in" });
  }
  const admin = await ctx.db
    .query("admins")
    .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
    .unique();
  if (!admin) {
    throw new ConvexError({ code: "FORBIDDEN", message: "This account is not an admin" });
  }
  return admin;
}
