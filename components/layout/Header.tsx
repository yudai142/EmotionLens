'use client';

/**
 * Header コンポーネント
 * アプリ名表示とセッション開始・停止ボタンを提供する
 */

interface HeaderProps {
  isActive: boolean;
  onStart: () => void;
  onStop: () => void;
}

export function Header({ isActive, onStart, onStop }: HeaderProps) {
  return (
    <header className="navbar bg-base-200 border-b border-el-border px-4 shadow-md">
      <div className="flex-1">
        <span className="text-xl font-bold tracking-wide text-primary">EmotionLens</span>
      </div>
      <div className="flex-none gap-2">
        {isActive ? (
          <button className="btn btn-error btn-sm" onClick={onStop}>
            停止
          </button>
        ) : (
          <button className="btn btn-primary btn-sm" onClick={onStart}>
            開始
          </button>
        )}
      </div>
    </header>
  );
}
