/** @jest-environment jsdom */
/**
 * useEmotionAnalysis フックのテスト
 * API Route 呼び出し・スコア更新・エラーハンドリングを検証する
 */
import { renderHook, act } from '@testing-library/react';
import { useEmotionAnalysis } from '../../hooks/useEmotionAnalysis';
import { EmotionScore } from '../../lib/types';

const mockScore: EmotionScore = {
  ANGRY: 0.1,
  ANXIOUS: 0.2,
  HAPPY: 0.3,
  NEUTRAL: 0.3,
  STRESSED: 0.05,
  HIDING: 0.05,
};

describe('useEmotionAnalysis', () => {
  let fetchMock: jest.Mock;

  beforeEach(() => {
    fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ score: mockScore }),
    } as Response);
    Object.defineProperty(globalThis, 'fetch', {
      writable: true,
      value: fetchMock,
    });
  });

  afterEach(() => {
    fetchMock.mockReset();
  });

  it('初期状態は voiceScore/faceScore/mergedScore が全て null', () => {
    const { result } = renderHook(() => useEmotionAnalysis());
    expect(result.current.voiceScore).toBeNull();
    expect(result.current.faceScore).toBeNull();
    expect(result.current.mergedScore).toBeNull();
    expect(result.current.isAnalyzing).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('analyzeVoice 後に voiceScore がセットされる', async () => {
    const { result } = renderHook(() => useEmotionAnalysis());
    await act(async () => {
      await result.current.analyzeVoice(new ArrayBuffer(8));
    });
    expect(result.current.voiceScore).toEqual(mockScore);
  });

  it('analyzeVoice が /api/analyze-voice に POST する', async () => {
    const { result } = renderHook(() => useEmotionAnalysis());
    await act(async () => {
      await result.current.analyzeVoice(new ArrayBuffer(8));
    });
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/analyze-voice',
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('analyzeFace 後に faceScore がセットされる', async () => {
    const { result } = renderHook(() => useEmotionAnalysis());
    await act(async () => {
      await result.current.analyzeFace('base64image');
    });
    expect(result.current.faceScore).toEqual(mockScore);
  });

  it('analyzeFace が /api/analyze-face に POST する', async () => {
    const { result } = renderHook(() => useEmotionAnalysis());
    await act(async () => {
      await result.current.analyzeFace('base64image');
    });
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/analyze-face',
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('音声・表情両方解析後に mergedScore がセットされる', async () => {
    const { result } = renderHook(() => useEmotionAnalysis());
    await act(async () => {
      await result.current.analyzeVoice(new ArrayBuffer(8));
    });
    await act(async () => {
      await result.current.analyzeFace('base64');
    });
    expect(result.current.mergedScore).not.toBeNull();
  });

  it('音声のみ解析後は mergedScore に voiceScore が反映される', async () => {
    const { result } = renderHook(() => useEmotionAnalysis());
    await act(async () => {
      await result.current.analyzeVoice(new ArrayBuffer(8));
    });
    expect(result.current.mergedScore).toEqual(mockScore);
  });

  it('API エラー時に error がセットされる', async () => {
    fetchMock.mockResolvedValueOnce({ ok: false, status: 500 } as Response);
    const { result } = renderHook(() => useEmotionAnalysis());
    await act(async () => {
      await result.current.analyzeVoice(new ArrayBuffer(8));
    });
    expect(result.current.error).toContain('500');
    expect(result.current.voiceScore).toBeNull();
  });

  it('fetch 例外時に error がセットされる', async () => {
    fetchMock.mockRejectedValueOnce(new Error('ネットワークエラー'));
    const { result } = renderHook(() => useEmotionAnalysis());
    await act(async () => {
      await result.current.analyzeVoice(new ArrayBuffer(8));
    });
    expect(result.current.error).toBe('ネットワークエラー');
  });
});
