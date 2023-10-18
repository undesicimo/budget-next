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

      const remainingBudgetAmount = relatedBudget.amount - input.amount;
      await ctx.db.budget.update({
        where: {
          id: relatedBudget.id,
        },
        data: {
          amount: remainingBudgetAmount,
        },
      });

      return newExpense;
    }),

  getAllExpenseByBudgetID: publicProcedure
    .input(z.object({ budgetID: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      if (!input.budgetID) throw new TRPCClientError("please provide budgetID");
      const expenses = await ctx.db.expense.findMany({
        where: {
          budgetID: input.budgetID,
        },
      });
      return expenses;
    }),
});
