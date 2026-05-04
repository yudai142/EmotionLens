import { NextResponse } from 'next/server';
import { getCurrentUser } from '../../../../lib/currentUser';
import { getLatestSessionForUser } from '../../../../lib/sessionRepository';

export async function GET(): Promise<NextResponse> {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const session = await getLatestSessionForUser(user.id);
    return NextResponse.json({ session }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch latest session.' }, { status: 500 });
  }
}