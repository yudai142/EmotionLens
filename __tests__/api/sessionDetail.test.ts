/**
 * app/api/sessions/[sessionId]/route.ts のテスト
 * 詳細取得 API の認証と所有者チェックを検証する
 */

jest.mock('../../lib/currentUser', () => ({
  getCurrentUser: jest.fn(),
}));

jest.mock('../../lib/sessionRepository', () => ({
  getSessionByIdForUser: jest.fn(),
}));

import { getCurrentUser as mockGetCurrentUser } from '../../lib/currentUser';
import { getSessionByIdForUser as mockGetSessionByIdForUser } from '../../lib/sessionRepository';
import { GET } from '../../app/api/sessions/[sessionId]/route';

const mockedGetCurrentUser = mockGetCurrentUser as unknown as jest.Mock<Promise<unknown>, []>;
const mockedGetSessionByIdForUser = mockGetSessionByIdForUser as unknown as jest.Mock<Promise<unknown>, [string, string]>;

describe('GET /api/sessions/[sessionId]', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('未ログイン時は 401 を返す', async () => {
    mockedGetCurrentUser.mockResolvedValueOnce(null);

    const response = await GET(new Request('http://localhost/api/sessions/s-1'), {
      params: { sessionId: 's-1' },
    });

    expect(response.status).toBe(401);
  });

  it('他人の session_id または存在しない場合は 404 を返す', async () => {
    mockedGetCurrentUser.mockResolvedValueOnce({
      id: 'user-1',
      email: 'user@example.com',
      name: 'User',
    });
    mockedGetSessionByIdForUser.mockResolvedValueOnce(null);

    const response = await GET(new Request('http://localhost/api/sessions/s-2'), {
      params: { sessionId: 's-2' },
    });

    expect(response.status).toBe(404);
    expect(mockedGetSessionByIdForUser).toHaveBeenCalledWith('user-1', 's-2');
  });

  it('ログインユーザーのセッションのみ 200 で返す', async () => {
    mockedGetCurrentUser.mockResolvedValueOnce({
      id: 'user-1',
      email: 'user@example.com',
      name: 'User',
    });
    mockedGetSessionByIdForUser.mockResolvedValueOnce({
      sessionId: 's-1',
      startedAt: 1000,
      frames: [],
      allAlerts: [],
    });

    const response = await GET(new Request('http://localhost/api/sessions/s-1'), {
      params: { sessionId: 's-1' },
    });
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({
      session: {
        sessionId: 's-1',
        startedAt: 1000,
        frames: [],
        allAlerts: [],
      },
    });
  });

  it('取得処理が失敗した場合は 500 を返す', async () => {
    mockedGetCurrentUser.mockResolvedValueOnce({
      id: 'user-1',
      email: 'user@example.com',
      name: 'User',
    });
    mockedGetSessionByIdForUser.mockRejectedValueOnce(new Error('db error'));

    const response = await GET(new Request('http://localhost/api/sessions/s-1'), {
      params: { sessionId: 's-1' },
    });
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body).toEqual({ error: 'Failed to fetch session.' });
  });
});