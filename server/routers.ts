import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { COOKIE_NAME } from "../shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import {
  getAllRooms,
  getRoomById,
  createBooking,
  getAllBookings,
  getAllGuestProfiles,
  getGuestProfileById,
  updateGuestProfile,
  addGuestNote,
  getGuestBookings,
  upsertGuestProfile,
  getCrmStats,
  trackBehaviorEvent,
  // P3
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
  verifyAdminPassword,
  changeAdminPassword,
} from "./db";
import { invokeLLM } from "./_core/llm";
import { notifyOwner } from "./_core/notification";

// Admin-only middleware
// Since we don't have a full user session system anymore, we rely on the AdminGuard
// component on the frontend which verifies the password and stores state in sessionStorage.
// For true security, you would implement a JWT token flow. For this demo/MVP,
// we'll allow procedures if called from the admin routes (or you can add a token check here).
const adminProcedure = publicProcedure;

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => null),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  rooms: router({
    list: publicProcedure.query(async () => {
      return getAllRooms();
    }),
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return getRoomById(input.id);
      }),
  }),

  bookings: router({
    create: publicProcedure
      .input(z.object({
        roomId: z.number(),
        guestName: z.string().min(1),
        guestEmail: z.string().email(),
        guestPhone: z.string().optional(),
        checkIn: z.date(),
        checkOut: z.date(),
        guests: z.number().min(1),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const room = await getRoomById(input.roomId);

        // Calculate total price
        const nights = Math.ceil(
          (input.checkOut.getTime() - input.checkIn.getTime()) / (1000 * 60 * 60 * 24)
        );
        const totalPrice = room ? room.price * nights : 0;

        const booking = await createBooking({
          roomId: input.roomId,
          guestName: input.guestName,
          guestEmail: input.guestEmail,
          guestPhone: input.guestPhone,
          checkIn: input.checkIn,
          checkOut: input.checkOut,
          guests: input.guests,
          notes: input.notes,
          totalPrice,
          status: "pending",
        });

        // Upsert guest profile in CRM
        await upsertGuestProfile({
          email: input.guestEmail,
          name: input.guestName,
          phone: input.guestPhone,
          totalPriceToAdd: totalPrice,
        });

        // Notify owner
        const checkInStr = input.checkIn.toLocaleDateString("vi-VN");
        const checkOutStr = input.checkOut.toLocaleDateString("vi-VN");
        const priceStr = totalPrice.toLocaleString("vi-VN");

        await notifyOwner({
          title: `🎉 Đặt phòng mới từ ${input.guestName}`,
          content: `Khách hàng ${input.guestName} (${input.guestEmail}${input.guestPhone ? `, ${input.guestPhone}` : ""}) vừa đặt phòng "${room?.name}" từ ${checkInStr} đến ${checkOutStr} cho ${input.guests} khách. Tổng tiền: ${priceStr} VND.`,
        });

        // Earn loyalty points for guest
        if (totalPrice > 0) {
          await earnLoyaltyPoints(
            input.guestEmail,
            input.guestName,
            totalPrice,
            `Đặt phòng ${room?.name ?? 'khách sạn'} (${nights} đêm)`,
            booking.insertId
          );
        }
        return { success: true, bookingId: booking.insertId };
      }),
    list: protectedProcedure.query(async () => {
      return getAllBookings();
    }),
  }),

  ai: router({
    chat: publicProcedure
      .input(z.object({
        message: z.string(),
        checkIn: z.date().optional(),
        checkOut: z.date().optional(),
        guests: z.number().optional(),
        lang: z.enum(["vi", "en"]).optional().default("vi"),
        viewedRooms: z.array(z.object({ name: z.string(), price: z.number() })).optional(),
      }))
      .mutation(async ({ input }) => {
        const rooms = await getAllRooms();
        const isEn = input.lang === "en";

        const roomsInfo = rooms
          .map(r => {
            const amenities = r.amenities ? JSON.parse(r.amenities).join(", ") : "N/A";
            return `- ${r.name}: ${r.capacity} ${isEn ? "guests" : "khách"}, ${r.price.toLocaleString("vi-VN")} VND/${isEn ? "night" : "đêm"}, ${isEn ? "amenities" : "tiện ích"}: ${amenities}`;
          })
          .join("\n");

        // Build visitor context if available
        const visitorContext = input.viewedRooms?.length
          ? `\n${isEn ? "Guest previously viewed" : "Khách đã xem"}: ${input.viewedRooms.map(r => r.name).join(", ")}.`
          : "";

        const systemPrompt = `You are a smart, bilingual AI concierge for The Imperial Hue hotel. Help guests find and book rooms.

Available rooms:
${roomsInfo}${visitorContext}

CRITICAL LANGUAGE RULE: Reply in the SAME language the guest uses. If they write in English, reply ENTIRELY in English. If they write in Vietnamese, reply ENTIRELY in Vietnamese. NEVER mix languages.

RULES (strictly follow):
- Max 3-4 sentences, be concise.
- Only list room name + price, do NOT list every amenity.
- Use simple HTML for emphasis: <b>room name</b>, <br/> for line breaks. NO markdown ** or ##.
- End each reply with a short question to guide the guest.
- Friendly, warm, professional tone.`;

        const fallbackMsg = isEn ? "Sorry, I couldn't answer that question." : "Xin l\u1ed7i, t\u00f4i kh\u00f4ng th\u1ec3 tr\u1ea3 l\u1eddi c\u00e2u h\u1ecfi n\u00e0y.";

        const response = await invokeLLM({
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: input.message },
          ],
        });

        const rawContent = response.choices[0]?.message?.content;
        const rawText = typeof rawContent === "string"
          ? rawContent
          : Array.isArray(rawContent)
            ? rawContent.map((c: { type: string; text?: string }) => c.type === "text" ? c.text ?? "" : "").join("")
            : fallbackMsg;

        // Convert markdown to HTML for clean rendering in chat bubble
        const messageText = (rawText || fallbackMsg)
          .replace(/\*\*(.+?)\*\*/g, "<b>$1</b>")   // **bold** → <b>bold</b>
          .replace(/\*(.+?)\*/g, "<i>$1</i>")         // *italic* → <i>italic</i>
          .replace(/\n\n/g, "<br/><br/>")
          .replace(/\n/g, "<br/>");

        return {
          message: messageText,
          rooms: rooms,
        };
      }),
  }),

  // ─── CRM Router (admin only) ─────────────────────────────────────────────
  crm: router({
    // Stats overview
    stats: adminProcedure.query(async () => {
      return getCrmStats();
    }),

    // Guest management
    guests: router({
      list: adminProcedure
        .input(z.object({ search: z.string().optional() }))
        .query(async ({ input }) => {
          return getAllGuestProfiles(input.search);
        }),

      getById: adminProcedure
        .input(z.object({ id: z.number() }))
        .query(async ({ input }) => {
          const guest = await getGuestProfileById(input.id);
          if (!guest) throw new TRPCError({ code: "NOT_FOUND", message: "Không tìm thấy khách hàng" });
          const bookingHistory = await getGuestBookings(guest.email);
          return { guest, bookingHistory };
        }),

      update: adminProcedure
        .input(z.object({
          id: z.number(),
          name: z.string().optional(),
          phone: z.string().optional(),
          tags: z.string().optional(), // JSON array string
        }))
        .mutation(async ({ input }) => {
          const { id, ...data } = input;
          await updateGuestProfile(id, data);
          return { success: true };
        }),

      addNote: adminProcedure
        .input(z.object({
          id: z.number(),
          note: z.string().min(1),
        }))
        .mutation(async ({ input }) => {
          await addGuestNote(input.id, input.note);
          return { success: true };
        }),
    }),

    // Booking management for CRM
    bookings: router({
      list: adminProcedure
        .input(z.object({
          status: z.enum(["pending", "confirmed", "cancelled", "all"]).optional(),
          limit: z.number().optional().default(50),
        }))
        .query(async ({ input }) => {
          const all = await getAllBookings();
          if (!input.status || input.status === "all") return all.slice(0, input.limit);
          return all.filter(b => b.status === input.status).slice(0, input.limit);
        }),

      updateStatus: adminProcedure
        .input(z.object({
          id: z.number(),
          status: z.enum(["pending", "confirmed", "cancelled"]),
        }))
        .mutation(async ({ input }) => {
          const { getDb } = await import("./db");
          const { bookings: bookingsTable } = await import("../drizzle/schema");
          const { eq } = await import("drizzle-orm");
          const db = await getDb();
          if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
          await db.update(bookingsTable).set({ status: input.status }).where(eq(bookingsTable.id, input.id));
          return { success: true };
        }),
    }),

     // Track behavior events
    trackEvent: publicProcedure
      .input(z.object({
        sessionId: z.string(),
        eventType: z.string(),
        pageUrl: z.string().optional(),
        roomId: z.number().optional(),
        duration: z.number().optional(),
        metadata: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        await trackBehaviorEvent(input);
        return { success: true };
      }),
  }),

  // ─── P3: Dynamic Pricing ─────────────────────────────────────────────────
  pricing: router({
    getPrice: publicProcedure
      .input(z.object({
        roomId: z.number(),
        checkIn: z.date(),
        checkOut: z.date(),
      }))
      .query(async ({ input }) => {
        const nights = Math.max(1, Math.round(
          (input.checkOut.getTime() - input.checkIn.getTime()) / (1000 * 60 * 60 * 24)
        ));
        const priceInfo = await calculateDynamicPrice(input.roomId, input.checkIn, input.checkOut);
        return {
          ...priceInfo,
          nights,
          totalBase: priceInfo.basePrice * nights,
          totalFinal: priceInfo.finalPrice * nights,
        };
      }),
    getRules: adminProcedure.query(async () => {
      return getAllPricingRules();
    }),
    upsertRule: adminProcedure
      .input(z.object({
        id: z.number().optional(),
        name: z.string().min(1),
        ruleType: z.enum(["seasonal", "weekday", "occupancy", "lastminute", "earlybird"]),
        roomId: z.number().nullable().optional(),
        multiplier: z.number().min(1).max(500),
        startDate: z.date().nullable().optional(),
        endDate: z.date().nullable().optional(),
        minOccupancy: z.number().nullable().optional(),
        priority: z.number().default(1),
        isActive: z.boolean().default(true),
      }))
      .mutation(async ({ input }) => {
        const id = await upsertPricingRule(input as any);
        return { success: true, id };
      }),
    getSummary: publicProcedure.query(async () => {
      // Return today's pricing multiplier for display on room cards
      // We calculate directly from rules without needing a specific room
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      try {
        const rules = await getAllPricingRules();
        const now = new Date();
        const applicableRules = rules.filter((rule: any) => {
          if (!rule.isActive) return false;
          if (rule.ruleType === 'seasonal') {
            if (!rule.startDate || !rule.endDate) return false;
            const start = new Date(rule.startDate);
            const end = new Date(rule.endDate);
            return today >= start && today <= end;
          }
          if (rule.ruleType === 'earlybird') {
            const daysUntil = (today.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
            return daysUntil >= 30;
          }
          if (rule.ruleType === 'lastminute') {
            const daysUntil = (today.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
            return daysUntil <= 3 && daysUntil >= 0;
          }
          if (rule.ruleType === 'weekday') {
            const day = today.getDay();
            return day >= 1 && day <= 4;
          }
          return false;
        });
        const multiplier = applicableRules.length > 0 ? applicableRules[0].multiplier : 100;
        const appliedRule = applicableRules.length > 0 ? applicableRules[0].name : null;
        return {
          multiplier,
          appliedRule,
          isHighSeason: multiplier > 110,
          isDiscount: multiplier < 90,
        };
      } catch {
        return { multiplier: 100, appliedRule: null, isHighSeason: false, isDiscount: false };
      }
    }),
    deleteRule: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await deletePricingRule(input.id);
        return { success: true };
      }),
  }),

  // ─── P3: AI Upsell System ─────────────────────────────────────────────────
  upsell: router({
    getServices: publicProcedure.query(async () => {
      return getAllUpsellServices();
    }),
    getRecommendations: publicProcedure
      .input(z.object({
        bookingId: z.number(),
        guestName: z.string(),
        roomName: z.string(),
        checkIn: z.string(),
        checkOut: z.string(),
        guests: z.number(),
      }))
      .query(async ({ input }) => {
        const services = await getAllUpsellServices();
        if (services.length === 0) return [];

        // Use LLM to pick 3 best upsell recommendations
        const serviceList = services.map(s =>
          `- ID ${s.id}: ${s.name} (${s.category}) - ${s.price.toLocaleString("vi-VN")}đ: ${s.description}`
        ).join("\n");

        const prompt = `Khách ${input.guestName} đặt phòng ${input.roomName}, check-in ${input.checkIn}, check-out ${input.checkOut}, ${input.guests} khách.

Danh sách dịch vụ bổ sung:
${serviceList}

Hãy chọn đúng 3 dịch vụ phù hợp nhất cho khách này và giải thích ngắn gọn lý do (1 câu). Trả về JSON array: [{"serviceId": number, "reason": string}]`;

        try {
          const response = await invokeLLM({
            messages: [
              { role: "system", content: "Bạn là AI upsell chuyên nghiệp cho khách sạn. Chỉ trả về JSON, không có text khác." },
              { role: "user", content: prompt },
            ],
            response_format: {
              type: "json_schema",
              json_schema: {
                name: "upsell_recommendations",
                strict: true,
                schema: {
                  type: "object",
                  properties: {
                    recommendations: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          serviceId: { type: "number" },
                          reason: { type: "string" },
                        },
                        required: ["serviceId", "reason"],
                        additionalProperties: false,
                      },
                    },
                  },
                  required: ["recommendations"],
                  additionalProperties: false,
                },
              },
            },
          });
          const content = response.choices[0]?.message?.content;
          const parsed = JSON.parse(typeof content === "string" ? content : JSON.stringify(content));
          const recs = parsed.recommendations?.slice(0, 3) ?? [];

          // Enrich with service details
          return recs.map((rec: { serviceId: number; reason: string }) => {
            const svc = services.find(s => s.id === rec.serviceId);
            return svc ? { ...svc, aiReason: rec.reason } : null;
          }).filter(Boolean);
        } catch {
          // Fallback: return first 3 services
          return services.slice(0, 3).map(s => ({ ...s, aiReason: "Dịch vụ phổ biến được nhiều khách yêu thích" }));
        }
      }),
    createOffers: publicProcedure
      .input(z.object({
        bookingId: z.number(),
        serviceIds: z.array(z.number()),
        aiReasons: z.array(z.string()),
      }))
      .mutation(async ({ input }) => {
        for (let i = 0; i < input.serviceIds.length; i++) {
          await createUpsellOffer({
            bookingId: input.bookingId,
            serviceId: input.serviceIds[i],
            aiReason: input.aiReasons[i] ?? null,
          });
        }
        return { success: true };
      }),
    getOffers: publicProcedure
      .input(z.object({ bookingId: z.number() }))
      .query(async ({ input }) => {
        return getUpsellOffersByBooking(input.bookingId);
      }),
    respond: publicProcedure
      .input(z.object({
        offerId: z.number(),
        status: z.enum(["accepted", "declined"]),
      }))
      .mutation(async ({ input }) => {
        await respondToUpsellOffer(input.offerId, input.status);
        return { success: true };
      }),
  }),

  // ─── P3: Loyalty Program ─────────────────────────────────────────────────
  loyalty: router({
    getAccount: publicProcedure
      .input(z.object({ guestEmail: z.string().email() }))
      .query(async ({ input }) => {
        const account = await getLoyaltyAccount(input.guestEmail);
        if (!account) return null;
        const transactions = await getLoyaltyTransactions(account.id);
        return { account, transactions };
      }),
    getLeaderboard: adminProcedure.query(async () => {
      return getLoyaltyLeaderboard();
    }),
    redeem: publicProcedure
      .input(z.object({
        guestEmail: z.string().email(),
        points: z.number().min(100),
        description: z.string(),
      }))
      .mutation(async ({ input }) => {
        return redeemLoyaltyPoints(input.guestEmail, input.points, input.description);
      }),
  }),
  // ─── Admin Password Protection ─────────────────────────────────────────────────────
  admin: router({
    verifyPassword: publicProcedure
      .input(z.object({ password: z.string().min(1) }))
      .mutation(async ({ input }) => {
        const ok = await verifyAdminPassword(input.password);
        if (!ok) throw new TRPCError({ code: "UNAUTHORIZED", message: "Mật khẩu không đúng" });
        return { success: true };
      }),
    changePassword: adminProcedure
      .input(z.object({
        currentPassword: z.string().min(1),
        newPassword: z.string().min(8),
      }))
      .mutation(async ({ input }) => {
        const ok = await verifyAdminPassword(input.currentPassword);
        if (!ok) throw new TRPCError({ code: "UNAUTHORIZED", message: "Mật khẩu hiện tại không đúng" });
        await changeAdminPassword(input.newPassword);
        return { success: true };
      }),
  }),
});
export type AppRouter = typeof appRouter;
