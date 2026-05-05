import { invoke } from "@tauri-apps/api/core";

export type MirrorAppType = "zoom" | "discord" | "teams" | "meet" | "unknown";

export interface MirrorAppInfo {
  name: MirrorAppType;
  window_title: string;
  detected_at: string; // ISO8601
}

/**
 * アクティブウィンドウを取得
 */
export async function getActiveWindow(): Promise<MirrorAppInfo | null> {
  try {
    return await invoke<MirrorAppInfo | null>("get_active_window");
  } catch (error) {
    console.error("Failed to get active window:", error);
    return null;
  }
}

/**
 * ウィンドウ変更イベントを購読
 */
export function onMirrorAppChanged(
  callback: (app: MirrorAppInfo | null) => void
): () => void {
  let unlistener: (() => void) | null = null;

  (async () => {
    const { listen } = await import("@tauri-apps/api/event");
    unlistener = await listen("mirror:app_changed", (event) => {
      callback(event.payload as MirrorAppInfo | null);
    });
  })();

  return () => {
    if (unlistener) {
      unlistener();
    }
  };
}
