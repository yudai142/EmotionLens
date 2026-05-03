/** @jest-environment jsdom */
/**
 * useVideoCapture フックのテスト
 * カメラ映像キャプチャの開始・停止・エラーハンドリングを検証する
 */
import { renderHook, act } from '@testing-library/react';
import { useVideoCapture } from '../../hooks/useVideoCapture';

const mockTrackStop = jest.fn();
const mockGetUserMedia = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  Object.defineProperty(global.navigator, 'mediaDevices', {
    writable: true,
    value: { getUserMedia: mockGetUserMedia },
  });
  mockGetUserMedia.mockResolvedValue({
    getTracks: () => [{ stop: mockTrackStop }],
  });
});

afterEach(() => {
  jest.clearAllTimers();
});

describe('useVideoCapture', () => {
  it('初期状態は isCapturing=false、error=null', () => {
    const { result } = renderHook(() => useVideoCapture());
    expect(result.current.isCapturing).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('videoRef が返される', () => {
    const { result } = renderHook(() => useVideoCapture());
    expect(result.current.videoRef).toBeDefined();
  });

  it('start() で getUserMedia({ video: true }) が呼ばれる', async () => {
    const { result } = renderHook(() => useVideoCapture());
    await act(async () => {
      await result.current.start(jest.fn());
    });
    expect(mockGetUserMedia).toHaveBeenCalledWith({ video: true });
  });

  it('start() 後に isCapturing=true になる', async () => {
    const { result } = renderHook(() => useVideoCapture());
    await act(async () => {
      await result.current.start(jest.fn());
    });
    expect(result.current.isCapturing).toBe(true);
  });

  it('getUserMedia 失敗時に error がセットされる', async () => {
    mockGetUserMedia.mockRejectedValueOnce(new Error('カメラ権限拒否'));
    const { result } = renderHook(() => useVideoCapture());
    await act(async () => {
      await result.current.start(jest.fn());
    });
    expect(result.current.isCapturing).toBe(false);
    expect(result.current.error).toBe('カメラ権限拒否');
  });

  it('stop() で isCapturing=false になる', async () => {
    const { result } = renderHook(() => useVideoCapture());
    await act(async () => {
      await result.current.start(jest.fn());
    });
    act(() => {
      result.current.stop();
    });
    expect(result.current.isCapturing).toBe(false);
  });

  it('stop() でストリームの tracks が停止される', async () => {
    const { result } = renderHook(() => useVideoCapture());
    await act(async () => {
      await result.current.start(jest.fn());
    });
    act(() => {
      result.current.stop();
    });
    expect(mockTrackStop).toHaveBeenCalled();
  });
});
