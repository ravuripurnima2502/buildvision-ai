import bcrypt from 'bcryptjs';
import { getNeonClient, isNeonConfigured } from './neon';

// ================================================================
// BuildVision AI — Auth Service (Neon PostgreSQL backend)
// ================================================================
// Uses bcryptjs for password hashing.
// Session token stored in localStorage (simple, secure enough for SPA).
// ================================================================

const SESSION_KEY = 'buildvision_session';
const JWT_SECRET = import.meta.env.VITE_JWT_SECRET || 'buildvision_dev_secret';

// ----------------------------------------------------------------
// Schema initializer — called once on app start
// ----------------------------------------------------------------
export async function initSchema(): Promise<void> {
  const sql = getNeonClient();
  if (!sql) return;
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS bv_users (
        id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        email       TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        full_name   TEXT,
        company     TEXT,
        created_at  TIMESTAMPTZ DEFAULT NOW()
      )
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS bv_sessions (
        token       TEXT PRIMARY KEY,
        user_id     TEXT NOT NULL REFERENCES bv_users(id) ON DELETE CASCADE,
        expires_at  TIMESTAMPTZ NOT NULL,
        created_at  TIMESTAMPTZ DEFAULT NOW()
      )
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS bv_projects (
        id           TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        user_id      TEXT NOT NULL REFERENCES bv_users(id) ON DELETE CASCADE,
        title        TEXT NOT NULL,
        journey_type TEXT NOT NULL DEFAULT 'have_idea',
        data         JSONB NOT NULL DEFAULT '{}',
        created_at   TIMESTAMPTZ DEFAULT NOW(),
        updated_at   TIMESTAMPTZ DEFAULT NOW()
      )
    `;
    console.log('[BuildVision] Neon schema initialized ✓');
  } catch (err) {
    console.error('[BuildVision] Schema init error:', err);
  }
}

// ----------------------------------------------------------------
// Token utilities (simple random token, no JWT library needed)
// ----------------------------------------------------------------
function generateToken(): string {
  const arr = new Uint8Array(32);
  crypto.getRandomValues(arr);
  return Array.from(arr, b => b.toString(16).padStart(2, '0')).join('');
}

function tokenExpiresAt(): string {
  const d = new Date();
  d.setDate(d.getDate() + 30); // 30-day session
  return d.toISOString();
}

// ----------------------------------------------------------------
// Session storage
// ----------------------------------------------------------------
interface StoredSession {
  token: string;
  userId: string;
  email: string;
  fullName: string;
  company: string;
  expiresAt: string;
}

export function getStoredSession(): StoredSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session: StoredSession = JSON.parse(raw);
    if (new Date(session.expiresAt) < new Date()) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

function storeSession(session: StoredSession): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
}

// ----------------------------------------------------------------
// SIGN UP
// ----------------------------------------------------------------
export async function signUp(
  email: string,
  password: string,
  fullName: string,
  company: string
): Promise<StoredSession> {
  const sql = getNeonClient();
  if (!sql) throw new Error('Database not configured');

  const trimEmail = email.trim().toLowerCase();
  const trimName = fullName.trim();
  const trimCompany = company.trim();

  // Check if email already exists
  const existing = await sql`
    SELECT id FROM bv_users WHERE email = ${trimEmail} LIMIT 1
  ` as any[];
  if (existing.length > 0) {
    throw new Error('An account with this email already exists. Please sign in instead.');
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const [user] = await sql`
    INSERT INTO bv_users (email, password_hash, full_name, company)
    VALUES (${trimEmail}, ${passwordHash}, ${trimName}, ${trimCompany})
    RETURNING id, email, full_name, company
  ` as any[];

  const token = generateToken();
  const expiresAt = tokenExpiresAt();

  await sql`
    INSERT INTO bv_sessions (token, user_id, expires_at)
    VALUES (${token}, ${user.id}, ${expiresAt})
  `;

  const session: StoredSession = {
    token,
    userId: user.id,
    email: user.email,
    fullName: user.full_name || trimName,
    company: user.company || trimCompany,
    expiresAt,
  };
  storeSession(session);
  return session;
}

// ----------------------------------------------------------------
// SIGN IN
// ----------------------------------------------------------------
export async function signIn(email: string, password: string): Promise<StoredSession> {
  const sql = getNeonClient();
  if (!sql) throw new Error('Database not configured');

  const trimEmail = email.trim().toLowerCase();

  const [user] = await sql`
    SELECT id, email, password_hash, full_name, company
    FROM bv_users
    WHERE email = ${trimEmail}
    LIMIT 1
  ` as any[];

  if (!user) {
    throw new Error('No account found with this email. Please register first.');
  }

  const passwordMatch = await bcrypt.compare(password, user.password_hash);
  if (!passwordMatch) {
    throw new Error('Incorrect password. Please try again.');
  }

  const token = generateToken();
  const expiresAt = tokenExpiresAt();

  await sql`
    INSERT INTO bv_sessions (token, user_id, expires_at)
    VALUES (${token}, ${user.id}, ${expiresAt})
  `;

  // Clean up old sessions for this user (keep last 5)
  await sql`
    DELETE FROM bv_sessions
    WHERE user_id = ${user.id}
      AND token NOT IN (
        SELECT token FROM bv_sessions
        WHERE user_id = ${user.id}
        ORDER BY created_at DESC
        LIMIT 5
      )
  `;

  const session: StoredSession = {
    token,
    userId: user.id,
    email: user.email,
    fullName: user.full_name || '',
    company: user.company || '',
    expiresAt,
  };
  storeSession(session);
  return session;
}

// ----------------------------------------------------------------
// SIGN OUT
// ----------------------------------------------------------------
export async function signOut(token: string): Promise<void> {
  const sql = getNeonClient();
  clearSession();
  if (!sql || !token) return;
  try {
    await sql`DELETE FROM bv_sessions WHERE token = ${token}`;
  } catch {
    // ignore — session already cleared locally
  }
}

// ----------------------------------------------------------------
// VERIFY SESSION (validate token against DB)
// ----------------------------------------------------------------
export async function verifySession(token: string): Promise<StoredSession | null> {
  const sql = getNeonClient();
  if (!sql) return null;
  try {
    const [row] = await sql`
      SELECT s.token, s.expires_at, u.id as user_id, u.email, u.full_name, u.company
      FROM bv_sessions s
      JOIN bv_users u ON u.id = s.user_id
      WHERE s.token = ${token}
        AND s.expires_at > NOW()
      LIMIT 1
    ` as any[];
    if (!row) {
      clearSession();
      return null;
    }
    return {
      token: row.token,
      userId: row.user_id,
      email: row.email,
      fullName: row.full_name || '',
      company: row.company || '',
      expiresAt: row.expires_at,
    };
  } catch {
    return null;
  }
}

// ----------------------------------------------------------------
// RESET PASSWORD (sends nothing — just logs for now; add email later)
// ----------------------------------------------------------------
export async function requestPasswordReset(email: string): Promise<void> {
  const sql = getNeonClient();
  if (!sql) return;
  const [user] = await sql`
    SELECT id FROM bv_users WHERE email = ${email.trim().toLowerCase()} LIMIT 1
  ` as any[];
  if (!user) throw new Error('No account found with this email address.');
  // In production: send email via SendGrid/Resend/etc.
  console.log(`[BuildVision] Password reset requested for ${email} (user: ${user.id})`);
}
