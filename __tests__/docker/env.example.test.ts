/**
 * .env.example のテスト
 * 環境変数テンプレートの必須キーを検証する
 */

import fs from 'fs';
import path from 'path';

describe('.env.example', () => {
  let envExample: string;

  beforeAll(() => {
    const envPath = path.join(__dirname, '../../.env.example');
    envExample = fs.readFileSync(envPath, 'utf-8');
  });

  it('ファイルが存在する', () => {
    expect(envExample).toBeDefined();
    expect(envExample.length).toBeGreaterThan(0);
  });

  it('HUME_API_KEY が記載されている', () => {
    expect(envExample).toMatch(/HUME_API_KEY/);
  });

  it('HUME_SECRET_KEY が記載されている', () => {
    expect(envExample).toMatch(/HUME_SECRET_KEY/);
  });

  it('NODE_ENV が記載されている', () => {
    expect(envExample).toMatch(/NODE_ENV/);
  });

  it('コメント行がある（説明文書）', () => {
    expect(envExample).toMatch(/#/);
  });
});
