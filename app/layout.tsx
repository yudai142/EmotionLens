import type { Metadata } from 'next';
import './globals.css';
import { AuthNav } from '../components/layout/AuthNav';

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
      <body className="min-h-screen bg-base-100 text-base-content">
        <div className="flex justify-end border-b border-el-border bg-base-200 px-4 py-2">
          <AuthNav />
        </div>
        {children}
      </body>
    </html>
  );
}
