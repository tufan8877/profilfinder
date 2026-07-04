import { pool } from "@workspace/db";
import { logger } from "./logger";

export async function ensureDatabaseTables() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      is_admin BOOLEAN NOT NULL DEFAULT FALSE,
      status TEXT NOT NULL DEFAULT 'active',
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS profiles (
      id SERIAL PRIMARY KEY,
      profile_number TEXT NOT NULL UNIQUE,
      user_id INTEGER NOT NULL,
      first_name TEXT,
      last_name TEXT,
      public_name TEXT,
      job_title TEXT NOT NULL,
      industry TEXT NOT NULL,
      profession TEXT,
      experience TEXT,
      education TEXT,
      skills TEXT,
      languages TEXT,
      desired_job TEXT,
      federal_state TEXT NOT NULL,
      city TEXT,
      availability TEXT NOT NULL,
      employment_type TEXT,
      driver_license BOOLEAN NOT NULL DEFAULT FALSE,
      description TEXT,
      cv_text TEXT,
      profile_image TEXT,
      is_available BOOLEAN NOT NULL DEFAULT TRUE,
      is_public BOOLEAN NOT NULL DEFAULT TRUE,
      phone_number TEXT,
      contact_email TEXT,
      address TEXT,
      admin_notes TEXT,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS company_requests (
      id SERIAL PRIMARY KEY,
      profile_id INTEGER,
      profile_number TEXT NOT NULL,
      company_name TEXT NOT NULL,
      contact_person TEXT NOT NULL,
      email TEXT NOT NULL,
      phone_number TEXT,
      message TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'neu',
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `);

  logger.info("Database tables are ready");
}
