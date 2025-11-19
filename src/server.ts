import fastifySwagger from "@fastify/swagger"
import fastify from "fastify"
import { jsonSchemaTransform, serializerCompiler, validatorCompiler } from "fastify-type-provider-zod"
import scalarAPIReference from "@scalar/fastify-api-reference"
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import cors from "@fastify/cors"
import fastifyCookie from "@fastify/cookie"
import { env } from "./utils/env.ts"
import { createUserRouter } from "./routes/create-users.ts"

const server = fastify({
    logger: {
        transport: {
            target: "pino-pretty",
            options: {
                translateTime: "HH:MM:ss Z",
                ignore: "pid,hostname"
            }
        }
    }
}).withTypeProvider<ZodTypeProvider>()

server.register(fastifySwagger, {
    openapi: {
        info: {
            title: "Proffy API",
            version: "1.0.0"
        }
    },
    transform: jsonSchemaTransform
})

server.register(cors, {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Platform'],
    credentials: true
})

server.register(fastifyCookie, {
    secret: env.COOKIE_SECRET
})

server.register(scalarAPIReference, {
    routePrefix: "/docs"
})

server.setValidatorCompiler(validatorCompiler)
server.setSerializerCompiler(serializerCompiler)


server.register(createUserRouter)

server.listen({ port: 3333 }).then(() => {
    console.log("HTTP server is running")
})