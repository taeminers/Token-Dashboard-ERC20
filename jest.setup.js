import "@testing-library/jest-dom";
import { fetch, Request, Response, Headers } from "@whatwg-node/fetch";

// Patch global scope for Jest (Node.js doesn't have these)
globalThis.fetch = fetch;
globalThis.Request = Request;
globalThis.Response = Response;
globalThis.Headers = Headers;

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
