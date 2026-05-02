/**
 * constants/emotions.ts の定数・設定値検証テスト
 */

import {
  EMOTION_CONFIG,
  ALERT_THRESHOLD,
  WEIGHT,
  AUDIO_CHUNK_INTERVAL_MS,
  FACE_CAPTURE_INTERVAL_MS,
  ALERT_COOLDOWN_MS,
} from '../../constants/emotions';
import { EmotionLabel } from '../../lib/types';

describe('EMOTION_CONFIG', () => {
  // 主要感情ラベルが全て定義されているか
  const requiredLabels: EmotionLabel[] = [
    'ANGRY',
    'ANXIOUS',
    'HAPPY',
    'NEUTRAL',
    'STRESSED',
    'HIDING',
  ];

  it('主要感情ラベルが全て含まれている', () => {
    requiredLabels.forEach((label) => {
      expect(EMOTION_CONFIG[label]).toBeDefined();
    });
  });

  it('各感情に label, color, displayName, tip が定義されている', () => {
    requiredLabels.forEach((label) => {
      const config = EMOTION_CONFIG[label];
      expect(config.label).toBe(label);
      expect(typeof config.color).toBe('string');
      expect(config.color).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(typeof config.displayName).toBe('string');
      expect(config.displayName.length).toBeGreaterThan(0);
      expect(typeof config.tip).toBe('string');
      expect(config.tip.length).toBeGreaterThan(0);
    });
  });

  it('各感情のカラーが tailwind.config.ts の emotion-* カラーと一致している', () => {
    expect(EMOTION_CONFIG.ANGRY.color).toBe('#FF3B3B');
    expect(EMOTION_CONFIG.ANXIOUS.color).toBe('#FBBF24');
    expect(EMOTION_CONFIG.HAPPY.color).toBe('#22C55E');
    expect(EMOTION_CONFIG.NEUTRAL.color).toBe('#00D4FF');
    expect(EMOTION_CONFIG.STRESSED.color).toBe('#F97316');
    expect(EMOTION_CONFIG.HIDING.color).toBe('#A855F7');
  });
});

describe('ALERT_THRESHOLD', () => {
  it('0 より大きく 1 以下の数値である', () => {
    expect(ALERT_THRESHOLD).toBeGreaterThan(0);
    expect(ALERT_THRESHOLD).toBeLessThanOrEqual(1);
  });
});

describe('WEIGHT', () => {
  it('audio と face の重みが定義されている', () => {
    expect(typeof WEIGHT.audio).toBe('number');
    expect(typeof WEIGHT.face).toBe('number');
  });

  it('audio と face の合計が 1 になっている', () => {
    expect(WEIGHT.audio + WEIGHT.face).toBeCloseTo(1, 5);
  });

  it('各重みが 0 より大きい', () => {
    expect(WEIGHT.audio).toBeGreaterThan(0);
    expect(WEIGHT.face).toBeGreaterThan(0);
  });
});

describe('interval 定数', () => {
  it('AUDIO_CHUNK_INTERVAL_MS が正の整数である', () => {
    expect(Number.isInteger(AUDIO_CHUNK_INTERVAL_MS)).toBe(true);
    expect(AUDIO_CHUNK_INTERVAL_MS).toBeGreaterThan(0);
  });

  it('FACE_CAPTURE_INTERVAL_MS が正の整数である', () => {
    expect(Number.isInteger(FACE_CAPTURE_INTERVAL_MS)).toBe(true);
    expect(FACE_CAPTURE_INTERVAL_MS).toBeGreaterThan(0);
  });

  it('ALERT_COOLDOWN_MS が正の整数である', () => {
    expect(Number.isInteger(ALERT_COOLDOWN_MS)).toBe(true);
    expect(ALERT_COOLDOWN_MS).toBeGreaterThan(0);
  });
});
