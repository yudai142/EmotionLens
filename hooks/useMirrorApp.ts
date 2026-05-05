import { useEffect, useState } from "react";
import { MirrorAppInfo, onMirrorAppChanged } from "@/lib/window";

/**
 * ウィンドウ監視フックでミラーリングアプリを検出
 */
export function useMirrorApp() {
  const [currentApp, setCurrentApp] = useState<MirrorAppInfo | null>(null);
  const [isMonitoring, setIsMonitoring] = useState(true);

  useEffect(() => {
    if (!isMonitoring) {
      return;
    }

    // ウィンドウ変更イベントを購読
    const unsubscribe = onMirrorAppChanged((app) => {
      setCurrentApp(app);
    });

    return () => {
      unsubscribe();
    };
  }, [isMonitoring]);

  const startMonitoring = () => {
    setIsMonitoring(true);
  };

  const stopMonitoring = () => {
    setIsMonitoring(false);
    setCurrentApp(null);
  };

  return {
    currentApp,
    isMonitoring,
    startMonitoring,
    stopMonitoring,
  };
}
