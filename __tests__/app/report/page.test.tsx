/** @jest-environment jsdom */
/**
 * app/report/page.tsx のテスト
 * レポート画面の API 連携と状態表示を確認する
 */
import { render, screen, waitFor } from '@testing-library/react';
import ReportPage from '../../../app/report/page';
import type { SessionData } from '../../../lib/types';

const mockSessionStore = {
  session: null as SessionData | null,
  isActive: false,
  startSession: jest.fn(),
  endSession: jest.fn(),
  addFrame: jest.fn(),
};

const sampleSession: SessionData = {
  sessionId: 'session-1',
  startedAt: 1710000000000,
  frames: [],
  allAlerts: [],
};

function jsonResponse(status: number, body: unknown): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  } as Response;
}

// コンポーネント内で使う Hooks をモック
jest.mock('../../../hooks/useSessionStore', () => ({
  useSessionStore: () => mockSessionStore,
}));

describe('ReportPage', () => {
  const fetchMock = jest.fn() as jest.MockedFunction<typeof fetch>;

  beforeEach(() => {
    mockSessionStore.session = null;
    fetchMock.mockReset();
    global.fetch = fetchMock;
  });

  it('ページが描画される（クラッシュしない）', () => {
    fetchMock.mockImplementation(() => new Promise(() => undefined));
    expect(() => render(<ReportPage />)).not.toThrow();
  });

  it('読み込み中の状態を表示する', () => {
    fetchMock.mockImplementation(() => new Promise(() => undefined));

    render(<ReportPage />);

    expect(screen.getByText('レポートを読み込み中です')).toBeInTheDocument();
  });

  it('未ログイン時はログイン導線メッセージを表示する', async () => {
    fetchMock.mockResolvedValue(jsonResponse(401, { error: 'Unauthorized' }));

    render(<ReportPage />);

    await waitFor(() => {
      expect(screen.getByText('ログインするとレポートを表示できます')).toBeInTheDocument();
    });
  });

  it('ログインユーザーの最新セッションを取得して表示する', async () => {
    const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
    fetchMock.mockResolvedValue(jsonResponse(200, { session: sampleSession }));

    render(<ReportPage />);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith('/api/sessions/latest', { cache: 'no-store' });
    });

    expect(await screen.findByText('セッションレポート')).toBeInTheDocument();
    expect(getItemSpy).not.toHaveBeenCalled();

    getItemSpy.mockRestore();
  });
});
