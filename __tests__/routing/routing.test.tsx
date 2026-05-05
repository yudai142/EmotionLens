/**
 * React Router SPA ルーティング統合テスト
 * ルーティング設定とページナビゲーションの動作確認
 */

import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '../../src/App';

// fetch モックの設定
const mockFetch = jest.fn() as jest.MockedFunction<typeof fetch>;
global.fetch = mockFetch;

function jsonResponse(status: number, body: unknown): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  } as Response;
}

// 各 Hooks をモック
jest.mock('../../hooks/useVideoCapture', () => ({
  useVideoCapture: () => ({
    isCapturing: false,
    error: null,
    videoRef: { current: null },
    start: jest.fn(),
    stop: jest.fn(),
  }),
}));

jest.mock('../../hooks/useAudioCapture', () => ({
  useAudioCapture: () => ({
    isCapturing: false,
    error: null,
    start: jest.fn(),
    stop: jest.fn(),
  }),
}));

jest.mock('../../hooks/useEmotionAnalysis', () => ({
  useEmotionAnalysis: () => ({
    voiceScore: null,
    faceScore: null,
    mergedScore: null,
    isAnalyzing: false,
    error: null,
    analyzeVoice: jest.fn(),
    analyzeFace: jest.fn(),
  }),
}));

jest.mock('../../hooks/useEmotionAlerts', () => ({
  useEmotionAlerts: () => ({
    alerts: [],
    latestAlert: null,
    addScore: jest.fn(),
    clearAlerts: jest.fn(),
  }),
}));

jest.mock('../../hooks/useSessionStore', () => ({
  useSessionStore: () => ({
    session: null,
    isActive: false,
    startSession: jest.fn(),
    endSession: jest.fn(),
    addFrame: jest.fn(),
  }),
}));

describe('React Router SPA ルーティング', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it('/ ルートでホームページが描画される', () => {
    mockFetch.mockImplementation(() => new Promise(() => undefined));

    render(
      <BrowserRouter initialEntries={['/']}>
        <App />
      </BrowserRouter>
    );

    // ホームページに特有の要素（Header など）が表示されることを確認
    expect(screen.getByText('EmotionLens')).toBeInTheDocument();
  });

  it('ホームページに開始ボタンが表示される', () => {
    mockFetch.mockImplementation(() => new Promise(() => undefined));

    render(
      <BrowserRouter initialEntries={['/']}>
        <App />
      </BrowserRouter>
    );

    expect(screen.getByRole('button', { name: /開始/ })).toBeInTheDocument();
  });

  it('/report ルートでレポートページが描画される', async () => {
    mockFetch.mockResolvedValue(jsonResponse(200, { session: {} }));

    render(
      <BrowserRouter initialEntries={['/report']}>
        <App />
      </BrowserRouter>
    );

    // レポートページが読み込み中状態を表示
    await waitFor(() => {
      expect(screen.getByText('レポート')).toBeInTheDocument();
    });
  });

  it('サイドバーにアラート履歴が表示される', () => {
    mockFetch.mockImplementation(() => new Promise(() => undefined));

    render(
      <BrowserRouter initialEntries={['/']}>
        <App />
      </BrowserRouter>
    );

    // Sidebar コンポーネントが描画されることを確認
    expect(screen.getByRole('complementary')).toBeInTheDocument();
  });
});
