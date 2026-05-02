/**
 * useEmotionAlerts Hook
 * 感情スコアを受け取り閾値超過を検出、ALERT_COOLDOWN_MS のクールダウンで重複を防ぐ
 */
'use client';

import { useState, useCallback, useRef } from 'react';
import { EmotionAlert, EmotionLabel, EmotionScore } from '../lib/types';
import { detectAlerts } from '../lib/emotionEngine';
import { ALERT_COOLDOWN_MS } from '../constants/emotions';

export interface UseEmotionAlertsReturn {
  /** 蓄積されたアラートリスト */
  alerts: EmotionAlert[];
  /** 感情スコアを渡してアラートを検出・追加する */
  addScore: (score: EmotionScore) => void;
  /** アラート履歴とクールダウン状態をリセットする */
  clearAlerts: () => void;
  /** 最後に追加されたアラート（なければ null） */
  latestAlert: EmotionAlert | null;
}

export function useEmotionAlerts(): UseEmotionAlertsReturn {
  const [alerts, setAlerts] = useState<EmotionAlert[]>([]);
  /** 各ラベルの最終アラート発生時刻（クールダウン管理用） */
  const lastAlertTimeRef = useRef<Partial<Record<EmotionLabel, number>>>({});

  const addScore = useCallback((score: EmotionScore) => {
    const now = Date.now();
    const raw = detectAlerts(score, now);

    // クールダウン中のラベルを除外する
    const filtered = raw.filter((a) => {
      const last = lastAlertTimeRef.current[a.label];
      if (last === undefined) {
        return true;
      }

      return now - last >= ALERT_COOLDOWN_MS;
    });

    if (filtered.length > 0) {
      filtered.forEach((a) => {
        lastAlertTimeRef.current[a.label] = now;
      });
      setAlerts((prev) => [...prev, ...filtered]);
    }
  }, []);

  const clearAlerts = useCallback(() => {
    setAlerts([]);
    lastAlertTimeRef.current = {};
  }, []);

  const latestAlert = alerts.length > 0 ? alerts[alerts.length - 1] : null;

  return { alerts, addScore, clearAlerts, latestAlert };
}
