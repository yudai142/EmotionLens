/** @jest-environment jsdom */
/**
 * Sidebar コンポーネントのテスト
 */
import { render, screen } from '@testing-library/react';
import { Sidebar } from '../../../components/layout/Sidebar';
import { EmotionAlert } from '../../../lib/types';

const mockAlerts: EmotionAlert[] = [
  { label: 'ANGRY', score: 0.8, timestamp: 1000 },
  { label: 'ANXIOUS', score: 0.7, timestamp: 2000 },
];

describe('Sidebar', () => {
  it('アラートがない場合は「アラートなし」と表示される', () => {
    render(<Sidebar alerts={[]} />);
    expect(screen.getByText(/アラートなし/)).toBeInTheDocument();
  });

  it('アラートが渡されると感情ラベルが表示される', () => {
    render(<Sidebar alerts={mockAlerts} />);
    expect(screen.getByText(/ANGRY|怒り/i)).toBeInTheDocument();
  });

  it('複数アラートがある場合に全件表示される', () => {
    render(<Sidebar alerts={mockAlerts} />);
    const items = screen.getAllByRole('listitem');
    expect(items.length).toBeGreaterThanOrEqual(2);
  });
});
