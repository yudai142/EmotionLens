# EmotionLens

## 1. サービス概要（※最後に記載）

EmotionLens は、ビデオ会議中の声のトーンと表情を解析し、隠れた感情の変化をリアルタイム通知するWebアプリです。
営業・カウンセリング・交渉担当者が、会話中の違和感を早期に捉えて対話行動を修正できるよう支援します。
結果として、表面的な合意ではなく、本音に基づくコミュニケーションの質向上を目指します。

誰の、どんな課題を、どう解決するか：
「オンライン対話で本音を引き出したい実務担当者」の「感情のズレを見落とす課題」を、音声・表情の複合解析と行動提案付き通知で解決する。

---

## 2. このアイデアはどこから生まれたか

### 2-1. きっかけとなった体験・感情

2025年の商談同席の場面で、相手は終始「問題ないです」と言っていたのに、後日の失注理由は「本音が言いづらかった」でした。
オンライン会議では相づちや表情の微妙な変化を見落としやすく、会話中に違和感を拾いきれなかったことに強い悔しさを感じました。
特に、相手の声の揺れと笑顔のズレに気づけなかった体験が、このサービスの出発点です。

### 2-2. なぜそれが「気になった」のか

- 自分の性格: 会話の温度差や沈黙の意味を深読みしやすく、表面的な合意だけで進むことに不安を感じる
- 過去の経験: 営業と1on1支援の両方で「言葉より先に感情が崩れる」場面を何度も見てきた
- 価値観: 相手の意思決定を急がせるより、安心して本音を言える対話を優先したい

このため、会議中に見落とされる感情サインを補助する仕組みが必要だと考えました。

---

## 3. 課題の整理（表面的になっていないか）

### 3-1. 表に見えている困りごと

オンライン会議中、相手の本音の変化に気づくのが遅れ、提案や問いかけのタイミングを外してしまう。

### 3-2. 本当に解決したい課題は何か

- なぜ？
相手が本音を言えないまま会話が進み、表面的な合意だけが積み上がるから。
- なぜ？
話し手は「伝えたつもり」、聞き手は「理解したつもり」になり、認識ギャップが会議中に可視化されないから。
- なぜ？
会議中に感情の違和感を検知し、対話の仕方を調整する支援がないから。

→ 本当に解決したい課題：
「本音を言いにくい会話で生まれる心理的なズレを、会議中に早期発見して対話を修正できないこと」

---

## 4. 想定ユーザーについて

### 4-1. 想定しているユーザー

年齢設定：
- 年齢：28〜45歳
- 理由：営業・カウンセリング・交渉の実務を一定以上担い、オンライン会議の意思決定責任を持つ年代であるため

生活・状況設定：
- 生活・状況：1日に複数の商談、面談、折衝をオンライン中心で実施している
- 理由：会議件数が多いほど、相手の微細な変化を人力だけで追うのが難しく、補助ツールの価値が出やすい

環境設定：
- 環境：Zoom/Meet/Teams 併用、在宅・出社のハイブリッド、時間制約が強い
- 理由：会議ログを後で見返すだけでは遅く、リアルタイム通知で会話中に軌道修正できる必要がある

### 4-2. 自分とユーザーの距離

- 選択：身近な誰か

理由：自分自身も近い課題を感じる一方、最初の導入は実務現場で課題が顕在化している営業・相談職の知人に聞きながら作る方が、需要検証と改善サイクルを回しやすいため。

### 4-3. 実際に使われる可能性について(需要・存在確認)

- まず最初に使ってくれそうな人は誰か？
商談の失注分析を日常的に行っているインサイドセールス、キャリアカウンセラー、採用面接官。
- その人は、どんな場面でこのアプリを思い出すか？
「会話は穏やかだったのに、結果が悪かった」会議の直前や振り返り時。
- 今の生活の中で、代わりに使っているものは何か？
会議録画、議事録ツール、主観的なメモ、ロープレ。
- それを置き換えてまで使う理由はあるか？
既存手段は事後分析中心で、会議中に行動を変える指示が出ない。EmotionLens はリアルタイム通知で「今すぐ何を変えるか」を示せる。

