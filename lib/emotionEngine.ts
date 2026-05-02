/**
 * 感情推論エンジン
 * 副作用なしの純関数として実装し、単体テストを容易にする
 */

import { EmotionAlert, EmotionFrame, EmotionLabel, EmotionScore } from './types';
import { ALERT_THRESHOLD, WEIGHT } from '../constants/emotions';

/** EmotionLabel の全ラベル配列 */
const ALL_LABELS: EmotionLabel[] = [
  'ANGRY',
  'ANXIOUS',
  'HAPPY',
  'NEUTRAL',
  'STRESSED',
  'HIDING',
];

/**
 * 音声スコアと表情スコアを重み付き平均で統合する
 * @param audio - 音声解析から得られた EmotionScore
 * @param face  - 表情解析から得られた EmotionScore
 * @returns 統合後の EmotionScore（合計が 1 になるよう正規化済み）
 */
export function mergeScores(audio: EmotionScore, face: EmotionScore): EmotionScore {
  // 重み付き加算
  const raw: Record<EmotionLabel, number> = {} as Record<EmotionLabel, number>;
  for (const label of ALL_LABELS) {
    raw[label] = audio[label] * WEIGHT.audio + face[label] * WEIGHT.face;
  }

  // 正規化（合計が 0 の場合は NEUTRAL = 1 にフォールバック）
  const total = ALL_LABELS.reduce((sum, label) => sum + raw[label], 0);
  if (total === 0) {
    return {
      ANGRY: 0,
      ANXIOUS: 0,
      HAPPY: 0,
      NEUTRAL: 1,
      STRESSED: 0,
      HIDING: 0,
    };
  }

  const normalized: Record<EmotionLabel, number> = {} as Record<EmotionLabel, number>;
  for (const label of ALL_LABELS) {
    normalized[label] = raw[label] / total;
  }

  return normalized as EmotionScore;
}

/**
 * 閾値を超えた感情のアラートリストを生成する
 * @param score     - 統合済みの EmotionScore
 * @param timestamp - アラートに付与する Unix タイムスタンプ (ms)
 * @returns 閾値を超えた EmotionAlert の配列（スコア降順）
 */
export function detectAlerts(score: EmotionScore, timestamp: number): EmotionAlert[] {
  const alerts: EmotionAlert[] = [];

  for (const label of ALL_LABELS) {
    if (score[label] > ALERT_THRESHOLD) {
      alerts.push({ label, score: score[label], timestamp });
    }
  }

  // スコアの高い順にソート
  alerts.sort((a, b) => b.score - a.score);

  return alerts;
}

/**
 * 1 解析サイクル分の EmotionFrame を生成する
 * @param audio     - 音声解析から得られた EmotionScore
 * @param face      - 表情解析から得られた EmotionScore
 * @param timestamp - フレームの Unix タイムスタンプ (ms)
 * @returns EmotionFrame
 */
export function createEmotionFrame(
  audio: EmotionScore,
  face: EmotionScore,
  timestamp: number
): EmotionFrame {
  const merged = mergeScores(audio, face);
  const alerts = detectAlerts(merged, timestamp);

  return { timestamp, merged, alerts };
}
