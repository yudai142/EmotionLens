-- issue #18
-- migration strategy:
-- 1) create new tables with IF NOT EXISTS to keep migration idempotent
-- 2) add indexes separately for query patterns (latest/list/detail)
-- 3) keep payload flexible with JSONB while persisting key metadata columns
--
-- retention policy:
-- - keep emotion_sessions for 180 days by default
-- - keep session_alerts for 365 days by default
-- - execute cleanup by scheduled job (not in this migration)

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  display_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS emotion_sessions (
  session_id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  started_at TIMESTAMPTZ NOT NULL,
  ended_at TIMESTAMPTZ,
  frame_count INTEGER NOT NULL DEFAULT 0 CHECK (frame_count >= 0),
  alert_count INTEGER NOT NULL DEFAULT 0 CHECK (alert_count >= 0),
  summary_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  payload_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_emotion_sessions_user
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS session_alerts (
  id BIGSERIAL PRIMARY KEY,
  session_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  label TEXT NOT NULL,
  score NUMERIC(5, 4) NOT NULL CHECK (score >= 0 AND score <= 1),
  detected_at TIMESTAMPTZ NOT NULL,
  metadata_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_session_alerts_session
    FOREIGN KEY (session_id) REFERENCES emotion_sessions (session_id) ON DELETE CASCADE,
  CONSTRAINT fk_session_alerts_user
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- latest session query: SELECT ... WHERE user_id = ? ORDER BY started_at DESC LIMIT 1
CREATE INDEX IF NOT EXISTS idx_sessions_user_started_at
  ON emotion_sessions (user_id, started_at DESC);

-- session list query: SELECT ... WHERE user_id = ? ORDER BY created_at DESC
CREATE INDEX IF NOT EXISTS idx_sessions_user_created_at
  ON emotion_sessions (user_id, created_at DESC);

-- session detail query: SELECT ... WHERE session_id = ? ORDER BY detected_at DESC
CREATE INDEX IF NOT EXISTS idx_alerts_session_timestamp
  ON session_alerts (session_id, detected_at DESC);

-- alert list query: SELECT ... WHERE user_id = ? AND label = ? ORDER BY detected_at DESC
CREATE INDEX IF NOT EXISTS idx_alerts_label_timestamp
  ON session_alerts (user_id, label, detected_at DESC);
