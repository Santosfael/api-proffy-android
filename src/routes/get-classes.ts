import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { checkRequestJWT } from "./hooks/check-request-jwt.ts";
import { z } from "zod";
import { and, eq, gt, ilike, lte, SQL } from "drizzle-orm";
import { classes, classSchedule, users } from "../database/schema.ts";
import { convertHoursToMinutes } from "../utils/convert-hours-to-minute.ts";
import { db } from "../database/client.ts";

export const getClassesRouter: FastifyPluginAsyncZod = async (server) => {
    server.get("/classes", {
        preHandler: [
            checkRequestJWT
        ],
        schema: {
            tags: ["Classes"],
            summary: "Get Classes",
            querystring: z.object({
                week_day: z.coerce.number(),
                subject: z.string(),
                time: z.string()
            }),
            response: {
                200: z.object({
                    classes: z.array(
                        z.object({
                            id: z.uuid(),
                            subject: z.string(),
                            cost: z.string(),
                            user: z.object({
                                id: z.uuid(),
                                name: z.string(),
                                email: z.string(),
                                avatar: z.string().nullable().optional(),
                                whatsapp: z.string(),
                                bio: z.string()
                            }),
                            schedules: z.object({
                                id: z.uuid(),
                                week_day: z.number(),
                                from: z.number(),
                                to: z.number()
                            })
                        })
                    )
                }),
                400: z.object({ message: z.string() })
            }
        }
    }, async (request, reply) => {
        const query = request.query
        const { subject, week_day, time } = query

        if (!subject || (!week_day && week_day != 0) || !time) {
            return reply.status(400).send({ message: "Missing filters to search classes" })
        }
        const conditions: SQL[] = []
        conditions.push(ilike(classes.subject, `%${subject}%`))

        const timeInMinutes = convertHoursToMinutes(time)

        const result = await db.select({
            id: classes.id,
            subject: classes.subject,
            cost: classes.cost,
            user: {
                id: users.id,
                name: users.name,
                email: users.email,
                avatar: users.avatar ?? null,
                whatsapp: users.whatsapp,
                bio: users.bio
            },
            schedules: {
                id: classSchedule.id,
                week_day: classSchedule.weekDay,
                from: classSchedule.from,
                to: classSchedule.to
            }
        })
        .from(classes)
        .innerJoin(users, eq(users.id, classes.userId))
        .innerJoin(classSchedule, eq(classSchedule.classId, classes.id))
        .where(and(
            ...conditions,
            lte(classSchedule.from, timeInMinutes),
            gt(classSchedule.to, timeInMinutes),
            eq(classSchedule.weekDay, week_day)
        ))

        return reply.send({ classes: result })
    })
}