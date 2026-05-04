/** @jest-environment jsdom */
/**
 * app/login/page.tsx のテスト
 * ログイン導線の最小 UI を検証する
 */

import { render, screen } from '@testing-library/react';

jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
}));

import LoginPage from '../../../app/login/page';

describe('LoginPage', () => {
  it('ログイン見出しが表示される', () => {
    render(<LoginPage />);
    expect(screen.getByRole('heading', { name: 'ログイン' })).toBeInTheDocument();
  });

  it('メールアドレスとパスワードの入力欄が表示される', () => {
    render(<LoginPage />);
    expect(screen.getByLabelText('メールアドレス')).toBeInTheDocument();
    expect(screen.getByLabelText('パスワード')).toBeInTheDocument();
  });

  it('送信ボタンが表示される', () => {
    render(<LoginPage />);
    expect(screen.getByRole('button', { name: 'ログインする' })).toBeInTheDocument();
  });
});