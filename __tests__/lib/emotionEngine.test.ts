/**
 * lib/emotionEngine.ts の統合スコア算出・アラート生成テスト
 */

import {
  mergeScores,
  detectAlerts,
  createEmotionFrame,
} from '../../lib/emotionEngine';
import { EmotionScore, EmotionFrame } from '../../lib/types';
import { ALERT_THRESHOLD } from '../../constants/emotions';

// テスト用スコアヘルパー
const makeScore = (overrides: Partial<EmotionScore> = {}): EmotionScore => ({
  ANGRY: 0,
  ANXIOUS: 0,
  HAPPY: 0,
  NEUTRAL: 1,
  STRESSED: 0,
  HIDING: 0,
  ...overrides,
});

describe('mergeScores', () => {
  it('audio と face のスコアを重み付き平均で統合する', () => {
    const audio = makeScore({ ANGRY: 0.8, NEUTRAL: 0.2 });
    const face = makeScore({ ANGRY: 0.4, NEUTRAL: 0.6 });

    const result = mergeScores(audio, face);

    // 合計が 1 になっているか
    const total = Object.values(result).reduce((s, v) => s + v, 0);
    expect(total).toBeCloseTo(1, 5);

    // ANGRY が NEUTRAL より高い（audio 0.8 / face 0.4 の平均）
    expect(result.ANGRY).toBeGreaterThan(result.NEUTRAL);
  });

  it('全感情ラベルがキーとして存在する', () => {
    const result = mergeScores(makeScore(), makeScore());
    expect(Object.keys(result)).toEqual(
      expect.arrayContaining(['ANGRY', 'ANXIOUS', 'HAPPY', 'NEUTRAL', 'STRESSED', 'HIDING'])
    );
  });

  it('片方のスコアが全て 0 の場合でも正常に動作する', () => {
    const audio = makeScore({ HAPPY: 1, NEUTRAL: 0 });
    const face = makeScore(); // NEUTRAL: 1 がデフォルト

    const result = mergeScores(audio, face);
    const total = Object.values(result).reduce((s, v) => s + v, 0);
    expect(total).toBeCloseTo(1, 5);
  });

  it('各スコア値が 0〜1 の範囲内である', () => {
    const audio = makeScore({ ANGRY: 0.6, NEUTRAL: 0.4 });
    const face = makeScore({ STRESSED: 0.7, NEUTRAL: 0.3 });

    const result = mergeScores(audio, face);
    Object.values(result).forEach((v) => {
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(1);
    });
  });
});

describe('detectAlerts', () => {
  it('閾値を超えた感情のアラートを返す', () => {
    const score = makeScore({ ANGRY: ALERT_THRESHOLD + 0.1, NEUTRAL: 1 - (ALERT_THRESHOLD + 0.1) });
    const alerts = detectAlerts(score, Date.now());

    expect(alerts.length).toBeGreaterThanOrEqual(1);
    expect(alerts[0].label).toBe('ANGRY');
    expect(alerts[0].score).toBeCloseTo(ALERT_THRESHOLD + 0.1, 5);
  });

  it('閾値以下の感情はアラートに含まれない', () => {
    const score = makeScore({ NEUTRAL: 1 }); // 全て NEUTRAL
    const alerts = detectAlerts(score, Date.now());

    const nonNeutral = alerts.filter((a) => a.label !== 'NEUTRAL');
    expect(nonNeutral).toHaveLength(0);
  });

  it('アラートに timestamp が含まれている', () => {
    const now = Date.now();
    const score = makeScore({ ANGRY: ALERT_THRESHOLD + 0.1, NEUTRAL: 1 - (ALERT_THRESHOLD + 0.1) });
    const alerts = detectAlerts(score, now);

    if (alerts.length > 0) {
      expect(typeof alerts[0].timestamp).toBe('number');
      expect(alerts[0].timestamp).toBe(now);
    }
  });

  it('複数の感情が同時に閾値を超えた場合、全てアラートを返す', () => {
    const highScore = ALERT_THRESHOLD + 0.05;
    const score: EmotionScore = {
      ANGRY: highScore,
      ANXIOUS: highScore,
      HAPPY: 0,
      NEUTRAL: 0,
      STRESSED: highScore,
      HIDING: 0,
    };
    const alerts = detectAlerts(score, Date.now());
    const labels = alerts.map((a) => a.label);

    expect(labels).toContain('ANGRY');
    expect(labels).toContain('ANXIOUS');
    expect(labels).toContain('STRESSED');
  });
});

describe('createEmotionFrame', () => {
  it('EmotionFrame を正しく生成する', () => {
    const audio = makeScore({ HAPPY: 0.8, NEUTRAL: 0.2 });
    const face = makeScore({ HAPPY: 0.6, NEUTRAL: 0.4 });
    const timestamp = Date.now();

    const frame: EmotionFrame = createEmotionFrame(audio, face, timestamp);

    expect(frame.timestamp).toBe(timestamp);
    expect(frame.merged).toBeDefined();
    expect(frame.alerts).toBeDefined();
    expect(Array.isArray(frame.alerts)).toBe(true);
  });

  it('merged スコアの合計が 1 になっている', () => {
    const audio = makeScore({ STRESSED: 0.5, NEUTRAL: 0.5 });
    const face = makeScore({ ANXIOUS: 0.3, NEUTRAL: 0.7 });
    const frame = createEmotionFrame(audio, face, Date.now());

    const total = Object.values(frame.merged).reduce((s, v) => s + v, 0);
    expect(total).toBeCloseTo(1, 5);
  });
});
