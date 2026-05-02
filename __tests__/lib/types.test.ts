/**
 * lib/types.ts の型構造検証テスト
 * 実行時に型の shape が期待通りかを確認する
 */

import { EmotionLabel } from '../../lib/types';

// EmotionScore の shape を実行時に検証するヘルパー
const isValidEmotionScore = (obj: unknown): boolean => {
  if (typeof obj !== 'object' || obj === null) return false;
  const labels: EmotionLabel[] = ['ANGRY', 'ANXIOUS', 'HAPPY', 'NEUTRAL', 'STRESSED', 'HIDING'];
  return labels.every(
    (label) => typeof (obj as Record<string, unknown>)[label] === 'number'
  );
};

// EmotionAlert の shape を実行時に検証するヘルパー
const isValidEmotionAlert = (obj: unknown): boolean => {
  if (typeof obj !== 'object' || obj === null) return false;
  const o = obj as Record<string, unknown>;
  return (
    typeof o.label === 'string' &&
    typeof o.score === 'number' &&
    typeof o.timestamp === 'number'
  );
};

// EmotionFrame の shape を実行時に検証するヘルパー
const isValidEmotionFrame = (obj: unknown): boolean => {
  if (typeof obj !== 'object' || obj === null) return false;
  const o = obj as Record<string, unknown>;
  return (
    typeof o.timestamp === 'number' &&
    isValidEmotionScore(o.merged) &&
    Array.isArray(o.alerts)
  );
};

// SessionData の shape を実行時に検証するヘルパー
const isValidSessionData = (obj: unknown): boolean => {
  if (typeof obj !== 'object' || obj === null) return false;
  const o = obj as Record<string, unknown>;
  return (
    typeof o.sessionId === 'string' &&
    typeof o.startedAt === 'number' &&
    Array.isArray(o.frames) &&
    Array.isArray(o.allAlerts)
  );
};

describe('EmotionLabel', () => {
  it('主要感情ラベルが文字列定数として使用できる', () => {
    const labels: EmotionLabel[] = ['ANGRY', 'ANXIOUS', 'HAPPY', 'NEUTRAL', 'STRESSED', 'HIDING'];
    expect(labels).toHaveLength(6);
    labels.forEach((label) => {
      expect(typeof label).toBe('string');
    });
  });
});

describe('EmotionScore shape', () => {
  it('全感情ラベルを数値として持つオブジェクトが有効', () => {
    const score = {
      ANGRY: 0.1,
      ANXIOUS: 0.2,
      HAPPY: 0.3,
      NEUTRAL: 0.2,
      STRESSED: 0.1,
      HIDING: 0.1,
    };
    expect(isValidEmotionScore(score)).toBe(true);
  });

  it('感情ラベルが欠けているオブジェクトは無効', () => {
    const invalid = { ANGRY: 0.5, NEUTRAL: 0.5 }; // 他が欠け
    expect(isValidEmotionScore(invalid)).toBe(false);
  });
});

describe('EmotionAlert shape', () => {
  it('label, score, timestamp を持つオブジェクトが有効', () => {
    const alert = { label: 'ANGRY', score: 0.85, timestamp: Date.now() };
    expect(isValidEmotionAlert(alert)).toBe(true);
  });

  it('timestamp が欠けているオブジェクトは無効', () => {
    const invalid = { label: 'ANGRY', score: 0.85 };
    expect(isValidEmotionAlert(invalid)).toBe(false);
  });
});

describe('EmotionFrame shape', () => {
  it('timestamp, merged, alerts を持つオブジェクトが有効', () => {
    const frame = {
      timestamp: Date.now(),
      merged: {
        ANGRY: 0, ANXIOUS: 0, HAPPY: 0, NEUTRAL: 1, STRESSED: 0, HIDING: 0,
      },
      alerts: [],
    };
    expect(isValidEmotionFrame(frame)).toBe(true);
  });
});

describe('SessionData shape', () => {
  it('sessionId, startedAt, frames, allAlerts を持つオブジェクトが有効', () => {
    const session = {
      sessionId: 'test-session-001',
      startedAt: Date.now(),
      frames: [],
      allAlerts: [],
    };
    expect(isValidSessionData(session)).toBe(true);
  });

  it('sessionId が欠けているオブジェクトは無効', () => {
    const invalid = { startedAt: Date.now(), frames: [], allAlerts: [] };
    expect(isValidSessionData(invalid)).toBe(false);
  });
});
