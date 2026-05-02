/**
 * 音声解析 API Route
 * POST /api/analyze-voice
 * クライアントから送信された音声データを Hume AI に転送し、
 * EmotionScore 形式のレスポンスを返す
 */

import { NextRequest, NextResponse } from 'next/server';
import { analyzeVoice } from '../../../lib/hume';

export async function POST(req: NextRequest): Promise<NextResponse> {
  // 環境変数チェック（機密値はメッセージに含めない）
  if (!process.env.HUME_API_KEY || !process.env.HUME_SECRET_KEY) {
    return NextResponse.json(
      { error: 'API keys are not configured on the server.' },
      { status: 400 }
    );
  }

  // FormData からの音声バイナリ取得
  let audioBuffer: ArrayBuffer;
  try {
    const formData = await req.formData();
    const audioFile = formData.get('audio');
    if (!audioFile || !(audioFile instanceof Blob)) {
      return NextResponse.json(
        { error: 'audio field is required.' },
        { status: 422 }
      );
    }
    audioBuffer = await audioFile.arrayBuffer();
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body.' },
      { status: 422 }
    );
  }

  // Hume AI 呼び出し
  try {
    const score = await analyzeVoice(audioBuffer);
    return NextResponse.json({ score }, { status: 200 });
  } catch {
    // Hume AI のエラー詳細をクライアントに漏らさない
    return NextResponse.json(
      { error: 'Failed to analyze voice. Please try again later.' },
      { status: 502 }
    );
  }
}
