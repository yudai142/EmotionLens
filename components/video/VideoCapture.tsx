'use client';

/**
 * VideoCapture コンポーネント
 * カメラ映像のプレビューを表示する。isActive=false のときはプレースホルダーを表示する
 */

import React from 'react';

interface VideoCaptureProps {
  isActive: boolean;
  videoRef?: React.RefObject<HTMLVideoElement | null> | React.MutableRefObject<HTMLVideoElement | null>;
  children?: React.ReactNode;
}

export function VideoCapture({ isActive, videoRef, children }: VideoCaptureProps) {
  if (!isActive) {
    return (
      <div
        role="img"
        aria-label="カメラ停止中"
        className="flex aspect-video w-full items-center justify-center rounded-lg bg-base-300 text-el-muted"
      >
        <span>カメラ停止中</span>
      </div>
    );
  }

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
      <video
        ref={videoRef as React.RefObject<HTMLVideoElement>}
        autoPlay
        playsInline
        muted
        className="h-full w-full object-cover"
      />
      {children && (
        <div className="absolute bottom-2 left-2">{children}</div>
      )}
    </div>
  );
}
