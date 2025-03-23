import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { TokenCardList } from "..";
import { TokenInfo } from "../token-card/types";

// Mock TokenCard component
jest.mock("../token-card", () => ({
  TokenCard: (props: TokenInfo) => (
    <div data-testid="token-card" data-token-symbol={props.symbol}>
      {props.symbol} - {props.balance}
    </div>
  ),
}));

describe("TokenCardList", () => {
  const mockTokens: TokenInfo[] = [
    {
      symbol: "ETH",
      balance: "1.5",
      name: "Ethereum",
    },
    {
      symbol: "USDT",
      balance: "1000.0",
      name: "Tether USD",
    },
    {
      symbol: "UNI",
      balance: "50.0",
      name: "Uniswap",
    },
  ];

  it("should render list of token cards", () => {
    render(<TokenCardList balanceItems={mockTokens} />);

    const tokenCards = screen.getAllByTestId("token-card");
    expect(tokenCards).toHaveLength(3);
    expect(tokenCards[0]).toHaveTextContent("ETH - 1.5");
    expect(tokenCards[1]).toHaveTextContent("USDT - 1000.0");
    expect(tokenCards[2]).toHaveTextContent("UNI - 50.0");
  });

  it("should render empty list when no tokens provided", () => {
    const { container } = render(<TokenCardList balanceItems={[]} />);

    const listWrapper = container.querySelector(".card-list-wrapper");
    expect(listWrapper).toBeInTheDocument();
    expect(listWrapper).toBeEmptyDOMElement();
  });

  it("should render tokens with correct data attributes", () => {
    render(<TokenCardList balanceItems={mockTokens} />);

    const tokenCards = screen.getAllByTestId("token-card");
    expect(tokenCards[0]).toHaveAttribute("data-token-symbol", "ETH");
    expect(tokenCards[1]).toHaveAttribute("data-token-symbol", "USDT");
    expect(tokenCards[2]).toHaveAttribute("data-token-symbol", "UNI");
  });

  it("should maintain token order as provided", () => {
    const reorderedTokens = [...mockTokens].reverse();
    render(<TokenCardList balanceItems={reorderedTokens} />);

    const tokenCards = screen.getAllByTestId("token-card");
    expect(tokenCards[0]).toHaveTextContent("UNI");
    expect(tokenCards[1]).toHaveTextContent("USDT");
    expect(tokenCards[2]).toHaveTextContent("ETH");
  });
});
