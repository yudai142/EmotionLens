/** @jest-environment jsdom */
/**
 * useSessionStore フックのテスト
 * セッション開始・終了・フレーム蓄積を検証する
 */
import { renderHook, act } from '@testing-library/react';
import { useSessionStore } from '../../hooks/useSessionStore';
import { EmotionFrame } from '../../lib/types';

const mockFrame: EmotionFrame = {
  timestamp: 1000,
  merged: {
    ANGRY: 0.1,
    ANXIOUS: 0.1,
    HAPPY: 0.5,
    NEUTRAL: 0.2,
    STRESSED: 0.05,
    HIDING: 0.05,
  },
  alerts: [],
};

const frameWithAlert: EmotionFrame = {
  ...mockFrame,
  alerts: [{ label: 'ANGRY', score: 0.8, timestamp: 1000 }],
};

describe('useSessionStore', () => {
  it('初期状態は session=null、isActive=false', () => {
    const { result } = renderHook(() => useSessionStore());
    expect(result.current.session).toBeNull();
    expect(result.current.isActive).toBe(false);
  });

  it('startSession でセッションが開始され isActive=true になる', () => {
    const { result } = renderHook(() => useSessionStore());
    act(() => {
      result.current.startSession();
    });
    expect(result.current.session).not.toBeNull();
    expect(result.current.isActive).toBe(true);
  });

  it('startSession でセッションID と startedAt が設定される', () => {
    const { result } = renderHook(() => useSessionStore());
    act(() => {
      result.current.startSession();
    });
    expect(result.current.session?.sessionId).toBeDefined();
    expect(typeof result.current.session?.sessionId).toBe('string');
    expect(result.current.session?.startedAt).toBeGreaterThan(0);
  });

  it('startSession で frames=[]、allAlerts=[] で初期化される', () => {
    const { result } = renderHook(() => useSessionStore());
    act(() => {
      result.current.startSession();
    });
    expect(result.current.session?.frames).toHaveLength(0);
    expect(result.current.session?.allAlerts).toHaveLength(0);
  });

  it('addFrame でフレームが蓄積される', () => {
    const { result } = renderHook(() => useSessionStore());
    act(() => {
      result.current.startSession();
    });
    act(() => {
      result.current.addFrame(mockFrame);
    });
    expect(result.current.session?.frames).toHaveLength(1);
    expect(result.current.session?.frames[0]).toEqual(mockFrame);
  });

  it('addFrame でフレームの alerts が allAlerts にも追加される', () => {
    const { result } = renderHook(() => useSessionStore());
    act(() => {
      result.current.startSession();
    });
    act(() => {
      result.current.addFrame(frameWithAlert);
    });
    expect(result.current.session?.allAlerts).toHaveLength(1);
    expect(result.current.session?.allAlerts[0].label).toBe('ANGRY');
  });

  it('複数フレームを追加できる', () => {
    const { result } = renderHook(() => useSessionStore());
    act(() => {
      result.current.startSession();
    });
    act(() => {
      result.current.addFrame(mockFrame);
      result.current.addFrame(mockFrame);
    });
    expect(result.current.session?.frames).toHaveLength(2);
  });

  it('endSession でセッションが終了し session=null になる', () => {
    const { result } = renderHook(() => useSessionStore());
    act(() => {
      result.current.startSession();
    });
    act(() => {
      result.current.endSession();
    });
    expect(result.current.session).toBeNull();
    expect(result.current.isActive).toBe(false);
  });

  it('セッション未開始時の addFrame は無視される', () => {
    const { result } = renderHook(() => useSessionStore());
    act(() => {
      result.current.addFrame(mockFrame);
    });
    expect(result.current.session).toBeNull();
  });

  it('endSession 後に startSession で新しいセッションが開始できる', () => {
    const { result } = renderHook(() => useSessionStore());
    act(() => {
      result.current.startSession();
    });
    const firstId = result.current.session?.sessionId;
    act(() => {
      result.current.endSession();
    });
    act(() => {
      result.current.startSession();
    });
    expect(result.current.session?.sessionId).not.toBe(firstId);
  });
});
