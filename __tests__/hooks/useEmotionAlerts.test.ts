/** @jest-environment jsdom */
/**
 * useEmotionAlerts フックのテスト
 * アラート生成・クールダウン・リセットを検証する
 */
import { renderHook, act } from '@testing-library/react';
import { useEmotionAlerts } from '../../hooks/useEmotionAlerts';
import { EmotionScore } from '../../lib/types';
import { ALERT_THRESHOLD, ALERT_COOLDOWN_MS } from '../../constants/emotions';

/** 閾値を超える ANGRY スコア */
const highAngryScore: EmotionScore = {
  ANGRY: ALERT_THRESHOLD + 0.1,
  ANXIOUS: 0.0,
  HAPPY: 0.0,
  NEUTRAL: ALERT_THRESHOLD - 0.11,
  STRESSED: 0.0,
  HIDING: 0.01,
};

/** 全て閾値未満の低スコア */
const lowScore: EmotionScore = {
  ANGRY: 0.1,
  ANXIOUS: 0.1,
  HAPPY: 0.1,
  NEUTRAL: 0.4,
  STRESSED: 0.1,
  HIDING: 0.2,
};

describe('useEmotionAlerts', () => {
  beforeEach(() => {
    jest.useFakeTimers({ now: 0 });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('初期状態は alerts=[]、latestAlert=null', () => {
    const { result } = renderHook(() => useEmotionAlerts());
    expect(result.current.alerts).toHaveLength(0);
    expect(result.current.latestAlert).toBeNull();
  });

  it('閾値以上のスコアで addScore するとアラートが生成される', () => {
    const { result } = renderHook(() => useEmotionAlerts());
    act(() => {
      result.current.addScore(highAngryScore);
    });
    expect(result.current.alerts.length).toBeGreaterThan(0);
    expect(result.current.alerts[0].label).toBe('ANGRY');
  });

  it('低スコアでは addScore してもアラートは生成されない', () => {
    const { result } = renderHook(() => useEmotionAlerts());
    act(() => {
      result.current.addScore(lowScore);
    });
    expect(result.current.alerts).toHaveLength(0);
  });

  it('クールダウン内の同一ラベルは重複アラートが生成されない', () => {
    const { result } = renderHook(() => useEmotionAlerts());
    act(() => {
      result.current.addScore(highAngryScore);
    });
    act(() => {
      jest.advanceTimersByTime(ALERT_COOLDOWN_MS - 1000);
      result.current.addScore(highAngryScore);
    });
    const angryAlerts = result.current.alerts.filter((a) => a.label === 'ANGRY');
    expect(angryAlerts).toHaveLength(1);
  });

  it('クールダウン経過後は再アラートが生成される', () => {
    const { result } = renderHook(() => useEmotionAlerts());
    act(() => {
      result.current.addScore(highAngryScore);
    });
    act(() => {
      jest.advanceTimersByTime(ALERT_COOLDOWN_MS + 1);
      result.current.addScore(highAngryScore);
    });
    const angryAlerts = result.current.alerts.filter((a) => a.label === 'ANGRY');
    expect(angryAlerts).toHaveLength(2);
  });

  it('clearAlerts で alerts がリセットされる', () => {
    const { result } = renderHook(() => useEmotionAlerts());
    act(() => {
      result.current.addScore(highAngryScore);
    });
    act(() => {
      result.current.clearAlerts();
    });
    expect(result.current.alerts).toHaveLength(0);
    expect(result.current.latestAlert).toBeNull();
  });

  it('clearAlerts 後はクールダウンがリセットされ即座に再アラートが生成される', () => {
    const { result } = renderHook(() => useEmotionAlerts());
    act(() => {
      result.current.addScore(highAngryScore);
    });
    act(() => {
      result.current.clearAlerts();
    });
    act(() => {
      result.current.addScore(highAngryScore);
    });
    expect(result.current.alerts.length).toBeGreaterThan(0);
  });

  it('latestAlert は最後に追加されたアラートを返す', () => {
    const { result } = renderHook(() => useEmotionAlerts());
    act(() => {
      result.current.addScore(highAngryScore);
    });
    expect(result.current.latestAlert).not.toBeNull();
    expect(result.current.latestAlert?.label).toBe('ANGRY');
  });
});
