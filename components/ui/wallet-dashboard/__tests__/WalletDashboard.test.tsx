import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { WalletDashboard } from "../index";

// Mock the child components
jest.mock("../ConnectedView", () => ({
  ConnectedView: () => <div data-testid="connected-view">Connected View</div>,
}));

jest.mock("../DisconnectedView", () => ({
  DisconnectedView: ({ onConnect }: { onConnect: () => Promise<void> }) => (
    <button data-testid="disconnected-view" onClick={onConnect}>
      지갑 연결하기
    </button>
  ),
}));

// Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    return <img {...props} />;
  },
}));

// Mock the WalletContext
const mockConnect = jest.fn();
const mockDisconnect = jest.fn();
let mockIsConnected = false;

jest.mock("@/context/WalletContext/WalletContext", () => ({
  WalletProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="wallet-provider">{children}</div>
  ),
  useWallet: () => ({
    isConnected: mockIsConnected,
    connect: mockConnect,
    disconnect: mockDisconnect,
  }),
}));

// Mock SearchContext
jest.mock("@/context/SearchContext/SearchContext", () => ({
  SearchProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="search-provider">{children}</div>
  ),
}));

describe("WalletDashboard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockIsConnected = false;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should render DisconnectedView when wallet is not connected", async () => {
    mockIsConnected = false;

    render(<WalletDashboard />);

    await waitFor(() => {
      expect(screen.getByTestId("disconnected-view")).toBeInTheDocument();
      expect(screen.queryByTestId("connected-view")).not.toBeInTheDocument();
    });
  });

  it("should render ConnectedView when wallet is connected", async () => {
    mockIsConnected = true;

    render(<WalletDashboard />);

    await waitFor(() => {
      expect(screen.getByTestId("connected-view")).toBeInTheDocument();
      expect(screen.queryByTestId("disconnected-view")).not.toBeInTheDocument();
    });
  });

  it("should pass connect function to DisconnectedView", async () => {
    mockIsConnected = false;
    mockConnect.mockResolvedValueOnce(undefined);

    render(<WalletDashboard />);

    const disconnectedView = await screen.findByTestId("disconnected-view");
    await fireEvent.click(disconnectedView);

    await waitFor(() => {
      expect(mockConnect).toHaveBeenCalledTimes(1);
    });
  });

  it("should wrap ConnectedView with SearchProvider when connected", async () => {
    mockIsConnected = true;

    render(<WalletDashboard />);

    await waitFor(() => {
      expect(screen.getByTestId("search-provider")).toBeInTheDocument();
      expect(screen.getByTestId("connected-view")).toBeInTheDocument();
    });
  });
});
