import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  level: integer("level").notNull().default(1),
  experience: integer("experience").notNull().default(0),
  points: integer("points").notNull().default(0),
  streak: integer("streak").notNull().default(0),
});

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  description: text("description"),
  duration: text("duration"),
  points: integer("points").notNull().default(0),
  isCompleted: boolean("is_completed").notNull().default(false),
  isDefault: boolean("is_default").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const skills = pgTable("skills", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  level: integer("level").notNull().default(1),
  experience: integer("experience").notNull().default(0),
  maxExperience: integer("max_experience").notNull().default(100),
});

export const rules = pgTable("rules", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  description: text("description").notNull(),
  type: text("type").notNull().default("avoid"),
  isDefault: boolean("is_default").notNull().default(false),
});

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  category: text("category").notNull().default("work"),
  description: text("description"),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertTaskSchema = createInsertSchema(tasks).pick({
  title: true,
  description: true,
  duration: true,
  points: true,
  isDefault: true,
});

export const insertSkillSchema = createInsertSchema(skills).pick({
  name: true,
  level: true,
  experience: true,
  maxExperience: true,
});

export const insertRuleSchema = createInsertSchema(rules).pick({
  description: true,
  type: true,
  isDefault: true,
});

export const insertEventSchema = createInsertSchema(events).pick({
  title: true,
  startTime: true,
  endTime: true,
  category: true,
  description: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Task = typeof tasks.$inferSelect;
export type Skill = typeof skills.$inferSelect;
export type Rule = typeof rules.$inferSelect;
export type Event = typeof events.$inferSelect;
