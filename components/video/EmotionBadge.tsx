'use client';

/**
 * EmotionBadge コンポーネント
 * 映像プレビュー上に最大スコア感情をオーバーレイ表示する
 */

import { EmotionScore, EmotionLabel } from '../../lib/types';
import { EMOTION_CONFIG } from '../../constants/emotions';

interface EmotionBadgeProps {
  score: EmotionScore | null;
}

function getDominantEmotion(score: EmotionScore): { label: EmotionLabel; value: number } {
  let dominant: EmotionLabel = 'NEUTRAL';
  let max = -1;
  for (const [label, value] of Object.entries(score) as [EmotionLabel, number][]) {
    if (value > max) {
      max = value;
      dominant = label;
    }
  }
  return { label: dominant, value: max };
}

export function EmotionBadge({ score }: EmotionBadgeProps) {
  if (!score) return null;

  const { label, value } = getDominantEmotion(score);
  const config = EMOTION_CONFIG[label];

  return (
    <div
      className="badge badge-lg gap-1 border font-semibold"
      style={{ borderColor: config.color, color: config.color, backgroundColor: 'rgba(0,0,0,0.6)' }}
    >
      <span>{config.displayName}</span>
      <span className="text-xs opacity-80">{Math.round(value * 100)}%</span>
    </div>
  );
}
