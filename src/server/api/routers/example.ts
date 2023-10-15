import { z } from "zod";
import { createId as createCUID } from "@paralleldrive/cuid2";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const exampleRouter = createTRPCRouter({
  newSession: publicProcedure.mutation(async ({ ctx }) => {
    const newSession = await ctx.db.session.create({
      data: {
        id: createCUID(),
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
});
