import { z } from "zod";
import { createId as createCUID } from "@paralleldrive/cuid2";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

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
});
