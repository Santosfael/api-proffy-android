import { text, pgTable, uuid, pgEnum, timestamp } from "drizzle-orm/pg-core";

export const userRole = pgEnum("user_role", [
    "student",
    "teacher"
])

export const users = pgTable("users", {
    id: uuid().primaryKey().defaultRandom(),
    name: text().notNull(),
    email: text().notNull().unique(),
    password: text().notNull(),
    avatar: text(),
    whatsapp: text().notNull(),
    bio: text().notNull(),
    role: userRole().default('student'),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updateAt: timestamp("updated_at")
})