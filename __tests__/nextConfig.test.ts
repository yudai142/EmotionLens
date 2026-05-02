const nextConfig = require('../next.config.js');

describe('next.config.js', () => {
  it('standalone 出力を有効にしている', () => {
    expect(nextConfig.output).toBe('standalone');
  });

  it('SWC 変換を強制しない設定になっている', () => {
    expect(nextConfig.experimental?.forceSwcTransforms).toBe(false);
  });

  it('webpack に esbuild-loader のルールを追加する', () => {
    const mockConfig = { module: { rules: [] as unknown[] } };

    // WebpackConfigContext の必須プロパティをすべて満たすモック
    const result = nextConfig.webpack?.(mockConfig as never, {
      buildId: 'test',
      dev: true,
      isServer: false,
      defaultLoaders: {} as never,
      webpack: {} as never,
      nextRuntime: undefined,
      dir: '/app',
      config: {} as never,
      totalPages: 1,
    });

    expect(result).toBe(mockConfig);

    const hasEsbuildRule = (mockConfig.module.rules as Array<{ use?: Array<{ loader?: string }> }>).some(
      (rule) =>
        Array.isArray(rule.use) &&
        rule.use.some((u) => u.loader === 'esbuild-loader')
    );

    expect(hasEsbuildRule).toBe(true);
  });
});
