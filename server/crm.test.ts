import { describe, it, expect, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock admin context
function createAdminContext(): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "admin-open-id",
      name: "Admin User",
      email: "admin@imperialhuehue.com",
      role: "admin",
      loginMethod: "oauth",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

// Mock non-admin context
function createUserContext(): TrpcContext {
  return {
    user: {
      id: 2,
      openId: "user-open-id",
      name: "Regular User",
      email: "user@example.com",
      role: "user",
      loginMethod: "oauth",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

// Mock public context (no user)
function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("CRM Stats API", () => {
  it("should return stats for admin users", async () => {
    const caller = appRouter.createCaller(createAdminContext());
    const stats = await caller.crm.stats();
    expect(stats).toBeDefined();
    if (stats) {
      expect(typeof stats.totalGuests).toBe("number");
      expect(typeof stats.totalBookings).toBe("number");
      expect(typeof stats.totalRevenue).toBe("number");
      expect(typeof stats.pendingBookings).toBe("number");
      expect(Array.isArray(stats.recentBookings)).toBe(true);
    }
  });

  it("should reject non-admin users", async () => {
    const caller = appRouter.createCaller(createUserContext());
    await expect(caller.crm.stats()).rejects.toThrow();
  });

  it("should reject unauthenticated users", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(caller.crm.stats()).rejects.toThrow();
  });
});

describe("CRM Guests API", () => {
  it("should list guests for admin", async () => {
    const caller = appRouter.createCaller(createAdminContext());
    const guests = await caller.crm.guests.list({});
    expect(Array.isArray(guests)).toBe(true);
  });

  it("should search guests by name", async () => {
    const caller = appRouter.createCaller(createAdminContext());
    const guests = await caller.crm.guests.list({ search: "Nguyễn" });
    expect(Array.isArray(guests)).toBe(true);
    // All results should match the search
    guests.forEach(g => {
      expect(
        g.name.toLowerCase().includes("nguyễn") ||
        g.email.toLowerCase().includes("nguyễn") ||
        (g.phone ?? "").includes("nguyễn")
      ).toBe(true);
    });
  });

  it("should reject non-admin for guest list", async () => {
    const caller = appRouter.createCaller(createUserContext());
    await expect(caller.crm.guests.list({})).rejects.toThrow();
  });
});

describe("CRM Bookings API", () => {
  it("should list all bookings for admin", async () => {
    const caller = appRouter.createCaller(createAdminContext());
    const bookings = await caller.crm.bookings.list({ status: "all" });
    expect(Array.isArray(bookings)).toBe(true);
  });

  it("should filter bookings by status", async () => {
    const caller = appRouter.createCaller(createAdminContext());
    const pendingBookings = await caller.crm.bookings.list({ status: "pending" });
    expect(Array.isArray(pendingBookings)).toBe(true);
    pendingBookings.forEach(b => {
      expect(b.status).toBe("pending");
    });
  });

  it("should filter confirmed bookings", async () => {
    const caller = appRouter.createCaller(createAdminContext());
    const confirmedBookings = await caller.crm.bookings.list({ status: "confirmed" });
    expect(Array.isArray(confirmedBookings)).toBe(true);
    confirmedBookings.forEach(b => {
      expect(b.status).toBe("confirmed");
    });
  });

  it("should reject non-admin for bookings list", async () => {
    const caller = appRouter.createCaller(createUserContext());
    await expect(caller.crm.bookings.list({ status: "all" })).rejects.toThrow();
  });
});

describe("CRM Track Event API", () => {
  it("should track behavior events (public)", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.crm.trackEvent({
      sessionId: "test-session-123",
      eventType: "page_view",
      pageUrl: "/rooms",
    });
    expect(result.success).toBe(true);
  });

  it("should track room view events", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.crm.trackEvent({
      sessionId: "test-session-456",
      eventType: "room_view",
      pageUrl: "/room/1",
      roomId: 1,
      duration: 45,
    });
    expect(result.success).toBe(true);
  });
});

describe("Bookings Create with CRM", () => {
  it("should create booking and upsert guest profile", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const checkIn = new Date("2026-06-01");
    const checkOut = new Date("2026-06-03");

    const result = await caller.bookings.create({
      roomId: 1,
      guestName: "Test Guest CRM",
      guestEmail: "test.crm@example.com",
      guestPhone: "0999888777",
      checkIn,
      checkOut,
      guests: 2,
    });

    expect(result).toBeDefined();

    // Verify guest profile was created
    const adminCaller = appRouter.createCaller(createAdminContext());
    const guests = await adminCaller.crm.guests.list({ search: "test.crm@example.com" });
    expect(guests.length).toBeGreaterThan(0);
    expect(guests[0].email).toBe("test.crm@example.com");
  }, 30000);
});
