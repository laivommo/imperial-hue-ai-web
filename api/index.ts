import "dotenv/config";
import express from "express";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createExpressMiddleware } from "@trpc/server/adapters/express";

type ExpressHandler = (req: VercelRequest, res: VercelResponse) => void | Promise<void>;

let cachedHandler: ExpressHandler | null = null;

async function createHandler(): Promise<ExpressHandler> {
  if (cachedHandler) {
    return cachedHandler;
  }

  const [{ appRouter }, { createContext }] = await Promise.all([
    import("../server/routers.js"),
    import("../server/_core/context.js"),
  ]);

  const app = express();

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  app.get("/api/health", (_req, res) => {
    res.status(200).json({ ok: true });
  });

  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );

  app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error("[Vercel API] Unhandled express error:", error);
    res.status(500).json({
      error: {
        message: "Internal server error",
      },
    });
  });

  cachedHandler = (req, res) => {
    app(req, res);
  };

  return cachedHandler;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const app = await createHandler();
    await app(req, res);
  } catch (error) {
    console.error("[Vercel API] Failed to initialize handler:", error);
    res.status(500).json({
      error: {
        message: error instanceof Error ? error.message : "Internal server error",
      },
    });
  }
}
