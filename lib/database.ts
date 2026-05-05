import { invoke } from '@tauri-apps/api/core';

export interface SessionRecord {
  id: string;
  timestamp: string;
  emotion_data: string;
  notes: string;
}

/**
 * セッション記録を保存
 */
export async function saveSession(
  emotionData: string,
  notes: string
): Promise<SessionRecord> {
  return invoke<SessionRecord>('save_session', {
    emotion_data: emotionData,
    notes,
  });
}

/**
 * すべてのセッション記録を読み込み
 */
export async function loadSessions(): Promise<SessionRecord[]> {
  return invoke<SessionRecord[]>('load_sessions');
}

/**
 * セッション記録を削除
 */
export async function deleteSession(id: string): Promise<void> {
  return invoke<void>('delete_session', { id });
}
