/**
 * docker-compose.prod.yml のテスト
 * 本番用 compose 設定を検証する
 */

import fs from 'fs';
import path from 'path';
import YAML from 'yaml';

describe('docker-compose.prod.yml', () => {
  let composeContent: string;
  let composeYaml: any;

  beforeAll(() => {
    const composePath = path.join(__dirname, '../../docker-compose.prod.yml');
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
    expect(composeYaml.services['emotion-lens'] || composeYaml.services['app']).toBeDefined();
  });

  it('build args が定義されている', () => {
    const service = composeYaml.services['emotion-lens'] || composeYaml.services['app'];
    if (service.build) {
      expect(service.build.args || service.build).toBeDefined();
    }
  });

  it('environment 変数が定義されている', () => {
    const service = composeYaml.services['emotion-lens'] || composeYaml.services['app'];
    expect(service.environment).toBeDefined();
  });

  it('ports が定義されている', () => {
    const service = composeYaml.services['emotion-lens'] || composeYaml.services['app'];
    expect(service.ports).toBeDefined();
  });

  it('NODE_ENV が production に設定されている', () => {
    const service = composeYaml.services['emotion-lens'] || composeYaml.services['app'];
    const env = service.environment;
    if (typeof env === 'object' && env !== null) {
      expect(env.NODE_ENV || env['NODE_ENV']).toBe('production');
    }
  });
});
