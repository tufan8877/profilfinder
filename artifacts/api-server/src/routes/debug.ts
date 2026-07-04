import { Router } from "express";
import { pool } from "@workspace/db";

const router = Router();

router.get("/debug-db", async (_req, res) => {
  try {
    const nowResult = await pool.query("SELECT NOW() AS now");
    const usersResult = await pool.query("SELECT COUNT(*)::int AS count FROM users");
    res.json({
      ok: true,
      databaseConnected: true,
      now: nowResult.rows[0]?.now,
      usersCount: usersResult.rows[0]?.count ?? 0,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      databaseConnected: false,
      error: error instanceof Error ? error.message : String(error),
    });
  }
});

export default router;
