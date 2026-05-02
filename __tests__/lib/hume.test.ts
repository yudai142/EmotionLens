/**
 * lib/hume.ts の Hume AI 接続ロジックテスト
 * fetch をモックして外部 API 呼び出しを検証する
 */

// グローバル fetch をモック
global.fetch = jest.fn();

import { analyzeVoice, analyzeFace } from '../../lib/hume';

const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

// Hume AI のレスポンス形式に近いモック（音声解析）
const makeVoiceResponse = (predictions: Array<{ name: string; score: number }>) => ({
  ok: true,
  json: async () => ({
    results: {
      predictions: [
        {
          models: {
            prosody: {
              grouped_predictions: [
                {
                  predictions: predictions.map((p) => ({
                    emotions: [p],
                  })),
                },
              ],
            },
          },
        },
      ],
    },
  }),
});

// Hume AI のレスポンス形式に近いモック（表情解析）
const makeFaceResponse = (predictions: Array<{ name: string; score: number }>) => ({
  ok: true,
  json: async () => ({
    results: {
      predictions: [
        {
          models: {
            face: {
              grouped_predictions: [
                {
                  predictions: predictions.map((p) => ({
                    emotions: [p],
                  })),
                },
              ],
            },
          },
        },
      ],
    },
  }),
});

// エラーレスポンス
const makeErrorResponse = (status: number) => ({
  ok: false,
  status,
  json: async () => ({ message: 'API Error' }),
});

describe('analyzeVoice', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.HUME_API_KEY = 'test-api-key';
    process.env.HUME_SECRET_KEY = 'test-secret-key';
  });

  it('正常系：EmotionScore 形式のオブジェクトを返す', async () => {
    mockFetch.mockResolvedValueOnce(makeVoiceResponse([
      { name: 'Anger', score: 0.8 },
      { name: 'Anxiety', score: 0.1 },
      { name: 'Joy', score: 0.05 },
      { name: 'Calmness', score: 0.03 },
      { name: 'Stress', score: 0.01 },
      { name: 'Contempt', score: 0.01 },
    ]) as unknown as Response);

    const audioData = new Uint8Array([0, 1, 2]).buffer;
    const result = await analyzeVoice(audioData);

    expect(result).toHaveProperty('ANGRY');
    expect(result).toHaveProperty('ANXIOUS');
    expect(result).toHaveProperty('HAPPY');
    expect(result).toHaveProperty('NEUTRAL');
    expect(result).toHaveProperty('STRESSED');
    expect(result).toHaveProperty('HIDING');

    // 各値が 0〜1 の範囲内
    Object.values(result).forEach((v) => {
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(1);
    });
  });

  it('合計スコアが 1 になるよう正規化されている', async () => {
    mockFetch.mockResolvedValueOnce(makeVoiceResponse([
      { name: 'Anger', score: 2.0 },
      { name: 'Joy', score: 2.0 },
    ]) as unknown as Response);

    const audioData = new Uint8Array([0, 1]).buffer;
    const result = await analyzeVoice(audioData);

    const total = Object.values(result).reduce((s, v) => s + v, 0);
    expect(total).toBeCloseTo(1, 5);
  });

  it('API が 4xx/5xx を返した場合はエラーをスローする', async () => {
    mockFetch.mockResolvedValueOnce(makeErrorResponse(401) as unknown as Response);

    const audioData = new Uint8Array([0]).buffer;
    await expect(analyzeVoice(audioData)).rejects.toThrow();
  });

  it('リクエストヘッダーに API キーが含まれる（ボディには含まない）', async () => {
    mockFetch.mockResolvedValueOnce(makeVoiceResponse([
      { name: 'Joy', score: 1.0 },
    ]) as unknown as Response);

    const audioData = new Uint8Array([0]).buffer;
    await analyzeVoice(audioData);

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const [, options] = mockFetch.mock.calls[0];
    const headers = (options?.headers ?? {}) as Record<string, string>;
    // Authorization ヘッダーにキーが含まれることを確認
    const authHeader = headers['Authorization'] ?? headers['authorization'] ?? '';
    expect(authHeader).toBeTruthy();
    // レスポンスボディには含まれないこと（API キーがボディに露出しないこと）
    const bodyStr = typeof options?.body === 'string' ? options.body : '';
    expect(bodyStr).not.toContain('test-api-key');
    expect(bodyStr).not.toContain('test-secret-key');
  });
});

describe('analyzeFace', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.HUME_API_KEY = 'test-api-key';
    process.env.HUME_SECRET_KEY = 'test-secret-key';
  });

  it('正常系：EmotionScore 形式のオブジェクトを返す', async () => {
    mockFetch.mockResolvedValueOnce(makeFaceResponse([
      { name: 'Joy', score: 0.9 },
      { name: 'Calmness', score: 0.05 },
      { name: 'Anger', score: 0.03 },
      { name: 'Anxiety', score: 0.01 },
      { name: 'Stress', score: 0.005 },
      { name: 'Contempt', score: 0.005 },
    ]) as unknown as Response);

    const imageBase64 = 'data:image/jpeg;base64,/9j/fake==';
    const result = await analyzeFace(imageBase64);

    expect(result).toHaveProperty('ANGRY');
    expect(result).toHaveProperty('ANXIOUS');
    expect(result).toHaveProperty('HAPPY');
    expect(result).toHaveProperty('NEUTRAL');
    expect(result).toHaveProperty('STRESSED');
    expect(result).toHaveProperty('HIDING');

    Object.values(result).forEach((v) => {
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(1);
    });
  });

  it('API が 4xx/5xx を返した場合はエラーをスローする', async () => {
    mockFetch.mockResolvedValueOnce(makeErrorResponse(403) as unknown as Response);

    const imageBase64 = 'data:image/jpeg;base64,/9j/fake==';
    await expect(analyzeFace(imageBase64)).rejects.toThrow();
  });
});
