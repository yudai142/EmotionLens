import '@testing-library/jest-dom';

jest.mock('server-only', () => ({}), { virtual: true });

// Recharts が必要とする ResizeObserver をモック
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));
