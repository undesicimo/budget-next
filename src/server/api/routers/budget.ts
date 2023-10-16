import { z } from "zod";
import { createId as createCUID } from "@paralleldrive/cuid2";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { TRPCClientError } from "@trpc/client";

export const budget = createTRPCRouter({
  newBuget: publicProcedure
    .input(
      z.object({
        amount: z.number().nonnegative(),
        sessionId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const newBudget = await ctx.db.budget.create({
        data: {
          id: createCUID(),
          amount: input.amount,
          sessionId: input.sessionId,
        },
      });
      return newBudget.id;
    }),

  getBudgetBySession: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const budget = await ctx.db.budget.findUnique({
        where: { sessionId: input },
      });
      if (!budget) {
        throw new TRPCClientError("Session not found");
      }

      return budget;
    }),
});
