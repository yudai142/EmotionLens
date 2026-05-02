import fs from 'node:fs';
import path from 'node:path';

describe('package.json scripts', () => {
  it('Issue #1 で必要なスクリプトが定義されている', () => {
    const packageJsonPath = path.resolve(process.cwd(), 'package.json');
    const packageJsonRaw = fs.readFileSync(packageJsonPath, 'utf-8');
    const packageJson = JSON.parse(packageJsonRaw) as { scripts?: Record<string, string> };

    expect(packageJson.scripts?.dev).toBe('next dev');
    expect(packageJson.scripts?.build).toBe('next build');
    expect(packageJson.scripts?.start).toBe('next start');
    expect(packageJson.scripts?.lint).toBe('next lint');
    expect(packageJson.scripts?.['docker:dev']).toBe('docker compose up --build');
    expect(packageJson.scripts?.['docker:prod']).toBe('docker compose -f docker-compose.prod.yml up --build');
    expect(packageJson.scripts?.['docker:down']).toBe('docker compose down');
  });
});
