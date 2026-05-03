'use client';

/**
 * Sidebar コンポーネント
 * 直近アラート履歴を縦スクロールで表示する
 */

import { EmotionAlert } from '../../lib/types';
import { EMOTION_CONFIG } from '../../constants/emotions';

interface SidebarProps {
  alerts: EmotionAlert[];
}

export function Sidebar({ alerts }: SidebarProps) {
  return (
    <aside className="flex h-full w-64 flex-col gap-3 overflow-y-auto border-r border-el-border bg-base-200 p-4">
      <h2 className="text-sm font-semibold uppercase tracking-widest text-el-muted">
        アラート履歴
      </h2>
      {alerts.length === 0 ? (
        <p className="text-sm text-el-muted">アラートなし</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {alerts.map((alert, i) => {
            const config = EMOTION_CONFIG[alert.label];
            return (
              <li key={i} className="flex items-center gap-2 text-sm">
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ backgroundColor: config.color }}
                />
                <span className="font-medium" style={{ color: config.color }}>
                  {config.displayName}
                </span>
                <span className="ml-auto text-el-muted text-xs">
                  {Math.round(alert.score * 100)}%
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </aside>
  );
}
