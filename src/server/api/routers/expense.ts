import { TRPCClientError } from "@trpc/client";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";

export const expense = createTRPCRouter({
  newExpense: publicProcedure
    .input(
      z.object({
        amount: z.number().nonnegative(),
        sessionID: z.string(),
        name: z.string(),
        emoji: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const relatedBudget = await ctx.db.budget.findUnique({
        where: {
          sessionId: input.sessionID,
        },
      });

      if (!relatedBudget) throw new TRPCClientError("Budget not found");

      const newExpense = await ctx.db.expense.create({
        data: {
          amount: input.amount,
          name: input.name,
          emoji: input.emoji,
          budgetID: relatedBudget.id,
        },
      });
      return newExpense;
    }),
});
