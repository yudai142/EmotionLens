/** @jest-environment jsdom */
/**
 * components/report/KpiCards.tsx のテスト
 * KPI カード群の表示と計算確認
 */
import { render, screen } from '@testing-library/react';
import { KpiCards } from '../../../components/report/KpiCards';
import type { SessionData } from '../../../lib/types';

describe('KpiCards', () => {
  const mockSession: SessionData = {
    sessionId: 'test-session-001',
    startedAt: 1000,
    frames: [
      {
        timestamp: 1000,
        merged: {
          ANGRY: 0.2,
          ANXIOUS: 0.1,
          HAPPY: 0.5,
          NEUTRAL: 0.1,
          STRESSED: 0.05,
          HIDING: 0.05,
        },
        alerts: [],
      },
      {
        timestamp: 2000,
        merged: {
          ANGRY: 0.1,
          ANXIOUS: 0.2,
          HAPPY: 0.4,
          NEUTRAL: 0.2,
          STRESSED: 0.05,
          HIDING: 0.05,
        },
        alerts: [{ label: 'ANXIOUS', score: 0.8, timestamp: 2000 }],
      },
    ],
    allAlerts: [{ label: 'ANXIOUS', score: 0.8, timestamp: 2000 }],
  };

  it('セッションデータがないとき何も表示しない', () => {
    const { container } = render(<KpiCards session={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('KPI カード（stat）が複数表示される', () => {
    render(<KpiCards session={mockSession} />);
    // DaisyUI `stat` クラスが複数ある
    const stats = document.querySelectorAll('.stat');
    expect(stats.length).toBeGreaterThan(0);
  });

  it('セッション時間が計算・表示される', () => {
    render(<KpiCards session={mockSession} />);
    // "1s" または同様のフォーマットで時間が表示される
    expect(screen.getByText(/^\d+s$/)).toBeInTheDocument();
  });

  it('アラート件数が表示される', () => {
    render(<KpiCards session={mockSession} />);
    const alertTexts = screen.getAllByText('1');
    expect(alertTexts.length).toBeGreaterThan(0);
  });

  it('最大スコア感情が表示される', () => {
    render(<KpiCards session={mockSession} />);
    // HAPPY が最大スコア（平均）なので喜びが表示されるはず
    expect(screen.getByText('喜び')).toBeInTheDocument();
  });
});
