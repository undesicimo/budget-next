import { sessions } from "@/server/api/routers/sessions";
import { createTRPCRouter } from "@/server/api/trpc";
import { budget } from "./routers/budget";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  sessions,
  budget,
});

// export type definition of API
export type AppRouter = typeof appRouter;
