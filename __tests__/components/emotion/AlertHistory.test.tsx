/** @jest-environment jsdom */
/**
 * AlertHistory コンポーネントのテスト
 */
import { render, screen } from '@testing-library/react';
import { AlertHistory } from '../../../components/emotion/AlertHistory';
import { EmotionAlert } from '../../../lib/types';

const mockAlerts: EmotionAlert[] = [
  { label: 'ANGRY', score: 0.8, timestamp: 1000 },
  { label: 'STRESSED', score: 0.7, timestamp: 2000 },
  { label: 'ANXIOUS', score: 0.65, timestamp: 3000 },
];

describe('AlertHistory', () => {
  it('アラートが空のとき「履歴なし」等が表示される', () => {
    render(<AlertHistory alerts={[]} />);
    expect(screen.getByText(/履歴なし|なし|empty/i)).toBeInTheDocument();
  });

  it('アラートが渡されると件数分のリスト項目が表示される', () => {
    render(<AlertHistory alerts={mockAlerts} />);
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(mockAlerts.length);
  });

  it('各アラートの感情ラベルが表示される', () => {
    render(<AlertHistory alerts={mockAlerts} />);
    expect(screen.getByText(/ANGRY|怒り/i)).toBeInTheDocument();
    expect(screen.getByText(/STRESSED|ストレス/i)).toBeInTheDocument();
  });

  it('タイムスタンプが人読み可能な形式で表示される', () => {
    render(<AlertHistory alerts={mockAlerts} />);
    // 数値の timestamp がそのまま表示されていないことを確認
    expect(screen.queryByText('1000')).toBeNull();
  });
});
