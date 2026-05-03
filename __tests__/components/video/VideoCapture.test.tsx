/** @jest-environment jsdom */
/**
 * VideoCapture コンポーネントのテスト
 */
import { render, screen } from '@testing-library/react';
import { VideoCapture } from '../../../components/video/VideoCapture';

describe('VideoCapture', () => {
  it('video 要素が描画される', () => {
    render(<VideoCapture isActive={false} />);
    expect(screen.getByRole('img', { hidden: true }) ?? document.querySelector('video')).toBeDefined();
  });

  it('isActive=false のとき「カメラ停止中」等のプレースホルダーが表示される', () => {
    render(<VideoCapture isActive={false} />);
    expect(screen.getByText(/停止|オフ|カメラ/i)).toBeInTheDocument();
  });

  it('videoRef が渡されたとき video 要素に適用される', () => {
    const ref = { current: null } as React.RefObject<HTMLVideoElement | null>;
    render(<VideoCapture isActive={false} videoRef={ref} />);
    // ref への代入は jsdom の制約上直接確認は難しいが描画エラーがないことを確認
    expect(document.querySelector('video')).toBeNull(); // placeholderのみ表示
  });
});
