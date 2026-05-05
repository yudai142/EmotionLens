/**
 * RootLayout コンポーネントのテスト
 * SPA レイアウトの基本構造と共通要素の確認
 */

import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import RootLayout from '../../src/layout/RootLayout';

describe('RootLayout コンポーネント', () => {
  it('RootLayout が正常に描画される', () => {
    render(
      <BrowserRouter>
        <RootLayout>
          <div>テストコンテンツ</div>
        </RootLayout>
      </BrowserRouter>
    );

    expect(screen.getByText('テストコンテンツ')).toBeInTheDocument();
  });

  it('data-theme="emotion-dark" 属性が設定される', () => {
    const { container } = render(
      <BrowserRouter>
        <RootLayout>
          <div>テストコンテンツ</div>
        </RootLayout>
      </BrowserRouter>
    );

    const rootElement = container.querySelector('[data-theme="emotion-dark"]');
    expect(rootElement).toBeInTheDocument();
  });

  it('min-h-screen クラスが適用される', () => {
    const { container } = render(
      <BrowserRouter>
        <RootLayout>
          <div>テストコンテンツ</div>
        </RootLayout>
      </BrowserRouter>
    );

    const layoutElement = container.querySelector('.min-h-screen');
    expect(layoutElement).toBeInTheDocument();
  });

  it('Tailwind DaisyUI テーマクラスが適用される', () => {
    const { container } = render(
      <BrowserRouter>
        <RootLayout>
          <div>テストコンテンツ</div>
        </RootLayout>
      </BrowserRouter>
    );

    const layoutElement = container.querySelector('.bg-base-100');
    expect(layoutElement).toBeInTheDocument();
  });
});
