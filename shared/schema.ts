import { pgTable, text, serial, timestamp, boolean, integer, jsonb, uuid, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const userRoleEnum = pgEnum('user_role', ['student', 'teacher', 'parent', 'counselor', 'admin']);
export const reportTypeEnum = pgEnum('report_type', ['bullying', 'safety', 'mental-health', 'substance', 'other']);
export const priorityEnum = pgEnum('priority', ['low', 'medium', 'high', 'urgent']);
export const caseStatusEnum = pgEnum('case_status', ['open', 'in-progress', 'monitoring', 'closed']);
export const moodEnum = pgEnum('mood', ['very-sad', 'sad', 'okay', 'good', 'great']);

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  role: userRoleEnum("role").notNull(),
  grade: text("grade"),
  parentId: uuid("parent_id"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const moodCheckins = pgTable("mood_checkins", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id),
  mood: moodEnum("mood").notNull(),
  energyLevel: integer("energy_level").notNull(),
  journalEntry: text("journal_entry"),
  aiAnalysis: jsonb("ai_analysis"),
  isPrivate: boolean("is_private").default(false),
  createdAt: timestamp("created_at").defaultNow()
});

export const anonymousReports = pgTable("anonymous_reports", {
  id: uuid("id").primaryKey().defaultRandom(),
  reportType: reportTypeEnum("report_type").notNull(),
  description: text("description").notNull(),
  isEmergency: boolean("is_emergency").default(false),
  attachments: jsonb("attachments"),
  location: text("location"),
  status: text("status").default('pending'),
  assignedCounselorId: uuid("assigned_counselor_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const panicAlerts = pgTable("panic_alerts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id),
  location: jsonb("location"),
  resolved: boolean("resolved").default(false),
  resolvedBy: uuid("resolved_by").references(() => users.id),
  resolvedAt: timestamp("resolved_at"),
  createdAt: timestamp("created_at").defaultNow()
});

export const wellnessCases = pgTable("wellness_cases", {
  id: uuid("id").primaryKey().defaultRandom(),
  studentId: uuid("student_id").notNull().references(() => users.id),
  counselorId: uuid("counselor_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  description: text("description"),
  priority: priorityEnum("priority").default('medium'),
  status: caseStatusEnum("status").default('open'),
  lastContact: timestamp("last_contact"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const counselorNotes = pgTable("counselor_notes", {
  id: uuid("id").primaryKey().defaultRandom(),
  caseId: uuid("case_id").notNull().references(() => wellnessCases.id),
  counselorId: uuid("counselor_id").notNull().references(() => users.id),
  note: text("note").notNull(),
  isPrivate: boolean("is_private").default(true),
  createdAt: timestamp("created_at").defaultNow()
});

export const chatMessages = pgTable("chat_messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id),
  message: text("message").notNull(),
  isAiResponse: boolean("is_ai_response").default(false),
  aiContext: jsonb("ai_context"),
  createdAt: timestamp("created_at").defaultNow()
});

export const parentNotifications = pgTable("parent_notifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  parentId: uuid("parent_id").notNull().references(() => users.id),
  studentId: uuid("student_id").notNull().references(() => users.id),
  type: text("type").notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  read: boolean("read").default(false),
  createdAt: timestamp("created_at").defaultNow()
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertMoodCheckinSchema = createInsertSchema(moodCheckins).omit({
  id: true,
  createdAt: true,
  aiAnalysis: true
});

export const insertAnonymousReportSchema = createInsertSchema(anonymousReports).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  status: true,
  assignedCounselorId: true
});

export const insertPanicAlertSchema = createInsertSchema(panicAlerts).omit({
  id: true,
  createdAt: true,
  resolved: true,
  resolvedBy: true,
  resolvedAt: true
});

export const insertWellnessCaseSchema = createInsertSchema(wellnessCases).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertCounselorNoteSchema = createInsertSchema(counselorNotes).omit({
  id: true,
  createdAt: true
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  createdAt: true,
  isAiResponse: true,
  aiContext: true
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type MoodCheckin = typeof moodCheckins.$inferSelect;
export type InsertMoodCheckin = z.infer<typeof insertMoodCheckinSchema>;
export type AnonymousReport = typeof anonymousReports.$inferSelect;
export type InsertAnonymousReport = z.infer<typeof insertAnonymousReportSchema>;
export type PanicAlert = typeof panicAlerts.$inferSelect;
export type InsertPanicAlert = z.infer<typeof insertPanicAlertSchema>;
export type WellnessCase = typeof wellnessCases.$inferSelect;
export type InsertWellnessCase = z.infer<typeof insertWellnessCaseSchema>;
export type CounselorNote = typeof counselorNotes.$inferSelect;
export type InsertCounselorNote = z.infer<typeof insertCounselorNoteSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
