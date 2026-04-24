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
