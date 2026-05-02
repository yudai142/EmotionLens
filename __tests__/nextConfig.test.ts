import nextConfig from '../next.config';

describe('next.config.ts', () => {
  it('standalone 出力を有効にしている', () => {
    expect(nextConfig.output).toBe('standalone');
  });

  it('SWC 変換を強制しない設定になっている', () => {
    expect(nextConfig.experimental?.forceSwcTransforms).toBe(false);
  });

  it('webpack に esbuild-loader のルールを追加する', () => {
    const mockConfig = { module: { rules: [] as unknown[] } };

    const result = nextConfig.webpack?.(mockConfig as never, {
      buildId: 'test',
      dev: true,
      isServer: false,
      defaultLoaders: {} as never,
      webpack: {} as never,
      nextRuntime: undefined,
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
