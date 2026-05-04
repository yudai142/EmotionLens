import 'server-only';

import type { CurrentUser } from './currentUser';
import { postgresPool } from './postgres';
import type { SessionData } from './types';

type SessionRow = {
  payload_json: SessionData;
};

function ensureUserEmail(user: CurrentUser): string {
  return user.email ?? `${user.id}@emotionlens.local`;
}

export async function saveSessionForUser(
  userId: string,
  user: CurrentUser,
  session: SessionData,
): Promise<void> {
  const client = await postgresPool.connect();

  try {
    await client.query('BEGIN');

    await client.query(
      `
        INSERT INTO users (id, email, display_name)
        VALUES ($1, $2, $3)
        ON CONFLICT (id)
        DO UPDATE SET
          email = EXCLUDED.email,
          display_name = EXCLUDED.display_name,
          updated_at = NOW()
      `,
      [userId, ensureUserEmail(user), user.name],
    );

    await client.query(
      `
        INSERT INTO emotion_sessions (
          session_id,
          user_id,
          started_at,
          frame_count,
          alert_count,
          summary_json,
          payload_json,
          updated_at
        )
        VALUES (
          $1,
          $2,
          TO_TIMESTAMP($3 / 1000.0),
          $4,
          $5,
          $6::jsonb,
          $7::jsonb,
          NOW()
        )
        ON CONFLICT (session_id)
        DO UPDATE SET
          user_id = EXCLUDED.user_id,
          started_at = EXCLUDED.started_at,
          frame_count = EXCLUDED.frame_count,
          alert_count = EXCLUDED.alert_count,
          summary_json = EXCLUDED.summary_json,
          payload_json = EXCLUDED.payload_json,
          updated_at = NOW()
      `,
      [
        session.sessionId,
        userId,
        session.startedAt,
        session.frames.length,
        session.allAlerts.length,
        JSON.stringify({
          frameCount: session.frames.length,
          alertCount: session.allAlerts.length,
        }),
        JSON.stringify(session),
      ],
    );

    await client.query('DELETE FROM session_alerts WHERE session_id = $1', [session.sessionId]);

    if (session.allAlerts.length > 0) {
      for (const alert of session.allAlerts) {
        await client.query(
          `
            INSERT INTO session_alerts (
              session_id,
              user_id,
              label,
              score,
              detected_at,
              metadata_json
            )
            VALUES ($1, $2, $3, $4, TO_TIMESTAMP($5 / 1000.0), '{}'::jsonb)
          `,
          [session.sessionId, userId, alert.label, alert.score, alert.timestamp],
        );
      }
    }

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export async function getLatestSessionForUser(userId: string): Promise<SessionData | null> {
  const result = await postgresPool.query<SessionRow>(
    `
      SELECT payload_json
      FROM emotion_sessions
      WHERE user_id = $1
      ORDER BY started_at DESC
      LIMIT 1
    `,
    [userId],
  );

  return result.rows[0]?.payload_json ?? null;
}

export async function getSessionByIdForUser(
  userId: string,
  sessionId: string,
): Promise<SessionData | null> {
  const result = await postgresPool.query<SessionRow>(
    `
      SELECT payload_json
      FROM emotion_sessions
      WHERE user_id = $1 AND session_id = $2
      LIMIT 1
    `,
    [userId, sessionId],
  );

  return result.rows[0]?.payload_json ?? null;
}