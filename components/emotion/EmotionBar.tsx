'use client';

/**
 * EmotionBar コンポーネント
 * 1 感情ラベルのスコアを progress バーで表示する
 */

import { EmotionLabel } from '../../lib/types';
import { EMOTION_CONFIG } from '../../constants/emotions';

interface EmotionBarProps {
  label: EmotionLabel;
  value: number;
  isDominant?: boolean;
}

export function EmotionBar({ label, value, isDominant }: EmotionBarProps) {
  const config = EMOTION_CONFIG[label];

  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex items-center justify-between text-xs">
        <span
          className={isDominant ? 'font-bold' : 'text-el-muted'}
          style={isDominant ? { color: config.color } : undefined}
        >
          {config.displayName}
        </span>
        <span className="text-el-muted">{Math.round(value * 100)}%</span>
      </div>
      <progress
        className="progress progress-primary h-1.5 w-full"
        value={value}
        max={1}
      />
    </div>
  );
}
