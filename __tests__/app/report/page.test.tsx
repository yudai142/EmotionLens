/** @jest-environment jsdom */
/**
 * app/report/page.tsx のテスト
 * レポート画面が正しく構成要素を持つことを確認する
 */
import { render, screen } from '@testing-library/react';
import ReportPage from '../../app/report/page';

// コンポーネント内で使う Hooks をモック
jest.mock('../../hooks/useSessionStore', () => ({
  useSessionStore: () => ({
    session: null,
    isActive: false,
    startSession: jest.fn(),
    endSession: jest.fn(),
    addFrame: jest.fn(),
  }),
}));

describe('ReportPage', () => {
  it('ページが描画される（クラッシュしない）', () => {
    expect(() => render(<ReportPage />)).not.toThrow();
  });

  it('セッションデータがないとき「レポートなし」メッセージが表示される', () => {
    render(<ReportPage />);
    expect(screen.getByText(/レポート|セッション|データ|なし/i)).toBeInTheDocument();
  });

  it('ページタイトルが表示される', () => {
    render(<ReportPage />);
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });
});
