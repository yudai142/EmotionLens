import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'EmotionLens',
  description: '隠れた感情の変化をリアルタイムで可視化するアプリ',
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ja" data-theme="emotion-dark">
      <body className="min-h-screen bg-base-100 text-base-content">{children}</body>
    </html>
  );
}
