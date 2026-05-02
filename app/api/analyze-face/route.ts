/**
 * 表情解析 API Route
 * POST /api/analyze-face
 * クライアントから送信された画像データを Hume AI に転送し、
 * EmotionScore 形式のレスポンスを返す
 */

import { NextRequest, NextResponse } from 'next/server';
import { analyzeFace } from '../../../lib/hume';

export async function POST(req: NextRequest): Promise<NextResponse> {
  // 環境変数チェック（機密値はメッセージに含めない）
  if (!process.env.HUME_API_KEY || !process.env.HUME_SECRET_KEY) {
    return NextResponse.json(
      { error: 'API keys are not configured on the server.' },
      { status: 400 }
    );
  }

  // JSON ボディから画像 Base64 取得
  let imageBase64: string;
  try {
    const body = await req.json() as Record<string, unknown>;
    if (typeof body.image !== 'string' || !body.image) {
      return NextResponse.json(
        { error: 'image field is required.' },
        { status: 422 }
      );
    }
    imageBase64 = body.image;
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON body.' },
      { status: 422 }
    );
  }

  // Hume AI 呼び出し
  try {
    const score = await analyzeFace(imageBase64);
    return NextResponse.json({ score }, { status: 200 });
  } catch {
    // Hume AI のエラー詳細をクライアントに漏らさない
    return NextResponse.json(
      { error: 'Failed to analyze face. Please try again later.' },
      { status: 502 }
    );
  }
}
