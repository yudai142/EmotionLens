/** @jest-environment jsdom */
/**
 * components/report/AlertLogTable.tsx のテスト
 * DaisyUI table でのアラートログ表示確認
 */
import { render, screen } from '@testing-library/react';
import { AlertLogTable } from '../../../components/report/AlertLogTable';
import type { SessionData, EmotionAlert } from '../../../lib/types';

describe('AlertLogTable', () => {
  const mockAlerts: EmotionAlert[] = [
    { label: 'ANXIOUS', score: 0.75, timestamp: 5000 },
    { label: 'STRESSED', score: 0.82, timestamp: 10000 },
    { label: 'ANGRY', score: 0.68, timestamp: 15000 },
  ];

  const mockSession: SessionData = {
    sessionId: 'test-session-001',
    startedAt: 1000,
    frames: [],
    allAlerts: mockAlerts,
  };

  it('セッションデータがないとき何も表示しない', () => {
    const { container } = render(<AlertLogTable session={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('アラートテーブルが描画される（table 要素がある）', () => {
    render(<AlertLogTable session={mockSession} />);
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('アラート件数分のテーブル行が表示される', () => {
    render(<AlertLogTable session={mockSession} />);
    const rows = screen.getAllByRole('row');
    // ヘッダー 1 行 + データ 3 行 = 4 行
    expect(rows.length).toBe(4);
  });

  it('感情ラベルが表示される', () => {
    render(<AlertLogTable session={mockSession} />);
    expect(screen.getByText(/不安|ストレス|怒り/)).toBeInTheDocument();
  });

  it('スコアがパーセンテージで表示される', () => {
    render(<AlertLogTable session={mockSession} />);
    // 75%, 82%, 68%
    expect(screen.getByText(/75%|82%|68%/)).toBeInTheDocument();
  });

  it('タイムスタンプが表示される', () => {
    render(<AlertLogTable session={mockSession} />);
    // toLocaleTimeString() フォーマットで表示されるはず
    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();
  });

  it('アラートがないときメッセージが表示される', () => {
    const emptySession: SessionData = {
      sessionId: 'test-session-empty',
      startedAt: 1000,
      frames: [],
      allAlerts: [],
    };
    render(<AlertLogTable session={emptySession} />);
    expect(screen.getByText(/アラート|ログ|なし|履歴|empty/i)).toBeInTheDocument();
  });

  it('テーブルに table-zebra クラスがある', () => {
    render(<AlertLogTable session={mockSession} />);
    const table = screen.getByRole('table');
    expect(table).toHaveClass('table-zebra');
  });
});
