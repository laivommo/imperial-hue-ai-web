import { integer, pgEnum, pgTable, text, timestamp, varchar, boolean, serial } from "drizzle-orm/pg-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const usersRoleEnum = pgEnum("role", ["user", "admin"]);

export const users = pgTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: serial("id").primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: usersRoleEnum("role").default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Rooms table
export const rooms = pgTable("rooms", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  price: integer("price").notNull(), // in VND
  capacity: integer("capacity").notNull(),
  image: varchar("image", { length: 512 }), // URL to room image
  amenities: text("amenities"), // JSON string of amenities
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Room = typeof rooms.$inferSelect;
export type InsertRoom = typeof rooms.$inferInsert;

// Bookings table
export const bookingStatusEnum = pgEnum("booking_status", ["pending", "confirmed", "cancelled"]);

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  roomId: integer("roomId").notNull(),
  guestName: varchar("guestName", { length: 255 }).notNull(),
  guestEmail: varchar("guestEmail", { length: 320 }).notNull(),
  guestPhone: varchar("guestPhone", { length: 20 }),
  checkIn: timestamp("checkIn").notNull(),
  checkOut: timestamp("checkOut").notNull(),
  guests: integer("guests").notNull(),
  totalPrice: integer("totalPrice"), // in VND
  status: bookingStatusEnum("status").default("pending").notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = typeof bookings.$inferInsert;

// Guest Profiles table - CRM
export const guestProfiles = pgTable("guestProfiles", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  totalStays: integer("totalStays").default(0).notNull(),
  totalSpend: integer("totalSpend").default(0).notNull(), // in VND
  tags: text("tags"), // JSON array of tags e.g. ["VIP", "Returning"]
  notes: text("notes"),
  firstVisit: timestamp("firstVisit").defaultNow().notNull(),
  lastVisit: timestamp("lastVisit").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type GuestProfile = typeof guestProfiles.$inferSelect;
export type InsertGuestProfile = typeof guestProfiles.$inferInsert;

// Behavior Events table - tracking user behavior for CRM analytics
export const behaviorEvents = pgTable("behaviorEvents", {
  id: serial("id").primaryKey(),
  sessionId: varchar("sessionId", { length: 128 }).notNull(),
  eventType: varchar("eventType", { length: 64 }).notNull(), // "page_view", "room_view", "booking_start", "booking_complete", "chat_open"
  pageUrl: varchar("pageUrl", { length: 512 }),
  roomId: integer("roomId"),
  duration: integer("duration"), // seconds spent on page
  metadata: text("metadata"), // JSON string for extra data
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type BehaviorEvent = typeof behaviorEvents.$inferSelect;
export type InsertBehaviorEvent = typeof behaviorEvents.$inferInsert;

// ─── P3: Dynamic Pricing ──────────────────────────────────────────────────────

export const pricingRuleTypeEnum = pgEnum("ruleType", ["seasonal", "weekday", "occupancy", "lastminute", "earlybird"]);

// Pricing Rules table - dynamic pricing configuration
export const pricingRules = pgTable("pricingRules", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(), // e.g. "Tết Nguyên Đán 2026"
  ruleType: pricingRuleTypeEnum("ruleType").notNull(),
  roomId: integer("roomId"), // null = applies to all rooms
  multiplier: integer("multiplier").notNull(), // percentage, e.g. 150 = 1.5x, 80 = 0.8x
  startDate: timestamp("startDate"),
  endDate: timestamp("endDate"),
  minOccupancy: integer("minOccupancy"), // trigger when occupancy >= this %
  priority: integer("priority").default(1).notNull(), // higher = takes precedence
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type PricingRule = typeof pricingRules.$inferSelect;
export type InsertPricingRule = typeof pricingRules.$inferInsert;

// ─── P3: AI Upsell System ─────────────────────────────────────────────────────

export const upsellCategoryEnum = pgEnum("category", ["room_upgrade", "food_beverage", "spa", "transport", "activity", "amenity"]);

// Upsell Services catalog
export const upsellServices = pgTable("upsellServices", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  price: integer("price").notNull(), // in VND
  category: upsellCategoryEnum("category").notNull(),
  icon: varchar("icon", { length: 64 }), // lucide icon name
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type UpsellService = typeof upsellServices.$inferSelect;
export type InsertUpsellService = typeof upsellServices.$inferInsert;

export const upsellStatusEnum = pgEnum("upsellStatus", ["offered", "accepted", "declined"]);

// Upsell Offers - per booking
export const upsellOffers = pgTable("upsellOffers", {
  id: serial("id").primaryKey(),
  bookingId: integer("bookingId").notNull(),
  serviceId: integer("serviceId").notNull(),
  status: upsellStatusEnum("status").default("offered").notNull(),
  offeredAt: timestamp("offeredAt").defaultNow().notNull(),
  respondedAt: timestamp("respondedAt"),
  aiReason: text("aiReason"), // why AI recommended this
});

export type UpsellOffer = typeof upsellOffers.$inferSelect;
export type InsertUpsellOffer = typeof upsellOffers.$inferInsert;

// ─── P3: Loyalty Program ──────────────────────────────────────────────────────

export const loyaltyTierEnum = pgEnum("tier", ["bronze", "silver", "gold", "platinum"]);

// Loyalty Accounts - one per guest email
export const loyaltyAccounts = pgTable("loyaltyAccounts", {
  id: serial("id").primaryKey(),
  guestEmail: varchar("guestEmail", { length: 320 }).notNull().unique(),
  guestName: varchar("guestName", { length: 255 }).notNull(),
  points: integer("points").default(0).notNull(), // current balance
  totalEarned: integer("totalEarned").default(0).notNull(), // lifetime earned
  tier: loyaltyTierEnum("tier").default("bronze").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type LoyaltyAccount = typeof loyaltyAccounts.$inferSelect;
export type InsertLoyaltyAccount = typeof loyaltyAccounts.$inferInsert;

export const loyaltyTransactionTypeEnum = pgEnum("type", ["earn", "redeem", "bonus", "expire"]);

// Loyalty Transactions - points history
export const loyaltyTransactions = pgTable("loyaltyTransactions", {
  id: serial("id").primaryKey(),
  accountId: integer("accountId").notNull(),
  type: loyaltyTransactionTypeEnum("type").notNull(),
  points: integer("points").notNull(), // positive = earn, negative = redeem
  description: varchar("description", { length: 512 }).notNull(),
  bookingId: integer("bookingId"), // linked booking if applicable
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type LoyaltyTransaction = typeof loyaltyTransactions.$inferSelect;
export type InsertLoyaltyTransaction = typeof loyaltyTransactions.$inferInsert;

// ─── Site Settings ─────────────────────────────────────────────────────────────
// Key-value store for site configuration (admin password, etc.)
export const siteSettings = pgTable("siteSettings", {
  key: varchar("key", { length: 128 }).primaryKey(),
  value: text("value").notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});
export type SiteSetting = typeof siteSettings.$inferSelect;
