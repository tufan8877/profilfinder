---
name: Session auth pattern
description: express-session + connect-pg-simple setup for this monorepo; admin auto-promotion via env vars
---

Session auth uses express-session with a PostgreSQL store (connect-pg-simple using the same `pool` from @workspace/db).

**Session table:** `session` table in the DB (created by connect-pg-simple on first use, not via Drizzle schema).

**Admin login:** If ADMIN_EMAIL + ADMIN_PASSWORD match, the API auto-creates or promotes that user to isAdmin=true. No separate admin seeding needed.

**CORS:** Must use `credentials: true` in both the Express cors() config and the frontend fetch (custom-fetch.ts) for session cookies to work cross-origin in development.

**How to apply:** When adding new protected routes, import `requireAuth` or `requireAdmin` from `src/middlewares/auth.ts`. Session data: `req.session.userId` (number) and `req.session.isAdmin` (boolean).
