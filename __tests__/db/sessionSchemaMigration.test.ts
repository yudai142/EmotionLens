/**
 * issue #18: PostgreSQL スキーマ設計テスト
 * ユーザー単位セッション保存の migration 定義を検証する
 */

import fs from 'fs';
import path from 'path';

const migrationPath = path.join(
  __dirname,
  '../../db/migrations/001_issue18_user_session_schema.sql',
);

describe('issue #18 migration schema', () => {
  it('migration ファイルが存在する', () => {
    expect(fs.existsSync(migrationPath)).toBe(true);
  });

  it('users / emotion_sessions / session_alerts テーブルを定義する', () => {
    const sql = fs.readFileSync(migrationPath, 'utf-8');

    expect(sql).toMatch(/CREATE TABLE IF NOT EXISTS users/i);
    expect(sql).toMatch(/CREATE TABLE IF NOT EXISTS emotion_sessions/i);
    expect(sql).toMatch(/CREATE TABLE IF NOT EXISTS session_alerts/i);
  });

  it('emotion_sessions が user_id 外部キーを持つ', () => {
    const sql = fs.readFileSync(migrationPath, 'utf-8');

    expect(sql).toMatch(/user_id\s+TEXT\s+NOT NULL/i);
    expect(sql).toMatch(/FOREIGN KEY\s*\(user_id\)\s*REFERENCES\s*users\s*\(id\)/i);
  });

  it('session_alerts が session_id 外部キーを持つ', () => {
    const sql = fs.readFileSync(migrationPath, 'utf-8');

    expect(sql).toMatch(/session_id\s+TEXT\s+NOT NULL/i);
    expect(sql).toMatch(
      /FOREIGN KEY\s*\(session_id\)\s*REFERENCES\s*emotion_sessions\s*\(session_id\)/i,
    );
  });

  it('最新取得・一覧取得・詳細取得を想定したインデックスを含む', () => {
    const sql = fs.readFileSync(migrationPath, 'utf-8');

    expect(sql).toMatch(/CREATE INDEX IF NOT EXISTS idx_sessions_user_started_at/i);
    expect(sql).toMatch(/CREATE INDEX IF NOT EXISTS idx_alerts_session_timestamp/i);
    expect(sql).toMatch(/CREATE INDEX IF NOT EXISTS idx_alerts_label_timestamp/i);
  });

  it('保持方針と migration 方針がコメントとして明記される', () => {
    const sql = fs.readFileSync(migrationPath, 'utf-8');

    expect(sql).toMatch(/retention policy/i);
    expect(sql).toMatch(/migration strategy/i);
  });
});