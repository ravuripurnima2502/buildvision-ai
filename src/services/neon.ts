import { neon } from '@neondatabase/serverless';

// ================================================================
// BuildVision AI — Neon PostgreSQL Client
// ================================================================
// Connection string loaded from VITE_DATABASE_URL in .env.local
// ================================================================

const DATABASE_URL = import.meta.env.VITE_DATABASE_URL as string | undefined;

export const isNeonConfigured = !!DATABASE_URL;

let _sql: ReturnType<typeof neon> | null = null;

export function getNeonClient(): ReturnType<typeof neon> | null {
  if (!isNeonConfigured || !DATABASE_URL) return null;
  if (!_sql) {
    _sql = neon(DATABASE_URL);
  }
  return _sql;
}

// Convenience export
export const sql = getNeonClient();
