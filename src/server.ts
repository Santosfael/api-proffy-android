import fastifySwagger from "@fastify/swagger"
import fastify from "fastify"
import { jsonSchemaTransform, serializerCompiler, validatorCompiler } from "fastify-type-provider-zod"
import scalarAPIReference from "@scalar/fastify-api-reference"
import type { ZodTypeProvider } from "fastify-type-provider-zod"

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

server.register(scalarAPIReference, {
    routePrefix: "/docs"
})

server.setValidatorCompiler(validatorCompiler)
server.setSerializerCompiler(serializerCompiler)

const classes = [
    { id: 1, name: "Português" },
    { id: 2, name: "Inglês" },
    { id: 3, name: "Matemática" },
    { id: 4, name: "Geografia" }
]

server.get("/classes", (request, replay) => {
    return replay.send({ classes })
})

server.listen({ port: 3333 }).then(() => {
    console.log("HTTP server is running")
})