/**
 * useEmotionAnalysis Hook
 * /api/analyze-voice・/api/analyze-face へ非同期送信し、統合感情スコアを管理する
 */
'use client';

import { useState, useCallback, useRef } from 'react';
import { EmotionScore } from '../lib/types';
import { mergeScores } from '../lib/emotionEngine';

export interface UseEmotionAnalysisReturn {
  /** 音声解析のスコア */
  voiceScore: EmotionScore | null;
  /** 表情解析のスコア */
  faceScore: EmotionScore | null;
  /** 音声・表情を統合したスコア */
  mergedScore: EmotionScore | null;
  /** 音声チャンク（ArrayBuffer）を送信して解析する */
  analyzeVoice: (buffer: ArrayBuffer) => Promise<void>;
  /** 画像フレーム（base64 文字列）を送信して解析する */
  analyzeFace: (imageBase64: string) => Promise<void>;
  /** API 呼び出し中かどうか */
  isAnalyzing: boolean;
  /** エラーメッセージ（未エラー時は null） */
  error: string | null;
}

/** ArrayBuffer をブラウザ互換の base64 文字列に変換する */
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export function useEmotionAnalysis(): UseEmotionAnalysisReturn {
  const [voiceScore, setVoiceScore] = useState<EmotionScore | null>(null);
  const [faceScore, setFaceScore] = useState<EmotionScore | null>(null);
  const [mergedScore, setMergedScore] = useState<EmotionScore | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 最新スコアを ref で保持し、非同期コールバック内でも参照できるようにする
  const voiceScoreRef = useRef<EmotionScore | null>(null);
  const faceScoreRef = useRef<EmotionScore | null>(null);

  /** 両スコアから mergedScore を算出し state に反映する */
  const updateMerged = useCallback(
    (vs: EmotionScore | null, fs: EmotionScore | null) => {
      if (vs && fs) {
        setMergedScore(mergeScores(vs, fs));
      } else if (vs) {
        setMergedScore(vs);
      } else if (fs) {
        setMergedScore(fs);
      }
    },
    [],
  );

  const analyzeVoice = useCallback(
    async (buffer: ArrayBuffer) => {
      setIsAnalyzing(true);
      setError(null);
      try {
        const audio = arrayBufferToBase64(buffer);
        const res = await fetch('/api/analyze-voice', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ audio }),
        });
        if (!res.ok) {
          throw new Error(`音声解析 API エラー: ${res.status}`);
        }
        const data = (await res.json()) as { score: EmotionScore };
        setVoiceScore(data.score);
        voiceScoreRef.current = data.score;
        updateMerged(data.score, faceScoreRef.current);
      } catch (err) {
        setError(err instanceof Error ? err.message : '音声解析に失敗しました');
      } finally {
        setIsAnalyzing(false);
      }
    },
    [updateMerged],
  );

  const analyzeFace = useCallback(
    async (imageBase64: string) => {
      setIsAnalyzing(true);
      setError(null);
      try {
        const res = await fetch('/api/analyze-face', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: imageBase64 }),
        });
        if (!res.ok) {
          throw new Error(`表情解析 API エラー: ${res.status}`);
        }
        const data = (await res.json()) as { score: EmotionScore };
        setFaceScore(data.score);
        faceScoreRef.current = data.score;
        updateMerged(voiceScoreRef.current, data.score);
      } catch (err) {
        setError(err instanceof Error ? err.message : '表情解析に失敗しました');
      } finally {
        setIsAnalyzing(false);
      }
    },
    [updateMerged],
  );

  return { voiceScore, faceScore, mergedScore, analyzeVoice, analyzeFace, isAnalyzing, error };
}
