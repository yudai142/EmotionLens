// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod hume;
mod window_monitor;
mod database;

use window_monitor::WindowMonitorState;
use database::{Database, SessionRecord};
use std::sync::Mutex;
use tauri::State;

// Tauri コマンド: セッション記録を保存
#[tauri::command]
fn save_session(
    db: State<Mutex<Database>>,
    emotion_data: String,
    notes: String,
) -> Result<SessionRecord, String> {
    let database = db.lock().map_err(|e| e.to_string())?;
    database
        .save_session(emotion_data, notes)
        .map_err(|e| e.to_string())
}

// Tauri コマンド: すべてのセッション記録を読み込み
#[tauri::command]
fn load_sessions(db: State<Mutex<Database>>) -> Result<Vec<SessionRecord>, String> {
    let database = db.lock().map_err(|e| e.to_string())?;
    database.load_sessions().map_err(|e| e.to_string())
}

// Tauri コマンド: セッション記録を削除
#[tauri::command]
fn delete_session(db: State<Mutex<Database>>, id: String) -> Result<(), String> {
    let database = db.lock().map_err(|e| e.to_string())?;
    database.delete_session(id).map_err(|e| e.to_string())
}

fn main() {
  let monitor_state = WindowMonitorState::default();

  // アプリケーション データディレクトリを取得
  let app_dir = tauri::api::path::app_data_dir(&Default::default())
    .expect("Failed to get app data dir");
  let db_path = app_dir.join("sessions.db");

  // データベースを初期化
  let database = Database::new(db_path);
  database
    .initialize_database()
    .expect("Failed to initialize database");

  tauri::Builder::default()
    .manage(monitor_state)
    .manage(Mutex::new(database))
    .invoke_handler(tauri::generate_handler![
      hume::analyze_voice,
      hume::analyze_face,
      window_monitor::get_active_window,
      save_session,
      load_sessions,
      delete_session,
    ])
    .setup(|app| {
      let app_handle = app.handle().clone();

      // ウィンドウ監視タスクをバックグラウンドで開始
      tauri::async_runtime::spawn(async move {
        let state = WindowMonitorState::default();
        window_monitor::monitor_window_changes(app_handle, state).await;
      });

      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
