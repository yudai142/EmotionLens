/** @jest-environment jsdom */
/**
 * app/page.tsx のテスト
 * メイン画面の認証状態と保存フローを確認する
 */
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import HomePage from '../../app/page';
import type { SessionData } from '../../lib/types';

const mockStartVideo = jest.fn();
const mockStopVideo = jest.fn();
const mockStartAudio = jest.fn();
const mockStopAudio = jest.fn();
const mockAnalyzeVoice = jest.fn();
const mockAnalyzeFace = jest.fn();
const mockAddScore = jest.fn();
const mockClearAlerts = jest.fn();
const mockStartSession = jest.fn();
const mockEndSession = jest.fn<SessionData | null, []>();
const mockAddFrame = jest.fn();

const sampleSession: SessionData = {
  sessionId: 'session-1',
  startedAt: 1710000000000,
  frames: [],
  allAlerts: [],
};

const mockSessionStore = {
  session: null as SessionData | null,
  isActive: false,
  startSession: mockStartSession,
  endSession: mockEndSession,
  addFrame: mockAddFrame,
};

function jsonResponse(status: number, body: unknown): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  } as Response;
}

// コンポーネント内で使う Hooks をモック
jest.mock('../../hooks/useVideoCapture', () => ({
  useVideoCapture: () => ({
    isCapturing: false,
    error: null,
    videoRef: { current: null },
    start: mockStartVideo,
    stop: mockStopVideo,
  }),
}));

jest.mock('../../hooks/useAudioCapture', () => ({
  useAudioCapture: () => ({
    isCapturing: false,
    error: null,
    start: mockStartAudio,
    stop: mockStopAudio,
  }),
}));

jest.mock('../../hooks/useEmotionAnalysis', () => ({
  useEmotionAnalysis: () => ({
    voiceScore: null,
    faceScore: null,
    mergedScore: null,
    isAnalyzing: false,
    error: null,
    analyzeVoice: mockAnalyzeVoice,
    analyzeFace: mockAnalyzeFace,
  }),
}));

jest.mock('../../hooks/useEmotionAlerts', () => ({
  useEmotionAlerts: () => ({
    alerts: [],
    latestAlert: null,
    addScore: mockAddScore,
    clearAlerts: mockClearAlerts,
  }),
}));

jest.mock('../../hooks/useSessionStore', () => ({
  useSessionStore: () => mockSessionStore,
}));

describe('HomePage', () => {
  const fetchMock = jest.fn() as jest.MockedFunction<typeof fetch>;

  beforeEach(() => {
    mockSessionStore.session = null;
    mockSessionStore.isActive = false;
    mockEndSession.mockReset();
    fetchMock.mockReset();
    global.fetch = fetchMock;
  });

  it('ページが描画される（クラッシュしない）', () => {
    fetchMock.mockImplementation(() => new Promise(() => undefined));
    expect(() => render(<HomePage />)).not.toThrow();
  });

  it('Header が含まれる（アプリ名が表示される）', () => {
    fetchMock.mockImplementation(() => new Promise(() => undefined));
    render(<HomePage />);
    expect(screen.getByText('EmotionLens')).toBeInTheDocument();
  });

  it('開始ボタンが表示される', () => {
    fetchMock.mockImplementation(() => new Promise(() => undefined));
    render(<HomePage />);
    expect(screen.getByRole('button', { name: /開始/ })).toBeInTheDocument();
  });

  it('未ログイン時は保存不可メッセージを表示する', async () => {
    fetchMock.mockResolvedValue(jsonResponse(401, { error: 'Unauthorized' }));

    render(<HomePage />);

    await waitFor(() => {
      expect(screen.getByText('ログインするとセッションを保存できます')).toBeInTheDocument();
    });
  });

  it('ログイン中に停止すると保存 API を呼ぶ', async () => {
    mockSessionStore.isActive = true;
    mockEndSession.mockReturnValue(sampleSession);
    fetchMock
      .mockResolvedValueOnce(jsonResponse(200, { user: { id: 'user-1', email: 'demo@example.com' } }))
      .mockResolvedValueOnce(jsonResponse(200, { sessionId: sampleSession.sessionId }));

    render(<HomePage />);

    const stopButton = await screen.findByRole('button', { name: '停止' });
    fireEvent.click(stopButton);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        '/api/sessions',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ session: sampleSession }),
        }),
      );
    });
  });

  it('保存失敗時はエラーメッセージを表示する', async () => {
    mockSessionStore.isActive = true;
    mockEndSession.mockReturnValue(sampleSession);
    fetchMock
      .mockResolvedValueOnce(jsonResponse(200, { user: { id: 'user-1', email: 'demo@example.com' } }))
      .mockResolvedValueOnce(jsonResponse(500, { error: 'Failed to save session.' }));

    render(<HomePage />);

    const stopButton = await screen.findByRole('button', { name: '停止' });
    fireEvent.click(stopButton);

    await waitFor(() => {
      expect(screen.getByText('セッションの保存に失敗しました')).toBeInTheDocument();
    });
  });
});
