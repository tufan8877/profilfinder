import { Router } from "express";
import bcrypt from "bcryptjs";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

router.post("/register", async (req, res) => {
  try {
    const email = String(req.body?.email || "").trim().toLowerCase();
    const password = String(req.body?.password || "");

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

    res.status(201).json({
      message: "Konto wurde erstellt. Bitte anmelden.",
      id: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
      status: user.status,
      createdAt: user.createdAt,
    });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Registrierung fehlgeschlagen" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const email = String(req.body?.email || "").trim().toLowerCase();
    const password = String(req.body?.password || "");

    if (!email || !password) {
      res.status(400).json({ error: "E-Mail und Passwort erforderlich" });
      return;
    }

    const adminEmail = String(process.env.ADMIN_EMAIL || "").trim().toLowerCase();
    if (email === adminEmail && password === process.env.ADMIN_PASSWORD) {
      res.json({ id: 0, email, isAdmin: true, status: "active" });
      return;
    }

    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
    if (!user) {
      res.status(401).json({ error: "E-Mail wurde nicht gefunden. Bitte zuerst registrieren." });
      return;
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      res.status(401).json({ error: "Passwort ist falsch." });
      return;
    }

    if (user.status !== "active") {
      res.status(401).json({ error: "Konto ist deaktiviert" });
      return;
    }

    res.json({ id: user.id, email: user.email, isAdmin: user.isAdmin, status: user.status, createdAt: user.createdAt });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Anmeldung fehlgeschlagen" });
  }
});

router.post("/logout", (_req, res) => {
  res.json({ message: "Abgemeldet" });
});

router.get("/user", (_req, res) => {
  res.status(401).json({ error: "Nicht angemeldet" });
});

export default router;
