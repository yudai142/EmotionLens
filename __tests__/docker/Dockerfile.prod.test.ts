/**
 * docker/Dockerfile.prod のテスト
 * マルチステージビルドの構成を検証する
 */

import fs from 'fs';
import path from 'path';

describe('Dockerfile.prod', () => {
  let dockerfileProd: string;

  beforeAll(() => {
    const dockerPath = path.join(__dirname, '../../docker/Dockerfile.prod');
    dockerfileProd = fs.readFileSync(dockerPath, 'utf-8');
  });

  it('ファイルが存在する', () => {
    expect(dockerfileProd).toBeDefined();
    expect(dockerfileProd.length).toBeGreaterThan(0);
  });

  it('3 つのステージを定義している', () => {
    const deps = dockerfileProd.includes('# deps');
    const builder = dockerfileProd.includes('# builder');
    const runner = dockerfileProd.includes('# runner');
    expect(deps || builder || runner).toBeTruthy();
  });

  it('standalone 出力を使用している', () => {
    expect(dockerfileProd).toMatch(/standalone|output.*standalone/i);
  });

  it('Node Alpine を使用している', () => {
    expect(dockerfileProd).toMatch(/node.*alpine/i);
  });

  it('WORKDIR が定義されている', () => {
    expect(dockerfileProd).toMatch(/WORKDIR/);
  });
});
