'use client';

/**
 * メイン画面
 * セッション開始・映像プレビュー・感情パネル・アラート通知を統合する
 */

import { useCallback, useEffect, useState } from 'react';
import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';
import { VideoCapture } from '../components/video/VideoCapture';
import { FaceLandmarkOverlay } from '../components/video/FaceLandmarkOverlay';
import { EmotionBadge } from '../components/video/EmotionBadge';
import { EmotionAlertBanner } from '../components/emotion/EmotionAlert';
import { EmotionPanel } from '../components/emotion/EmotionPanel';
import { AlertHistory } from '../components/emotion/AlertHistory';
import { useVideoCapture } from '../hooks/useVideoCapture';
import { useAudioCapture } from '../hooks/useAudioCapture';
import { useEmotionAnalysis } from '../hooks/useEmotionAnalysis';
import { useEmotionAlerts } from '../hooks/useEmotionAlerts';
import { useSessionStore } from '../hooks/useSessionStore';
import type { SessionData } from '../lib/types';

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';
type SaveStatus = 'idle' | 'saving' | 'success' | 'error';

export default function HomePage() {
  const { isCapturing: videoActive, videoRef, start: startVideo, stop: stopVideo } = useVideoCapture();
  const { isCapturing: audioActive, start: startAudio, stop: stopAudio } = useAudioCapture();
  const { mergedScore, analyzeVoice, analyzeFace } = useEmotionAnalysis();
  const { alerts, latestAlert, addScore, clearAlerts } = useEmotionAlerts();
  const { isActive, startSession, endSession, addFrame } = useSessionStore();
  const [authStatus, setAuthStatus] = useState<AuthStatus>('loading');
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');

  // 感情スコアが更新されたらアラート判定とフレーム蓄積
  useEffect(() => {
    if (!mergedScore || !isActive) return;
    const frameAlerts = addScore(mergedScore);
    addFrame({
      timestamp: Date.now(),
      merged: mergedScore,
      alerts: frameAlerts,
    });
  }, [mergedScore, isActive, addScore]);

  useEffect(() => {
    let cancelled = false;

    async function loadCurrentUser() {
      try {
        const response = await fetch('/api/auth/me');

        if (cancelled) {
          return;
        }

        if (response.ok) {
          setAuthStatus('authenticated');
          return;
        }

        if (response.status === 401) {
          setAuthStatus('unauthenticated');
          return;
        }

        setAuthStatus('unauthenticated');
      } catch {
        if (!cancelled) {
          setAuthStatus('unauthenticated');
        }
      }
    }

    void loadCurrentUser();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleStart = useCallback(async () => {
    startSession();
    clearAlerts();
    setSaveStatus('idle');
    await startVideo((imageBase64) => {
      analyzeFace(imageBase64);
    });
    await startAudio((buffer) => {
      analyzeVoice(buffer);
    });
  }, [startSession, clearAlerts, startVideo, startAudio, analyzeFace, analyzeVoice]);

  const persistSession = useCallback(async (completedSession: SessionData) => {
    setSaveStatus('saving');

    try {
      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session: completedSession }),
      });

      if (!response.ok) {
        throw new Error('Failed to save session.');
      }

      setSaveStatus('success');
    } catch {
      setSaveStatus('error');
    }
  }, []);

  const handleStop = useCallback(async () => {
    stopVideo();
    stopAudio();
    const completedSession = endSession();

    if (!completedSession) {
      return;
    }

    if (authStatus !== 'authenticated') {
      setSaveStatus('idle');
      return;
    }

    await persistSession(completedSession);
  }, [authStatus, endSession, persistSession, stopAudio, stopVideo]);

  const sessionMessage =
    saveStatus === 'saving'
      ? 'セッションを保存中です'
      : saveStatus === 'error'
        ? 'セッションの保存に失敗しました'
        : saveStatus === 'success'
          ? 'セッションを保存しました'
          : authStatus === 'loading'
            ? '認証状態を確認中です'
            : authStatus === 'authenticated'
              ? 'ログイン中のみセッションを保存します'
              : 'ログインするとセッションを保存できます';

  return (
    <div data-theme="emotion-dark" className="flex h-screen flex-col bg-base-100 text-base-content">
      <Header isActive={isActive} onStart={handleStart} onStop={() => void handleStop()} />
      <div className="border-b border-el-border bg-base-200/60 px-4 py-2 text-sm text-el-muted">
        {sessionMessage}
      </div>
      <div className="flex flex-1 overflow-hidden">
        <Sidebar alerts={alerts} />
        <main className="flex flex-1 flex-col gap-4 overflow-y-auto p-4 md:flex-row">
          {/* 左: 映像エリア */}
          <section className="flex flex-col gap-3 md:w-1/2">
            <div className="relative">
              <VideoCapture isActive={videoActive} videoRef={videoRef}>
                <EmotionBadge score={mergedScore} />
              </VideoCapture>
              <FaceLandmarkOverlay videoRef={videoRef} isActive={videoActive} />
            </div>
            {latestAlert && <EmotionAlertBanner alert={latestAlert} />}
          </section>
          {/* 右: スコア・履歴エリア */}
          <section className="flex flex-col gap-4 md:w-1/2">
            <EmotionPanel score={mergedScore} />
            <AlertHistory alerts={alerts} />
          </section>
        </main>
      </div>
    </div>
  );
}
