/**
 * useVideoCapture Hook
 * カメラ映像を取得し FACE_CAPTURE_INTERVAL_MS 周期でフレームをコールバックする
 */
'use client';

import { useState, useRef, useCallback } from 'react';
import { FACE_CAPTURE_INTERVAL_MS } from '../constants/emotions';

export interface UseVideoCaptureReturn {
  /** 映像キャプチャを開始する。onFrame は JPEG base64 フレームが得られるたびに呼ばれる */
  start: (onFrame: (imageBase64: string) => void) => Promise<void>;
  /** キャプチャを停止しストリームを解放する */
  stop: () => void;
  /** キャプチャ中かどうか */
  isCapturing: boolean;
  /** エラーメッセージ（未エラー時は null） */
  error: string | null;
  /** video 要素へのref（UI でプレビュー表示する場合に使用） */
  videoRef: React.RefObject<HTMLVideoElement | null>;
}

export function useVideoCapture(): UseVideoCaptureReturn {
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = useCallback(async (onFrame: (imageBase64: string) => void) => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      intervalRef.current = setInterval(() => {
        const video = videoRef.current;
        if (!video) return;

        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
          // "data:image/jpeg;base64," を除去して base64 のみ取得
          const base64 = dataUrl.split(',')[1];
          if (base64) onFrame(base64);
        }
      }, FACE_CAPTURE_INTERVAL_MS);

      setIsCapturing(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'カメラの取得に失敗しました');
    }
  }, []);

  const stop = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setIsCapturing(false);
  }, []);

  return { start, stop, isCapturing, error, videoRef };
}
