/** @jest-environment jsdom */
/**
 * app/report/page.tsx のテスト
 * レポート画面が正しく構成要素を持つことを確認する
 */
import { render, screen } from '@testing-library/react';
import ReportPage from '../../../app/report/page';

// コンポーネント内で使う Hooks をモック
jest.mock('../../../hooks/useSessionStore', () => ({
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

  it('セッションデータがないとき「レポートデータなし」メッセージが表示される', () => {
    render(<ReportPage />);
    expect(screen.getByText('レポートデータなし')).toBeInTheDocument();
  });

  it('セッションデータがないときページタイトルが表示される', () => {
    render(<ReportPage />);
    // セッションデータなし時は h2 が表示される
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
  });
});
