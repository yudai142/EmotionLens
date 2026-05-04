'use client';

import Link from 'next/link';

export default function SignupPage() {
  return (
    <div data-theme="emotion-dark" className="flex min-h-screen items-center justify-center bg-base-100 px-4">
      <div className="card w-full max-w-md bg-base-200 shadow-xl">
        <div className="card-body gap-4">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold">新規登録</h1>
            <p className="text-sm text-el-muted">新規登録機能は現在準備中です。</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-el-muted">
              すでにアカウントをお持ちですか?{' '}
              <Link href="/login" className="link link-primary">
                ログイン
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
