/**
 * Hume AI 統合モジュール（Rust Tauri Command）
 * HUME_API_KEY / HUME_SECRET_KEY はサーバー環境変数からのみ読み込む
 * クライアントへ機密値を露出しない
 */

use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use base64::Engine;

/** 感情ラベル */
#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum EmotionLabel {
    #[serde(rename = "ANGRY")]
    Angry,
    #[serde(rename = "ANXIOUS")]
    Anxious,
    #[serde(rename = "HAPPY")]
    Happy,
    #[serde(rename = "NEUTRAL")]
    Neutral,
    #[serde(rename = "STRESSED")]
    Stressed,
    #[serde(rename = "HIDING")]
    Hiding,
}

/** 感情スコア */
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EmotionScore {
    pub ANGRY: f64,
    pub ANXIOUS: f64,
    pub HAPPY: f64,
    pub NEUTRAL: f64,
    pub STRESSED: f64,
    pub HIDING: f64,
}

impl EmotionScore {
    /** ゼロ初期化したスコアを返す */
    fn zero() -> Self {
        EmotionScore {
            ANGRY: 0.0,
            ANXIOUS: 0.0,
            HAPPY: 0.0,
            NEUTRAL: 0.0,
            STRESSED: 0.0,
            HIDING: 0.0,
        }
    }
}

/** Hume AI の感情名を EmotionLabel にマッピング */
fn hume_emotion_map(name: &str) -> Option<&'static str> {
    match name {
        // 怒り系
        "Anger" => Some("ANGRY"),
        "Contempt" => Some("HIDING"),
        // 不安系
        "Anxiety" => Some("ANXIOUS"),
        "Fear" => Some("ANXIOUS"),
        // 喜び系
        "Joy" => Some("HAPPY"),
        "Amusement" => Some("HAPPY"),
        "Excitement" => Some("HAPPY"),
        // 通常系
        "Calmness" => Some("NEUTRAL"),
        "Contentment" => Some("NEUTRAL"),
        // ストレス系
        "Stress" => Some("STRESSED"),
        "Distress" => Some("STRESSED"),
        // 隠蔽系
        "Awkwardness" => Some("HIDING"),
        _ => None,
    }
}

/** 感情スコアを集計して正規化する */
fn aggregate_emotions(emotions: Vec<(String, f64)>) -> EmotionScore {
    let mut raw: HashMap<String, f64> = HashMap::new();

    for (name, score) in emotions {
        if let Some(label) = hume_emotion_map(&name) {
            *raw.entry(label.to_string()).or_insert(0.0) += score;
        }
    }

    // 全スコア合計で正規化
    let total: f64 = raw.values().sum();
    if total == 0.0 {
        return EmotionScore {
            ANGRY: 0.0,
            ANXIOUS: 0.0,
            HAPPY: 0.0,
            NEUTRAL: 1.0,
            STRESSED: 0.0,
            HIDING: 0.0,
        };
    }

    let mut result = EmotionScore::zero();
    for (key, value) in raw {
        match key.as_str() {
            "ANGRY" => result.ANGRY = value / total,
            "ANXIOUS" => result.ANXIOUS = value / total,
            "HAPPY" => result.HAPPY = value / total,
            "NEUTRAL" => result.NEUTRAL = value / total,
            "STRESSED" => result.STRESSED = value / total,
            "HIDING" => result.HIDING = value / total,
            _ => {}
        }
    }

    result
}

/** Hume AI API のベース URL */
const HUME_API_BASE: &str = "https://api.hume.ai/v0";

/**
 * 音声データを Hume AI に送信して EmotionScore を返す
 * @param audio_base64 - Base64 エンコードされた音声データ
 */
