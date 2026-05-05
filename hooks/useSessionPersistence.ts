import { useState, useCallback } from 'react';
import * as db from '@/lib/database';

export interface UseSessionPersistenceReturn {
  sessions: db.SessionRecord[];
  loading: boolean;
  error: string | null;
  saveSession: (emotionData: string, notes: string) => Promise<void>;
  loadAllSessions: () => Promise<void>;
  deleteSession: (id: string) => Promise<void>;
}

/**
 * セッション永続化を管理する React Hooks
 */
export function useSessionPersistence(): UseSessionPersistenceReturn {
  const [sessions, setSessions] = useState<db.SessionRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * セッション記録を保存
   */
  const saveSession = useCallback(
    async (emotionData: string, notes: string) => {
      try {
        setLoading(true);
        setError(null);
        const newSession = await db.saveSession(emotionData, notes);
        setSessions((prev) => [newSession, ...prev]);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'セッション保存に失敗しました';
        setError(message);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /**
   * すべてのセッション記録を読み込み
   */
  const loadAllSessions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const loadedSessions = await db.loadSessions();
      setSessions(loadedSessions);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'セッション読み込みに失敗しました';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * セッション記録を削除
   */
  const deleteSession = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await db.deleteSession(id);
      setSessions((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'セッション削除に失敗しました';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    sessions,
    loading,
    error,
    saveSession,
    loadAllSessions,
    deleteSession,
  };
}
