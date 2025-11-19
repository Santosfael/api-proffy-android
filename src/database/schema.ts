import { integer } from "drizzle-orm/pg-core";
import { text, pgTable, uuid, pgEnum, timestamp, decimal } from "drizzle-orm/pg-core";

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

export const classes = pgTable("classes", {
    id: uuid().primaryKey().defaultRandom(),
    subject: text().notNull(),
    cost: decimal().notNull(),
    userId: uuid("user_id").notNull().references(() => users.id, {onDelete: "cascade", onUpdate: "cascade"}),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at"),
})

export const classSchedule = pgTable("class_schedule", {
    id: uuid().primaryKey().defaultRandom(),
    weekDay: integer("week_day").notNull(),
    from: integer().notNull(),
    to: integer().notNull(),
    classId: uuid("class_id").notNull().references(() => classes.id, {onDelete: "cascade", onUpdate: "cascade"}),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at"),
})

export const connections = pgTable("connections", {
    id: uuid().primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => users.id, {onDelete: "cascade", onUpdate: "cascade"}),
    createdAt: timestamp("created_at").defaultNow().notNull(),
})