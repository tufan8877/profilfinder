import { Router } from "express";
import bcrypt from "bcryptjs";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAuth } from "../middlewares/auth";

const router = Router();

router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: "E-Mail und Passwort erforderlich" });
    return;
  }
  if (password.length < 8) {
    res.status(400).json({ error: "Passwort muss mindestens 8 Zeichen haben" });
    return;
  }
  const existing = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
  if (existing.length > 0) {
    res.status(400).json({ error: "E-Mail bereits registriert" });
    return;
  }
  const hashed = await bcrypt.hash(password, 12);
  const [user] = await db.insert(usersTable).values({ email, password: hashed }).returning();
  req.session.userId = user.id;
  req.session.isAdmin = user.isAdmin;
  res.status(201).json({ id: user.id, email: user.email, isAdmin: user.isAdmin, status: user.status, createdAt: user.createdAt });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: "E-Mail und Passwort erforderlich" });
    return;
  }

  // Admin login via env
  if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
    let adminUser = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
    if (adminUser.length === 0) {
      const hashed = await bcrypt.hash(password, 12);
      const [created] = await db.insert(usersTable).values({ email, password: hashed, isAdmin: true }).returning();
      adminUser = [created];
    } else if (!adminUser[0].isAdmin) {
      await db.update(usersTable).set({ isAdmin: true }).where(eq(usersTable.id, adminUser[0].id));
      adminUser[0].isAdmin = true;
    }
    req.session.userId = adminUser[0].id;
    req.session.isAdmin = true;
    res.json({ id: adminUser[0].id, email: adminUser[0].email, isAdmin: true, status: adminUser[0].status, createdAt: adminUser[0].createdAt });
    return;
  }

  const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
  if (!user) {
    res.status(401).json({ error: "Ungültige Anmeldedaten" });
    return;
  }
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    res.status(401).json({ error: "Ungültige Anmeldedaten" });
    return;
  }
  if (user.status !== "active") {
    res.status(401).json({ error: "Konto ist deaktiviert" });
    return;
  }
  req.session.userId = user.id;
  req.session.isAdmin = user.isAdmin;
  res.json({ id: user.id, email: user.email, isAdmin: user.isAdmin, status: user.status, createdAt: user.createdAt });
});

router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ message: "Abgemeldet" });
  });
});

router.get("/user", requireAuth, async (req, res) => {
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.session.userId!)).limit(1);
  if (!user) {
    res.status(401).json({ error: "Nicht gefunden" });
    return;
  }
  res.json({ id: user.id, email: user.email, isAdmin: user.isAdmin, status: user.status, createdAt: user.createdAt });
});

router.post("/change-email", requireAuth, async (req, res) => {
  const { newEmail, password } = req.body;
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.session.userId!)).limit(1);
  if (!user) { res.status(401).json({ error: "Nicht gefunden" }); return; }
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) { res.status(400).json({ error: "Falsches Passwort" }); return; }
  await db.update(usersTable).set({ email: newEmail }).where(eq(usersTable.id, user.id));
  res.json({ message: "E-Mail geändert" });
});

router.post("/change-password", requireAuth, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!newPassword || newPassword.length < 8) {
    res.status(400).json({ error: "Passwort muss mindestens 8 Zeichen haben" });
    return;
  }
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.session.userId!)).limit(1);
  if (!user) { res.status(401).json({ error: "Nicht gefunden" }); return; }
  const valid = await bcrypt.compare(currentPassword, user.password);
  if (!valid) { res.status(400).json({ error: "Falsches Passwort" }); return; }
  const hashed = await bcrypt.hash(newPassword, 12);
  await db.update(usersTable).set({ password: hashed }).where(eq(usersTable.id, user.id));
  res.json({ message: "Passwort geändert" });
});

router.delete("/account", requireAuth, async (req, res) => {
  await db.delete(usersTable).where(eq(usersTable.id, req.session.userId!));
  req.session.destroy(() => {
    res.json({ message: "Konto gelöscht" });
  });
});

export default router;
