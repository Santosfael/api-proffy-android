FROM node:22.18.0 AS base

FROM base AS dependencies

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

FROM base AS build

WORKDIR /usr/src/app

COPY . .
COPY --from=dependencies /usr/src/app/node_modules ./node_modules

FROM node:22.18.0-alpine3.22 AS deploy

WORKDIR /usr/src/app

RUN apk add --no-cache openssl libc6-compat

COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/package.json ./package.json
COPY --from=build /usr/src/app/package-lock.json ./package-lock.json
COPY --from=build /usr/src/app/src ./src
COPY --from=build /usr/src/app/drizzle ./drizzle
COPY --from=build /usr/src/app/drizzle.config.ts ./drizzle.config.ts

EXPOSE 3333