### 4-4. ユーザーがサービスを導入して利用するまでのイメージ(導入・継続の流れ)

- どんな場面・困りごとがきっかけで、このサービスを知る・思い出すか
失注・面談離脱・交渉長期化が続き、「ヒアリングの質」を改善したいタイミング。
- 最初の一歩（登録・導入）で、ユーザーは何をする必要があるか
APIキー設定、ブラウザでマイク/カメラ許可、テスト会議で感情通知のしきい値を確認。
- 利用を続ける理由は何か？（習慣・必要性・価値）
会議ごとの感情ログとアラート履歴が残り、改善行動と結果の相関を振り返れるため。

toB観点：
- 企業や組織が導入判断する理由
商談品質の標準化、育成の再現性向上、対話品質KPIの可視化。
- 機密情報や業務データを登録してもらうための工夫
API Routes経由で鍵を秘匿、クライアントへ秘密情報を露出しない設計、運用ポリシーを明記。
- 既存運用から乗り換えるハードル
会議文化を変える心理的抵抗と、初期設定の手間。段階導入（チーム単位の試験運用）で緩和する。

## 5. 既存サービス・競合調査

### 5-1. 似たサービスの調査

- サービス名：Hume AI
- URL：https://hume.ai
- どんなことができるか：音声・映像から感情特徴を推定するAPI提供、リアルタイム/バッチ分析対応

### 5-2. それでも自分が作りたい理由

既存APIや分析ツールは高機能だが、現場で欲しいのは「会議中にどう振る舞いを変えるか」の具体的指示です。
単なる感情スコアの列では、忙しい会議中に判断できず、結果として使われない違和感がありました。
EmotionLens では、感情検知を目的にせず、対話行動の修正を主目的に置きます。

### 5-3. 差別化を一文で決める

このアプリは、【相手の本音を引き出したい対話担当者】の【会議中に違和感が生まれた瞬間】を一番助けるアプリです。

- 私のアプリの差別化ポイント：
感情推定結果をリアルタイムの行動提案（声量・速度・問い方）に変換して返す点。

---

## 6. このサービスで提供したい価値

### 6-1. ユーザーの変化

- 行動の変化：会話中に質問の深さ、話速、共感表現を意識的に調整できる
- 気持ちの変化：手応えのない会議でも、次に打つ手が分かる安心感が得られる
- 考え方の変化：結果だけでなく、対話プロセス自体を改善対象として捉えられる

### 6-2. 価値を一文で表す

このサービスは本音を引き出したい人が、会議中の感情のズレに気づいて対話をその場で修正できるようになるサービス。

---

## 7. このアプリで実現すること

### MVPで作る機能

- Tauri + TypeScript strict + Tailwind + DaisyUI の開発基盤
- ネイティブ（macOS 優先）開発環境セットアップ
- 感情ドメイン型、閾値、重み付けロジック
- 音声/表情の解析API（Hume連携）
- Web Audio API / カメラ入力のキャプチャHooks
- メイン画面でのリアルタイム通知（EmotionAlert / EmotionPanel）

### 本リリースで作る機能

- レポート画面（KPI、時系列、アラートログ）
- ネイティブアプリの署名・配布設定
- 運用ドキュメントと導入手順の整備
- GitHub Releases / App Store デプロイ導線整備

---

## 8. このアプリの懸念点とその対策

### 懸念点①

- 何が問題になりそうか：感情推定の誤検知により、誤った行動提案を行う可能性
- なぜそう思うか：感情は個人差・文化差・文脈依存が大きく、単一モデルでの解釈に限界があるため
- そのために考えている対策：
「断定」ではなく「可能性」として通知し、音声と表情の複合判定、閾値調整、ユーザーフィードバックで改善する

### 懸念点②

