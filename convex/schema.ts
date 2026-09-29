import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const status = v.union(
  v.literal("New"),
  v.literal("Confirmed"),
  v.literal("Completed"),
  v.literal("Cancelled"),
);

export default defineSchema({
  users: defineTable({
    tokenIdentifier: v.string(),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
  }).index("by_token", ["tokenIdentifier"]),

  // Owners who may open the admin panel
  admins: defineTable({
    tokenIdentifier: v.string(),
  }).index("by_token", ["tokenIdentifier"]),

  // Password-login sessions for the admin panel
  adminSessions: defineTable({
    token: v.string(),
    expiresAt: v.string(),
  }).index("by_token", ["token"]),

  // Single-document site config, keyed: site, hero, about, theme, sections, seo
  settings: defineTable({
    key: v.string(),
    value: v.any(),
  }).index("by_key", ["key"]),

  // All list content (services, offers, gallery...) distinguished by `kind`
  items: defineTable({
    kind: v.string(),
    order: v.number(),
    visible: v.boolean(),
    data: v.any(),
  }).index("by_kind_and_order", ["kind", "order"]),

  appointments: defineTable({
    name: v.string(),
    phone: v.string(),
    service: v.string(),
    date: v.string(),
    time: v.string(),
    message: v.optional(v.string()),
    status,
    notes: v.optional(v.string()),
    isDemo: v.boolean(),
    createdAt: v.string(),
  }),

  enquiries: defineTable({
    name: v.string(),
    phone: v.string(),
    course: v.optional(v.string()),
    message: v.optional(v.string()),
    isDemo: v.boolean(),
    createdAt: v.string(),
  }),

  media: defineTable({
    storageId: v.id("_storage"),
    url: v.string(),
    name: v.string(),
    alt: v.string(),
  }),
});
