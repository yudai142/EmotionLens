/**
 * MirrorAppBadge コンポーネント
 * 検出されたミラーリングアプリのバッジを表示
 */

import React from 'react';
import { MirrorAppInfo } from '@/lib/window';

interface MirrorAppBadgeProps {
  app: MirrorAppInfo | null;
}

export function MirrorAppBadge({ app }: MirrorAppBadgeProps) {
  if (!app) {
    return null;
  }

  const getAppColor = (name: string) => {
    switch (name) {
      case 'zoom':
        return 'badge-info';
      case 'discord':
        return 'badge-primary';
      case 'teams':
        return 'badge-secondary';
      case 'meet':
        return 'badge-success';
      default:
        return 'badge-neutral';
    }
  };

  const getAppLabel = (name: string) => {
    switch (name) {
      case 'zoom':
        return 'Zoom';
      case 'discord':
        return 'Discord';
      case 'teams':
        return 'Teams';
      case 'meet':
        return 'Google Meet';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className={`badge ${getAppColor(app.name)} text-xs font-semibold`}>
      📱 {getAppLabel(app.name)}
    </div>
  );
}
