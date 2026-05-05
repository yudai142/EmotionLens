import React, { useState, useEffect } from 'react';

interface PermissionState {
  camera: boolean;
  microphone: boolean;
  requested: boolean;
}

export const PermissionsPrompt: React.FC = () => {
  const [permissions, setPermissions] = useState<PermissionState>({
    camera: false,
    microphone: false,
    requested: false,
  });

  const [showPrompt, setShowPrompt] = useState(true);

  useEffect(() => {
    // Check saved permission state from localStorage
    const saved = localStorage.getItem('emotionlens-permissions-requested');
    if (saved) {
      setPermissions(JSON.parse(saved));
      setShowPrompt(false);
    }
  }, []);

  const requestPermission = async (type: 'camera' | 'microphone') => {
    try {
      if (type === 'camera') {
        await navigator.mediaDevices.getUserMedia({ video: true });
        setPermissions((prev) => ({ ...prev, camera: true }));
      } else if (type === 'microphone') {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        setPermissions((prev) => ({ ...prev, microphone: true }));
      }

      const updated = {
        ...permissions,
        [type]: true,
        requested: true,
      };
      setPermissions(updated);
      localStorage.setItem('emotionlens-permissions-requested', JSON.stringify(updated));
      setShowPrompt(false);
    } catch (error) {
      console.error(`Failed to request ${type} permission:`, error);
      alert(
        `${type === 'camera' ? 'カメラ' : 'マイク'}へのアクセスが拒否されました。\n\n` +
          `システム設定を確認してください:\n` +
          `1. システム設定 > プライバシーとセキュリティ\n` +
          `2. ${type === 'camera' ? 'カメラ' : '録音'}\n` +
          `3. EmotionLens ブラウザを許可リストに追加`
      );
    }
  };

  const handleRequestAll = async () => {
    await requestPermission('camera');
    setTimeout(() => requestPermission('microphone'), 500);
  };

  if (!showPrompt) {
    return null;
  }

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h2 className="text-2xl font-bold mb-4 text-emotion-dark">
          EmotionLens へようこそ
        </h2>

        <p className="mb-4 text-emotion-dark">
          音声と表情を解析するために、カメラとマイクへのアクセスが必要です。
        </p>

        <div className="alert alert-info mb-4">
          <span>
            {'ℹ'}️ macOS ユーザーの場合、システム設定でアクセス許可を確認してください
          </span>
        </div>

        <div className="modal-action">
          <button
            className="btn btn-primary"
            onClick={handleRequestAll}
          >
            アクセスを許可する
          </button>
          <button
            className="btn btn-ghost"
            onClick={() => {
              setPermissions((prev) => ({ ...prev, requested: true }));
              localStorage.setItem(
                'emotionlens-permissions-requested',
                JSON.stringify({
                  camera: false,
                  microphone: false,
                  requested: true,
                })
              );
              setShowPrompt(false);
            }}
          >
            後で対応するスキップ
          </button>
        </div>
      </div>
    </div>
  );
};
