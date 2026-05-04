import 'server-only';

import { randomUUID, scryptSync, timingSafeEqual } from 'crypto';
import { Pool } from 'pg';

type AuthUserRow = {
  id: string;
  email: string;
  password_hash: string;
  display_name: string | null;
};

let authUserPool: Pool | null = null;

function getPool(): Pool {
  if (authUserPool) {
    return authUserPool;
  }

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL is not configured on the server.');
  }

  authUserPool = new Pool({ connectionString });
  return authUserPool;
}

async function ensureAuthUsersTable(): Promise<void> {
  const pool = getPool();

  await pool.query(`
    CREATE TABLE IF NOT EXISTS auth_users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      display_name TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}

function hashPassword(password: string): string {
  const salt = randomUUID();
  const hash = scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password: string, passwordHash: string): boolean {
  const [salt, expectedHex] = passwordHash.split(':');
  if (!salt || !expectedHex) {
    return false;
  }

  const actual = scryptSync(password, salt, 64);
  const expected = Buffer.from(expectedHex, 'hex');

  if (actual.length !== expected.length) {
    return false;
  }

  return timingSafeEqual(actual, expected);
}

export class DuplicateEmailError extends Error {
  constructor() {
    super('Email already registered');
    this.name = 'DuplicateEmailError';
  }
}

export async function findAuthUserByEmail(email: string): Promise<AuthUserRow | null> {
  await ensureAuthUsersTable();

  const pool = getPool();
  const result = await pool.query<AuthUserRow>(
    `
      SELECT id, email, password_hash, display_name
      FROM auth_users
      WHERE email = $1
      LIMIT 1
    `,
    [email],
  );

  return result.rows[0] ?? null;
}

export async function createAuthUser(input: {
  email: string;
  password: string;
  displayName?: string | null;
}): Promise<{ id: string; email: string; displayName: string | null }> {
  await ensureAuthUsersTable();

  const pool = getPool();
  const id = randomUUID();
  const passwordHash = hashPassword(input.password);

  try {
    const result = await pool.query<Pick<AuthUserRow, 'id' | 'email' | 'display_name'>>(
      `
        INSERT INTO auth_users (id, email, password_hash, display_name)
        VALUES ($1, $2, $3, $4)
        RETURNING id, email, display_name
      `,
      [id, input.email, passwordHash, input.displayName ?? null],
    );

    const row = result.rows[0];
    return {
      id: row.id,
      email: row.email,
      displayName: row.display_name,
    };
  } catch (error) {
    const candidate = error as { code?: string };
    if (candidate.code === '23505') {
      throw new DuplicateEmailError();
    }
    throw error;
  }
}

export async function verifyAuthUser(input: {
  email: string;
  password: string;
}): Promise<{ id: string; email: string; displayName: string | null } | null> {
  const user = await findAuthUserByEmail(input.email);
  if (!user) {
    return null;
  }

  if (!verifyPassword(input.password, user.password_hash)) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    displayName: user.display_name,
  };
}
