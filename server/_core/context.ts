import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  // Since we removed Manus OAuth, we default to null.
  // Admin authentication is handled separately via verifyAdminPassword in routers.ts
  const user: User | null = null;

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
