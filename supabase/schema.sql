-- ================================================================
-- BuildVision AI — Neon PostgreSQL Schema
-- This is run automatically by the app on startup (initSchema).
-- You can also run it manually in the Neon SQL Editor.
-- ================================================================

-- Users table (stores accounts with bcrypt-hashed passwords)
CREATE TABLE IF NOT EXISTS bv_users (
  id            TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  full_name     TEXT,
  company       TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Sessions table (token-based, 30-day expiry)
CREATE TABLE IF NOT EXISTS bv_sessions (
  token       TEXT PRIMARY KEY,
  user_id     TEXT NOT NULL REFERENCES bv_users(id) ON DELETE CASCADE,
  expires_at  TIMESTAMPTZ NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Projects table
CREATE TABLE IF NOT EXISTS bv_projects (
  id           TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id      TEXT NOT NULL REFERENCES bv_users(id) ON DELETE CASCADE,
  title        TEXT NOT NULL,
  journey_type TEXT NOT NULL DEFAULT 'have_idea',
  data         JSONB NOT NULL DEFAULT '{}',
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS bv_projects_user_idx ON bv_projects(user_id);
CREATE INDEX IF NOT EXISTS bv_sessions_user_idx ON bv_sessions(user_id);
