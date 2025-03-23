import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { TokenCard } from "..";

// Mock next/navigation
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock formatTokenBalance helper
jest.mock("@/helpers/formatTokenBalance", () => ({
  formatTokenBalance: (balance: string) => {
    // Simulate the actual formatting logic for testing
    return parseFloat(balance).toFixed(3);
  },
}));

describe("TokenCard", () => {
  const mockToken = {
    name: "Ethereum",
    symbol: "ETH",
    balance: "1234.5678",
  };

  beforeEach(() => {
    mockPush.mockClear();
  });

  it("should render token information correctly", () => {
    render(<TokenCard {...mockToken} />);

    expect(screen.getByText("Ethereum")).toBeInTheDocument();
    expect(screen.getByText("1234.568 ETH")).toBeInTheDocument();
  });

  it("should navigate to send form when button is clicked", () => {
    render(<TokenCard {...mockToken} />);

    const sendButton = screen.getByText("토큰 보내기");
    fireEvent.click(sendButton);

    expect(mockPush).toHaveBeenCalledWith("/send-form");
  });

  it("should render with correct CSS classes", () => {
    const { container } = render(<TokenCard {...mockToken} />);

    expect(container.querySelector(".card-container")).toBeInTheDocument();
    expect(container.querySelector(".card-metadata")).toBeInTheDocument();
    expect(container.querySelector(".card-title")).toBeInTheDocument();
    expect(container.querySelector(".card-balance")).toBeInTheDocument();
    expect(
      container.querySelector(".card-bottom-container")
    ).toBeInTheDocument();
  });

  it("should format balance with symbol correctly", () => {
    const tokens = [
      { name: "Tether", symbol: "USDT", balance: "1000000.123456" },
      { name: "Bitcoin", symbol: "BTC", balance: "0.12345678" },
      { name: "Empty", symbol: "EMPTY", balance: "0" },
    ];

    tokens.forEach((token) => {
      const { unmount } = render(<TokenCard {...token} />);
      const expectedBalance = `${parseFloat(token.balance).toFixed(3)} ${
        token.symbol
      }`;
      expect(screen.getByText(expectedBalance)).toBeInTheDocument();
      unmount();
    });
  });

  it("should render button with correct styling", () => {
    render(<TokenCard {...mockToken} />);

    const button = screen.getByText("토큰 보내기");
    expect(button).toHaveClass("button-md");

    fireEvent.click(button);
    expect(mockPush).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith("/send-form");
  });
});
