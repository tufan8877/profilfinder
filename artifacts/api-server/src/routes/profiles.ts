import { Router } from "express";
import { db, profilesTable } from "@workspace/db";
import { eq, sql, and, ilike, or } from "drizzle-orm";
import { requireAuth } from "../middlewares/auth";

const router = Router();

function generateProfileNumber(id: number): string {
  return `PF-${String(id).padStart(6, "0")}`;
}

function toPublic(p: typeof profilesTable.$inferSelect) {
  return {
    id: p.id,
    profileNumber: p.profileNumber,
    publicName: p.publicName,
    jobTitle: p.jobTitle,
    profession: p.profession,
    industry: p.industry,
    experience: p.experience,
    education: p.education,
    skills: p.skills,
    languages: p.languages,
    desiredJob: p.desiredJob,
    federalState: p.federalState,
    city: p.city,
    availability: p.availability,
    employmentType: p.employmentType,
    driverLicense: p.driverLicense,
    description: p.description,
    cvText: p.cvText,
    profileImage: p.profileImage,
    isAvailable: p.isAvailable,
    isPublic: p.isPublic,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  };
}

router.get("/profiles", async (req, res) => {
  const { search, industry, federalState, availability, profession, page = "1", limit = "12" } = req.query as Record<string, string>;
  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
  const offset = (pageNum - 1) * limitNum;

  const conditions = [eq(profilesTable.isPublic, true), eq(profilesTable.isAvailable, true)];
  if (industry) conditions.push(eq(profilesTable.industry, industry));
  if (federalState) conditions.push(eq(profilesTable.federalState, federalState));
  if (availability) conditions.push(eq(profilesTable.availability, availability));
  if (search) conditions.push(
    or(
      ilike(profilesTable.jobTitle, `%${search}%`),
      ilike(profilesTable.profession, `%${search}%`),
      ilike(profilesTable.description, `%${search}%`),
    )!
  );

  const where = and(...conditions);
  const [{ count }] = await db.select({ count: sql<number>`count(*)::int` }).from(profilesTable).where(where);
  const profiles = await db.select().from(profilesTable).where(where).limit(limitNum).offset(offset).orderBy(sql`${profilesTable.createdAt} DESC`);

  res.json({ profiles: profiles.map(toPublic), total: count, page: pageNum, limit: limitNum });
});

router.post("/profiles", requireAuth, async (req, res) => {
  const userId = req.session.userId!;
  const existing = await db.select({ id: profilesTable.id }).from(profilesTable).where(eq(profilesTable.userId, userId)).limit(1);
  if (existing.length > 0) {
    res.status(400).json({ error: "Sie haben bereits ein Profil" });
    return;
  }
  const { jobTitle, industry, federalState, availability, description } = req.body;
  if (!jobTitle || !industry || !federalState || !availability || !description) {
    res.status(400).json({ error: "Pflichtfelder fehlen: Beruf, Branche, Bundesland, Verfügbarkeit, Beschreibung" });
    return;
  }
  // Insert with temporary profile number, then update
  const [profile] = await db.insert(profilesTable).values({
    profileNumber: "TEMP",
    userId,
    ...req.body,
  }).returning();
  const profileNumber = generateProfileNumber(profile.id);
  const [updated] = await db.update(profilesTable).set({ profileNumber }).where(eq(profilesTable.id, profile.id)).returning();
  res.status(201).json(toPublic(updated));
});

router.get("/profiles/:profileNumber", async (req, res) => {
  const { profileNumber } = req.params;
  const [profile] = await db.select().from(profilesTable)
    .where(and(eq(profilesTable.profileNumber, profileNumber), eq(profilesTable.isPublic, true)))
    .limit(1);
  if (!profile) {
    res.status(404).json({ error: "Profil nicht gefunden" });
    return;
  }
  res.json(toPublic(profile));
});

router.patch("/profiles/:id/update", requireAuth, async (req, res) => {
  const id = parseInt(String(req.params.id));
  const userId = req.session.userId!;
  const [profile] = await db.select().from(profilesTable).where(and(eq(profilesTable.id, id), eq(profilesTable.userId, userId))).limit(1);
  if (!profile) {
    res.status(404).json({ error: "Profil nicht gefunden oder kein Zugriff" });
    return;
  }
  const { profileNumber, userId: _uid, createdAt, ...updateData } = req.body;
  const [updated] = await db.update(profilesTable)
    .set({ ...updateData, updatedAt: new Date() })
    .where(eq(profilesTable.id, id))
    .returning();
  res.json(toPublic(updated));
});

router.delete("/profiles/:id/delete", requireAuth, async (req, res) => {
  const id = parseInt(String(req.params.id));
  const userId = req.session.userId!;
  const [profile] = await db.select().from(profilesTable).where(and(eq(profilesTable.id, id), eq(profilesTable.userId, userId))).limit(1);
  if (!profile) {
    res.status(404).json({ error: "Profil nicht gefunden oder kein Zugriff" });
    return;
  }
  await db.delete(profilesTable).where(eq(profilesTable.id, id));
  res.json({ message: "Profil gelöscht" });
});

router.get("/my-profile", requireAuth, async (req, res) => {
  const userId = req.session.userId!;
  const [profile] = await db.select().from(profilesTable).where(eq(profilesTable.userId, userId)).limit(1);
  if (!profile) {
    res.status(404).json({ error: "Kein Profil gefunden" });
    return;
  }
  res.json(toPublic(profile));
});

router.get("/featured-profiles", async (req, res) => {
  const profiles = await db.select().from(profilesTable)
    .where(and(eq(profilesTable.isPublic, true), eq(profilesTable.isAvailable, true)))
    .limit(6)
    .orderBy(sql`${profilesTable.createdAt} DESC`);
  res.json(profiles.map(toPublic));
});

router.get("/industry-stats", async (req, res) => {
  const stats = await db
    .select({ industry: profilesTable.industry, count: sql<number>`count(*)::int` })
    .from(profilesTable)
    .where(and(eq(profilesTable.isPublic, true), eq(profilesTable.isAvailable, true)))
    .groupBy(profilesTable.industry)
    .orderBy(sql`count(*) DESC`);
  res.json(stats);
});

export default router;
