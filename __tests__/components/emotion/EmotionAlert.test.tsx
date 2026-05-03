/** @jest-environment jsdom */
/**
 * EmotionAlert コンポーネントのテスト
 */
import { render, screen } from '@testing-library/react';
import { EmotionAlertBanner } from '../../../components/emotion/EmotionAlert';
import { EmotionAlert } from '../../../lib/types';

const mockAlert: EmotionAlert = {
  label: 'STRESSED',
  score: 0.82,
  timestamp: Date.now(),
};

describe('EmotionAlertBanner', () => {
  it('alert が null のとき何も表示しない', () => {
    const { container } = render(<EmotionAlertBanner alert={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('alert が渡されると感情ラベルが表示される', () => {
    render(<EmotionAlertBanner alert={mockAlert} />);
    expect(screen.getByText(/STRESSED|ストレス/i)).toBeInTheDocument();
  });

  it('スコア値が表示される', () => {
    render(<EmotionAlertBanner alert={mockAlert} />);
    expect(screen.getByText(/82%|0\.82/)).toBeInTheDocument();
  });

  it('DaisyUI alert クラスが付与されている', () => {
    const { container } = render(<EmotionAlertBanner alert={mockAlert} />);
    expect(container.querySelector('.alert')).not.toBeNull();
  });
});
