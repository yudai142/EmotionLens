import '@testing-library/jest-dom';

jest.mock('server-only', () => ({}), { virtual: true });

// Recharts が必要とする ResizeObserver をモック
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Tauri API をモック
jest.mock('@tauri-apps/api', () => ({
  invoke: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('@tauri-apps/api/event', () => ({
  listen: jest.fn(),
  emit: jest.fn(),
}));
