/**
 * useEmotionAnalysis Hook
 * Tauri Command を介して Rust の Hume AI 処理を呼び出し、統合感情スコアを管理する
 */
'use client';

import { useState, useCallback, useRef } from 'react';
import { EmotionScore } from '../lib/types';
import { mergeScores } from '../lib/emotionEngine';
import { analyzeVoice as analyzeVoiceCommand, analyzeFace as analyzeFaceCommand } from '../lib/hume';

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
        const score = await analyzeVoiceCommand(buffer);
        setVoiceScore(score);
        voiceScoreRef.current = score;
        updateMerged(score, faceScoreRef.current);
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
        const score = await analyzeFaceCommand(imageBase64);
        setFaceScore(score);
        faceScoreRef.current = score;
        updateMerged(voiceScoreRef.current, score);
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
