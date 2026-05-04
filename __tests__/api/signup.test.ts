/**
 * app/api/auth/signup/route.ts のテスト
 */

jest.mock('../../lib/authUserRepository', () => ({
  createAuthUser: jest.fn(),
  DuplicateEmailError: class DuplicateEmailError extends Error {},
}));

import { NextRequest } from 'next/server';
import { POST } from '../../app/api/auth/signup/route';
import { createAuthUser } from '../../lib/authUserRepository';

const mockedCreateAuthUser = createAuthUser as jest.MockedFunction<typeof createAuthUser>;

describe('POST /api/auth/signup', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('不正なJSONで422を返す', async () => {
    const req = new NextRequest('http://localhost:3000/api/auth/signup', {
      method: 'POST',
      body: 'not-json',
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await POST(req);
    expect(response.status).toBe(422);
  });

  it('email/password不足で422を返す', async () => {
    const req = new NextRequest('http://localhost:3000/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email: 'user@example.com' }),
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await POST(req);
    expect(response.status).toBe(422);
  });

  it('パスワードが短いと422を返す', async () => {
    const req = new NextRequest('http://localhost:3000/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email: 'user@example.com', password: 'short' }),
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await POST(req);
    expect(response.status).toBe(422);
  });

  it('登録成功で201を返す', async () => {
    mockedCreateAuthUser.mockResolvedValueOnce({
      id: 'user-1',
      email: 'user@example.com',
      displayName: null,
    });

    const req = new NextRequest('http://localhost:3000/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email: 'user@example.com', password: 'password123' }),
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await POST(req);
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(body).toEqual({
      user: {
        id: 'user-1',
        email: 'user@example.com',
        name: null,
      },
    });
  });

  it('重複メールで409を返す', async () => {
    mockedCreateAuthUser.mockRejectedValueOnce({ name: 'DuplicateEmailError' });

    const req = new NextRequest('http://localhost:3000/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email: 'user@example.com', password: 'password123' }),
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await POST(req);
    expect(response.status).toBe(409);
  });
});
