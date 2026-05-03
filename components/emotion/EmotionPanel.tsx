'use client';

/**
 * EmotionPanel コンポーネント
 * 全感情ラベルのスコアを一覧表示する DaisyUI card ベースのパネル
 */

import { EmotionScore, EmotionLabel } from '../../lib/types';
import { EMOTION_CONFIG } from '../../constants/emotions';
import { EmotionBar } from './EmotionBar';

interface EmotionPanelProps {
  score: EmotionScore | null;
}

const EMOTION_LABELS: EmotionLabel[] = ['ANGRY', 'ANXIOUS', 'HAPPY', 'NEUTRAL', 'STRESSED', 'HIDING'];

function getDominant(score: EmotionScore): EmotionLabel {
  let dominant: EmotionLabel = 'NEUTRAL';
  let max = -1;
  for (const label of EMOTION_LABELS) {
    if (score[label] > max) {
      max = score[label];
      dominant = label;
    }
  }
  return dominant;
}

export function EmotionPanel({ score }: EmotionPanelProps) {
  const dominant = score ? getDominant(score) : null;

  return (
    <div className="card card-body bg-base-200 shadow-xl gap-3">
      <h3 className="text-sm font-semibold uppercase tracking-widest text-el-muted">
        感情スコア
      </h3>
      {!score ? (
        <p className="text-sm text-el-muted">解析待ち --</p>
      ) : (
        <div className="flex flex-col gap-2" data-dominant={dominant}>
          {EMOTION_LABELS.map((label) => (
            <EmotionBar
              key={label}
              label={label}
              value={score[label]}
              isDominant={label === dominant}
            />
          ))}
        </div>
      )}
    </div>
  );
}
