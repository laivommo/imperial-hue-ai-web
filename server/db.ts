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
  return result;
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
