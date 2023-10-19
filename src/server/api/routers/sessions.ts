import { z } from "zod";
import { init } from "@paralleldrive/cuid2";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { TRPCClientError } from "@trpc/client";

const createCUID = init({
  length: 5,
});

export const sessions = createTRPCRouter({
  newSession: publicProcedure.mutation(async ({ ctx }) => {
    const newSession = await ctx.db.session.create({
      data: {
        id: createCUID(),
      },
    });

    await ctx.db.budget.create({
      data: {
        id: createCUID(),
        amount: 0,
        sessionId: newSession.id,
      },
    });
    return newSession.id;
  }),
  deleteSession: publicProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      await ctx.db.session.delete({
        where: {
          id: input,
        },
      });
    }),
  findSession: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const session = await ctx.db.session.findUnique({
        where: {
          id: input,
        },
      });

      if (!session) {
        throw new TRPCClientError("Session not found");
      }

      return session;
    }),
});
