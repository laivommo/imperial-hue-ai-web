import { describe, it, expect, beforeAll } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock context
function createMockContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("Rooms API", () => {
  it("should list all rooms", async () => {
    const caller = appRouter.createCaller(createMockContext());
    const rooms = await caller.rooms.list();
    expect(Array.isArray(rooms)).toBe(true);
  });

  it("should get room by id", async () => {
    const caller = appRouter.createCaller(createMockContext());
    // First get all rooms to find a valid id
    const rooms = await caller.rooms.list();
    if (rooms.length === 0) return; // Skip if no rooms in DB
    const firstRoomId = rooms[0].id;
    const room = await caller.rooms.getById({ id: firstRoomId });
    expect(room).toBeDefined();
    if (room) {
      expect(room.id).toBe(firstRoomId);
      expect(room.name).toBeDefined();
      expect(room.price).toBeGreaterThan(0);
    }
  });
});

describe("AI Chat API", () => {
  it("should handle natural language query", async () => {
    const caller = appRouter.createCaller(createMockContext());
    const response = await caller.ai.chat({
      message: "Tôi cần một phòng cho 2 người với giá dưới 2 triệu",
      guests: 2,
    });

    expect(response).toBeDefined();
    expect(response.message).toBeDefined();
    expect(typeof response.message).toBe("string");
    expect(Array.isArray(response.rooms)).toBe(true);
  }, 30000); // LLM calls need more time

  it("should recommend rooms based on capacity", async () => {
    const caller = appRouter.createCaller(createMockContext());
    const response = await caller.ai.chat({
      message: "Phòng nào phù hợp cho gia đình 4 người?",
      guests: 4,
    });

    expect(response).toBeDefined();
    expect(response.message).toBeDefined();
    expect(response.rooms.length).toBeGreaterThan(0);
  }, 30000); // LLM calls need more time
});
