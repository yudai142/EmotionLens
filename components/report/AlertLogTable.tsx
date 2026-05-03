'use client';

/**
 * AlertLogTable コンポーネント
 * DaisyUI table を使用してアラートログを表示する
 */

import { SessionData } from '../../lib/types';
import { EMOTION_CONFIG } from '../../constants/emotions';

interface AlertLogTableProps {
  session: SessionData | null;
}

function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString('ja-JP', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

export function AlertLogTable({ session }: AlertLogTableProps) {
  if (!session) return null;

  const alerts = session.allAlerts;

  if (alerts.length === 0) {
    return (
      <div className="card card-body bg-base-200">
        <p className="text-sm text-el-muted">アラートログなし</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra">
        <thead>
          <tr>
            <th className="text-xs">感情</th>
            <th className="text-xs">スコア</th>
            <th className="text-xs">検出時刻</th>
          </tr>
        </thead>
        <tbody>
          {alerts.map((alert, idx) => {
            const config = EMOTION_CONFIG[alert.label];
            return (
              <tr key={idx}>
                <td style={{ color: config.color }} className="font-semibold text-sm">
                  {config.displayName}
                </td>
                <td className="text-sm">{Math.round(alert.score * 100)}%</td>
                <td className="text-xs text-el-muted">{formatTime(alert.timestamp)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
