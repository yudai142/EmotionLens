/**
 * EmotionLens メインアプリケーション
 * React Router SPA ルーティング設定
 */

import { Routes, Route } from 'react-router-dom';
import RootLayout from './layout/RootLayout';
import HomePage from './pages/HomePage';
import ReportPage from './pages/ReportPage';

function App() {
  return (
    <RootLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/report" element={<ReportPage />} />
      </Routes>
    </RootLayout>
  );
}

export default App;

