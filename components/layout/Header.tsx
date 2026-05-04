'use client';

/**
 * Header コンポーネント
 * アプリ名表示、セッション開始・停止ボタン、認証ボタンを提供する
 */

import Link from 'next/link';

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

interface HeaderProps {
  isActive: boolean;
  onStart: () => void;
  onStop: () => void;
  authStatus?: AuthStatus;
}

export function Header({ isActive, onStart, onStop, authStatus = 'loading' }: HeaderProps) {
  return (
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
            <Link href="/signup" className="btn btn-primary btn-sm">
              新規登録
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
