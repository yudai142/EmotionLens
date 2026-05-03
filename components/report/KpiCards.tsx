'use client';

/**
 * KpiCards コンポーネント
 * DaisyUI `stat` を使用して KPI を表示する
 */

import { SessionData } from '../../lib/types';
import { EMOTION_CONFIG } from '../../constants/emotions';

interface KpiCardsProps {
  session: SessionData | null;
}

function calculateKpis(session: SessionData) {
  if (!session || session.frames.length === 0) {
    return { sessionTime: 0, alertCount: 0, dominantEmotion: 'NEUTRAL' as const, dominantScore: 0 };
  }

  const sessionTime = session.frames[session.frames.length - 1].timestamp - session.startedAt;
  const alertCount = session.allAlerts.length;

  // 感情スコアの平均を計算して最大を取得
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
      emotionSums[label as keyof typeof emotionSums] += score;
    });
  });

  const emotionAvgs = Object.entries(emotionSums).map(([label, sum]) => ({
    label: label as keyof typeof emotionSums,
    avg: sum / session.frames.length,
  }));

  const dominant = emotionAvgs.reduce((max, curr) =>
    curr.avg > max.avg ? curr : max
  );

  return {
    sessionTime: Math.round(sessionTime / 1000), // to seconds
    alertCount,
    dominantEmotion: dominant.label,
    dominantScore: dominant.avg,
  };
}

export function KpiCards({ session }: KpiCardsProps) {
  if (!session) return null;

  const kpis = calculateKpis(session);
  const dominantConfig = EMOTION_CONFIG[kpis.dominantEmotion];

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {/* セッション時間 */}
      <div className="stat place-items-center bg-base-200 px-3 py-2">
        <div className="stat-title text-xs">セッション時間</div>
        <div className="stat-value text-lg">{kpis.sessionTime}s</div>
      </div>

      {/* アラート件数 */}
      <div className="stat place-items-center bg-base-200 px-3 py-2">
        <div className="stat-title text-xs">アラート件数</div>
        <div className="stat-value text-lg">{kpis.alertCount}</div>
      </div>

      {/* 最大スコア感情 */}
      <div className="stat place-items-center bg-base-200 px-3 py-2">
        <div className="stat-title text-xs">最大感情</div>
        <div className="stat-value text-lg" style={{ color: dominantConfig.color }}>
          {dominantConfig.displayName}
        </div>
      </div>

      {/* スコア */}
      <div className="stat place-items-center bg-base-200 px-3 py-2">
        <div className="stat-title text-xs">スコア</div>
        <div className="stat-value text-lg">{Math.round(kpis.dominantScore * 100)}%</div>
      </div>
    </div>
  );
}
