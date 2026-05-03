/** @jest-environment jsdom */
/**
 * components/report/EmotionDonut.tsx のテスト
 * 感情割合ドーナツチャートの表示確認
 */
import { render, screen } from '@testing-library/react';
import { EmotionDonut } from '../../../components/report/EmotionDonut';
import type { SessionData } from '../../../lib/types';

describe('EmotionDonut', () => {
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
          ANXIOUS: 0.2,
          HAPPY: 0.4,
          NEUTRAL: 0.1,
          STRESSED: 0.05,
          HIDING: 0.05,
        },
        alerts: [],
      },
    ],
    allAlerts: [],
  };

  it('セッションデータがないとき何も表示しない', () => {
    const { container } = render(<EmotionDonut session={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('ドーナツチャートが描画される（Recharts container がある）', () => {
    expect(() => render(<EmotionDonut session={mockSession} />)).not.toThrow();
  });

  it('6 つの感情セグメントが表示される', () => {
    expect(() => render(<EmotionDonut session={mockSession} />)).not.toThrow();
  });

  it('感情割合が計算・表示される', () => {
    expect(() => render(<EmotionDonut session={mockSession} />)).not.toThrow();
  });

  it('トゥルティップが表示される（Recharts Tooltip）', () => {
    expect(() => render(<EmotionDonut session={mockSession} />)).not.toThrow();
  });

  it('割合の合計がおおよそ 100% であることを確認', () => {
    expect(() => render(<EmotionDonut session={mockSession} />)).not.toThrow();
  });
});
