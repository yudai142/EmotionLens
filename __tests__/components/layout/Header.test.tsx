/** @jest-environment jsdom */
/**
 * Header コンポーネントのテスト
 */
import { render, screen } from '@testing-library/react';
import { Header } from '../../../components/layout/Header';

describe('Header', () => {
  it('アプリ名 "EmotionLens" が表示される', () => {
    render(<Header isActive={false} onStart={jest.fn()} onStop={jest.fn()} />);
    expect(screen.getByText('EmotionLens')).toBeInTheDocument();
  });

  it('isActive=false のとき「開始」ボタンが表示される', () => {
    render(<Header isActive={false} onStart={jest.fn()} onStop={jest.fn()} />);
    expect(screen.getByRole('button', { name: /開始/ })).toBeInTheDocument();
  });

  it('isActive=true のとき「停止」ボタンが表示される', () => {
    render(<Header isActive={true} onStart={jest.fn()} onStop={jest.fn()} />);
    expect(screen.getByRole('button', { name: /停止/ })).toBeInTheDocument();
  });

  it('「開始」ボタンクリックで onStart が呼ばれる', () => {
    const onStart = jest.fn();
    render(<Header isActive={false} onStart={onStart} onStop={jest.fn()} />);
    screen.getByRole('button', { name: /開始/ }).click();
    expect(onStart).toHaveBeenCalledTimes(1);
  });

  it('「停止」ボタンクリックで onStop が呼ばれる', () => {
    const onStop = jest.fn();
    render(<Header isActive={true} onStart={jest.fn()} onStop={onStop} />);
    screen.getByRole('button', { name: /停止/ }).click();
    expect(onStop).toHaveBeenCalledTimes(1);
  });
});
