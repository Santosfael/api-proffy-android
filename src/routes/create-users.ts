import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { db } from "../database/client.ts";
import { users } from "../database/schema.ts";
import { hash } from "argon2";

export const createUserRouter: FastifyPluginAsyncZod = async (server) => {
    server.post("/users", {
        schema: {
            tags: ["Auth"],
            summary: "Create user",
            body: z.object({
                name: z.string("the name field is required"),
                email: z.email("the email field is required"),
                password: z.string("the password field is required"),
                avatar: z.string().optional(),
                whatsapp: z.string("the whatsapp field is required"),
                bio: z.string("the bio field is required")
            }),
            response: {
                201: z.object({ userId: z.uuid() }),
                400: z.object({ message: z.string() })
            }
        }
    }, async (request, reply) => {
        const body = request.body
        const { name, email, password, whatsapp, bio } = body

        if(!name || !email || !password || !whatsapp || !bio) {
            return reply.status(400).send({ message: 'the field is required' })
        }

        const result = await db.insert(users).values({
            name,
            email,
            password: await hash(password),
            whatsapp,
            bio
        }).returning()

        return reply.status(201).send({ userId: result[0].id })
    })
}