- 何が問題になりそうか：toB導入時のプライバシー・コンプライアンス懸念
- なぜそう思うか：会議データは機密性が高く、導入判断の最大障壁になりやすいため
- そのために考えている対策：
APIキーをサーバー側限定で利用、保存データ最小化、保持期間ポリシーの明示、監査可能な運用ガイドを整備する

---

## 9. 今後の展開・発展の方向性

### 今考えている発展案

- 機能追加の方向性：
個人最適の通知強度、業種別テンプレート、会議目的別のアラートプロファイル
- UI・体験の改善：
会議中のノイズを減らす表示モード、重要通知だけを残すフォーカスUI
- 機能以外の工夫：
チーム向け振り返りフレーム、教育コンテンツ、導入時チェックリストの提供

---

## 10. 技術スタック（手段としての技術）

### 10-1. 使用予定の技術

- フレームワーク：Tauri（ネイティブアプリ）+ Vite + React + TypeScript（strict）
- DB：PostgreSQL（ログインユーザー単位のセッション保存に使用、オプション）
- デプロイ先：GitHub Releases / App Store / Microsoft Store / 自社配布
- 使用予定ライブラリ：
Tailwind CSS、DaisyUI、Framer Motion、Recharts、@mediapipe/face_mesh、@mediapipe/camera_utils、@tauri-apps/api

### 10-2. 技術選定の理由

- なぜこの技術を使うのか：
Tauri でクロスプラットフォームネイティブアプリを実現し、OS レベルのシステムリソースアクセス（マイク、カメラ、ファイルシステム）を安全に確保するため
- 今回チャレンジしたい点：
リアルタイム音声/映像処理と感情推定を、UI通知まで低遅延でつなぐ実装
- 不安な点：
OS 権限リクエスト、ネイティブビルドの複雑性、クロスプラットフォーム対応の手間

### 10-3.キャッチアップ不足の懸念

1. 完成までのハードルが高い
音声・映像・推定API・UIを同時に扱うため、基礎理解不足があると実装速度が落ちる。

2. Issueの見積もりが難しい
調査時間の振れ幅が大きく、機能単位の工数が読みづらい。

対応方針：
- Issueを段階分割して、MVPを先に固定する
- 「調査タスク」を明示的にIssue化して見積もり不確実性を吸収する
- React/Nextの深い最適化は本リリース後に段階導入し、先に価値検証を優先する

---

## 11. 前提条件・必要なツール

### 必須

- **Node.js**: 20.x 以上
- **npm**: 10.x 以上（またはyarn）
- **Git**: コマンドラインから実行可能
- **Rust**: 1.70 以上（Tauri ネイティブビルド用）
- **Hume.ai アカウント**: 感情解析 API キー取得用

### 推奨

- **VS Code**: 開発エディタ
- **Chrome / Safari / Edge**: ブラウザ（マイク・カメラ許可で動作確認）
- **Xcode Command Line Tools**: macOS でのネイティブビルド用（`xcode-select --install`）

---

## 12. Hume.ai API キーの取得方法

EmotionLens は Hume.ai の音声・表情解析 API を使用します。アプリ起動前に API キーを取得してください。

### ステップ 1: Hume.ai に登録

