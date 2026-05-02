/**
 * app/api/analyze-voice/route.ts のテスト
 * API Route の正常系・異常系レスポンスを検証する
 */

import { NextRequest } from 'next/server';

// 環境変数をモック
const VALID_ENV = {
  HUME_API_KEY: 'test-api-key',
  HUME_SECRET_KEY: 'test-secret-key',
};

// lib/hume.ts の analyzeVoice をモック
jest.mock('../../lib/hume', () => ({
  analyzeVoice: jest.fn(),
}));

import { analyzeVoice as mockAnalyzeVoice } from '../../lib/hume';
import { POST } from '../../app/api/analyze-voice/route';

const mockedAnalyzeVoice = mockAnalyzeVoice as jest.MockedFunction<typeof mockAnalyzeVoice>;

// テスト用の FormData（音声バイナリを模擬）
const makeFormDataRequest = (hasAudio = true): NextRequest => {
  const formData = new FormData();
  if (hasAudio) {
    const audioBlob = new Blob(['fake-audio-data'], { type: 'audio/webm' });
    formData.append('audio', audioBlob, 'audio.webm');
  }
  return new NextRequest('http://localhost/api/analyze-voice', {
    method: 'POST',
    body: formData,
  });
};

describe('POST /api/analyze-voice', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('環境変数未設定時', () => {
    it('HUME_API_KEY が未設定なら 400 を返す', async () => {
      const originalKey = process.env.HUME_API_KEY;
      delete process.env.HUME_API_KEY;
      process.env.HUME_SECRET_KEY = VALID_ENV.HUME_SECRET_KEY;

      const req = makeFormDataRequest();
      const res = await POST(req);

      expect(res.status).toBe(400);
      const body = await res.json();
      expect(body).toHaveProperty('error');
      // エラーメッセージに機密値が含まれないことを確認
      expect(JSON.stringify(body)).not.toContain('test-api-key');
      expect(JSON.stringify(body)).not.toContain('test-secret-key');

      process.env.HUME_API_KEY = originalKey;
    });

    it('HUME_SECRET_KEY が未設定なら 400 を返す', async () => {
      process.env.HUME_API_KEY = VALID_ENV.HUME_API_KEY;
      const originalSecret = process.env.HUME_SECRET_KEY;
      delete process.env.HUME_SECRET_KEY;

      const req = makeFormDataRequest();
      const res = await POST(req);

      expect(res.status).toBe(400);
      const body = await res.json();
      expect(body).toHaveProperty('error');

      process.env.HUME_SECRET_KEY = originalSecret;
    });
  });

  describe('リクエストバリデーション', () => {
    it('audio フィールドがない場合は 422 を返す', async () => {
      process.env.HUME_API_KEY = VALID_ENV.HUME_API_KEY;
      process.env.HUME_SECRET_KEY = VALID_ENV.HUME_SECRET_KEY;

      const req = makeFormDataRequest(false);
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
        ANGRY: 0.1,
        ANXIOUS: 0.2,
        HAPPY: 0.3,
        NEUTRAL: 0.2,
        STRESSED: 0.1,
        HIDING: 0.1,
      };
      mockedAnalyzeVoice.mockResolvedValueOnce(mockScore);

      const req = makeFormDataRequest();
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
      mockedAnalyzeVoice.mockResolvedValueOnce(mockScore);

      const req = makeFormDataRequest();
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
      mockedAnalyzeVoice.mockRejectedValueOnce(new Error('Hume API error'));

      const req = makeFormDataRequest();
      const res = await POST(req);

      expect(res.status).toBe(502);
      const body = await res.json();
      expect(body).toHaveProperty('error');
    });
  });
});
