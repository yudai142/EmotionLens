import 'server-only';

import { Pool } from 'pg';

declare global {
  var __emotionLensPgPool: Pool | undefined;
}

function createPool(): Pool {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL is not configured on the server.');
  }

  return new Pool({ connectionString });
}

export const postgresPool = globalThis.__emotionLensPgPool ?? createPool();

if (process.env.NODE_ENV !== 'production') {
  globalThis.__emotionLensPgPool = postgresPool;
}