import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const timerSessionsRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        timerId: z.string(),
        startTime: z.number(),
        endTime: z.number(),
        timePassed: z.number(),
      })
    )
    .mutation((req) => {
      return req.ctx.prisma.timerSessions.create({
        data: {
          timerId: req.input.timerId,
          startTime: req.input.startTime,
          endTime: req.input.endTime,
          timePassed: req.input.timePassed,
          userEmail: req.ctx.session.user.email,
        },
      });
    }),

  get: protectedProcedure
    .input(
      z.object({
        timerSessionId: z.string(),
      })
    )
    .query((req) => {
      return req.ctx.prisma.timerSessions.findUnique({
        where: { id: req.input.timerSessionId },
        include: { timer: { select: { title: true } } },
      });
    }),

  getAllIds: protectedProcedure
    .input(
      z.object({
        page: z.number(),
        limit: z.number(),
      })
    )

    .query((req) => {
      return req.ctx.prisma.timerSessions.findMany({
        where: { userEmail: req.ctx.session.user.email },
        select: { id: true },
        orderBy: { endTime: "desc" },
        skip: (req.input.page - 1) * req.input.limit,
        take: req.input.limit,
      });
    }),

  getAllIdsCount: protectedProcedure.query((req) => {
    return req.ctx.prisma.timerSessions.count({
      where: { userEmail: req.ctx.session.user.email },
    });
  }),

  update: protectedProcedure
    .input(
      z.object({
        timerSessionId: z.string(),
        startTime: z.number(),
        endTime: z.number(),
        timePassed: z.number(),
      })
    )
    .mutation((req) => {
      return req.ctx.prisma.timerSessions.update({
        where: {
          id: req.input.timerSessionId,
        },
        data: {
          startTime: req.input.startTime,
          endTime: req.input.endTime,
          timePassed: req.input.timePassed,
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ timerSessionId: z.string() }))
    .mutation((req) => {
      return req.ctx.prisma.timerSessions.delete({
        where: {
          id: req.input.timerSessionId,
        },
      });
    }),
});
