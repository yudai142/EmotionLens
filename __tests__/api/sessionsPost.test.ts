/**
 * app/api/sessions/route.ts のテスト
 * 保存 API の認証・バリデーション・保存呼び出しを検証する
 */

import { NextRequest } from 'next/server';

jest.mock('../../lib/currentUser', () => ({
  getCurrentUser: jest.fn(),
}));

jest.mock('../../lib/sessionRepository', () => ({
  saveSessionForUser: jest.fn(),
}));

import { getCurrentUser as mockGetCurrentUser } from '../../lib/currentUser';
import { saveSessionForUser as mockSaveSessionForUser } from '../../lib/sessionRepository';
import { POST } from '../../app/api/sessions/route';

const mockedGetCurrentUser = mockGetCurrentUser as unknown as jest.Mock<Promise<unknown>, []>;
const mockedSaveSessionForUser = mockSaveSessionForUser as unknown as jest.Mock<Promise<void>, [string, unknown, unknown]>;

function makeRequest(body: unknown): NextRequest {
  return new NextRequest('http://localhost/api/sessions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('POST /api/sessions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('未ログイン時は 401 を返す', async () => {
    mockedGetCurrentUser.mockResolvedValueOnce(null);

    const response = await POST(makeRequest({ session: {} }));

    expect(response.status).toBe(401);
  });

  it('バリデーション不正時は 422 を返す', async () => {
    mockedGetCurrentUser.mockResolvedValueOnce({
      id: 'user-1',
      email: 'user@example.com',
      name: 'User',
    });

    const response = await POST(makeRequest({ session: { sessionId: 's-1' } }));

    expect(response.status).toBe(422);
  });

  it('ログイン中かつ有効 payload の場合は保存して 200 を返す', async () => {
    mockedGetCurrentUser.mockResolvedValueOnce({
      id: 'user-1',
      email: 'user@example.com',
      name: 'User',
    });

    const session = {
      sessionId: 's-1',
      startedAt: Date.now(),
      frames: [],
      allAlerts: [],
    };

    const response = await POST(makeRequest({ session }));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(mockedSaveSessionForUser).toHaveBeenCalledWith('user-1', expect.objectContaining({ email: 'user@example.com' }), session);
    expect(body).toEqual({ sessionId: 's-1' });
  });

  it('保存処理が失敗した場合は 500 を返す', async () => {
    mockedGetCurrentUser.mockResolvedValueOnce({
      id: 'user-1',
      email: 'user@example.com',
      name: 'User',
    });
    mockedSaveSessionForUser.mockRejectedValueOnce(new Error('db error'));

    const session = {
      sessionId: 's-1',
      startedAt: Date.now(),
      frames: [],
      allAlerts: [],
    };

    const response = await POST(makeRequest({ session }));
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body).toEqual({ error: 'Failed to save session.' });
  });
});