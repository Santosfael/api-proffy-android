import type { FastifyReply, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";
import { env } from "../../utils/env.ts";

type JWTPayload = {
    sub: string,
    role: "student" | "teacher"
}

export async function checkRequestJWT(request: FastifyRequest, reply: FastifyReply) {
    const token = request.cookies.token ?? request.headers.authorization

    if(!token) {
        return reply.status(401).send()
    }

    try {
        const payload = jwt.verify(token, env.JWT_TOKEN) as JWTPayload
        request.user = payload
    } catch {
        return reply.status(401).send()
    }

}