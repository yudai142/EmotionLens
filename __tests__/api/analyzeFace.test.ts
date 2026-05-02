/**
 * app/api/analyze-face/route.ts のテスト
 * API Route の正常系・異常系レスポンスを検証する
 */

import { NextRequest } from 'next/server';

// 環境変数をモック
const VALID_ENV = {
  HUME_API_KEY: 'test-api-key',
  HUME_SECRET_KEY: 'test-secret-key',
};

// lib/hume.ts の analyzeFace をモック
jest.mock('../../lib/hume', () => ({
  analyzeFace: jest.fn(),
}));

import { analyzeFace as mockAnalyzeFace } from '../../lib/hume';
import { POST } from '../../app/api/analyze-face/route';

const mockedAnalyzeFace = mockAnalyzeFace as jest.MockedFunction<typeof mockAnalyzeFace>;

// テスト用の JSON リクエスト（Base64 画像データを模擬）
const makeJsonRequest = (hasImage = true): NextRequest => {
  const body = hasImage
    ? JSON.stringify({ image: 'data:image/jpeg;base64,/9j/fakebase64==' })
    : JSON.stringify({});
  return new NextRequest('http://localhost/api/analyze-face', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
  });
};

describe('POST /api/analyze-face', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('環境変数未設定時', () => {
    it('HUME_API_KEY が未設定なら 400 を返す', async () => {
      const originalKey = process.env.HUME_API_KEY;
      delete process.env.HUME_API_KEY;
      process.env.HUME_SECRET_KEY = VALID_ENV.HUME_SECRET_KEY;

      const req = makeJsonRequest();
      const res = await POST(req);

      expect(res.status).toBe(400);
      const body = await res.json();
      expect(body).toHaveProperty('error');
      expect(JSON.stringify(body)).not.toContain('test-api-key');
      expect(JSON.stringify(body)).not.toContain('test-secret-key');

      process.env.HUME_API_KEY = originalKey;
    });

    it('HUME_SECRET_KEY が未設定なら 400 を返す', async () => {
      process.env.HUME_API_KEY = VALID_ENV.HUME_API_KEY;
      const originalSecret = process.env.HUME_SECRET_KEY;
      delete process.env.HUME_SECRET_KEY;

      const req = makeJsonRequest();
      const res = await POST(req);

      expect(res.status).toBe(400);
      const body = await res.json();
      expect(body).toHaveProperty('error');

      process.env.HUME_SECRET_KEY = originalSecret;
    });
  });

  describe('リクエストバリデーション', () => {
    it('image フィールドがない場合は 422 を返す', async () => {
      process.env.HUME_API_KEY = VALID_ENV.HUME_API_KEY;
      process.env.HUME_SECRET_KEY = VALID_ENV.HUME_SECRET_KEY;

      const req = makeJsonRequest(false);
      const res = await POST(req);

      expect(res.status).toBe(422);
      const body = await res.json();
      expect(body).toHaveProperty('error');
    });
  });

  describe('正常系', () => {
    beforeEach(() => {
      process.env.HUME_API_KEY = VALID_ENV.HUME_API_KEY;
      process.env.HUME_SECRET_KEY = VALID_ENV.HUME_SECRET_KEY;
    });

    it('Hume AI の解析結果を EmotionScore 形式で返す', async () => {
      const mockScore = {
        ANGRY: 0.05,
        ANXIOUS: 0.1,
        HAPPY: 0.6,
        NEUTRAL: 0.15,
        STRESSED: 0.05,
        HIDING: 0.05,
      };
      mockedAnalyzeFace.mockResolvedValueOnce(mockScore);

      const req = makeJsonRequest();
      const res = await POST(req);

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body).toHaveProperty('score');
      expect(body.score).toEqual(mockScore);
    });

    it('レスポンスボディに機密値が含まれない', async () => {
      const mockScore = {
        ANGRY: 0,
        ANXIOUS: 0,
        HAPPY: 1,
        NEUTRAL: 0,
        STRESSED: 0,
        HIDING: 0,
      };
      mockedAnalyzeFace.mockResolvedValueOnce(mockScore);

      const req = makeJsonRequest();
      const res = await POST(req);
      const body = await res.json();

      expect(JSON.stringify(body)).not.toContain('test-api-key');
      expect(JSON.stringify(body)).not.toContain('test-secret-key');
    });
  });

  describe('異常系（Hume AI エラー）', () => {
    beforeEach(() => {
      process.env.HUME_API_KEY = VALID_ENV.HUME_API_KEY;
      process.env.HUME_SECRET_KEY = VALID_ENV.HUME_SECRET_KEY;
    });

    it('Hume AI がエラーを返した場合は 502 を返す', async () => {
      mockedAnalyzeFace.mockRejectedValueOnce(new Error('Hume API error'));

      const req = makeJsonRequest();
      const res = await POST(req);

      expect(res.status).toBe(502);
      const body = await res.json();
      expect(body).toHaveProperty('error');
    });
  });
});
