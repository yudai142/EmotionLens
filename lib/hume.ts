/**
 * Hume AI 接続ロジック
 * HUME_API_KEY / HUME_SECRET_KEY はサーバー環境変数からのみ読み込む
 * クライアントへ機密値を露出しない
 */

import { EmotionLabel, EmotionScore } from './types';

/** Hume AI API のベース URL */
const HUME_API_BASE = 'https://api.hume.ai/v0';

/**
 * Hume AI の感情名を EmotionLabel にマッピングするテーブル
 * Hume が返す感情名 → 本アプリのラベルへの変換
 */
const HUME_EMOTION_MAP: Record<string, EmotionLabel> = {
  // 怒り系
  Anger: 'ANGRY',
  Contempt: 'HIDING',
  // 不安系
  Anxiety: 'ANXIOUS',
  Fear: 'ANXIOUS',
  // 喜び系
  Joy: 'HAPPY',
  Amusement: 'HAPPY',
  Excitement: 'HAPPY',
  // 通常系
  Calmness: 'NEUTRAL',
  Contentment: 'NEUTRAL',
  // ストレス系
  Stress: 'STRESSED',
  Distress: 'STRESSED',
  // 隠蔽系
  Awkwardness: 'HIDING',
};

/** ゼロ初期化した EmotionScore を返す */
function zeroScore(): Record<EmotionLabel, number> {
  return {
    ANGRY: 0,
    ANXIOUS: 0,
    HAPPY: 0,
    NEUTRAL: 0,
    STRESSED: 0,
    HIDING: 0,
  };
}

/**
 * Hume AI のレスポンスから感情スコアを集計して正規化する
 * @param emotions - Hume が返す { name, score } の配列
 * @returns 正規化済み EmotionScore
 */
function aggregateEmotions(emotions: Array<{ name: string; score: number }>): EmotionScore {
  const raw = zeroScore();

  for (const { name, score } of emotions) {
    const label = HUME_EMOTION_MAP[name];
    if (label) {
      raw[label] += score;
    }
  }

  // 全スコア合計で正規化
  const total = Object.values(raw).reduce((s, v) => s + v, 0);
  if (total === 0) {
    raw.NEUTRAL = 1;
    return raw as EmotionScore;
  }

  const normalized = zeroScore();
  for (const key of Object.keys(raw) as EmotionLabel[]) {
    normalized[key] = raw[key] / total;
  }
  return normalized as EmotionScore;
}

/**
 * 音声データを Hume AI に送信して EmotionScore を返す
 * @param audioBuffer - 音声の ArrayBuffer
 * @throws API キーが未設定の場合、または Hume AI がエラーを返した場合
 */
export async function analyzeVoice(audioBuffer: ArrayBuffer): Promise<EmotionScore> {
  const apiKey = process.env.HUME_API_KEY;
  // キーが未設定の場合は早期エラー（機密値はメッセージに含めない）
  if (!apiKey) {
    throw new Error('HUME_API_KEY is not configured');
  }

  const formData = new FormData();
  const audioBlob = new Blob([audioBuffer], { type: 'audio/webm' });
  formData.append('file', audioBlob, 'audio.webm');
  formData.append('models', JSON.stringify({ prosody: {} }));

  const res = await fetch(`${HUME_API_BASE}/batch/jobs`, {
    method: 'POST',
    headers: {
      // API キーはリクエストヘッダーにのみ含める
      Authorization: `Bearer ${apiKey}`,
    },
    body: formData,
  });

  if (!res.ok) {
    // エラーメッセージにステータスのみ含め、機密値は含めない
    throw new Error(`Hume AI voice API error: ${res.status}`);
  }

  const json = await res.json();
  const predictions: Array<{ name: string; score: number }> = [];

  try {
    const grouped =
      json.results.predictions[0].models.prosody.grouped_predictions[0].predictions;
    for (const pred of grouped) {
      for (const e of pred.emotions) {
        predictions.push({ name: e.name, score: e.score });
      }
    }
  } catch {
    // パースエラーは NEUTRAL に丸める
    return { ANGRY: 0, ANXIOUS: 0, HAPPY: 0, NEUTRAL: 1, STRESSED: 0, HIDING: 0 };
  }

  return aggregateEmotions(predictions);
}

/**
 * 顔画像（Base64）を Hume AI に送信して EmotionScore を返す
 * @param imageBase64 - data URL 形式の Base64 画像
 * @throws API キーが未設定の場合、または Hume AI がエラーを返した場合
 */
export async function analyzeFace(imageBase64: string): Promise<EmotionScore> {
  const apiKey = process.env.HUME_API_KEY;
  if (!apiKey) {
    throw new Error('HUME_API_KEY is not configured');
  }

  const res = await fetch(`${HUME_API_BASE}/batch/jobs`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      models: { face: {} },
      urls: [],
      text: [],
      // Base64 画像を inline で送信
      files: [{ data: imageBase64 }],
    }),
  });

  if (!res.ok) {
    throw new Error(`Hume AI face API error: ${res.status}`);
  }

  const json = await res.json();
  const predictions: Array<{ name: string; score: number }> = [];

  try {
    const grouped =
      json.results.predictions[0].models.face.grouped_predictions[0].predictions;
    for (const pred of grouped) {
      for (const e of pred.emotions) {
        predictions.push({ name: e.name, score: e.score });
      }
    }
  } catch {
    return { ANGRY: 0, ANXIOUS: 0, HAPPY: 0, NEUTRAL: 1, STRESSED: 0, HIDING: 0 };
  }

  return aggregateEmotions(predictions);
}