1. [Hume.ai 公式サイト](https://www.hume.ai) にアクセス
2. 右上の **「Sign Up」** をクリック
3. メールアドレスとパスワードでアカウント作成
4. メール確認して本人確認完了

### ステップ 2: API キーを生成

1. ダッシュボード右上の **「Settings」** または **「API Keys」** にアクセス
2. **「Create new API key」** をクリック
3. キー名（例：`EmotionLens-Dev`）を入力
4. **Secret Key も同時に表示** → 必ずコピーして保存（二度と表示されません）
5. **API Key** と **Secret Key** 両方を別途保管

⚠️ **重要**: Secret Key は絶対に GitHub に commit しないでください。`.env.local` / `.env` ファイルに記載し、`.gitignore` で除外してください。

---

## 13. インストール・セットアップ

### 13-1. リポジトリをクローン

```bash
git clone https://github.com/yudai142/EmotionLens.git
cd EmotionLens
```

### 13-2. 依存パッケージをインストール

```bash
npm install
```

### 13-3. Rust 環境のセットアップ（Tauri ネイティブビルド用）

```bash
# rustup をインストール（macOS/Linux）
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# または Homebrew でインストール（macOS）
brew install rustup

# Rust をセットアップ
rustup default stable
```

### 13-4. 環境変数を設定

`.env.example` をコピーして `.env.local` を作成：

```bash
cp .env.example .env.local
```

`.env.local` を編集して、Hume.ai から取得した API キーを設定：

```env
HUME_API_KEY=your_actual_hume_api_key_here
HUME_SECRET_KEY=your_actual_hume_secret_key_here
AUTH_SECRET=replace_with_a_long_random_secret
AUTH_DEMO_EMAIL=demo@example.com
AUTH_DEMO_PASSWORD=change_me_securely
DATABASE_URL=postgres://postgres:postgres@localhost:5432/emotion_lens
NODE_ENV=development
```

⚠️ `.env.local` は Git で管理されません（`.gitignore` で除外）

認証付き保存フローを使う場合の前提：

- `AUTH_SECRET` は Auth.js の署名に使うため、十分長いランダム文字列に置き換える
- `AUTH_DEMO_EMAIL` / `AUTH_DEMO_PASSWORD` は開発用ログイン資格情報。共有環境では必ず変更する
- `DATABASE_URL` は PostgreSQL の read/write 可能な接続先を指定する
- ログインしていない状態ではセッションはサーバー保存されず、保存済みレポートも表示されない

---

## 14. 開発環境での実行

### 14-1. Tauri ネイティブ開発（推奨）

```bash
npm run tauri:dev
```

- Tauri アプリがネイティブウィンドウで起動
- macOS 上でネイティブ実行ファイルとして動作
- マイク・カメラの OS 権限リクエストが表示される場合がある
- **「許可」** をクリックして権限を有効化
- **「開始」** ボタンで会議画面シミュレーション開始
- `Ctrl+C` で停止

### 14-2. Web ブラウザ開発（テスト用）

```bash
npm run dev
```

- Vite 開発サーバーが起動（http://localhost:5173）
- ブラウザでのテストに使用
- マイク・カメラのブラウザ許可ダイアログが表示されたら **「許可」** をクリック

---

## 15. Tauri ネイティブアプリのビルド

本番相当のネイティブアプリケーション（.app / .dmg）をビルドします：

### 15-1. Tauri バンドル生成

```bash
npm run tauri:build
```

- `src-tauri/target/release/bundle/` 以下に以下が生成されます：
  - macOS: `emotion-lens.app` / `emotion-lens.dmg`
  - Windows: `emotion-lens.exe` / `.msi`
  - Linux: `.AppImage` / `.deb`

### 15-2. 生成されたアプリの実行

macOS の場合：

```bash
open src-tauri/target/release/bundle/macos/emotion-lens.app
```

または生成された `.dmg` をダブルクリック

---

## 16. トラブルシューティング

### Q1: `HUME_API_KEY が設定されていません` エラーが表示される

**原因**: `.env.local` ファイルが作成されていない、または環境変数が設定されていない

**対策**:
1. `.env.local` ファイルが存在するか確認
   ```bash
   ls -la .env.local
   ```
2. ファイルが存在しない場合は作成
   ```bash
   cp .env.example .env.local
   ```
3. HUME_API_KEY と HUME_SECRET_KEY を正しく設定
4. サーバーを再起動
   ```bash
   npm run dev
   # または
   npm run docker:dev
   ```

### Q2: マイク・カメラが検出されない

**原因**: ブラウザのメディア入力許可が無い、またはデバイスが接続されていない

**対策**:
1. ブラウザの許可設定を確認（Chrome アドレスバー左の 🔒 アイコン）
2. **Microphone** と **Camera** が「Allow」になっているか確認
3. デバイスが他のアプリで使用中でないか確認（Zoom など）
4. ブラウザ再起動またはページ再読み込み（F5）

### Q3: Tauri アプリの起動に失敗する

**原因**: Rust 環境が正しくセットアップされていない、または依存パッケージが不足

**対策**:
```bash
# Rust がインストールされているか確認
rustc --version
cargo --version

# 最新の stable にアップデート
rustup update

# 依存パッケージを再インストール
npm install

# 再度ビルド
npm run tauri:dev
```

### Q4: `npm install` でエラーが発生

**原因**: Node.js バージョンが古い、または npm キャッシュが破損

**対策**:
```bash
# Node.js バージョン確認（20.x 以上必須）
node --version
npm --version

# npm キャッシュをクリア
npm cache clean --force

# 再度インストール
rm -rf node_modules package-lock.json
npm install
```

### Q5: Hume API 呼び出しで 401 / 403 エラー

**原因**: API キーが無効または有効期限切れ

**対策**:
1. Hume.ai ダッシュボードで API キーの有効性確認
2. キーが正しく `.env.local` に設定されているか確認
3. 必要に応じて新しい API キーを生成
4. `.env.local` を更新して保存
5. サーバー再起動
   ```bash
   npm run dev
   ```

### Q6: ログイン済みなのにセッションが保存されない

**原因**: `AUTH_SECRET` または `DATABASE_URL` が未設定、もしくは PostgreSQL に接続できていない

**対策**:
1. `.env.local` に `AUTH_SECRET`、`AUTH_DEMO_EMAIL`、`AUTH_DEMO_PASSWORD`、`DATABASE_URL` が設定されているか確認
2. PostgreSQL が起動しており、指定した DB 名に接続できるか確認
3. マイグレーション済みの `users` / `emotion_sessions` / `session_alerts` テーブルが存在するか確認
4. 認証後に `/api/auth/me` が 200 を返すか確認
5. 開発サーバーを再起動

### Q7: Docker イメージのビルドが遅い

**原因**: `docker/Dockerfile.prod` のマルチステージビルドで deps → builder → runner を実行しているため初回は時間がかかる

**対策**:
- 初回は 1-3 分かかる場合があります
- 以降のビルドはキャッシュが効くため高速化
- イメージサイズを削減したい場合は `.dockerignore` を確認

---

## 17. macOS パーミッション設定

### ブラウザパーミッション（カメラ・マイク）

EmotionLens はビデオ会議中の音声と表情を解析するため、ブラウザのカメラ・マイクへのアクセスを要求します。

**初回アクセス時の操作:**

1. EmotionLens を起動
2. 「アクセスを許可する」ボタンをクリック
3. ブラウザのパーミッション要求ダイアログが表示される
4. 「許可」をクリック

**PermissionsPrompt コンポーネントについて:**

- `src/components/macOS/PermissionsPrompt.tsx` がカメラ・マイク許可を管理
- ユーザーの対応状況は `localStorage` に保存
- 後で対応を選択した場合、ホーム画面の設定メニューで再度要求可能

### システム設定でのアクセス確認（macOS）

パーミッションが拒否された場合、以下の手順で確認してください：

**カメラアクセスの確認:**
1. Apple メニュー > システム設定
2. プライバシーとセキュリティ > カメラ
3. EmotionLens（ブラウザ）が許可リストに含まれてるか確認
4. 含まれていない場合は「許可」をクリック

**マイクアクセスの確認:**
1. Apple メニュー > システム設定
2. プライバシーとセキュリティ > 録音
3. EmotionLens（ブラウザ）が許可リストに含まれているか確認
4. 含まれていない場合は「許可」をクリック

### パーミッション拒否時の対応

- 拒否した場合、再度許可を求めるには**ブラウザの接続情報をリセット**する必要があります
- Chrome/Safari/Edge 各ブラウザのキャッシュ・サイトデータを削除後、再度アクセス
- または PermissionsPrompt コンポーネントから「アクセスを許可する」を再度クリック

---

## 18. クロスプラットフォームビルド

EmotionLens は Tauri により、Windows・Linux・macOS のネイティブアプリケーションとしてビルド可能です。

### 前提条件

**全プラットフォーム共通:**
- Node.js 18.x 以上
- Rust toolchain (`rustup` で前提条件を自動インストール)
- npm 9.x 以上

**macOS:**
- Xcode Command Line Tools
- ```bash
  xcode-select --install
  ```

**Windows:**
- Microsoft C++ Build Tools または Visual Studio 2022 Community Edition
- Windows 11/10 Pro 以上（Home では App Installer に制限あり）

**Linux:**
- `libssl-dev`, `libwebkit2gtk-4.1-dev`, `libappindicator3-dev`, `librsvg2-dev` 等
- Ubuntu/Debian:
  ```bash
  sudo apt-get install -y libssl-dev libwebkit2gtk-4.1-dev libappindicator3-dev librsvg2-dev
  ```
- Fedora:
  ```bash
  sudo dnf install -y openssl-devel webkit2gtk4.1-devel libappindicator-gtk3-devel librsvg2-devel
  ```

### ビルドコマンド

**開発モード（ホットリロード）:**
```bash
npm run tauri:dev
```

**本番ビルド（すべてのプラットフォーム）:**
```bash
npm run tauri:build
```

**プラットフォーム別ビルド:**

#### macOS (Intel/Apple Silicon)
```bash
npm run tauri:build:macos
# または
cargo tauri build --target universal-apple-darwin
```
- 出力: `src-tauri/target/release/bundle/dmg/*.dmg` / `src-tauri/target/release/bundle/macos/*.app`
- Intel/Apple Silicon 両対応の Universal Binary として生成

#### Windows (x86_64)
```bash
npm run tauri:build:windows
```
- 出力: `src-tauri/target/release/bundle/msi/*.msi`
- MSVC ビルドツールが必須
- インストーラー形式（.msi）で自動生成

#### Linux (x86_64)
```bash
npm run tauri:build:linux
```
- 出力: `src-tauri/target/release/bundle/`
  - AppImage: `src-tauri/target/release/bundle/appimage/*.AppImage`
  - .deb: `src-tauri/target/release/bundle/deb/*.deb`
- AppImage でも .deb でも配布可能

### リリースビルドの署名（オプション）

#### macOS App Store 提出・notarization
```bash
# Notarization 前に証明書の設定が必要
# See: https://tauri.app/en/v1/guides/distribution/sign-macos
```

#### Windows コード署名
```bash
# EV Certificate が必要
# src-tauri/tauri.conf.json で signingIdentity を設定可能
```

### ビルド出力の確認

各ビルド完了後、以下の場所に実行ファイル/インストーラーが生成されます：

- **macOS**: `.app` bundle または `.dmg` イメージ
- **Windows**: `.msi` インストーラー
- **Linux**: `.AppImage` または `.deb` パッケージ

### GitHub Releases での配布

リリース時は以下を GitHub Releases にアップロード：

```bash
gh release create v1.0.0 \
  src-tauri/target/release/bundle/dmg/*.dmg \  # macOS
  src-tauri/target/release/bundle/msi/*.msi \  # Windows
  src-tauri/target/release/bundle/appimage/*.AppImage \  # Linux
  --title "EmotionLens 1.0.0" \
  --notes "Release notes"
```

---

## 19. ディストリビューション・デプロイ

### ネイティブアプリ配布

Tauri でビルドしたネイティブアプリケーション（.app / .dmg / .exe）は以下の方法で配布できます：

- **Apple App Store**: macOS ビルド版を App Store 経由で配布
- **Microsoft Store**: Windows ビルド版を Store 経由で配布
- **GitHub Releases**: `.dmg` / `.exe` / `.AppImage` を直接アップロード
- **自社サーバー**: ダウンロードページで直接配布

### Web 版デプロイ（ブラウザ版）

Vite ビルドによる Web 版を Vercel / Railway / Render などの PaaS にデプロイできます：

#### Vercel（推奨・最も簡単）

```bash
# Vercel CLI をインストール
npm install -g vercel

# Vercel にデプロイ
vercel
```

- マージ直後に自動デプロイ可能
- 環境変数は Vercel ダッシュボード → Project Settings → Environment Variables で設定
- HTTPS 無料、独自ドメイン対応

**環境変数設定**:
1. Vercel ダッシュボード → Project → Settings
2. Environment Variables セクションで以下を追加
   - `HUME_API_KEY`
   - `HUME_SECRET_KEY`
   - `NODE_ENV=production`

### Railway（Docker ネイティブ）

**注**: このセクションは Web 版デプロイ用です。ネイティブアプリの場合は GitHub Releases などから直接配布してください。

```bash
# Railway CLI をインストール
npm install -g railway

# Railway にログイン
railway login

# デプロイ
railway up
```

- `Dockerfile` と `docker-compose.yml` をそのまま使用可能
- 月額制で無料枠あり

**注**: EmotionLens はネイティブ（Tauri）優先のため、Web 版のデプロイは補助的な役割です。

### Render

- Web Service として `npm run build && npm start` で実行
- 環境変数を GUI で設定
- 無料枠あり（スリープあり）

---

## 20. セキュリティに関する注意

### 機密情報の管理

- ✅ **API キーは `.env.local` / `.env` に記載**（Git 除外）
- ✅ **API Routes からのみ API キーを使用**（クライアント側で露出しない）
- ✅ **HTTPS でのアクセス**（本番環境では必須）
- ❌ **Git Commit に `.env.local` / API キーを含めない**
- ❌ **クライアント側の JavaScript に秘密鍵を書き込まない**

### 本番運用のベストプラクティス

1. **環境ごとに API キーを分ける**
   - 開発環境用、テスト環境用、本番環境用
2. **定期的にキーをローテーション**
   - Hume.ai ダッシュボードで定期更新
3. **アクセスログの監視**
   - 異常なリクエストを検知
4. **データ保持期間を設定**
   - 会議ログ・感情データの削除ルール
5. **保存対象を最小化**
   - 現在は `sessionId`、開始時刻、感情フレーム、アラートのみを保存し、録音・録画の生データは保持しない
6. **デモ認証情報の使い回しを避ける**
   - 開発・検証・本番で資格情報を分離し、共有テスト後は速やかにローテーションする

---

## 21. 認証付き保存フローの運用メモ

- ログイン済みユーザーのみ `POST /api/sessions` を通じてセッションを永続化する
- レポート画面は `GET /api/sessions/latest` でログインユーザー自身の最新データのみ取得する
- 他ユーザーの `session_id` を指定しても `GET /api/sessions/[sessionId]` は 404 を返す
- ローカル一時状態はセッション中の UI 表示に限定し、レポート表示はサーバー保存済みデータを優先する
- 運用時は DB バックアップ方針と保持期間を先に決めてからチーム利用を開始する

### 既知の制約と残課題

- 現在の認証はデモ用 Credentials Provider 前提で、SSO や本番向け ID プロバイダ連携は未対応
- セッション保存失敗時の自動リトライは未実装で、UI 上のエラー表示で再実行判断を行う
- 保持期間に応じた自動削除ジョブは未実装のため、別 issue で定期削除運用を切り出す想定

---

## 22. ライセンス

MIT License

EmotionLens はオープンソースプロジェクトです。
自由に使用・改変・配布できます。詳細は [LICENSE](./LICENSE) ファイルを参照してください。

---

## 23. サポート・フィードバック

問題報告・機能リクエストは GitHub Issues で受け付けています。

https://github.com/yudai142/EmotionLens/issues

---

**Last Updated**: 2026年5月
**Version**: 0.1.0 (MVP)
