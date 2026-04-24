import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, boolean } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Rooms table
export const rooms = mysqlTable("rooms", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  price: int("price").notNull(), // in VND
  capacity: int("capacity").notNull(),
  image: varchar("image", { length: 512 }), // URL to room image
  amenities: text("amenities"), // JSON string of amenities
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Room = typeof rooms.$inferSelect;
export type InsertRoom = typeof rooms.$inferInsert;

// Bookings table
export const bookings = mysqlTable("bookings", {
  id: int("id").autoincrement().primaryKey(),
  roomId: int("roomId").notNull(),
  guestName: varchar("guestName", { length: 255 }).notNull(),
  guestEmail: varchar("guestEmail", { length: 320 }).notNull(),
  guestPhone: varchar("guestPhone", { length: 20 }),
  checkIn: timestamp("checkIn").notNull(),
  checkOut: timestamp("checkOut").notNull(),
  guests: int("guests").notNull(),
  totalPrice: int("totalPrice"), // in VND
  status: mysqlEnum("status", ["pending", "confirmed", "cancelled"]).default("pending").notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = typeof bookings.$inferInsert;

// Guest Profiles table - CRM
export const guestProfiles = mysqlTable("guestProfiles", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  totalStays: int("totalStays").default(0).notNull(),
  totalSpend: int("totalSpend").default(0).notNull(), // in VND
  tags: text("tags"), // JSON array of tags e.g. ["VIP", "Returning"]
  notes: text("notes"),
  firstVisit: timestamp("firstVisit").defaultNow().notNull(),
  lastVisit: timestamp("lastVisit").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type GuestProfile = typeof guestProfiles.$inferSelect;
export type InsertGuestProfile = typeof guestProfiles.$inferInsert;

// Behavior Events table - tracking user behavior for CRM analytics
export const behaviorEvents = mysqlTable("behaviorEvents", {
  id: int("id").autoincrement().primaryKey(),
  sessionId: varchar("sessionId", { length: 128 }).notNull(),
  eventType: varchar("eventType", { length: 64 }).notNull(), // "page_view", "room_view", "booking_start", "booking_complete", "chat_open"
  pageUrl: varchar("pageUrl", { length: 512 }),
  roomId: int("roomId"),
  duration: int("duration"), // seconds spent on page
  metadata: text("metadata"), // JSON string for extra data
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type BehaviorEvent = typeof behaviorEvents.$inferSelect;
export type InsertBehaviorEvent = typeof behaviorEvents.$inferInsert;

// ─── P3: Dynamic Pricing ──────────────────────────────────────────────────────

// Pricing Rules table - dynamic pricing configuration
export const pricingRules = mysqlTable("pricingRules", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(), // e.g. "Tết Nguyên Đán 2026"
  ruleType: mysqlEnum("ruleType", ["seasonal", "weekday", "occupancy", "lastminute", "earlybird"]).notNull(),
  roomId: int("roomId"), // null = applies to all rooms
  multiplier: int("multiplier").notNull(), // percentage, e.g. 150 = 1.5x, 80 = 0.8x
  startDate: timestamp("startDate"),
  endDate: timestamp("endDate"),
  minOccupancy: int("minOccupancy"), // trigger when occupancy >= this %
  priority: int("priority").default(1).notNull(), // higher = takes precedence
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PricingRule = typeof pricingRules.$inferSelect;
export type InsertPricingRule = typeof pricingRules.$inferInsert;

// ─── P3: AI Upsell System ─────────────────────────────────────────────────────

// Upsell Services catalog
export const upsellServices = mysqlTable("upsellServices", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  price: int("price").notNull(), // in VND
  category: mysqlEnum("category", ["room_upgrade", "food_beverage", "spa", "transport", "activity", "amenity"]).notNull(),
  icon: varchar("icon", { length: 64 }), // lucide icon name
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type UpsellService = typeof upsellServices.$inferSelect;
export type InsertUpsellService = typeof upsellServices.$inferInsert;

// Upsell Offers - per booking
export const upsellOffers = mysqlTable("upsellOffers", {
  id: int("id").autoincrement().primaryKey(),
  bookingId: int("bookingId").notNull(),
  serviceId: int("serviceId").notNull(),
  status: mysqlEnum("status", ["offered", "accepted", "declined"]).default("offered").notNull(),
  offeredAt: timestamp("offeredAt").defaultNow().notNull(),
  respondedAt: timestamp("respondedAt"),
  aiReason: text("aiReason"), // why AI recommended this
});

export type UpsellOffer = typeof upsellOffers.$inferSelect;
export type InsertUpsellOffer = typeof upsellOffers.$inferInsert;

// ─── P3: Loyalty Program ──────────────────────────────────────────────────────

// Loyalty Accounts - one per guest email
export const loyaltyAccounts = mysqlTable("loyaltyAccounts", {
  id: int("id").autoincrement().primaryKey(),
  guestEmail: varchar("guestEmail", { length: 320 }).notNull().unique(),
  guestName: varchar("guestName", { length: 255 }).notNull(),
  points: int("points").default(0).notNull(), // current balance
  totalEarned: int("totalEarned").default(0).notNull(), // lifetime earned
  tier: mysqlEnum("tier", ["bronze", "silver", "gold", "platinum"]).default("bronze").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type LoyaltyAccount = typeof loyaltyAccounts.$inferSelect;
export type InsertLoyaltyAccount = typeof loyaltyAccounts.$inferInsert;

// Loyalty Transactions - points history
export const loyaltyTransactions = mysqlTable("loyaltyTransactions", {
  id: int("id").autoincrement().primaryKey(),
  accountId: int("accountId").notNull(),
  type: mysqlEnum("type", ["earn", "redeem", "bonus", "expire"]).notNull(),
  points: int("points").notNull(), // positive = earn, negative = redeem
  description: varchar("description", { length: 512 }).notNull(),
  bookingId: int("bookingId"), // linked booking if applicable
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type LoyaltyTransaction = typeof loyaltyTransactions.$inferSelect;
export type InsertLoyaltyTransaction = typeof loyaltyTransactions.$inferInsert;

// ─── Site Settings ─────────────────────────────────────────────────────────────
// Key-value store for site configuration (admin password, etc.)
export const siteSettings = mysqlTable("siteSettings", {
  key: varchar("key", { length: 128 }).primaryKey(),
  value: text("value").notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type SiteSetting = typeof siteSettings.$inferSelect;
