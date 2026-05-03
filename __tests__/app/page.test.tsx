/** @jest-environment jsdom */
/**
 * app/page.tsx のテスト
 * メイン画面が正しく構成要素を持つことを確認する
 */
import { render, screen } from '@testing-library/react';
import HomePage from '../../app/page';

// コンポーネント内で使う Hooks をモック
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

describe('HomePage', () => {
  it('ページが描画される（クラッシュしない）', () => {
    expect(() => render(<HomePage />)).not.toThrow();
  });

  it('Header が含まれる（アプリ名が表示される）', () => {
    render(<HomePage />);
    expect(screen.getByText('EmotionLens')).toBeInTheDocument();
  });

  it('開始ボタンが表示される', () => {
    render(<HomePage />);
    expect(screen.getByRole('button', { name: /開始/ })).toBeInTheDocument();
  });
});
