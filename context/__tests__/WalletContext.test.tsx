// __tests__/WalletContext.test.tsx
import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useWallet, WalletProvider } from "@/context/WalletContext";

// Mock component to consume the context
const TestComponent = () => {
  const {
    walletAddress,
    isConnected,
    ETHBalance,
    tokenInfo,
    loading,
    error,
    connect,
    disconnect,
    refetchTokenData,
  } = useWallet();

  return (
    <div>
      <div data-testid="wallet-address">{walletAddress || "Not connected"}</div>
      <div data-testid="connected">{isConnected.toString()}</div>
      <div data-testid="eth-balance">{ETHBalance}</div>
      <div data-testid="token-info">
        {tokenInfo ? JSON.stringify(tokenInfo) : "No token info"}
      </div>
      <div data-testid="loading">{loading.toString()}</div>
      <div data-testid="error">{error || "No error"}</div>
      <button data-testid="connect-btn" onClick={connect}>
        Connect
      </button>
      <button data-testid="disconnect-btn" onClick={disconnect}>
        Disconnect
      </button>
      <button data-testid="refetch-btn" onClick={refetchTokenData}>
        Refetch
      </button>
    </div>
  );
};

const mockTokenInfo = {
  symbol: "TEST",
  balance: "100",
};

const setup = () => {
  const utils = render(
    <WalletProvider>
      <TestComponent />
    </WalletProvider>
  );
  return {
    ...utils,
    connectButton: screen.getByTestId("connect-btn"),
    disconnectButton: screen.getByTestId("disconnect-btn"),
    refetchButton: screen.getByTestId("refetch-btn"),
    walletAddress: screen.getByTestId("wallet-address"),
    connected: screen.getByTestId("connected"),
    ethBalance: screen.getByTestId("eth-balance"),
    tokenInfo: screen.getByTestId("token-info"),
    loading: screen.getByTestId("loading"),
    error: screen.getByTestId("error"),
  };
};

describe("WalletContext", () => {
  const mockAddress = "0xTestWalletAddress";
  const mockBalance = "1000000000000000000"; // 1 ETH in wei

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock window.ethereum
    window.ethereum = {
      request: jest.fn().mockImplementation(({ method }) => {
        switch (method) {
          case "eth_requestAccounts":
            return Promise.resolve([mockAddress]);
          case "eth_getBalance":
            return Promise.resolve(mockBalance);
          default:
            return Promise.reject(new Error("Unknown method"));
        }
      }),
      on: jest.fn(),
      removeListener: jest.fn(),
    };

    // Mock fetch
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockTokenInfo),
      })
    );
  });

  it("should connect wallet and fetch token data successfully", async () => {
    const { connectButton, walletAddress, connected, ethBalance, tokenInfo } =
      setup();

    await act(async () => {
      connectButton.click();
    });

    await waitFor(() => {
      expect(walletAddress).toHaveTextContent(mockAddress);
      expect(connected).toHaveTextContent("true");
      expect(ethBalance).toHaveTextContent("1"); // 1 ETH
      expect(tokenInfo).toHaveTextContent(JSON.stringify(mockTokenInfo));
    });
  });

  it("should handle MetaMask if it is not installed", async () => {
    window.ethereum = undefined;
    const alertMock = jest.spyOn(window, "alert").mockImplementation(() => {});
    const openMock = jest.spyOn(window, "open").mockImplementation(() => null);

    const { connectButton } = setup();

    await act(async () => {
      connectButton.click();
    });

    expect(alertMock).toHaveBeenCalled();
    expect(openMock).toHaveBeenCalledWith(
      "https://metamask.io/download/",
      "_blank"
    );

    alertMock.mockRestore();
    openMock.mockRestore();
  });

  it("should handle connect errors", async () => {
    // connect function
    window.ethereum = {
      request: jest.fn().mockImplementation(async ({ method }) => {
        if (method === "eth_requestAccounts") {
          throw new Error("User rejected");
        }
        return mockBalance;
      }),
      on: jest.fn(),
      removeListener: jest.fn(),
    };

    const { connectButton, connected, walletAddress, error } = setup();

    await act(async () => {
      await connectButton.click();
    });

    await waitFor(() => {
      expect(connected).toHaveTextContent("false");
      expect(walletAddress).toHaveTextContent("Not connected");
      expect(error).toHaveTextContent("Failed to connect wallet");
    });
  });

  it("should handle token fetch error", async () => {
    // data.error case
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ error: "Failed to fetch token data" }),
      })
    );

    const { connectButton, error, tokenInfo } = setup();

    await act(async () => {
      connectButton.click();
    });

    await waitFor(() => {
      expect(error).toHaveTextContent("Failed to fetch token data");
      expect(tokenInfo).toHaveTextContent("No token info");
    });
  });

  it("should handle network error during token fetch", async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error("Network error"));

    const { connectButton, error, tokenInfo, loading } = setup();

    await act(async () => {
      connectButton.click();
    });

    await waitFor(() => {
      expect(error).toHaveTextContent("Failed to fetch token data");
      expect(tokenInfo).toHaveTextContent("No token info");
      expect(loading).toHaveTextContent("false");
    });
  });

  it("should disconnect wallet", async () => {
    // disconnect function
    const {
      connectButton,
      disconnectButton,
      walletAddress,
      connected,
      ethBalance,
      tokenInfo,
    } = setup();

    // First connect
    await act(async () => {
      connectButton.click();
    });

    // Then disconnect
    await act(async () => {
      disconnectButton.click();
    });

    expect(walletAddress).toHaveTextContent("Not connected");
    expect(connected).toHaveTextContent("false");
    expect(ethBalance).toHaveTextContent("0");
    expect(tokenInfo).toHaveTextContent("No token info");
  });

  it("should not refetch token data if wallet is not connected", async () => {
    // refetchTokenData failed case when walletAddress is null
    const fetchSpy = jest.spyOn(global, "fetch");

    const { refetchButton, walletAddress } = setup();

    await act(async () => {
      refetchButton.click();
    });

    expect(walletAddress).toHaveTextContent("Not connected");
    expect(fetchSpy).not.toHaveBeenCalled();
    fetchSpy.mockRestore();
  });

  it("should refetch token data", async () => {
    // refetchTokenData function
    const { connectButton, refetchButton, tokenInfo, walletAddress } = setup();

    // First connect
    await act(async () => {
      connectButton.click();
    });

    // Update mock for refetch
    const updatedTokenInfo = { ...mockTokenInfo, balance: "200" };
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(updatedTokenInfo),
      })
    );

    // Trigger refetch
    await act(async () => {
      refetchButton.click();
    });

    await waitFor(() => {
      expect(tokenInfo).toHaveTextContent(JSON.stringify(updatedTokenInfo));
    });
  });

  it("should throw error when useWallet is used outside provider", () => {
    // test when no context is provided
    const TestWithoutProvider = () => {
      useWallet();
      return null;
    };

    expect(() => {
      render(<TestWithoutProvider />);
    }).toThrow("useWallet must be used within a WalletProvider");
  });
});
