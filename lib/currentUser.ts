import 'server-only';

import { auth } from '../auth';

export type CurrentUser = {
  id: string;
  name: string | null;
  email: string | null;
};

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const session = await auth();
  const user = session?.user;

  if (!user || typeof user.id !== 'string' || user.id.length === 0) {
    return null;
  }

  return {
    id: user.id,
    name: user.name ?? null,
    email: user.email ?? null,
  };
}

export async function requireCurrentUser(): Promise<CurrentUser> {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  return user;
}