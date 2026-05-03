'use client';

/**
 * AlertHistory コンポーネント
 * セッション中に発生したアラートを時系列で表示する
 */

import { EmotionAlert } from '../../lib/types';
import { EMOTION_CONFIG } from '../../constants/emotions';

interface AlertHistoryProps {
  alerts: EmotionAlert[];
}

function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString('ja-JP', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

export function AlertHistory({ alerts }: AlertHistoryProps) {
  return (
    <div className="card card-body bg-base-200 shadow-xl gap-3">
      <h3 className="text-sm font-semibold uppercase tracking-widest text-el-muted">
        アラート履歴
      </h3>
      {alerts.length === 0 ? (
        <p className="text-sm text-el-muted">履歴なし</p>
      ) : (
        <ul className="flex flex-col gap-1.5">
          {alerts.map((alert, i) => {
            const config = EMOTION_CONFIG[alert.label];
            return (
              <li key={i} className="flex items-center gap-2 text-sm">
                <span
                  className="inline-block h-2 w-2 flex-shrink-0 rounded-full"
                  style={{ backgroundColor: config.color }}
                />
                <span style={{ color: config.color }}>{config.displayName}</span>
                <span className="text-el-muted text-xs">{Math.round(alert.score * 100)}%</span>
                <span className="ml-auto text-el-muted text-xs">{formatTime(alert.timestamp)}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
