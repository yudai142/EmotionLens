'use client';

/**
 * レポート画面
 * セッション終了後に感情推移とアラート履歴を表示する
 */

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { SessionData } from '../../lib/types';
import { KpiCards } from '../../components/report/KpiCards';
import { EmotionTimeline } from '../../components/report/EmotionTimeline';
import { EmotionDonut } from '../../components/report/EmotionDonut';
import { AlertLogTable } from '../../components/report/AlertLogTable';

type ReportStatus = 'loading' | 'ready' | 'empty' | 'unauthenticated' | 'error';

export default function ReportPage() {
  const [data, setData] = useState<SessionData | null>(null);
  const [status, setStatus] = useState<ReportStatus>('loading');

  useEffect(() => {
    let cancelled = false;

    async function loadLatestSession() {
      try {
        const response = await fetch('/api/sessions/latest', { cache: 'no-store' });

        if (cancelled) {
          return;
        }

        if (response.ok) {
          const payload = (await response.json()) as { session: SessionData };
          setData(payload.session);
          setStatus('ready');
          return;
        }

        if (response.status === 401) {
          setStatus('unauthenticated');
          return;
        }

        if (response.status === 404) {
          setStatus('empty');
          return;
        }

        setStatus('error');
      } catch {
        if (!cancelled) {
          setStatus('error');
        }
      }
    }

    void loadLatestSession();

    return () => {
      cancelled = true;
    };
  }, []);

  if (status === 'loading') {
    return (
      <div data-theme="emotion-dark" className="flex min-h-screen flex-col items-center justify-center bg-base-100">
        <div className="card w-full max-w-md bg-base-200 shadow-xl">
          <div className="card-body items-center text-center gap-3">
            <h2 className="card-title text-lg">レポートを読み込み中です</h2>
            <p className="text-sm text-el-muted">最新の保存済みセッションを取得しています</p>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div data-theme="emotion-dark" className="flex min-h-screen flex-col items-center justify-center bg-base-100">
        <div className="card w-full max-w-md bg-base-200 shadow-xl">
          <div className="card-body items-center text-center gap-4">
            <h2 className="card-title text-lg">ログインするとレポートを表示できます</h2>
            <p className="text-sm text-el-muted">保存済みセッションの閲覧にはログインが必要です</p>
            <Link href="/login" className="btn btn-primary btn-sm">
              ログインへ進む
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div data-theme="emotion-dark" className="flex min-h-screen flex-col items-center justify-center bg-base-100">
        <div className="card w-full max-w-md bg-base-200 shadow-xl">
          <div className="card-body items-center text-center gap-3">
            <h2 className="card-title text-lg">レポートの取得に失敗しました</h2>
            <p className="text-sm text-el-muted">時間をおいて再度お試しください</p>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'empty' || !data) {
    return (
      <div data-theme="emotion-dark" className="flex min-h-screen flex-col items-center justify-center bg-base-100">
        <div className="card w-full max-w-md bg-base-200 shadow-xl">
          <div className="card-body items-center text-center gap-3">
            <h2 className="card-title text-lg">レポートデータなし</h2>
            <p className="text-sm text-el-muted">
              セッションを完了してから、レポート画面にアクセスしてください
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div data-theme="emotion-dark" className="min-h-screen bg-base-100 p-4 text-base-content">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* タイトル */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">セッションレポート</h1>
          <p className="text-sm text-el-muted">
            {new Date(data.startedAt).toLocaleString('ja-JP')}
          </p>
        </div>

        {/* KPI カード */}
        <section className="card card-body bg-base-200 shadow-lg p-4">
          <h2 className="text-lg font-semibold mb-3">主要指標</h2>
          <KpiCards session={data} />
        </section>

        {/* グラフエリア */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* 感情時系列 */}
          <section className="card card-body bg-base-200 shadow-lg p-4">
            <h2 className="text-lg font-semibold mb-3">感情の推移</h2>
            <EmotionTimeline session={data} />
          </section>

          {/* ドーナツチャート */}
          <section className="card card-body bg-base-200 shadow-lg p-4">
            <h2 className="text-lg font-semibold mb-3">感情の割合</h2>
            <EmotionDonut session={data} />
          </section>
        </div>

        {/* アラートログテーブル */}
        <section className="card card-body bg-base-200 shadow-lg p-4">
          <h2 className="text-lg font-semibold mb-3">アラートログ</h2>
          <AlertLogTable session={data} />
        </section>
      </div>
    </div>
  );
}
