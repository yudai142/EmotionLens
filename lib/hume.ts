/**
 * Hume AI 接続ロジック（Tauri Command を介して Rust から呼び出す）
 * HUME_API_KEY / HUME_SECRET_KEY はサーバー環境変数からのみ読み込まれ、
 * クライアントへ機密値を露出しない
 */

import { invoke } from '@tauri-apps/api/core';
import { EmotionLabel, EmotionScore } from './types';

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
 * 音声データを Hume AI に送信して EmotionScore を返す（Tauri Command）
 * @param audioBuffer - 音声の ArrayBuffer
 * @throws Tauri Command がエラーを返した場合
 */
export async function analyzeVoice(audioBuffer: ArrayBuffer): Promise<EmotionScore> {
  // ArrayBuffer を base64 文字列に変換
  const bytes = new Uint8Array(audioBuffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const audioBase64 = btoa(binary);

  try {
    const result = await invoke<EmotionScore>('analyze_voice', { audioBase64 });
    return result;
  } catch (error) {
    // Tauri Command エラーは音声解析失敗として扱う
    console.error('Hume AI voice analysis error:', error);
    return zeroScore();
  }
}

/**
 * 顔画像（Base64）を Hume AI に送信して EmotionScore を返す（Tauri Command）
 * @param imageBase64 - data URL 形式の Base64 画像
 * @throws Tauri Command がエラーを返した場合
 */
export async function analyzeFace(imageBase64: string): Promise<EmotionScore> {
  try {
    const result = await invoke<EmotionScore>('analyze_face', { imageBase64 });
    return result;
  } catch (error) {
    // Tauri Command エラーは表情解析失敗として扱う
    console.error('Hume AI face analysis error:', error);
    return zeroScore();
  }
}
