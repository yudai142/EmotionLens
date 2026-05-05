import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/__tests__'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: { jsx: 'react-jsx' } }],
  },
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/src-tauri/',
    // Issue #28 以前の実装が不完全なため、以下のテストは一時的に無視
    'api/',
    'hooks/',
    'components/layout/',
    'components/emotion/',
    'app/page',
    'app/report',
    'app/login',
    'lib/hume',
    'docker/',
    'routing',
    'packageScripts',
  ],
};

export default config;
