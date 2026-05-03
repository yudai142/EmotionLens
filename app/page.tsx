'use client';

/**
 * メイン画面
 * セッション開始・映像プレビュー・感情パネル・アラート通知を統合する
 */

import { useCallback, useEffect } from 'react';
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

export default function HomePage() {
  const { isCapturing: videoActive, videoRef, start: startVideo, stop: stopVideo } = useVideoCapture();
  const { isCapturing: audioActive, start: startAudio, stop: stopAudio } = useAudioCapture();
  const { mergedScore, analyzeVoice, analyzeFace } = useEmotionAnalysis();
  const { alerts, latestAlert, addScore, clearAlerts } = useEmotionAlerts();
  const { isActive, startSession, endSession, addFrame } = useSessionStore();

  // 感情スコアが更新されたらアラート判定とフレーム蓄積
  useEffect(() => {
    if (!mergedScore || !isActive) return;
    addScore(mergedScore);
  }, [mergedScore, isActive, addScore]);

  const handleStart = useCallback(async () => {
    startSession();
    clearAlerts();
    await startVideo((imageBase64) => {
      analyzeFace(imageBase64);
    });
    await startAudio((buffer) => {
      analyzeVoice(buffer);
    });
  }, [startSession, clearAlerts, startVideo, startAudio, analyzeFace, analyzeVoice]);

  const handleStop = useCallback(() => {
    stopVideo();
    stopAudio();
    endSession();
  }, [stopVideo, stopAudio, endSession]);

  return (
    <div data-theme="emotion-dark" className="flex h-screen flex-col bg-base-100 text-base-content">
      <Header isActive={isActive} onStart={handleStart} onStop={handleStop} />
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
