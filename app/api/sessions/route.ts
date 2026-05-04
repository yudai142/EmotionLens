import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '../../../lib/currentUser';
import { saveSessionForUser } from '../../../lib/sessionRepository';
import type { SessionData } from '../../../lib/types';

type SessionBody = {
  session?: unknown;
};

function isSessionData(value: unknown): value is SessionData {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<SessionData>;
  return (
    typeof candidate.sessionId === 'string' &&
    typeof candidate.startedAt === 'number' &&
    Array.isArray(candidate.frames) &&
    Array.isArray(candidate.allAlerts)
  );
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let session: SessionData;
  try {
    const body = (await req.json()) as SessionBody;
    if (!isSessionData(body.session)) {
      return NextResponse.json({ error: 'Invalid session payload.' }, { status: 422 });
    }
    session = body.session;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 422 });
  }

  try {
    await saveSessionForUser(user.id, user, session);
    return NextResponse.json({ sessionId: session.sessionId }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Failed to save session.' }, { status: 500 });
  }
}