import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { TRPCClientError } from "@trpc/client";

export const budget = createTRPCRouter({
  updateBudget: publicProcedure
    .input(
      z.object({
        amount: z.number().nonnegative(),
        sessionId: z.string(),
      }),
    )
    //todo 常にsessionIDあるのに発行してる
    //初回だからいいか。
    //２回目以降どうするか
    //budgetのセットでsessionIDに紐づけるのはやめて、budgeIDの発行はsessionIDの発行と同時に行う
    .mutation(async ({ ctx, input }) => {
      const newBudget = await ctx.db.budget.update({
        where: { sessionId: input.sessionId },
        data: {
          amount: input.amount,
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

  resetBudget: publicProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const resetBudget = await ctx.db.budget.update({
        where: { sessionId: input },
        data: { amount: 0, expenses: { deleteMany: {} } },
      });

      return resetBudget;
    }),
});
