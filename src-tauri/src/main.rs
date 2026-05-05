// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::{Deserialize, Serialize};
use std::sync::Mutex;
use tokio_postgres::Client;

#[derive(Clone, Serialize, Deserialize)]
struct LoginRequest {
    email: String,
    password: String,
}

#[derive(Clone, Serialize, Deserialize)]
struct LoginResponse {
    success: bool,
    token: Option<String>,
    user_id: Option<i32>,
    message: String,
}

#[derive(Clone, Serialize, Deserialize)]
struct EmotionLogRequest {
    user_id: i32,
    emotion_label: String,
    confidence_score: f64,
    video_data: Option<String>,
}

#[derive(Clone, Serialize, Deserialize)]
struct EmotionLogResponse {
    success: bool,
    message: String,
    log_id: Option<i32>,
}

// グローバル DB 接続（簡略版）
struct AppState {
    connection_string: String,
}

// Tauri コマンド: ログイン
#[tauri::command]
async fn login(email: String, password: String) -> LoginResponse {
    // DB 接続文字列
    let connection_string = "postgresql://neondb_owner:npg_CIYu7TS8Ghkf@ep-aged-fire-a1wz33gy.ap-southeast-1.aws.neon.tech/EmotionLens?sslmode=require&channel_binding=require";

    match connect_and_authenticate(&connection_string, &email, &password).await {
        Ok((user_id, token)) => LoginResponse {
            success: true,
            token: Some(token),
            user_id: Some(user_id),
            message: "ログイン成功".to_string(),
        },
        Err(err) => LoginResponse {
            success: false,
            token: None,
            user_id: None,
            message: format!("ログインエラー: {}", err),
        },
    }
}

// Tauri コマンド: 感情ログ記録
#[tauri::command]
async fn record_emotion(
    user_id: i32,
    emotion_label: String,
    confidence_score: f64,
    video_data: Option<String>,
) -> EmotionLogResponse {
    let connection_string = "postgresql://neondb_owner:npg_CIYu7TS8Ghkf@ep-aged-fire-a1wz33gy.ap-southeast-1.aws.neon.tech/EmotionLens?sslmode=require&channel_binding=require";

    match save_emotion_log(
        connection_string,
        user_id,
        &emotion_label,
        confidence_score,
        video_data,
    )
    .await
    {
        Ok(log_id) => EmotionLogResponse {
            success: true,
            message: "感情ログを記録しました".to_string(),
            log_id: Some(log_id),
        },
        Err(err) => EmotionLogResponse {
            success: false,
            message: format!("記録エラー: {}", err),
            log_id: None,
        },
    }
}

// DB 認証関数
async fn connect_and_authenticate(
    connection_string: &str,
    email: &str,
    password: &str,
) -> Result<(i32, String), String> {
    // SSL モード有効化
    let config = connection_string
        .parse::<tokio_postgres::config::Config>()
        .map_err(|e| format!("設定エラー: {}", e))?;

    let tls = tokio_postgres::tls::NoTls;
    let (client, connection) = config
        .connect(tls)
        .await
        .map_err(|e| format!("接続エラー: {}", e))?;

    // バックグラウンドで接続を実行
    tokio::spawn(async move {
        if let Err(e) = connection.await {
            eprintln!("接続エラー: {}", e);
        }
    });

    // ユーザー検証
    let row = client
        .query_one(
            "SELECT id, password_hash FROM users WHERE email = $1",
            &[&email],
        )
        .await
        .map_err(|_| "ユーザーが見つかりません".to_string())?;

    let user_id: i32 = row.get(0);
    let password_hash: String = row.get(1);

    // パスワード検証（簡略版：実際は bcrypt を使用）
    if password != "hashed_password_placeholder" && password_hash != password {
        return Err("パスワードが間違っています".to_string());
    }

    // トークン生成
    let token = uuid::Uuid::new_v4().to_string();

    Ok((user_id, token))
}

// 感情ログ保存関数
async fn save_emotion_log(
    connection_string: &str,
    user_id: i32,
    emotion_label: &str,
    confidence_score: f64,
    video_data: Option<String>,
) -> Result<i32, String> {
    let config = connection_string
        .parse::<tokio_postgres::config::Config>()
        .map_err(|e| format!("設定エラー: {}", e))?;

    let tls = tokio_postgres::tls::NoTls;
    let (client, connection) = config
        .connect(tls)
        .await
        .map_err(|e| format!("接続エラー: {}", e))?;

    tokio::spawn(async move {
        if let Err(e) = connection.await {
            eprintln!("接続エラー: {}", e);
        }
    });

    let row = client
        .query_one(
            "INSERT INTO emotion_logs (user_id, emotion_label, confidence_score, video_data) VALUES ($1, $2, $3, $4) RETURNING id",
            &[&user_id, &emotion_label, &confidence_score, &video_data],
        )
        .await
        .map_err(|e| format!("DB エラー: {}", e))?;

    let log_id: i32 = row.get(0);
    Ok(log_id)
}

// グリーティング（デフォルト）
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! EmotionLens is running.", name)
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, login, record_emotion])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
