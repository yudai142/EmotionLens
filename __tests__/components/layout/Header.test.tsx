/** @jest-environment jsdom */
/**
 * Header コンポーネントのテスト
 */
import { fireEvent, render, screen } from '@testing-library/react';
import { Header } from '../../../components/layout/Header';

jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

describe('Header', () => {
  it('アプリ名 "EmotionLens" が表示される', () => {
    render(<Header isActive={false} onStart={jest.fn()} onStop={jest.fn()} authStatus="unauthenticated" />);
    expect(screen.getByText('EmotionLens')).toBeInTheDocument();
  });

  it('isActive=false のとき「開始」ボタンが表示される', () => {
    render(<Header isActive={false} onStart={jest.fn()} onStop={jest.fn()} authStatus="unauthenticated" />);
    expect(screen.getByRole('button', { name: /開始/ })).toBeInTheDocument();
  });

  it('isActive=true のとき「停止」ボタンが表示される', () => {
    render(<Header isActive={true} onStart={jest.fn()} onStop={jest.fn()} authStatus="unauthenticated" />);
    expect(screen.getByRole('button', { name: /停止/ })).toBeInTheDocument();
  });

  it('「開始」ボタンクリックで onStart が呼ばれる', () => {
    const onStart = jest.fn();
    render(<Header isActive={false} onStart={onStart} onStop={jest.fn()} authStatus="unauthenticated" />);
    screen.getByRole('button', { name: /開始/ }).click();
    expect(onStart).toHaveBeenCalledTimes(1);
  });

  it('「停止」ボタンクリックで onStop が呼ばれる', () => {
    const onStop = jest.fn();
    render(<Header isActive={true} onStart={jest.fn()} onStop={onStop} authStatus="unauthenticated" />);
    screen.getByRole('button', { name: /停止/ }).click();
    expect(onStop).toHaveBeenCalledTimes(1);
  });

  it('authStatus="loading" のとき確認中ボタンが表示される', () => {
    render(<Header isActive={false} onStart={jest.fn()} onStop={jest.fn()} authStatus="loading" />);
    expect(screen.getByRole('button', { name: /確認中/ })).toBeInTheDocument();
  });

  it('authStatus="unauthenticated" のときログインと新規登録ボタンが表示される', () => {
    render(<Header isActive={false} onStart={jest.fn()} onStop={jest.fn()} authStatus="unauthenticated" />);
    expect(screen.getByRole('link', { name: /ログイン/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /新規登録/ })).toBeInTheDocument();
  });

  it('authStatus="authenticated" のときログアウトボタンが表示される', () => {
    render(<Header isActive={false} onStart={jest.fn()} onStop={jest.fn()} authStatus="authenticated" />);
    expect(screen.getByRole('link', { name: /ログアウト/ })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /ログイン/ })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /新規登録/ })).not.toBeInTheDocument();
  });

  it('ログインリンクが /login にポイントしている', () => {
    render(<Header isActive={false} onStart={jest.fn()} onStop={jest.fn()} authStatus="unauthenticated" />);
    const loginLink = screen.getByRole('link', { name: /ログイン/ }) as HTMLAnchorElement;
    expect(loginLink.href).toContain('/login');
  });

  it('新規登録リンクが /signup にポイントしている', () => {
    render(<Header isActive={false} onStart={jest.fn()} onStop={jest.fn()} authStatus="unauthenticated" />);
    fireEvent.click(screen.getByRole('button', { name: /新規登録/ }));
    expect(screen.getByRole('heading', { name: '新規登録' })).toBeInTheDocument();
    expect(screen.getByLabelText('メールアドレス')).toBeInTheDocument();
    expect(screen.getByLabelText('パスワード')).toBeInTheDocument();
  });

  it('ログアウトリンクが /api/auth/signout にポイントしている', () => {
    render(<Header isActive={false} onStart={jest.fn()} onStop={jest.fn()} authStatus="authenticated" />);
    const logoutLink = screen.getByRole('link', { name: /ログアウト/ }) as HTMLAnchorElement;
    expect(logoutLink.href).toContain('/api/auth/signout');
  });
});
