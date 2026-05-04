import { NextRequest, NextResponse } from 'next/server';
import { createAuthUser, DuplicateEmailError } from '../../../../lib/authUserRepository';

type SignupBody = {
  email?: unknown;
  password?: unknown;
};

export async function POST(req: NextRequest): Promise<NextResponse> {
  let body: SignupBody;

  try {
    body = (await req.json()) as SignupBody;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 422 });
  }

  if (typeof body.email !== 'string' || typeof body.password !== 'string') {
    return NextResponse.json({ error: 'Email and password are required.' }, { status: 422 });
  }

  const email = body.email.trim().toLowerCase();
  const password = body.password;

  if (!email || password.length < 8) {
    return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 422 });
  }

  try {
    const user = await createAuthUser({ email, password });
    return NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          name: user.displayName,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    const candidate = error as { name?: string };
    if (error instanceof DuplicateEmailError || candidate.name === 'DuplicateEmailError') {
      return NextResponse.json({ error: 'Email is already registered.' }, { status: 409 });
    }

    return NextResponse.json({ error: 'Failed to register user.' }, { status: 500 });
  }
}
