import { Router } from "express";
import { db, companyRequestsTable, profilesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { logger } from "../lib/logger";

const router = Router();

router.post("/company-requests", async (req, res) => {
  const { profileNumber, companyName, contactPerson, email, phoneNumber, message } = req.body;
  if (!profileNumber || !companyName || !contactPerson || !email || !message) {
    res.status(400).json({ error: "Pflichtfelder fehlen" });
    return;
  }
  const [profile] = await db.select({ id: profilesTable.id }).from(profilesTable)
    .where(eq(profilesTable.profileNumber, profileNumber)).limit(1);

  const [request] = await db.insert(companyRequestsTable).values({
    profileId: profile?.id ?? null,
    profileNumber,
    companyName,
    contactPerson,
    email,
    phoneNumber: phoneNumber ?? null,
    message,
  }).returning();

  logger.info({ requestId: request.id, profileNumber }, "Company request submitted");
  res.status(201).json({ message: "Anfrage erfolgreich gesendet" });
});

export default router;
