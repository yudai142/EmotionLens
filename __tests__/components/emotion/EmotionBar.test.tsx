/** @jest-environment jsdom */
/**
 * EmotionBar コンポーネントのテスト
 */
import { render, screen } from '@testing-library/react';
import { EmotionBar } from '../../../components/emotion/EmotionBar';

describe('EmotionBar', () => {
  it('ラベルと値が表示される', () => {
    render(<EmotionBar label="ANGRY" value={0.6} />);
    expect(screen.getByText(/ANGRY|怒り/i)).toBeInTheDocument();
  });

  it('progress 要素が描画される', () => {
    const { container } = render(<EmotionBar label="HAPPY" value={0.4} />);
    expect(container.querySelector('progress')).not.toBeNull();
  });

  it('progress の value が渡した値に対応している', () => {
    const { container } = render(<EmotionBar label="NEUTRAL" value={0.5} />);
    const progress = container.querySelector('progress');
    expect(progress).not.toBeNull();
    expect(Number(progress?.getAttribute('value'))).toBeCloseTo(0.5, 2);
  });
});
