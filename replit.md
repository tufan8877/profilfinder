# ProfilFinder.at

ProfilFinder.at ist eine Bewerberprofil-Plattform für Unternehmen in Österreich — Bewerber können anonyme Profile erstellen, Unternehmen können Profile durchsuchen und per Profilnummer Kontakt anfragen.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm --filter @workspace/profil-finder run dev` — run the frontend (port 24347)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string
- Required env: `SESSION_SECRET` — session secret
- Optional env: `ADMIN_EMAIL`, `ADMIN_PASSWORD` — admin credentials (login creates admin user automatically)

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + TypeScript + Tailwind CSS + wouter routing
- API: Express 5 + express-session + connect-pg-simple (session store)
- DB: PostgreSQL + Drizzle ORM
- Auth: bcryptjs password hashing, session-based auth
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — API contract (source of truth)
- `lib/db/src/schema/` — DB schema (users, profiles, company-requests, sessions)
- `artifacts/api-server/src/routes/` — Express route handlers
  - `auth.ts` — register, login, logout, user, change-email/password, delete account
  - `profiles.ts` — public profile CRUD + featured + industry-stats
  - `company-requests.ts` — company contact request submission
  - `admin.ts` — admin-only routes (stats, profiles with private data, requests, users)
- `artifacts/profil-finder/src/pages/` — all frontend pages
- `artifacts/profil-finder/src/components/` — shared components (Navbar, Footer, ProfileCard, ContactRequestModal)

## Architecture decisions

- Privacy-first: public API routes never return phoneNumber, contactEmail, address, adminNotes — stripped in `toPublic()` in profiles.ts
- Profile numbers auto-generated as `PF-XXXXXX` (zero-padded sequential ID)
- Session-based auth stored in PostgreSQL via connect-pg-simple
- Admin login: if ADMIN_EMAIL/ADMIN_PASSWORD env vars match, auto-creates or promotes the user to admin
- Frontend uses React Query hooks generated from OpenAPI spec via Orval

## Product

- Bewerber create privacy-protected profiles with a unique profile number (PF-000001)
- Öffentliche Profilkarten show only professional info — never phone/email/address
- Unternehmen submit contact requests referencing the profile number
- Admin dashboard shows all private contact data, manages profiles/requests/users
- 12 pages: Startseite, Profile, Profil erstellen, So funktioniert es, Für Unternehmen, Kontakt, Login/Registrierung, Mein Profil, Admin, Datenschutz, Impressum, FAQ

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Always run `pnpm run typecheck:libs` after changing any `lib/*` schema before typechecking api-server
- `req.params.id` in Express 5 is `string | string[]` — use `parseInt(String(req.params.id))`
- `useGetFeaturedProfiles` and `useGetIndustryStats` return arrays directly (not wrapped objects)
- CORS must have `credentials: true` for session cookies to work cross-origin in dev

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
