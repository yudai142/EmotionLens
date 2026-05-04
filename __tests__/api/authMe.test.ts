/**
 * app/api/auth/me/route.ts のテスト
 * ログイン中ユーザーの取得 API を検証する
 */

jest.mock('../../lib/currentUser', () => ({
  getCurrentUser: jest.fn(),
}));

import { getCurrentUser as mockGetCurrentUser } from '../../lib/currentUser';
import { GET } from '../../app/api/auth/me/route';

const mockedGetCurrentUser = mockGetCurrentUser as jest.MockedFunction<typeof mockGetCurrentUser>;

describe('GET /api/auth/me', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('未ログイン時は 401 を返す', async () => {
    mockedGetCurrentUser.mockResolvedValueOnce(null);

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body).toEqual({ error: 'Unauthorized' });
  });

  it('ログイン中は user を返す', async () => {
    mockedGetCurrentUser.mockResolvedValueOnce({
      id: 'user-123',
      name: 'Emotion Lens User',
      email: 'user@example.com',
    });

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({
      user: {
        id: 'user-123',
        name: 'Emotion Lens User',
        email: 'user@example.com',
      },
    });
  });
});