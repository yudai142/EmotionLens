/**
 * ドメイン型定義
 * API・Hooks・UI コンポーネントで共通参照する型を一元管理する
 */

/** 感情ラベル */
export type EmotionLabel =
  | 'ANGRY'
  | 'ANXIOUS'
  | 'HAPPY'
  | 'NEUTRAL'
  | 'STRESSED'
  | 'HIDING';

/**
 * 感情スコアマップ
 * 各感情ラベルに対して 0〜1 の確率スコアを持つ
 * 全ラベルの合計が 1 になるよう正規化されることを期待する
 */
export type EmotionScore = {
  [K in EmotionLabel]: number;
};

/**
 * 感情アラート
 * 閾値を超えた感情が検出された際に生成される
 */
export type EmotionAlert = {
  /** 検出された感情ラベル */
  label: EmotionLabel;
  /** 検出時のスコア */
  score: number;
  /** 検出時の Unix タイムスタンプ (ms) */
  timestamp: number;
};

/**
 * 感情フレーム
 * 1 回の感情解析サイクルで生成されるデータ
 */
export type EmotionFrame = {
  /** フレームの Unix タイムスタンプ (ms) */
  timestamp: number;
  /** 音声・表情スコアを統合した感情スコアマップ */
  merged: EmotionScore;
  /** このフレームで検出されたアラートリスト */
  alerts: EmotionAlert[];
};

/**
 * セッションデータ
 * 1 回のビデオ会議セッション中に収集されたフレームとアラートを保持する
 */
export type SessionData = {
  /** セッション識別子 */
  sessionId: string;
  /** セッション開始時の Unix タイムスタンプ (ms) */
  startedAt: number;
  /** 収集されたフレームのリスト */
  frames: EmotionFrame[];
  /** セッション中に発生した全アラートのリスト */
  allAlerts: EmotionAlert[];
};

/**
 * 感情表示設定
 * UI でラベルを表示する際の色・文言・Tip を管理する
 */
export type EmotionConfig = {
  [K in EmotionLabel]: {
    label: K;
    /** Tailwind emotion-* カラーコード (#RRGGBB) */
    color: string;
    /** 日本語表示名 */
    displayName: string;
    /** ユーザー向けの補足情報 */
    tip: string;
  };
};
