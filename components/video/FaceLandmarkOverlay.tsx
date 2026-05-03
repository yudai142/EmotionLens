'use client';

/**
 * FaceLandmarkOverlay コンポーネント
 * video 要素の上に canvas を重ねて表情ランドマーク（将来拡張用の枠組み）を描画する
 */

import React, { useEffect, useRef } from 'react';

interface FaceLandmarkOverlayProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isActive: boolean;
}

export function FaceLandmarkOverlay({ videoRef, isActive }: FaceLandmarkOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!isActive) return;
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    // video サイズに合わせて canvas を更新するハンドラ
    const syncSize = () => {
      canvas.width = video.videoWidth || video.clientWidth;
      canvas.height = video.videoHeight || video.clientHeight;
    };

    video.addEventListener('loadedmetadata', syncSize);
    syncSize();
    return () => {
      video.removeEventListener('loadedmetadata', syncSize);
    };
  }, [isActive, videoRef]);

  if (!isActive) return null;

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
