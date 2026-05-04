'use client';

import { FormEvent, useState } from 'react';
import { signIn } from 'next-auth/react';

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function authenticate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const result = await signIn('credentials', {
      email: String(formData.get('email') ?? ''),
      password: String(formData.get('password') ?? ''),
      redirect: false,
      callbackUrl: '/',
    });

    if (!result || result.error) {
      setError('ログインに失敗しました');
      setIsSubmitting(false);
      return;
    }

    window.location.href = result.url ?? '/';
  }

  return (
    <div data-theme="emotion-dark" className="flex min-h-screen items-center justify-center bg-base-100 px-4">
      <div className="card w-full max-w-md bg-base-200 shadow-xl">
        <div className="card-body gap-4">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold">ログイン</h1>
            <p className="text-sm text-el-muted">
              EmotionLens のセッションデータ保存にはログインが必要です
            </p>
          </div>
          <form onSubmit={authenticate} className="space-y-4">
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
                autoComplete="current-password"
                className="input input-bordered w-full"
                required
              />
            </label>
            {error && <p className="text-sm text-error">{error}</p>}
            <button type="submit" className="btn btn-primary w-full" disabled={isSubmitting}>
              ログインする
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}