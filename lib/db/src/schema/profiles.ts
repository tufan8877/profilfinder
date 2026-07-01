import { pgTable, serial, text, boolean, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const profilesTable = pgTable("profiles", {
  id: serial("id").primaryKey(),
  profileNumber: text("profile_number").notNull().unique(),
  userId: integer("user_id").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  publicName: text("public_name"),
  jobTitle: text("job_title").notNull(),
  industry: text("industry").notNull(),
  profession: text("profession"),
  experience: text("experience"),
  education: text("education"),
  skills: text("skills"),
  languages: text("languages"),
  desiredJob: text("desired_job"),
  federalState: text("federal_state").notNull(),
  city: text("city"),
  availability: text("availability").notNull(),
  employmentType: text("employment_type"),
  driverLicense: boolean("driver_license").notNull().default(false),
  description: text("description"),
  cvText: text("cv_text"),
  profileImage: text("profile_image"),
  isAvailable: boolean("is_available").notNull().default(true),
  isPublic: boolean("is_public").notNull().default(true),
  // Private fields — only returned to admin
  phoneNumber: text("phone_number"),
  contactEmail: text("contact_email"),
  address: text("address"),
  adminNotes: text("admin_notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertProfileSchema = createInsertSchema(profilesTable).omit({
  id: true,
  profileNumber: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type Profile = typeof profilesTable.$inferSelect;
