/**
 * README.md のテスト
 * セットアップ・API キー・デプロイ手順の記載を検証する
 */

import fs from 'fs';
import path from 'path';

describe('README.md', () => {
  let readme: string;

  beforeAll(() => {
    const readmePath = path.join(__dirname, '../../README.md');
    readme = fs.readFileSync(readmePath, 'utf-8');
  });

  it('ファイルが存在する', () => {
    expect(readme).toBeDefined();
    expect(readme.length).toBeGreaterThan(0);
  });

  it('プロジェクト説明がある', () => {
    expect(readme).toMatch(/EmotionLens|感情|emotion|声|表情/i);
  });

  it('前提条件セクションがある', () => {
    expect(readme).toMatch(/前提|Prerequisites|Requirements|Node|Docker/i);
  });

  it('セットアップ手順がある', () => {
    expect(readme).toMatch(/セットアップ|Setup|インストール|Installation|npm install/i);
  });

  it('API キー取得手順がある', () => {
    expect(readme).toMatch(/API|キー|key|Hume|設定/i);
  });

  it('認証付き保存フローの前提がある', () => {
    expect(readme).toMatch(/AUTH_SECRET|AUTH_DEMO_EMAIL|AUTH_DEMO_PASSWORD|認証/i);
  });

  it('DATABASE_URL の設定前提がある', () => {
    expect(readme).toMatch(/DATABASE_URL|PostgreSQL|postgres/i);
  });

  it('起動手順がある', () => {
    expect(readme).toMatch(/起動|Start|Run|npm run|docker/i);
  });

  it('Docker Compose で PostgreSQL を一緒に起動する説明がある', () => {
    expect(readme).toMatch(/docker compose|PostgreSQL|postgres/i);
  });

  it('docker-compose.prod.yml への依存がない', () => {
    expect(readme).not.toMatch(/docker-compose\.prod\.yml|docker:prod/);
  });

  it('保存データ運用の注意点がある', () => {
    expect(readme).toMatch(/保存データ|保持期間|ローテーション|ログイン中のみ|セッション保存/i);
  });

  it('残課題または既知の制約がある', () => {
    expect(readme).toMatch(/残課題|既知の制約|今後の改善|known issue/i);
  });

  it('トラブルシューティングがある', () => {
    expect(readme).toMatch(/トラブル|Troubleshoot|問題|FAQ|error/i);
  });

  it('ライセンスがある', () => {
    expect(readme).toMatch(/License|ライセンス|MIT|Apache/i);
  });
});
