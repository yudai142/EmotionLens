'use client';

/**
 * EmotionDonut コンポーネント
 * Recharts PieChart でドーナツチャート（感情割合）を描画する
 */

import { SessionData, EmotionLabel } from '../../lib/types';
import { EMOTION_CONFIG } from '../../constants/emotions';
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface EmotionDonutProps {
  session: SessionData | null;
}

const EMOTIONS: EmotionLabel[] = ['ANGRY', 'ANXIOUS', 'HAPPY', 'NEUTRAL', 'STRESSED', 'HIDING'];

export function EmotionDonut({ session }: EmotionDonutProps) {
  if (!session || session.frames.length === 0) return null;

  // 全フレーム中の各感情の平均スコアを計算
  const emotionSums = {
    ANGRY: 0,
    ANXIOUS: 0,
    HAPPY: 0,
    NEUTRAL: 0,
    STRESSED: 0,
    HIDING: 0,
  };

  session.frames.forEach((frame) => {
    Object.entries(frame.merged).forEach(([label, score]) => {
      emotionSums[label as EmotionLabel] += score;
    });
  });

  const data = EMOTIONS.map((label) => ({
    name: EMOTION_CONFIG[label].displayName,
    value: Math.round((emotionSums[label] / session.frames.length) * 100),
    label,
  }));

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={EMOTION_CONFIG[entry.label].color} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => `${value}%`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
