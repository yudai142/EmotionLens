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

  it('起動手順がある', () => {
    expect(readme).toMatch(/起動|Start|Run|npm run|docker/i);
  });

  it('トラブルシューティングがある', () => {
    expect(readme).toMatch(/トラブル|Troubleshoot|問題|FAQ|error/i);
  });

  it('ライセンスがある', () => {
    expect(readme).toMatch(/License|ライセンス|MIT|Apache/i);
  });
});
