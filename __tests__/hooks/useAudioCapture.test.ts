/** @jest-environment jsdom */
/**
 * useAudioCapture フックのテスト
 * マイク録音の開始・停止・エラーハンドリングを検証する
 */
import { renderHook, act } from '@testing-library/react';
import { useAudioCapture } from '../../hooks/useAudioCapture';
import { AUDIO_CHUNK_INTERVAL_MS } from '../../constants/emotions';

const mockStop = jest.fn();
const mockStart = jest.fn();
const mockTrackStop = jest.fn();

/** MediaRecorder モック */
const MockMediaRecorder = jest.fn().mockImplementation(() => ({
  start: mockStart,
  stop: mockStop,
  state: 'inactive',
  ondataavailable: null as ((e: { data: Blob }) => void) | null,
}));
(MockMediaRecorder as unknown as { isTypeSupported: jest.Mock }).isTypeSupported =
  jest.fn().mockReturnValue(true);

const mockGetUserMedia = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  Object.defineProperty(global, 'MediaRecorder', { writable: true, value: MockMediaRecorder });
  Object.defineProperty(global.navigator, 'mediaDevices', {
    writable: true,
    value: { getUserMedia: mockGetUserMedia },
  });
  mockGetUserMedia.mockResolvedValue({
    getTracks: () => [{ stop: mockTrackStop }],
  });
});

describe('useAudioCapture', () => {
  it('初期状態は isCapturing=false、error=null', () => {
    const { result } = renderHook(() => useAudioCapture());
    expect(result.current.isCapturing).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('start() で getUserMedia({ audio: true }) が呼ばれる', async () => {
    const { result } = renderHook(() => useAudioCapture());
    await act(async () => {
      await result.current.start(jest.fn());
    });
    expect(mockGetUserMedia).toHaveBeenCalledWith({ audio: true });
  });

  it('start() 後に isCapturing=true になる', async () => {
    const { result } = renderHook(() => useAudioCapture());
    await act(async () => {
      await result.current.start(jest.fn());
    });
    expect(result.current.isCapturing).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it('start() で MediaRecorder.start が AUDIO_CHUNK_INTERVAL_MS で呼ばれる', async () => {
    const { result } = renderHook(() => useAudioCapture());
    await act(async () => {
      await result.current.start(jest.fn());
    });
    expect(mockStart).toHaveBeenCalledWith(AUDIO_CHUNK_INTERVAL_MS);
  });

  it('getUserMedia 失敗時に error がセットされ isCapturing=false のまま', async () => {
    mockGetUserMedia.mockRejectedValueOnce(new Error('Permission denied'));
    const { result } = renderHook(() => useAudioCapture());
    await act(async () => {
      await result.current.start(jest.fn());
    });
    expect(result.current.isCapturing).toBe(false);
    expect(result.current.error).toBe('Permission denied');
  });

  it('stop() で isCapturing=false になる', async () => {
    const { result } = renderHook(() => useAudioCapture());
    await act(async () => {
      await result.current.start(jest.fn());
    });
    act(() => {
      result.current.stop();
    });
    expect(result.current.isCapturing).toBe(false);
  });

  it('stop() でストリームの tracks が停止される', async () => {
    const { result } = renderHook(() => useAudioCapture());
    await act(async () => {
      await result.current.start(jest.fn());
    });
    act(() => {
      result.current.stop();
    });
    expect(mockTrackStop).toHaveBeenCalled();
  });
});
