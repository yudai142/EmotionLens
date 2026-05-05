use rusqlite::{Connection, Result as SqliteResult, params};
use serde::{Serialize, Deserialize};
use std::path::PathBuf;
use uuid::Uuid;
use chrono::{DateTime, Utc};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SessionRecord {
    pub id: String,
    pub timestamp: String,
    pub emotion_data: String,
    pub notes: String,
}

/// SQLite データベース管理構造体
pub struct Database {
    db_path: PathBuf,
}

impl Database {
    /// データベースインスタンスを作成
    pub fn new(db_path: PathBuf) -> Self {
        Database { db_path }
    }

    /// SQLite スキーマを初期化
    pub fn initialize_database(&self) -> SqliteResult<()> {
        let conn = Connection::open(&self.db_path)?;

        // セッション記録テーブルを作成
        conn.execute(
            "CREATE TABLE IF NOT EXISTS sessions (
                id TEXT PRIMARY KEY,
                timestamp TEXT NOT NULL,
                emotion_data TEXT NOT NULL,
                notes TEXT NOT NULL
            )",
            [],
        )?;

        Ok(())
    }

    /// セッション記録を保存
    pub fn save_session(
        &self,
        emotion_data: String,
        notes: String,
    ) -> SqliteResult<SessionRecord> {
        let conn = Connection::open(&self.db_path)?;

        let id = Uuid::new_v4().to_string();
        let timestamp = Utc::now().to_rfc3339();

        conn.execute(
            "INSERT INTO sessions (id, timestamp, emotion_data, notes) VALUES (?1, ?2, ?3, ?4)",
            params![&id, &timestamp, &emotion_data, &notes],
        )?;

        Ok(SessionRecord {
            id,
            timestamp,
            emotion_data,
            notes,
        })
    }

    /// すべてのセッション記録を読み込み
    pub fn load_sessions(&self) -> SqliteResult<Vec<SessionRecord>> {
        let conn = Connection::open(&self.db_path)?;

        let mut stmt = conn.prepare(
            "SELECT id, timestamp, emotion_data, notes FROM sessions ORDER BY timestamp DESC"
        )?;

        let sessions = stmt.query_map([], |row| {
            Ok(SessionRecord {
                id: row.get(0)?,
                timestamp: row.get(1)?,
                emotion_data: row.get(2)?,
                notes: row.get(3)?,
            })
        })?;

        let mut result = Vec::new();
        for session in sessions {
            result.push(session?);
        }

        Ok(result)
    }

    /// セッション記録を削除
    pub fn delete_session(&self, id: String) -> SqliteResult<()> {
        let conn = Connection::open(&self.db_path)?;

        conn.execute(
            "DELETE FROM sessions WHERE id = ?1",
            params![&id],
        )?;

        Ok(())
    }
}
