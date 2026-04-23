import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { getAllRooms, getRoomById, createBooking, getAllBookings } from "./db";
import { invokeLLM } from "./_core/llm";
import { notifyOwner } from "./_core/notification";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
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
        checkIn: z.date(),
        checkOut: z.date(),
        guests: z.number().min(1),
      }))
      .mutation(async ({ input }) => {
        const booking = await createBooking({
          roomId: input.roomId,
          guestName: input.guestName,
          guestEmail: input.guestEmail,
          checkIn: input.checkIn,
          checkOut: input.checkOut,
          guests: input.guests,
          status: "pending",
        });

        // Notify owner
        const room = await getRoomById(input.roomId);
        const checkInStr = input.checkIn.toLocaleDateString("vi-VN");
        const checkOutStr = input.checkOut.toLocaleDateString("vi-VN");

        await notifyOwner({
          title: `🎉 Đặt phòng mới từ ${input.guestName}`,
          content: `Khách hàng ${input.guestName} (${input.guestEmail}) vừa đặt phòng "${room?.name}" từ ${checkInStr} đến ${checkOutStr} cho ${input.guests} khách.`,
        });

        return booking;
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
      }))
      .mutation(async ({ input }) => {
        const rooms = await getAllRooms();
        
        const roomsInfo = rooms
          .map(r => {
            const amenities = r.amenities ? JSON.parse(r.amenities).join(", ") : "N/A";
            return `- ${r.name}: ${r.capacity} khách, ${r.price.toLocaleString("vi-VN")} VND/đêm, tiện ích: ${amenities}`;
          })
          .join("\n");

        const systemPrompt = `Bạn là một trợ lý AI thông minh cho khách sạn The Imperial Hue. Bạn giúp khách hàng tìm kiếm và đặt phòng phù hợp với nhu cầu của họ.

Danh sách phòng hiện có:
${roomsInfo}

Khi khách hỏi, hãy:
1. Hiểu nhu cầu của khách (số khách, ngày check-in/out, sở thích)
2. Gợi ý phòng phù hợp nhất dựa trên thông tin
3. Cung cấp thông tin chi tiết về phòng được gợi ý
4. Hỗ trợ khách hoàn tất đặt phòng

Luôn trả lời bằng tiếng Việt và thân thiện.`;

        const response = await invokeLLM({
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: input.message },
          ],
        });

        return {
          message: response.choices[0]?.message?.content || "Xin lỗi, tôi không thể trả lời câu hỏi này.",
          rooms: rooms,
        };
      }),
  }),
});

export type AppRouter = typeof appRouter;
