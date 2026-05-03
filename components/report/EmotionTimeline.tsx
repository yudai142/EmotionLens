'use client';

/**
 * EmotionTimeline コンポーネント
 * Recharts LineChart で感情スコアの時系列グラフを描画する
 */

import { SessionData, EmotionLabel } from '../../lib/types';
import { EMOTION_CONFIG } from '../../constants/emotions';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface EmotionTimelineProps {
  session: SessionData | null;
}

const EMOTIONS: EmotionLabel[] = ['ANGRY', 'ANXIOUS', 'HAPPY', 'NEUTRAL', 'STRESSED', 'HIDING'];

export function EmotionTimeline({ session }: EmotionTimelineProps) {
  if (!session || session.frames.length === 0) return null;

  // グラフデータへ変換
  const data = session.frames.map((frame) => {
    const timeOffset = Math.round((frame.timestamp - session.startedAt) / 1000); // seconds
    return {
      time: `${timeOffset}s`,
      timestamp: frame.timestamp,
      ...frame.merged,
    };
  });

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis domain={[0, 1]} />
          <Tooltip formatter={(value: number) => (typeof value === 'number' ? `${Math.round(value * 100)}%` : value)} />
          <Legend />
          {EMOTIONS.map((emotion) => (
            <Line
              key={emotion}
              type="monotone"
              dataKey={emotion}
              stroke={EMOTION_CONFIG[emotion].color}
              dot={false}
              name={EMOTION_CONFIG[emotion].displayName}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
