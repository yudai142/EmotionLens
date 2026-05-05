/**
 * RootLayout コンポーネント
 * SPA レイアウトの基本構造を定義
 */

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <div data-theme="emotion-dark" className="min-h-screen bg-base-100 text-base-content">
      {children}
    </div>
  );
}
