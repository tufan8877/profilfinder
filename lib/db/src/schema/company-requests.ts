import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const companyRequestsTable = pgTable("company_requests", {
  id: serial("id").primaryKey(),
  profileId: integer("profile_id"),
  profileNumber: text("profile_number").notNull(),
  companyName: text("company_name").notNull(),
  contactPerson: text("contact_person").notNull(),
  email: text("email").notNull(),
  phoneNumber: text("phone_number"),
  message: text("message").notNull(),
  status: text("status").notNull().default("neu"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertCompanyRequestSchema = createInsertSchema(companyRequestsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  status: true,
});
export type InsertCompanyRequest = z.infer<typeof insertCompanyRequestSchema>;
export type CompanyRequest = typeof companyRequestsTable.$inferSelect;
