/**
 * lib/currentUser.ts のテスト
 * サーバー側でログインユーザーを安全に解決できることを検証する
 */

jest.mock('../../auth', () => ({
  auth: jest.fn(),
}));

import { auth as mockAuth } from '../../auth';
import { getCurrentUser, requireCurrentUser } from '../../lib/currentUser';

const mockedAuth = mockAuth as unknown as jest.Mock<Promise<unknown>, []>;

describe('currentUser helpers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('セッションがない場合 getCurrentUser は null を返す', async () => {
    mockedAuth.mockResolvedValueOnce(null);

    await expect(getCurrentUser()).resolves.toBeNull();
  });

  it('user.id を含むセッションがある場合 getCurrentUser はユーザー情報を返す', async () => {
    mockedAuth.mockResolvedValueOnce({
      user: {
        id: 'user-123',
        name: 'Emotion Lens User',
        email: 'user@example.com',
      },
      expires: '2099-01-01T00:00:00.000Z',
    });

    await expect(getCurrentUser()).resolves.toEqual({
      id: 'user-123',
      name: 'Emotion Lens User',
      email: 'user@example.com',
    });
  });

  it('requireCurrentUser は未ログイン時に Unauthorized エラーを投げる', async () => {
    mockedAuth.mockResolvedValueOnce(null);

    await expect(requireCurrentUser()).rejects.toThrow('Unauthorized');
  });
});