import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { db } from "../database/client.ts";
import { users } from "../database/schema.ts";
import { eq } from "drizzle-orm";
import { verify } from "argon2";
import jwt from "jsonwebtoken";
import { env } from "../utils/env.ts";

export const loginRoute: FastifyPluginAsyncZod = async (server) => {
    server.post("/sessions", {
        schema: {
            tags: ["Auth"],
            summary: "Login",
            headers: z.object({
                'x-platform': z.string("the x-platform header is required")
            }),
            body: z.object ({
                email: z.email("the email field is required"),
                password: z.string("the password field is required")
            }),
            response: {
                200: z.object({ token: z.string() }),
                400: z.object({ message: z.string })
            }
        }
    }, async (request, reply) => {
        const { email, password } = request.body
        const platform = request.headers["x-platform"]

        const result = await db.select().from(users).where(eq(users.email, email))

        if (result.length === 0) {
            return reply.status(400).send({ message: "Invalid credentials" })
        }

        const user = result[0]
        const doesPasswordMatch = await verify(user.password, password)

        if(!doesPasswordMatch) {
            return reply.status(400).send({ message: "Invalid credentials" }) 
        }

        const token = jwt.sign({ sub: user.id, role: user.role }, env.JWT_TOKEN)

        if (platform === "web") {
            return reply.setCookie("token", token, {
                httpOnly: true,
                secure: false,
                sameSite: "strict",
                path: "/"
            }).status(200).send({ token })
        } else {
            return reply.status(200).send({ token })
        }
    })
}