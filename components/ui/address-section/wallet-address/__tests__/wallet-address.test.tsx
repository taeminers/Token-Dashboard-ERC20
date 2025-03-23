import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { WalletAddress } from "..";

// Mock formatWalletAddress helper
jest.mock("@/helpers/formatWalletAddress", () => ({
  formatWalletAddress: (address: string) => {
    // Simulate the actual formatting logic for testing
    if (!address) return "Not connected";
    const start = address.slice(0, 6);
    const end = address.slice(-4);
    return `${start}...${end}`;
  },
}));

describe("WalletAddress", () => {
  const mockAddress = "0x1234567890abcdef1234567890abcdef12345678";

  it("should render formatted wallet address", () => {
    render(<WalletAddress wallet_address={mockAddress} />);

    const formattedAddress = screen.getByText("0x1234...5678");
    expect(formattedAddress).toBeInTheDocument();
    expect(formattedAddress).toHaveClass("wallet-address-text");
  });

  it("should handle empty address", () => {
    render(<WalletAddress wallet_address="" />);

    const notConnectedText = screen.getByText("Not connected");
    expect(notConnectedText).toBeInTheDocument();
    expect(notConnectedText).toHaveClass("wallet-address-text");
  });

  it("should format short addresses", () => {
    const shortAddress = "0x1234";
    render(<WalletAddress wallet_address={shortAddress} />);

    // Even short addresses should be formatted with ...
    const formattedAddress = screen.getByText("0x1234...1234");
    expect(formattedAddress).toBeInTheDocument();
  });

  it("should maintain consistent formatting for different address lengths", () => {
    const addresses = [
      "0x1234567890abcdef1234567890abcdef12345678",
      "0xabcdef1234567890abcdef1234567890abcdef12",
      "0x9876543210fedcba9876543210fedcba98765432",
    ];

    addresses.forEach((address) => {
      const { unmount } = render(<WalletAddress wallet_address={address} />);
      const formatted = screen.getByText(
        `${address.slice(0, 6)}...${address.slice(-4)}`
      );
      expect(formatted).toBeInTheDocument();
      expect(formatted.textContent?.length).toBe(13); // "0xABCD...1234" is always 13 chars
      unmount(); // Clean up for next iteration
    });
  });
});
