/**
 * EmotionLens メインアプリケーション
 * Tauri ネイティブアプリケーション
 */

import { PermissionsPrompt } from './components/macOS/PermissionsPrompt';

function App() {
  return (
    <div className="min-h-screen bg-emotion-dark text-white">
      <PermissionsPrompt />
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-4xl font-bold mb-4">EmotionLens</h1>
        <p className="text-lg mb-2">ビデオ会議中の感情をリアルタイム解析</p>
        <p className="text-gray-400">セットアップ中...</p>
      </div>
    </div>
  );
}

export default App;
