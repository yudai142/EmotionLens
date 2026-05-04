import { NextResponse } from 'next/server';
import { getCurrentUser } from '../../../../lib/currentUser';
import { getSessionByIdForUser } from '../../../../lib/sessionRepository';

type RouteContext = {
  params: {
    sessionId: string;
  };
};

export async function GET(_req: Request, { params }: RouteContext): Promise<NextResponse> {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const sessionId = params.sessionId;
  if (!sessionId) {
    return NextResponse.json({ error: 'sessionId is required.' }, { status: 422 });
  }

  try {
    const session = await getSessionByIdForUser(user.id, sessionId);
    if (!session) {
      return NextResponse.json({ error: 'Not found.' }, { status: 404 });
    }

    return NextResponse.json({ session }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch session.' }, { status: 500 });
  }
}