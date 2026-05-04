/**
 * docker-compose.yml のテスト
 * 開発用 compose にアプリと PostgreSQL が含まれることを検証する
 */

import fs from 'fs';
import path from 'path';
import YAML from 'yaml';

describe('docker-compose.yml', () => {
  let composeContent: string;
  let composeYaml: any;

  beforeAll(() => {
    const composePath = path.join(__dirname, '../../docker-compose.yml');
    composeContent = fs.readFileSync(composePath, 'utf-8');
    composeYaml = YAML.parse(composeContent);
  });

  it('ファイルが存在する', () => {
    expect(composeContent).toBeDefined();
    expect(composeContent.length).toBeGreaterThan(0);
  });

  it('YAML パースが成功する', () => {
    expect(composeYaml).toBeDefined();
    expect(typeof composeYaml).toBe('object');
  });

  it('services セクションがある', () => {
    expect(composeYaml.services).toBeDefined();
  });

  it('emotion-lens サービスが定義されている', () => {
    expect(composeYaml.services['emotion-lens']).toBeDefined();
  });

  it('postgres サービスが定義されている', () => {
    expect(composeYaml.services.postgres).toBeDefined();
  });

  it('emotion-lens が postgres に依存している', () => {
    const service = composeYaml.services['emotion-lens'];
    expect(service.depends_on).toBeDefined();
    expect(Object.keys(service.depends_on)).toContain('postgres');
  });

  it('emotion-lens に DATABASE_URL が定義されている', () => {
    const service = composeYaml.services['emotion-lens'];
    const env = service.environment;

    if (Array.isArray(env)) {
      expect(env.some((value) => String(value).startsWith('DATABASE_URL='))).toBe(true);
      return;
    }

    expect(env.DATABASE_URL).toMatch(/postgres/i);
  });

  it('postgres に永続ボリュームが設定されている', () => {
    const service = composeYaml.services.postgres;
    expect(service.volumes).toBeDefined();
    expect(service.volumes.some((value: string) => value.includes('postgres-data'))).toBe(true);
  });
});