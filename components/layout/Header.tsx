'use client';

/**
 * Header コンポーネント
 * アプリ名表示、セッション開始・停止ボタン、認証ボタンを提供する
 */

import Link from 'next/link';
import { FormEvent, useState } from 'react';

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

interface HeaderProps {
  isActive: boolean;
  onStart: () => void;
  onStop: () => void;
  authStatus?: AuthStatus;
}

export function Header({ isActive, onStart, onStop, authStatus = 'loading' }: HeaderProps) {
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [signupError, setSignupError] = useState<string | null>(null);
  const [isSignupSubmitting, setIsSignupSubmitting] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState<string | null>(null);

  async function handleSignup(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setSignupError(null);
    setSignupSuccess(null);
    setIsSignupSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get('email') ?? '').trim();
    const password = String(formData.get('password') ?? '');

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const body = (await response.json()) as { error?: string };
        setSignupError(body.error ?? '新規登録に失敗しました');
        return;
      }

      setSignupSuccess('アカウントを登録しました。ログインしてください。');
      event.currentTarget.reset();
    } catch {
      setSignupError('新規登録に失敗しました');
    } finally {
      setIsSignupSubmitting(false);
    }
  }

  return (
    <>
      <header className="navbar bg-base-200 border-b border-el-border px-4 shadow-md">
        <div className="flex-1">
          <span className="text-xl font-bold tracking-wide text-primary">EmotionLens</span>
        </div>
        <div className="flex-none gap-2">
          {isActive ? (
            <button className="btn btn-error btn-sm" onClick={onStop}>
              停止
            </button>
          ) : (
            <button className="btn btn-primary btn-sm" onClick={onStart}>
              開始
            </button>
          )}

          {authStatus === 'loading' ? (
            <button className="btn btn-ghost btn-sm" disabled>
              確認中...
            </button>
          ) : authStatus === 'authenticated' ? (
            <Link href="/api/auth/signout?callbackUrl=/login" className="btn btn-ghost btn-sm">
              ログアウト
            </Link>
          ) : (
            <>
              <Link href="/login" className="btn btn-ghost btn-sm">
                ログイン
              </Link>
              <button type="button" className="btn btn-primary btn-sm" onClick={() => setIsSignupOpen(true)}>
                新規登録
              </button>
            </>
          )}
        </div>
      </header>

      {isSignupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4">
          <div className="card w-full max-w-md bg-base-200 shadow-xl">
            <div className="card-body gap-4">
              <div className="space-y-2 text-center">
                <h2 className="text-2xl font-bold">新規登録</h2>
                <p className="text-sm text-el-muted">ログインと同じ形式でアカウントを作成できます</p>
              </div>
              <form onSubmit={(event) => void handleSignup(event)} className="space-y-4">
                <label className="form-control w-full gap-2">
                  <span className="label-text">メールアドレス</span>
                  <input
                    name="email"
                    type="email"
                    autoComplete="email"
                    className="input input-bordered w-full"
                    required
                  />
                </label>
                <label className="form-control w-full gap-2">
                  <span className="label-text">パスワード</span>
                  <input
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    className="input input-bordered w-full"
                    required
                    minLength={8}
                  />
                </label>
                {signupError && <p className="text-sm text-error">{signupError}</p>}
                {signupSuccess && <p className="text-sm text-success">{signupSuccess}</p>}
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => {
                      setIsSignupOpen(false);
                      setSignupError(null);
                      setSignupSuccess(null);
                    }}
                  >
                    閉じる
                  </button>
                  <button type="submit" className="btn btn-primary btn-sm" disabled={isSignupSubmitting}>
                    {isSignupSubmitting ? '登録中...' : '登録する'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