#[tauri::command]
pub async fn analyze_voice(audio_base64: String) -> Result<EmotionScore, String> {
    let api_key = std::env::var("HUME_API_KEY")
        .map_err(|_| "HUME_API_KEY is not configured".to_string())?;

    let client = reqwest::Client::new();

    // Base64 から バイナリに変換
    let audio_bytes = base64::engine::general_purpose::STANDARD
        .decode(&audio_base64)
        .map_err(|_| "Failed to decode audio base64".to_string())?;

    // multipart/form-data で送信
    let form = reqwest::multipart::Form::new()
        .part("file",
            reqwest::multipart::Part::bytes(audio_bytes)
                .file_name("audio.webm")
                .mime_str("audio/webm").unwrap()
        )
        .text("models", r#"{"prosody": {}}"#);

    let response = client
        .post(format!("{}/batch/jobs", HUME_API_BASE))
        .header("Authorization", format!("Bearer {}", api_key))
        .multipart(form)
        .send()
        .await
        .map_err(|e| format!("Hume AI request failed: {}", e))?;

    if !response.status().is_success() {
        return Err(format!("Hume AI voice API error: {}", response.status()));
    }

    let json: serde_json::Value = response
        .json()
        .await
        .map_err(|e| format!("Failed to parse Hume response: {}", e))?;

    let mut predictions = Vec::new();

    if let Some(grouped) = json
        .get("results")
        .and_then(|r| r.get("predictions"))
        .and_then(|p| p.get(0))
        .and_then(|p| p.get("models"))
        .and_then(|m| m.get("prosody"))
        .and_then(|p| p.get("grouped_predictions"))
        .and_then(|g| g.get(0))
        .and_then(|g| g.get("predictions"))
        .and_then(|p| p.as_array())
    {
        for pred in grouped {
            if let Some(emotions) = pred.get("emotions").and_then(|e| e.as_array()) {
                for emotion in emotions {
                    if let (Some(name), Some(score)) =
                        (emotion.get("name").and_then(|n| n.as_str()),
                         emotion.get("score").and_then(|s| s.as_f64()))
                    {
                        predictions.push((name.to_string(), score));
                    }
                }
            }
        }
    }

    Ok(aggregate_emotions(predictions))
}

/**
 * 顔画像（Base64）を Hume AI に送信して EmotionScore を返す
 * @param image_base64 - Base64 エンコードされた画像データ（data URI 形式も可）
 */
#[tauri::command]
pub async fn analyze_face(image_base64: String) -> Result<EmotionScore, String> {
    let api_key = std::env::var("HUME_API_KEY")
        .map_err(|_| "HUME_API_KEY is not configured".to_string())?;

    let client = reqwest::Client::new();

    let body = serde_json::json!({
        "models": { "face": {} },
        "urls": [],
        "text": [],
        "files": [{ "data": image_base64 }]
    });

    let response = client
        .post(format!("{}/batch/jobs", HUME_API_BASE))
        .header("Authorization", format!("Bearer {}", api_key))
        .header("Content-Type", "application/json")
        .json(&body)
        .send()
        .await
        .map_err(|e| format!("Hume AI request failed: {}", e))?;

    if !response.status().is_success() {
        return Err(format!("Hume AI face API error: {}", response.status()));
    }

    let json: serde_json::Value = response
        .json()
        .await
        .map_err(|e| format!("Failed to parse Hume response: {}", e))?;

    let mut predictions = Vec::new();

    if let Some(grouped) = json
        .get("results")
        .and_then(|r| r.get("predictions"))
        .and_then(|p| p.get(0))
        .and_then(|p| p.get("models"))
        .and_then(|m| m.get("face"))
        .and_then(|p| p.get("grouped_predictions"))
        .and_then(|g| g.get(0))
        .and_then(|g| g.get("predictions"))
        .and_then(|p| p.as_array())
    {
        for pred in grouped {
            if let Some(emotions) = pred.get("emotions").and_then(|e| e.as_array()) {
                for emotion in emotions {
                    if let (Some(name), Some(score)) =
                        (emotion.get("name").and_then(|n| n.as_str()),
                         emotion.get("score").and_then(|s| s.as_f64()))
                    {
                        predictions.push((name.to_string(), score));
                    }
                }
            }
        }
    }

    Ok(aggregate_emotions(predictions))
}
