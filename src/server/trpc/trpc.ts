import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";

import { type Context } from "./context";

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape;
  },
});

export const router = t.router;

/**
 * Unprotected procedure
 **/
export const publicProcedure = t.procedure;

/**
 * Reusable middleware to ensure
 * users are logged in
 */

const isAuthed2 = t.middleware(({ ctx, next }) => {
  if (!ctx.user || !ctx.user.userId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      userId: ctx.user.userId,
    },
  });
});

/**
 * Protected procedure
 **/

export const protected2Procedure = t.procedure.use(isAuthed2);
