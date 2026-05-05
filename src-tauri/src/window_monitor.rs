use active_win_pos_rs::ActiveWindow;
use chrono::Utc;
use serde::{Deserialize, Serialize};
use std::sync::{Arc, Mutex};
use tauri::State;

/// ミラーリングアプリの情報
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "lowercase")]
pub enum MirrorAppType {
    Zoom,
    Discord,
    Teams,
    Meet,
    Unknown,
}

impl MirrorAppType {
    /// ウィンドウタイトルからアプリタイプを検出
    fn from_title(title: &str) -> Self {
        let lower_title = title.to_lowercase();

        if lower_title.contains("zoom") {
            MirrorAppType::Zoom
        } else if lower_title.contains("discord") {
            MirrorAppType::Discord
        } else if lower_title.contains("microsoft teams") || lower_title.contains("teams") {
            MirrorAppType::Teams
        } else if lower_title.contains("google meet") || lower_title.contains("meet") {
            MirrorAppType::Meet
        } else {
            MirrorAppType::Unknown
        }
    }
}

/// ミラーリングアプリの検出結果
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MirrorAppInfo {
    pub name: MirrorAppType,
    pub window_title: String,
    pub detected_at: String, // ISO8601
}

/// ウィンドウ監視の状態を管理
#[derive(Debug, Clone)]
pub struct WindowMonitorState {
    pub last_app: Arc<Mutex<Option<MirrorAppInfo>>>,
}

impl Default for WindowMonitorState {
    fn default() -> Self {
        Self {
            last_app: Arc::new(Mutex::new(None)),
        }
    }
}

/// アクティブウィンドウを取得
#[tauri::command]
pub fn get_active_window() -> Result<Option<MirrorAppInfo>, String> {
    match ActiveWindow::get() {
        Ok(active_window) => {
            let app_name = MirrorAppType::from_title(&active_window.title);

            // Unknown は返さない（対応アプリのみ通知）
            if app_name == MirrorAppType::Unknown {
                Ok(None)
            } else {
                Ok(Some(MirrorAppInfo {
                    name: app_name,
                    window_title: active_window.title,
                    detected_at: Utc::now().to_rfc3339(),
                }))
            }
        }
        Err(_) => {
            // Windows の場合は API がないため、空を返す
            Ok(None)
        }
    }
}

/// ウィンドウ変更を監視し、emit でフロントへ通知
pub async fn monitor_window_changes(app_handle: tauri::AppHandle, state: WindowMonitorState) {
    let mut last_app: Option<MirrorAppInfo> = None;

    loop {
        // 1秒ごとにウィンドウをチェック
        tokio::time::sleep(tokio::time::Duration::from_secs(1)).await;

        match get_active_window() {
            Ok(Some(current_app)) => {
                // アプリが変更されたかチェック
                if last_app.as_ref() != Some(&current_app) {
                    last_app = Some(current_app.clone());

                    // フロントへイベントを emit
                    let _ = app_handle.emit_all("mirror:app_changed", &current_app);

                    // 状態を保存
                    if let Ok(mut last) = state.last_app.lock() {
                        *last = Some(current_app);
                    }
                }
            }
            Ok(None) => {
                // アプリが対応外に変わった場合
                if last_app.is_some() {
                    last_app = None;

                    // フロントへクリアイベントを emit
                    let _ = app_handle.emit_all("mirror:app_changed", serde_json::json!(null));

                    // 状態をクリア
                    if let Ok(mut last) = state.last_app.lock() {
                        *last = None;
                    }
                }
            }
            Err(_) => {
                // エラーの場合は無視
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_mirror_app_type_zoom() {
        assert_eq!(MirrorAppType::from_title("Zoom Meeting"), MirrorAppType::Zoom);
        assert_eq!(MirrorAppType::from_title("zoom"), MirrorAppType::Zoom);
    }

    #[test]
    fn test_mirror_app_type_discord() {
        assert_eq!(MirrorAppType::from_title("Discord"), MirrorAppType::Discord);
    }

    #[test]
    fn test_mirror_app_type_teams() {
        assert_eq!(MirrorAppType::from_title("Microsoft Teams"), MirrorAppType::Teams);
    }

    #[test]
    fn test_mirror_app_type_meet() {
        assert_eq!(MirrorAppType::from_title("Google Meet"), MirrorAppType::Meet);
    }

    #[test]
    fn test_mirror_app_type_unknown() {
        assert_eq!(MirrorAppType::from_title("Finder"), MirrorAppType::Unknown);
    }
}

