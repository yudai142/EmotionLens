/**
 * useSessionStore Hook
 * ビデオ会議セッションの開始・終了・フレーム蓄積を管理する
 */
'use client';

import { useState, useCallback } from 'react';
import { SessionData, EmotionFrame } from '../lib/types';

export interface UseSessionStoreReturn {
  /** 現在のセッションデータ（未開始時は null） */
  session: SessionData | null;
  /** セッション開始中かどうか */
  isActive: boolean;
  /** 新しいセッションを開始する */
  startSession: () => void;
  /** セッションを終了し、最終セッションデータを返す */
  endSession: () => SessionData | null;
  /** 感情フレームをセッションに追加する */
  addFrame: (frame: EmotionFrame) => void;
}

/** ユニークなセッションIDを生成する */
function generateSessionId(): string {
  return `session-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function useSessionStore(): UseSessionStoreReturn {
  const [session, setSession] = useState<SessionData | null>(null);
  const isActive = session !== null;

  const startSession = useCallback(() => {
    setSession({
      sessionId: generateSessionId(),
      startedAt: Date.now(),
      frames: [],
      allAlerts: [],
    });
  }, []);

  const endSession = useCallback((): SessionData | null => {
    let result: SessionData | null = null;
    setSession((prev) => {
      result = prev;
      return null;
    });
    return result;
  }, []);

  const addFrame = useCallback((frame: EmotionFrame) => {
    setSession((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        frames: [...prev.frames, frame],
        allAlerts: [...prev.allAlerts, ...frame.alerts],
      };
    });
  }, []);

  return { session, isActive, startSession, endSession, addFrame };
}
