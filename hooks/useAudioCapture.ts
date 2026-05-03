/**
 * useAudioCapture Hook
 * マイク音声を取得し AUDIO_CHUNK_INTERVAL_MS 周期でチャンクコールバックを呼び出す
 */
'use client';

import { useState, useRef, useCallback } from 'react';
import { AUDIO_CHUNK_INTERVAL_MS } from '../constants/emotions';

export interface UseAudioCaptureReturn {
  /** 録音を開始する。onChunk は音声チャンクが得られるたびに呼ばれる */
  start: (onChunk: (buffer: ArrayBuffer) => void) => Promise<void>;
  /** 録音を停止しストリームを解放する */
  stop: () => void;
  /** 録音中かどうか */
  isCapturing: boolean;
  /** エラーメッセージ（未エラー時は null） */
  error: string | null;
}

export function useAudioCapture(): UseAudioCaptureReturn {
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const start = useCallback(async (onChunk: (buffer: ArrayBuffer) => void) => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = async (e: BlobEvent) => {
        if (e.data.size > 0) {
          const buffer = await e.data.arrayBuffer();
          onChunk(buffer);
        }
      };

      recorder.start(AUDIO_CHUNK_INTERVAL_MS);
      setIsCapturing(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'マイクの取得に失敗しました');
    }
  }, []);

  const stop = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    mediaRecorderRef.current = null;

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }

    setIsCapturing(false);
  }, []);

  return { start, stop, isCapturing, error };
}
