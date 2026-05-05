// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod hume;
mod window_monitor;

use window_monitor::WindowMonitorState;

fn main() {
  let monitor_state = WindowMonitorState::default();

  tauri::Builder::default()
    .manage(monitor_state)
    .invoke_handler(tauri::generate_handler![
      hume::analyze_voice,
      hume::analyze_face,
      window_monitor::get_active_window,
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
