import Link from 'next/link';
import { auth, signOut } from '../../auth';

export async function AuthNav() {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    return (
      <Link href="/login" className="btn btn-ghost btn-sm">
        ログイン
      </Link>
    );
  }

  async function handleSignOut() {
    'use server';

    await signOut({ redirectTo: '/login' });
  }

  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="text-el-muted">{user.email ?? user.name ?? 'ログイン中'}</span>
      <form action={handleSignOut}>
        <button type="submit" className="btn btn-ghost btn-sm">
          ログアウト
        </button>
      </form>
    </div>
  );
}