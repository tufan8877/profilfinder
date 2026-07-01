import { Router } from "express";
import { db, profilesTable, usersTable, companyRequestsTable } from "@workspace/db";
import { eq, sql, and, ilike, or } from "drizzle-orm";
import { requireAdmin } from "../middlewares/auth";

const router = Router();

router.get("/admin/stats", requireAdmin, async (req, res) => {
  const [{ total }] = await db.select({ total: sql<number>`count(*)::int` }).from(profilesTable);
  const [{ active }] = await db.select({ active: sql<number>`count(*)::int` }).from(profilesTable).where(eq(profilesTable.isAvailable, true));
  const [{ requests }] = await db.select({ requests: sql<number>`count(*)::int` }).from(companyRequestsTable);
  const [{ newReqs }] = await db.select({ newReqs: sql<number>`count(*)::int` }).from(companyRequestsTable).where(eq(companyRequestsTable.status, "neu"));
  const [{ users }] = await db.select({ users: sql<number>`count(*)::int` }).from(usersTable);

  res.json({
    totalProfiles: total,
    activeProfiles: active,
    totalRequests: requests,
    newRequests: newReqs,
    totalUsers: users,
  });
});

router.get("/admin/profiles", requireAdmin, async (req, res) => {
  const { search, industry, federalState, availability, page = "1", limit = "20" } = req.query as Record<string, string>;
  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
  const offset = (pageNum - 1) * limitNum;

  const conditions: ReturnType<typeof eq>[] = [];
  if (industry) conditions.push(eq(profilesTable.industry, industry));
  if (federalState) conditions.push(eq(profilesTable.federalState, federalState));
  if (availability) conditions.push(eq(profilesTable.availability, availability));
  if (search) {
    conditions.push(
      or(
        ilike(profilesTable.profileNumber, `%${search}%`),
        ilike(profilesTable.firstName, `%${search}%`),
        ilike(profilesTable.lastName, `%${search}%`),
        ilike(profilesTable.jobTitle, `%${search}%`),
      )! as ReturnType<typeof eq>
    );
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined;
  const [{ count }] = await db.select({ count: sql<number>`count(*)::int` }).from(profilesTable).where(where);
  const profiles = await db.select().from(profilesTable).where(where)
    .limit(limitNum).offset(offset).orderBy(sql`${profilesTable.createdAt} DESC`);

  res.json({ profiles, total: count, page: pageNum, limit: limitNum });
});

router.get("/admin/profiles/:id", requireAdmin, async (req, res) => {
  const id = parseInt(String(req.params.id));
  const [profile] = await db.select().from(profilesTable).where(eq(profilesTable.id, id)).limit(1);
  if (!profile) {
    res.status(404).json({ error: "Profil nicht gefunden" });
    return;
  }
  res.json(profile);
});

router.patch("/admin/profiles/:id", requireAdmin, async (req, res) => {
  const id = parseInt(String(req.params.id));
  const { profileNumber, userId, createdAt, ...updateData } = req.body;
  const [updated] = await db.update(profilesTable)
    .set({ ...updateData, updatedAt: new Date() })
    .where(eq(profilesTable.id, id))
    .returning();
  if (!updated) {
    res.status(404).json({ error: "Profil nicht gefunden" });
    return;
  }
  res.json(updated);
});

router.delete("/admin/profiles/:id", requireAdmin, async (req, res) => {
  const [deleted] = await db.delete(profilesTable).where(eq(profilesTable.id, parseInt(String(req.params.id)))).returning();
  if (!deleted) {
    res.status(404).json({ error: "Profil nicht gefunden" });
    return;
  }
  res.json({ message: "Profil gelöscht" });
});

router.get("/admin/company-requests", requireAdmin, async (req, res) => {
  const requests = await db.select().from(companyRequestsTable).orderBy(sql`${companyRequestsTable.createdAt} DESC`);
  res.json(requests);
});

router.patch("/admin/company-requests/:id/status", requireAdmin, async (req, res) => {
  const id = parseInt(String(req.params.id));
  const { status } = req.body;
  if (!["neu", "bearbeitet", "erledigt"].includes(status)) {
    res.status(400).json({ error: "Ungültiger Status" });
    return;
  }
  const [updated] = await db.update(companyRequestsTable)
    .set({ status, updatedAt: new Date() })
    .where(eq(companyRequestsTable.id, id))
    .returning();
  if (!updated) {
    res.status(404).json({ error: "Anfrage nicht gefunden" });
    return;
  }
  res.json(updated);
});

router.get("/admin/users", requireAdmin, async (req, res) => {
  const users = await db.select({ id: usersTable.id, email: usersTable.email, isAdmin: usersTable.isAdmin, status: usersTable.status, createdAt: usersTable.createdAt })
    .from(usersTable).orderBy(sql`${usersTable.createdAt} DESC`);
  res.json(users);
});

router.patch("/admin/users/:id/status", requireAdmin, async (req, res) => {
  const id = parseInt(String(req.params.id));
  const { status } = req.body;
  if (!["active", "inactive"].includes(status)) {
    res.status(400).json({ error: "Ungültiger Status" });
    return;
  }
  const [updated] = await db.update(usersTable).set({ status }).where(eq(usersTable.id, id)).returning();
  if (!updated) {
    res.status(404).json({ error: "Benutzer nicht gefunden" });
    return;
  }
  res.json({ id: updated.id, email: updated.email, isAdmin: updated.isAdmin, status: updated.status, createdAt: updated.createdAt });
});

export default router;
