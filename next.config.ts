import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    forceSwcTransforms: false,
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(js|jsx|ts|tsx)$/,
      exclude: /node_modules/,
      use: [
        {
          loader: 'esbuild-loader',
          options: {
            loader: 'tsx',
            target: 'es2020',
            jsx: 'automatic',
          },
        },
      ],
    });

    return config;
  },
  output: 'standalone',
  images: {
    domains: [],
    unoptimized: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
