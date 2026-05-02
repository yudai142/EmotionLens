/**
 * 感情解析の定数・設定値
 * EMOTION_CONFIG, ALERT_THRESHOLD, WEIGHT, interval 定数を一元管理する
 */

import { EmotionConfig } from '../lib/types';

/**
 * 感情ラベルごとの UI 表示設定
 * カラーは tailwind.config.ts の emotion-* と一致させること
 */
export const EMOTION_CONFIG: EmotionConfig = {
  ANGRY: {
    label: 'ANGRY',
    color: '#FF3B3B',
    displayName: '怒り',
    tip: '声のトーンが高く、短いフレーズが多い傾向があります',
  },
  ANXIOUS: {
    label: 'ANXIOUS',
    color: '#FBBF24',
    displayName: '不安',
    tip: '言葉に詰まりや繰り返しが増える傾向があります',
  },
  HAPPY: {
    label: 'HAPPY',
    color: '#22C55E',
    displayName: '喜び',
    tip: '表情が明るく、声のトーンが上がる傾向があります',
  },
  NEUTRAL: {
    label: 'NEUTRAL',
    color: '#00D4FF',
    displayName: '通常',
    tip: '感情の変化が少ない安定した状態です',
  },
  STRESSED: {
    label: 'STRESSED',
    color: '#F97316',
    displayName: 'ストレス',
    tip: '眉間に力が入り、声が硬くなる傾向があります',
  },
  HIDING: {
    label: 'HIDING',
    color: '#A855F7',
    displayName: '隠蔽',
    tip: '感情の表出を意図的に抑制している可能性があります',
  },
} as const;

/**
 * アラート発火の閾値
 * EmotionScore のスコアがこの値を超えた場合にアラートを生成する
 */
export const ALERT_THRESHOLD = 0.6;

/**
 * 音声スコアと表情スコアの統合重み
 * audio + face = 1 を維持すること
 */
export const WEIGHT = {
  audio: 0.5,
  face: 0.5,
} as const;

/** 音声チャンクを取得する間隔 (ms) */
export const AUDIO_CHUNK_INTERVAL_MS = 3000;

/** 表情キャプチャの間隔 (ms) */
export const FACE_CAPTURE_INTERVAL_MS = 1000;

/** アラートの再発火を抑制するクールダウン時間 (ms) */
export const ALERT_COOLDOWN_MS = 10000;
