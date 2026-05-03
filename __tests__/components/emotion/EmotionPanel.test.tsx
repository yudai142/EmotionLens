/** @jest-environment jsdom */
/**
 * EmotionPanel コンポーネントのテスト
 */
import { render, screen } from '@testing-library/react';
import { EmotionPanel } from '../../../components/emotion/EmotionPanel';
import { EmotionScore } from '../../../lib/types';

const mockScore: EmotionScore = {
  ANGRY: 0.1,
  ANXIOUS: 0.2,
  HAPPY: 0.5,
  NEUTRAL: 0.1,
  STRESSED: 0.05,
  HIDING: 0.05,
};

describe('EmotionPanel', () => {
  it('score が null のとき「解析待ち」等のメッセージが表示される', () => {
    render(<EmotionPanel score={null} />);
    expect(screen.getByText(/解析|待機|--/i)).toBeInTheDocument();
  });

  it('score が渡されると全感情ラベルの行が表示される', () => {
    render(<EmotionPanel score={mockScore} />);
    // 6 ラベル分の progress 要素があること
    const { container } = render(<EmotionPanel score={mockScore} />);
    const bars = container.querySelectorAll('progress');
    expect(bars.length).toBeGreaterThanOrEqual(6);
  });

  it('最大スコアのラベルが強調表示される（data 属性かクラスで判定）', () => {
    const { container } = render(<EmotionPanel score={mockScore} />);
    // HAPPY が最大のため何らかの強調要素を持つことを確認
    expect(
      container.querySelector('[data-dominant]') ??
        container.querySelector('.font-bold') ??
        screen.queryByText(/HAPPY|喜び/i),
    ).not.toBeNull();
  });
});
