import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ConnectedView } from "../ConnectedView";
import { SearchProvider } from "@/context/SearchContext/SearchContext";
import { TokenInfo } from "@/components/ui/token-card-list/token-card/types";

// Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    return <img {...props} />;
  },
}));

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    };
  },
  usePathname() {
    return "";
  },
}));

// Mock TokenCardList component
jest.mock("@/components/ui/token-card-list", () => ({
  TokenCardList: ({ balanceItems }: { balanceItems: TokenInfo[] }) => (
    <div data-testid="token-list">
      {balanceItems?.map((item: TokenInfo, index: number) => (
        <div key={index} data-testid="token-item">
          {item.name || "Test ETH"} - {item.symbol || "TETH"} - {item.balance}
        </div>
      ))}
    </div>
  ),
}));

const mockTokenInfo = {
  name: "Test Token",
  symbol: "TEST",
  balance: "100",
};

const mockETHBalance = "1.5";
const mockDisconnect = jest.fn();
const mockWalletAddress = "0xTestAddress";

// Mock useWallet hook
const mockUseWallet = jest.fn().mockReturnValue({
  walletAddress: mockWalletAddress,
  ETHBalance: mockETHBalance,
  tokenInfo: mockTokenInfo,
  loading: false,
  error: null,
  disconnect: mockDisconnect,
});

jest.mock("@/context/WalletContext/WalletContext", () => ({
  useWallet: () => mockUseWallet(),
}));

const renderWithProviders = () => {
  return render(
    <SearchProvider>
      <ConnectedView />
    </SearchProvider>
  );
};

describe("ConnectedView", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseWallet.mockReturnValue({
      walletAddress: mockWalletAddress,
      ETHBalance: mockETHBalance,
      tokenInfo: mockTokenInfo,
      loading: false,
      error: null,
      disconnect: mockDisconnect,
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("Loading and Error States", () => {
    it("should show loading state", async () => {
      mockUseWallet.mockReturnValue({
        walletAddress: mockWalletAddress,
        ETHBalance: "0",
        tokenInfo: null,
        loading: true,
        error: null,
        disconnect: mockDisconnect,
      });

      renderWithProviders();

      await waitFor(() => {
        expect(screen.getByText("Loading...")).toBeInTheDocument();
        expect(screen.queryByTestId("token-list")).not.toBeInTheDocument();
      });
    });

    it("should show error state", async () => {
      const testError = "Failed to fetch token info";
      mockUseWallet.mockReturnValue({
        walletAddress: mockWalletAddress,
        ETHBalance: "0",
        tokenInfo: null,
        loading: false,
        error: testError,
        disconnect: mockDisconnect,
      });

      renderWithProviders();

      await waitFor(() => {
        expect(screen.getByText(`Error: ${testError}`)).toBeInTheDocument();
        expect(screen.queryByTestId("token-list")).not.toBeInTheDocument();
      });
    });

    // it("should handle null tokenInfo", async () => {
    //   mockUseWallet.mockReturnValue({
    //     walletAddress: mockWalletAddress,
    //     ETHBalance: mockETHBalance,
    //     tokenInfo: null,
    //     loading: false,
    //     error: null,
    //     disconnect: mockDisconnect,
    //   });

    //   renderWithProviders();

    //   await waitFor(() => {
    //     const tokenList = screen.getByTestId("token-list");
    //     expect(tokenList).toBeInTheDocument();
    //     expect(tokenList).toHaveTextContent(
    //       `Test ETH - TETH - ${mockETHBalance}`
    //     );
    //   });
    // });
  });

  describe("Disconnect functionality", () => {
    it("should call disconnect when button is clicked", async () => {
      renderWithProviders();

      const disconnectButton = screen.getByRole("button", {
        name: "지갑 연결 끊기",
      });
      await fireEvent.click(disconnectButton);

      await waitFor(() => {
        expect(mockDisconnect).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("Search functionality", () => {
    it("should show all tokens initially", async () => {
      renderWithProviders();

      await waitFor(() => {
        const tokenItems = screen.getAllByTestId("token-item");
        expect(tokenItems).toHaveLength(2);
        expect(tokenItems[0]).toHaveTextContent(`Test Token - TEST - 100`);
        expect(tokenItems[1]).toHaveTextContent(
          `Test ETH - TETH - ${mockETHBalance}`
        );
      });
    });

    it("should filter tokens by name", async () => {
      renderWithProviders();

      const searchInput = screen.getByPlaceholderText("토큰 검색");
      await fireEvent.change(searchInput, { target: { value: "Test Token" } });

      await waitFor(() => {
        const tokenItems = screen.getAllByTestId("token-item");
        expect(tokenItems).toHaveLength(1);
        expect(tokenItems[0]).toHaveTextContent(`Test Token - TEST - 100`);
      });
    });

    it("should show no tokens when search term doesn't match", async () => {
      renderWithProviders();

      const searchInput = screen.getByPlaceholderText("토큰 검색");
      await fireEvent.change(searchInput, { target: { value: "NonExistent" } });

      await waitFor(() => {
        const tokenList = screen.getByTestId("token-list");
        expect(tokenList).toBeEmptyDOMElement();
      });
    });

    it("should be case insensitive", async () => {
      renderWithProviders();

      const searchInput = screen.getByPlaceholderText("토큰 검색");
      await fireEvent.change(searchInput, { target: { value: "test" } });

      await waitFor(() => {
        const tokenItems = screen.getAllByTestId("token-item");
        expect(tokenItems).toHaveLength(2);
        expect(tokenItems[0]).toHaveTextContent(`Test Token - TEST - 100`);
        expect(tokenItems[1]).toHaveTextContent(
          `Test ETH - TETH - ${mockETHBalance}`
        );
      });
    });

    it("should show all tokens after clearing search", async () => {
      renderWithProviders();

      const searchInput = screen.getByPlaceholderText("토큰 검색");
      const clearButton = screen.getByAltText("Close Icon");

      await fireEvent.change(searchInput, { target: { value: "Test Token" } });

      await waitFor(() => {
        const filteredItems = screen.getAllByTestId("token-item");
        expect(filteredItems).toHaveLength(1);
      });

      await fireEvent.click(clearButton);

      await waitFor(() => {
        const allItems = screen.getAllByTestId("token-item");
        expect(allItems).toHaveLength(2);
        expect(allItems[0]).toHaveTextContent(`Test Token - TEST - 100`);
        expect(allItems[1]).toHaveTextContent(
          `Test ETH - TETH - ${mockETHBalance}`
        );
      });
    });
  });
});
