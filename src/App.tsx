/**
 * EmotionLens メインアプリケーション
 * Tauri ネイティブアプリケーション
 */

import { useState } from 'react'
import { invoke } from '@tauri-apps/api/tauri'
import { PermissionsPrompt } from './components/macOS/PermissionsPrompt'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userId, setUserId] = useState<number | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emotionLabel, setEmotionLabel] = useState('NEUTRAL')
  const [confidenceScore, setConfidenceScore] = useState(0.5)
  const [message, setMessage] = useState('')

  // ログイン処理
  const handleLogin = async () => {
    try {
      const response = await invoke<{
        success: boolean
        user_id?: number
        token?: string
        message: string
      }>('login', { email, password })

      if (response.success && response.user_id) {
        setIsLoggedIn(true)
        setUserId(response.user_id)
        setMessage(`ようこそ！ユーザーID: ${response.user_id}`)
        setEmail('')
        setPassword('')
      } else {
        setMessage(response.message)
      }
    } catch (error) {
      setMessage(`エラー: ${error}`)
    }
  }

  // 感情ログ記録
  const handleRecordEmotion = async () => {
    if (!userId) {
      setMessage('ログインしてください')
      return
    }

    try {
      const response = await invoke<{
        success: boolean
        log_id?: number
        message: string
      }>('record_emotion', {
        user_id: userId,
        emotion_label: emotionLabel,
        confidence_score: confidenceScore,
        video_data: null,
      })

      if (response.success) {
        setMessage(`✅ 感情ログを記録しました (ID: ${response.log_id})`)
      } else {
        setMessage(response.message)
      }
    } catch (error) {
      setMessage(`エラー: ${error}`)
    }
  }

  // ログアウト
  const handleLogout = () => {
    setIsLoggedIn(false)
    setUserId(null)
    setEmail('')
    setPassword('')
    setMessage('ログアウトしました')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-black text-white">
      <PermissionsPrompt />

      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-2xl p-8">
          <h1 className="text-4xl font-bold mb-2 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
            EmotionLens
          </h1>
          <p className="text-center text-gray-400 mb-8">
            ビデオ会議中の感情をリアルタイム解析
          </p>

          {!isLoggedIn ? (
            // ログイン画面
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">メールアドレス</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="test@emotionlens.app"
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">パスワード</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="パスワード"
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <button
                onClick={handleLogin}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 font-bold py-2 px-4 rounded-lg transition"
              >
                ログイン
              </button>

              <p className="text-sm text-gray-400 text-center">
                テスト: test@emotionlens.app / password
              </p>
            </div>
          ) : (
            // ログイン後の画面
            <div className="space-y-4">
              <p className="text-center text-green-400 font-semibold">
                ✅ ログイン済み (ユーザーID: {userId})
              </p>

              <div className="border-t border-gray-700 pt-4">
                <h2 className="text-xl font-bold mb-4">感情を記録</h2>

                <div>
                  <label className="block text-sm font-medium mb-2">感情ラベル</label>
                  <select
                    value={emotionLabel}
                    onChange={(e) => setEmotionLabel(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option>NEUTRAL</option>
                    <option>HAPPY</option>
                    <option>ANGRY</option>
                    <option>ANXIOUS</option>
                    <option>STRESSED</option>
                    <option>HIDING</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    信頼度: {(confidenceScore * 100).toFixed(0)}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={confidenceScore}
                    onChange={(e) => setConfidenceScore(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>

                <button
                  onClick={handleRecordEmotion}
                  className="w-full bg-green-600 hover:bg-green-700 font-bold py-2 px-4 rounded-lg transition mt-4"
                >
                  📊 感情ログを記録
                </button>
              </div>

              <button
                onClick={handleLogout}
                className="w-full bg-gray-600 hover:bg-gray-700 font-bold py-2 px-4 rounded-lg transition"
              >
                ログアウト
              </button>
            </div>
          )}

          {message && (
            <div className="mt-4 p-3 bg-blue-900 border border-blue-500 rounded-lg text-sm text-blue-100">
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
