import { describe, it, expect, vi, beforeEach } from "vitest";

// ─── Mock DB helpers ──────────────────────────────────────────────────────────

vi.mock("./db", () => ({
  calculateDynamicPrice: vi.fn(),
  getAllPricingRules: vi.fn(),
  upsertPricingRule: vi.fn(),
  deletePricingRule: vi.fn(),
  getAllUpsellServices: vi.fn(),
  createUpsellOffer: vi.fn(),
  getUpsellOffersByBooking: vi.fn(),
  respondToUpsellOffer: vi.fn(),
  getLoyaltyAccount: vi.fn(),
  getLoyaltyTransactions: vi.fn(),
  earnLoyaltyPoints: vi.fn(),
  redeemLoyaltyPoints: vi.fn(),
  getLoyaltyLeaderboard: vi.fn(),
  // Other db helpers used in routers
  getAllRooms: vi.fn(),
  getRoomById: vi.fn(),
  createBooking: vi.fn(),
  getAllBookings: vi.fn(),
  getAllGuestProfiles: vi.fn(),
  getGuestProfileById: vi.fn(),
  updateGuestProfile: vi.fn(),
  addGuestNote: vi.fn(),
  getGuestBookings: vi.fn(),
  upsertGuestProfile: vi.fn(),
  getCrmStats: vi.fn(),
  trackBehaviorEvent: vi.fn(),
}));

vi.mock("./_core/llm", () => ({
  invokeLLM: vi.fn(),
}));

vi.mock("./_core/notification", () => ({
  notifyOwner: vi.fn().mockResolvedValue(true),
}));

import {
  calculateDynamicPrice,
  getAllPricingRules,
  upsertPricingRule,
  deletePricingRule,
  getAllUpsellServices,
  createUpsellOffer,
  getUpsellOffersByBooking,
  respondToUpsellOffer,
  getLoyaltyAccount,
  getLoyaltyTransactions,
  earnLoyaltyPoints,
  redeemLoyaltyPoints,
  getLoyaltyLeaderboard,
} from "./db";

import { invokeLLM } from "./_core/llm";

// ─── Dynamic Pricing Tests ────────────────────────────────────────────────────

describe("Dynamic Pricing Engine", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns base price when no rule applies", async () => {
    vi.mocked(calculateDynamicPrice).mockResolvedValue({
      basePrice: 1000000,
      finalPrice: 1000000,
      multiplier: 100,
      appliedRule: null,
    });

    const result = await calculateDynamicPrice(1, new Date("2026-03-10"), new Date("2026-03-12"));
    expect(result.finalPrice).toBe(result.basePrice);
    expect(result.multiplier).toBe(100);
    expect(result.appliedRule).toBeNull();
  });

  it("applies seasonal surcharge correctly", async () => {
    vi.mocked(calculateDynamicPrice).mockResolvedValue({
      basePrice: 1000000,
      finalPrice: 1700000,
      multiplier: 170,
      appliedRule: "Lễ 30/4 - 1/5",
    });

    const result = await calculateDynamicPrice(1, new Date("2026-04-30"), new Date("2026-05-02"));
    expect(result.multiplier).toBe(170);
    expect(result.finalPrice).toBe(1700000);
    expect(result.appliedRule).toBe("Lễ 30/4 - 1/5");
  });

  it("applies early bird discount correctly", async () => {
    vi.mocked(calculateDynamicPrice).mockResolvedValue({
      basePrice: 1000000,
      finalPrice: 850000,
      multiplier: 85,
      appliedRule: "Ưu đãi đặt sớm (30+ ngày)",
    });

    const result = await calculateDynamicPrice(1, new Date("2026-07-01"), new Date("2026-07-03"));
    expect(result.multiplier).toBe(85);
    expect(result.finalPrice).toBeLessThan(result.basePrice);
  });

  it("applies last minute discount", async () => {
    vi.mocked(calculateDynamicPrice).mockResolvedValue({
      basePrice: 1000000,
      finalPrice: 900000,
      multiplier: 90,
      appliedRule: "Giá phút chót (≤3 ngày)",
    });

    const result = await calculateDynamicPrice(1, new Date(), new Date(Date.now() + 2 * 86400000));
    expect(result.multiplier).toBe(90);
    expect(result.finalPrice).toBeLessThan(result.basePrice);
  });

  it("getAllPricingRules returns sorted list", async () => {
    const mockRules = [
      { id: 1, name: "Tết", ruleType: "seasonal", multiplier: 200, priority: 10, isActive: true },
      { id: 2, name: "Ngày thường", ruleType: "weekday", multiplier: 90, priority: 3, isActive: true },
    ];
    vi.mocked(getAllPricingRules).mockResolvedValue(mockRules as any);

    const rules = await getAllPricingRules();
    expect(rules).toHaveLength(2);
    expect(rules[0].priority).toBeGreaterThan(rules[1].priority);
  });

  it("upsertPricingRule creates new rule", async () => {
    vi.mocked(upsertPricingRule).mockResolvedValue(42);
    const id = await upsertPricingRule({ name: "Test Rule", ruleType: "seasonal", multiplier: 150, priority: 5, isActive: true } as any);
    expect(id).toBe(42);
  });

  it("deletePricingRule removes rule by id", async () => {
    vi.mocked(deletePricingRule).mockResolvedValue(undefined);
    await deletePricingRule(1);
    expect(deletePricingRule).toHaveBeenCalledWith(1);
  });
});

// ─── Upsell System Tests ──────────────────────────────────────────────────────

