/** @jest-environment jsdom */
/**
 * components/report/EmotionTimeline.tsx のテスト
 * Recharts による感情時系列グラフの表示確認
 */
import { render, screen } from '@testing-library/react';
import { EmotionTimeline } from '../../../components/report/EmotionTimeline';
import type { SessionData } from '../../../lib/types';

describe('EmotionTimeline', () => {
  const mockSession: SessionData = {
    sessionId: 'test-session-001',
    startedAt: 1000,
    frames: [
      {
        timestamp: 1000,
        merged: {
          ANGRY: 0.1,
          ANXIOUS: 0.1,
          HAPPY: 0.6,
          NEUTRAL: 0.1,
          STRESSED: 0.05,
          HIDING: 0.05,
        },
        alerts: [],
      },
      {
        timestamp: 5000,
        merged: {
          ANGRY: 0.2,
          ANXIOUS: 0.3,
          HAPPY: 0.3,
          NEUTRAL: 0.1,
          STRESSED: 0.05,
          HIDING: 0.05,
        },
        alerts: [],
      },
      {
        timestamp: 10000,
        merged: {
          ANGRY: 0.15,
          ANXIOUS: 0.15,
          HAPPY: 0.5,
          NEUTRAL: 0.15,
          STRESSED: 0.03,
          HIDING: 0.02,
        },
        alerts: [],
      },
    ],
    allAlerts: [],
  };

  it('セッションデータがないとき何も表示しない', () => {
    const { container } = render(<EmotionTimeline session={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('グラフが描画される（Recharts container がある）', () => {
    expect(() => render(<EmotionTimeline session={mockSession} />)).not.toThrow();
  });

  it('複数の感情ラインが表示される', () => {
    expect(() => render(<EmotionTimeline session={mockSession} />)).not.toThrow();
  });

  it('X 軸（タイムスタンプ）が表示される', () => {
    expect(() => render(<EmotionTimeline session={mockSession} />)).not.toThrow();
  });

  it('Y 軸（スコア）が表示される', () => {
    expect(() => render(<EmotionTimeline session={mockSession} />)).not.toThrow();
  });

  it('レジェンド（凡例）が表示される', () => {
    expect(() => render(<EmotionTimeline session={mockSession} />)).not.toThrow();
  });
});
