import "@testing-library/jest-dom";

// Mock window.ethereum
const mockEthereum = {
  request: jest.fn(),
  on: jest.fn(),
  removeListener: jest.fn(),
};

global.window = {
  ...global.window,
  ethereum: mockEthereum,
};

// Mock fetch
global.fetch = jest.fn();