describe("AI Upsell System", () => {
  beforeEach(() => vi.clearAllMocks());

  it("getAllUpsellServices returns active services", async () => {
    const mockServices = [
      { id: 1, name: "Spa 60 phút", category: "spa", price: 650000, isActive: true },
      { id: 2, name: "Bữa sáng", category: "food_beverage", price: 280000, isActive: true },
    ];
    vi.mocked(getAllUpsellServices).mockResolvedValue(mockServices as any);

    const services = await getAllUpsellServices();
    expect(services).toHaveLength(2);
    expect(services.every(s => s.isActive)).toBe(true);
  });

  it("createUpsellOffer stores offer with bookingId", async () => {
    vi.mocked(createUpsellOffer).mockResolvedValue(10);
    const id = await createUpsellOffer({ bookingId: 5, serviceId: 1, aiReason: "Phù hợp với kỳ nghỉ của bạn" } as any);
    expect(id).toBe(10);
    expect(createUpsellOffer).toHaveBeenCalledWith(expect.objectContaining({ bookingId: 5 }));
  });

  it("getUpsellOffersByBooking returns offers for booking", async () => {
    const mockOffers = [
      { id: 1, bookingId: 5, serviceId: 1, status: "pending" },
      { id: 2, bookingId: 5, serviceId: 2, status: "pending" },
    ];
    vi.mocked(getUpsellOffersByBooking).mockResolvedValue(mockOffers as any);

    const offers = await getUpsellOffersByBooking(5);
    expect(offers).toHaveLength(2);
    expect(offers.every(o => o.bookingId === 5)).toBe(true);
  });

  it("respondToUpsellOffer updates status to accepted", async () => {
    vi.mocked(respondToUpsellOffer).mockResolvedValue(undefined);
    await respondToUpsellOffer(1, "accepted");
    expect(respondToUpsellOffer).toHaveBeenCalledWith(1, "accepted");
  });

  it("respondToUpsellOffer updates status to declined", async () => {
    vi.mocked(respondToUpsellOffer).mockResolvedValue(undefined);
    await respondToUpsellOffer(2, "declined");
    expect(respondToUpsellOffer).toHaveBeenCalledWith(2, "declined");
  });
});

// ─── Loyalty Program Tests ────────────────────────────────────────────────────

describe("Loyalty Program", () => {
  beforeEach(() => vi.clearAllMocks());

  it("getLoyaltyAccount returns null for new guest", async () => {
    vi.mocked(getLoyaltyAccount).mockResolvedValue(undefined);
    const account = await getLoyaltyAccount("newguest@example.com");
    expect(account).toBeUndefined();
  });

  it("getLoyaltyAccount returns account with tier info", async () => {
    const mockAccount = {
      id: 1,
      guestEmail: "vip@example.com",
      guestName: "VIP Guest",
      points: 12000,
      totalEarned: 18000,
      tier: "gold",
    };
    vi.mocked(getLoyaltyAccount).mockResolvedValue(mockAccount as any);

    const account = await getLoyaltyAccount("vip@example.com");
    expect(account?.tier).toBe("gold");
    expect(account?.points).toBe(12000);
  });

  it("earnLoyaltyPoints is called with correct params", async () => {
    vi.mocked(earnLoyaltyPoints).mockResolvedValue(undefined);
    await earnLoyaltyPoints("guest@example.com", "Test Guest", 2000000, "Đặt phòng 2 đêm", 5);
    expect(earnLoyaltyPoints).toHaveBeenCalledWith(
      "guest@example.com",
      "Test Guest",
      2000000,
      "Đặt phòng 2 đêm",
      5
    );
  });

  it("redeemLoyaltyPoints returns success when enough points", async () => {
    vi.mocked(redeemLoyaltyPoints).mockResolvedValue({ success: true, message: "Đã đổi 1000 điểm thành công" });
    const result = await redeemLoyaltyPoints("guest@example.com", 1000, "Đổi điểm: Giảm 100.000đ");
    expect(result.success).toBe(true);
    expect(result.message).toContain("thành công");
  });

  it("redeemLoyaltyPoints returns failure when insufficient points", async () => {
    vi.mocked(redeemLoyaltyPoints).mockResolvedValue({ success: false, message: "Không đủ điểm. Hiện có 500 điểm" });
    const result = await redeemLoyaltyPoints("guest@example.com", 1000, "Đổi điểm");
    expect(result.success).toBe(false);
    expect(result.message).toContain("Không đủ điểm");
  });

  it("getLoyaltyLeaderboard returns top 10 accounts", async () => {
    const mockLeaderboard = Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      guestEmail: `guest${i + 1}@example.com`,
      guestName: `Guest ${i + 1}`,
      points: 10000 - i * 500,
      totalEarned: 15000 - i * 500,
      tier: i < 2 ? "platinum" : i < 5 ? "gold" : "silver",
    }));
    vi.mocked(getLoyaltyLeaderboard).mockResolvedValue(mockLeaderboard as any);

    const leaderboard = await getLoyaltyLeaderboard();
    expect(leaderboard).toHaveLength(10);
    expect(leaderboard[0].points).toBeGreaterThan(leaderboard[9].points);
  });

  it("getLoyaltyTransactions returns transaction history", async () => {
    const mockTxs = [
      { id: 1, accountId: 1, type: "earn", points: 200, description: "Đặt phòng 2 đêm", createdAt: new Date() },
      { id: 2, accountId: 1, type: "redeem", points: -1000, description: "Đổi điểm: Bữa sáng", createdAt: new Date() },
    ];
    vi.mocked(getLoyaltyTransactions).mockResolvedValue(mockTxs as any);

    const txs = await getLoyaltyTransactions(1);
    expect(txs).toHaveLength(2);
    expect(txs.find(t => t.type === "earn")).toBeTruthy();
    expect(txs.find(t => t.type === "redeem")).toBeTruthy();
  });
});
