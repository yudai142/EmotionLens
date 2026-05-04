/**
 * app/api/sessions/latest/route.ts のテスト
 * 最新取得 API の認証と user スコープを検証する
 */

jest.mock('../../lib/currentUser', () => ({
  getCurrentUser: jest.fn(),
}));

jest.mock('../../lib/sessionRepository', () => ({
  getLatestSessionForUser: jest.fn(),
}));

import { getCurrentUser as mockGetCurrentUser } from '../../lib/currentUser';
import { getLatestSessionForUser as mockGetLatestSessionForUser } from '../../lib/sessionRepository';
import { GET } from '../../app/api/sessions/latest/route';

const mockedGetCurrentUser = mockGetCurrentUser as unknown as jest.Mock<Promise<unknown>, []>;
const mockedGetLatestSessionForUser = mockGetLatestSessionForUser as unknown as jest.Mock<Promise<unknown>, [string]>;

describe('GET /api/sessions/latest', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('未ログイン時は 401 を返す', async () => {
    mockedGetCurrentUser.mockResolvedValueOnce(null);

    const response = await GET();

    expect(response.status).toBe(401);
  });

  it('ログイン中は user_id で最新セッションを取得する', async () => {
    mockedGetCurrentUser.mockResolvedValueOnce({
      id: 'user-1',
      email: 'user@example.com',
      name: 'User',
    });
    mockedGetLatestSessionForUser.mockResolvedValueOnce({
      sessionId: 's-1',
      startedAt: 1000,
      frames: [],
      allAlerts: [],
    });

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(mockedGetLatestSessionForUser).toHaveBeenCalledWith('user-1');
    expect(body).toEqual({
      session: {
        sessionId: 's-1',
        startedAt: 1000,
        frames: [],
        allAlerts: [],
      },
    });
  });
});