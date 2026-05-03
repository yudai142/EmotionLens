/** @jest-environment jsdom */
/**
 * EmotionBadge コンポーネントのテスト
 */
import { render, screen } from '@testing-library/react';
import { EmotionBadge } from '../../../components/video/EmotionBadge';
import { EmotionScore } from '../../../lib/types';

const mockScore: EmotionScore = {
  ANGRY: 0.7,
  ANXIOUS: 0.1,
  HAPPY: 0.1,
  NEUTRAL: 0.05,
  STRESSED: 0.03,
  HIDING: 0.02,
};

describe('EmotionBadge', () => {
  it('score が null のとき何も表示しない（または空）', () => {
    const { container } = render(<EmotionBadge score={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('スコアが渡されると最大スコアのラベルが表示される', () => {
    render(<EmotionBadge score={mockScore} />);
    expect(screen.getByText(/ANGRY|怒り/i)).toBeInTheDocument();
  });

  it('スコア値がパーセント表示で示される', () => {
    render(<EmotionBadge score={mockScore} />);
    expect(screen.getByText(/70%|0\.7/)).toBeInTheDocument();
  });
});
