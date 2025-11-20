import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { checkRequestJWT } from "./hooks/check-request-jwt.ts";
import { z } from "zod";
import { getAuthenticateUserFromRequest } from "../utils/get-authenticated-user-from-request.ts";
import { db } from "../database/client.ts";
import { classes, classSchedule } from "../database/schema.ts";
import { convertHoursToMinutes } from "../utils/convert-hours-to-minute.ts";

export const createClassesRouter: FastifyPluginAsyncZod = async (server) => {
    server.post("/classes", {
        preHandler: [
            checkRequestJWT
        ],
        schema: {
            tags: ["Classes"],
            summary: "Create classe",
            body: z.object({
                subject: z.string("the subject field is required"),
                cost: z.number("the cost field is required"),
                schedules: z.array(
                    z.object({
                        week_day: z.coerce.number("the week_day field is required"),
                        from: z.string("the from field is required"),
                        to: z.string("the to field is required")
                    })
                )
            }),
            response: {
                201: z.object({ classeId: z.uuid() }),
                400: z.object({ message: z.string() })
            }
        }
    }, async (request, reply) => {
        const body = request.body
        const user = getAuthenticateUserFromRequest(request)
        const { subject, cost, schedules } = body

        if(!subject || !cost || !schedules) {
            return reply.status(400).send({ message: "the field is required"})
        }

        await db.transaction( async (tx) => {
            try {
                const resultClasse = await tx.insert(classes).values({
                    subject,
                    cost: `${cost}`,
                    userId: user.sub
                }).returning()

                const resultSchedules = schedules.map((schedule) => {
                    return {
                        weekDay: schedule.week_day,
                        from: convertHoursToMinutes(schedule.from),
                        to: convertHoursToMinutes(schedule.to),
                        classId: resultClasse[0].id
                    }
                })

                await tx.insert(classSchedule).values(resultSchedules)

                return reply.status(201).send({ classeId: resultClasse[0].id })
            } catch (error) {
                tx.rollback()
                return reply.status(400).send({ message: "Unexpected error while creating new class" })
            }
        })
    })
}