import { eq, gte, desc, sql, and, like, or } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser, users,
  InsertBooking, bookings, rooms,
  guestProfiles, InsertGuestProfile, GuestProfile,
  behaviorEvents, InsertBehaviorEvent
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Room queries
export async function getAllRooms() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(rooms).orderBy(rooms.createdAt);
}

export async function getRoomById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(rooms).where(eq(rooms.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getRoomsByCapacity(capacity: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(rooms).where(gte(rooms.capacity, capacity));
}

// Booking queries
export async function createBooking(booking: InsertBooking) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  const result = await db.insert(bookings).values(booking);
  const insertId = (result as any)[0]?.insertId as number | undefined;
  return { insertId };
}

export async function getBookingById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(bookings).where(eq(bookings.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getAllBookings() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(bookings).orderBy(desc(bookings.createdAt));
}

// ─── CRM: Guest Profile queries ────────────────────────────────────────────

export async function getAllGuestProfiles(search?: string) {
  const db = await getDb();
  if (!db) return [];
  if (search) {
    return db.select().from(guestProfiles)
      .where(or(
        like(guestProfiles.name, `%${search}%`),
        like(guestProfiles.email, `%${search}%`),
        like(guestProfiles.phone, `%${search}%`)
      ))
      .orderBy(desc(guestProfiles.lastVisit));
  }
  return db.select().from(guestProfiles).orderBy(desc(guestProfiles.lastVisit));
}

export async function getGuestProfileById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(guestProfiles).where(eq(guestProfiles.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getGuestProfileByEmail(email: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(guestProfiles).where(eq(guestProfiles.email, email)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function upsertGuestProfile(data: {
  email: string;
  name: string;
  phone?: string;
  totalPriceToAdd?: number;
}) {
  const db = await getDb();
  if (!db) return;

  const existing = await getGuestProfileByEmail(data.email);
  if (existing) {
    // Update existing guest profile
    await db.update(guestProfiles)
      .set({
        name: data.name,
        phone: data.phone ?? existing.phone,
        totalStays: existing.totalStays + 1,
        totalSpend: existing.totalSpend + (data.totalPriceToAdd ?? 0),
        lastVisit: new Date(),
      })
      .where(eq(guestProfiles.email, data.email));
    return existing;
  } else {
    // Create new guest profile
    await db.insert(guestProfiles).values({
      email: data.email,
      name: data.name,
      phone: data.phone,
      totalStays: 1,
      totalSpend: data.totalPriceToAdd ?? 0,
      firstVisit: new Date(),
      lastVisit: new Date(),
    });
    return getGuestProfileByEmail(data.email);
  }
}

export async function updateGuestProfile(id: number, data: Partial<GuestProfile>) {
  const db = await getDb();
  if (!db) return;
  await db.update(guestProfiles).set(data).where(eq(guestProfiles.id, id));
}

export async function addGuestNote(id: number, note: string) {
  const db = await getDb();
  if (!db) return;
  const existing = await getGuestProfileById(id);
  if (!existing) return;
  const currentNotes = existing.notes ?? '';
  const timestamp = new Date().toISOString().split('T')[0];
  const newNotes = currentNotes ? `${currentNotes}\n[${timestamp}] ${note}` : `[${timestamp}] ${note}`;
  await db.update(guestProfiles).set({ notes: newNotes }).where(eq(guestProfiles.id, id));
}

export async function getGuestBookings(email: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(bookings).where(eq(bookings.guestEmail, email)).orderBy(desc(bookings.createdAt));
}

// ─── CRM: Behavior Events ────────────────────────────────────────────────────

export async function trackBehaviorEvent(event: InsertBehaviorEvent) {
  const db = await getDb();
  if (!db) return;
  await db.insert(behaviorEvents).values(event);
}

// ─── CRM: Analytics / Stats ─────────────────────────────────────────────────

export async function getCrmStats() {
  const db = await getDb();
  if (!db) return null;

  const [totalGuests] = await db.select({ count: sql<number>`count(*)` }).from(guestProfiles);
  const [totalBookings] = await db.select({ count: sql<number>`count(*)` }).from(bookings);
  const [totalRevenue] = await db.select({ sum: sql<number>`COALESCE(SUM(totalPrice), 0)` }).from(bookings)
    .where(eq(bookings.status, 'confirmed'));
  const [pendingBookings] = await db.select({ count: sql<number>`count(*)` }).from(bookings)
    .where(eq(bookings.status, 'pending'));
  const [confirmedBookings] = await db.select({ count: sql<number>`count(*)` }).from(bookings)
    .where(eq(bookings.status, 'confirmed'));

  // Bookings per month (last 6 months)
  const recentBookings = await db.select({
    month: sql<string>`DATE_FORMAT(createdAt, '%Y-%m')`,
    count: sql<number>`count(*)`,
    revenue: sql<number>`COALESCE(SUM(totalPrice), 0)`,
  }).from(bookings)
    .where(gte(bookings.createdAt, new Date(Date.now() - 180 * 24 * 60 * 60 * 1000)))
    .groupBy(sql`DATE_FORMAT(createdAt, '%Y-%m')`)
    .orderBy(sql`DATE_FORMAT(createdAt, '%Y-%m')`);

  return {
    totalGuests: Number(totalGuests?.count ?? 0),
    totalBookings: Number(totalBookings?.count ?? 0),
    totalRevenue: Number(totalRevenue?.sum ?? 0),
    pendingBookings: Number(pendingBookings?.count ?? 0),
    confirmedBookings: Number(confirmedBookings?.count ?? 0),
    recentBookings: recentBookings.map(r => ({
      month: r.month,
      count: Number(r.count),
      revenue: Number(r.revenue),
    })),
  };
}

// ─── P3: Dynamic Pricing ──────────────────────────────────────────────────────

import {
  pricingRules, InsertPricingRule,
  upsellServices, upsellOffers, InsertUpsellOffer,
  loyaltyAccounts, loyaltyTransactions,
} from "../drizzle/schema";
import { lte } from "drizzle-orm";

export async function getAllPricingRules() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(pricingRules).orderBy(desc(pricingRules.priority));
}

export async function upsertPricingRule(data: InsertPricingRule & { id?: number }) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  if (data.id) {
    const { id, ...rest } = data;
    await db.update(pricingRules).set(rest).where(eq(pricingRules.id, id));
    return id;
  } else {
    const result = await db.insert(pricingRules).values(data);
    return (result as any)[0]?.insertId as number;
  }
}

export async function deletePricingRule(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(pricingRules).where(eq(pricingRules.id, id));
}

/**
 * Calculate dynamic price for a room and date range.
 * Returns { basePrice, finalPrice, multiplier, appliedRule }
 */
export async function calculateDynamicPrice(
  roomId: number,
  checkIn: Date,
  checkOut: Date
): Promise<{ basePrice: number; finalPrice: number; multiplier: number; appliedRule: string | null }> {
  const db = await getDb();
  const room = await getRoomById(roomId);
  if (!room) throw new Error('Room not found');

  const basePrice = room.price;

  if (!db) return { basePrice, finalPrice: basePrice, multiplier: 100, appliedRule: null };

  // Get active rules that apply to this room and date range
  const now = new Date();
  const activeRules = await db.select().from(pricingRules)
    .where(and(
      eq(pricingRules.isActive, true),
    ))
    .orderBy(desc(pricingRules.priority));

  // Filter rules that apply
  const applicableRules = activeRules.filter(rule => {
    // Room filter: null = all rooms
    if (rule.roomId !== null && rule.roomId !== roomId) return false;

    if (rule.ruleType === 'seasonal') {
      if (!rule.startDate || !rule.endDate) return false;
      const start = new Date(rule.startDate);
      const end = new Date(rule.endDate);
      // Check if checkIn falls within seasonal range
      return checkIn >= start && checkIn <= end;
    }

    if (rule.ruleType === 'earlybird') {
      // Early bird: booking made >= 30 days before check-in
      const daysUntilCheckIn = (checkIn.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
      return daysUntilCheckIn >= 30;
    }

    if (rule.ruleType === 'lastminute') {
      // Last minute: booking made <= 3 days before check-in
      const daysUntilCheckIn = (checkIn.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
      return daysUntilCheckIn <= 3 && daysUntilCheckIn >= 0;
    }

    if (rule.ruleType === 'weekday') {
      // Weekday discount: Mon-Thu
      const day = checkIn.getDay();
      return day >= 1 && day <= 4;
    }

    return false;
  });

  if (applicableRules.length === 0) {
    return { basePrice, finalPrice: basePrice, multiplier: 100, appliedRule: null };
  }

  // Apply highest priority rule
  const topRule = applicableRules[0];
  const multiplier = topRule.multiplier; // e.g. 150 = 1.5x
  const finalPrice = Math.round(basePrice * multiplier / 100);

  return {
    basePrice,
    finalPrice,
    multiplier,
    appliedRule: topRule.name,
  };
}

// ─── P3: Upsell Services ──────────────────────────────────────────────────────

export async function getAllUpsellServices() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(upsellServices).where(eq(upsellServices.isActive, true));
}

export async function createUpsellOffer(offer: InsertUpsellOffer) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  const result = await db.insert(upsellOffers).values(offer);
  return (result as any)[0]?.insertId as number;
}

export async function getUpsellOffersByBooking(bookingId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(upsellOffers).where(eq(upsellOffers.bookingId, bookingId));
}

export async function respondToUpsellOffer(offerId: number, status: 'accepted' | 'declined') {
  const db = await getDb();
  if (!db) return;
  await db.update(upsellOffers)
    .set({ status, respondedAt: new Date() })
    .where(eq(upsellOffers.id, offerId));
}

// ─── P3: Loyalty Program ──────────────────────────────────────────────────────

const TIER_THRESHOLDS = {
  bronze: 0,
  silver: 5000,
  gold: 15000,
  platinum: 50000,
} as const;

function calcTier(totalEarned: number): 'bronze' | 'silver' | 'gold' | 'platinum' {
  if (totalEarned >= TIER_THRESHOLDS.platinum) return 'platinum';
  if (totalEarned >= TIER_THRESHOLDS.gold) return 'gold';
  if (totalEarned >= TIER_THRESHOLDS.silver) return 'silver';
  return 'bronze';
}

export async function getLoyaltyAccount(guestEmail: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(loyaltyAccounts)
    .where(eq(loyaltyAccounts.guestEmail, guestEmail)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getLoyaltyTransactions(accountId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(loyaltyTransactions)
    .where(eq(loyaltyTransactions.accountId, accountId))
    .orderBy(desc(loyaltyTransactions.createdAt))
    .limit(20);
}

export async function earnLoyaltyPoints(
  guestEmail: string,
  guestName: string,
  amountVND: number,
  description: string,
  bookingId?: number
) {
  const db = await getDb();
  if (!db) return;

  // 1 point per 10,000 VND
  const pointsEarned = Math.floor(amountVND / 10000);
  if (pointsEarned <= 0) return;

  let account = await getLoyaltyAccount(guestEmail);

  if (!account) {
    // Create new account
    await db.insert(loyaltyAccounts).values({
      guestEmail,
      guestName,
      points: pointsEarned,
      totalEarned: pointsEarned,
      tier: calcTier(pointsEarned),
    });
    account = await getLoyaltyAccount(guestEmail);
  } else {
    const newTotal = account.totalEarned + pointsEarned;
    const newTier = calcTier(newTotal);
    // VIP bonus: gold/platinum earns 2x
    const bonusMultiplier = (account.tier === 'gold' || account.tier === 'platinum') ? 2 : 1;
    const finalPoints = pointsEarned * bonusMultiplier;
    await db.update(loyaltyAccounts)
      .set({
        points: account.points + finalPoints,
        totalEarned: newTotal,
        tier: newTier,
      })
      .where(eq(loyaltyAccounts.id, account.id));
  }

  if (account) {
    await db.insert(loyaltyTransactions).values({
      accountId: account.id,
      type: 'earn',
      points: pointsEarned,
      description,
      bookingId: bookingId ?? null,
    });
  }
}

export async function redeemLoyaltyPoints(
  guestEmail: string,
  pointsToRedeem: number,
  description: string
): Promise<{ success: boolean; message: string }> {
  const db = await getDb();
  if (!db) return { success: false, message: 'Database not available' };

  const account = await getLoyaltyAccount(guestEmail);
  if (!account) return { success: false, message: 'Không tìm thấy tài khoản loyalty' };
  if (account.points < pointsToRedeem) {
    return { success: false, message: `Không đủ điểm. Hiện có ${account.points} điểm` };
  }

  await db.update(loyaltyAccounts)
    .set({ points: account.points - pointsToRedeem })
    .where(eq(loyaltyAccounts.id, account.id));

  await db.insert(loyaltyTransactions).values({
    accountId: account.id,
    type: 'redeem',
    points: -pointsToRedeem,
    description,
  });

  return { success: true, message: `Đã đổi ${pointsToRedeem} điểm thành công` };
}

export async function getLoyaltyLeaderboard() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(loyaltyAccounts)
    .orderBy(desc(loyaltyAccounts.totalEarned))
    .limit(10);
}

// ─── Site Settings ─────────────────────────────────────────────────────────────
import { createHash } from "crypto";
import { siteSettings } from "../drizzle/schema";

export async function getSetting(key: string): Promise<string | null> {
  const db = await getDb();
  if (!db) return null;
  const rows = await db.select().from(siteSettings).where(eq(siteSettings.key, key));
  return rows[0]?.value ?? null;
}

export async function setSetting(key: string, value: string): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.insert(siteSettings).values({ key, value })
    .onDuplicateKeyUpdate({ set: { value } });
}

export function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex");
}

export async function verifyAdminPassword(password: string): Promise<boolean> {
  const storedHash = await getSetting("admin_password_hash");
  if (!storedHash) return false;
  return storedHash === hashPassword(password);
}

export async function changeAdminPassword(newPassword: string): Promise<void> {
  await setSetting("admin_password_hash", hashPassword(newPassword));
}
