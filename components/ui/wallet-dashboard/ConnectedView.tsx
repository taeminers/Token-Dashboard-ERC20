"use client";
import { Button } from "@/components/button";
import { AddressSection } from "@/components/ui/address-section";
import { SearchBar } from "@/components/ui/search-bar";
import { TokenCardList } from "@/components/ui/token-card-list";
import { TokenInfo } from "../token-card-list/token-card/types";
import { useWallet } from "@/context/WalletContext";

export const ConnectedView = () => {
  const { walletAddress, ETHBalance, tokenInfo, loading, error, disconnect } =
    useWallet();

  const balanceItems: TokenInfo[] = tokenInfo
    ? [tokenInfo, { name: "Test ETH", symbol: "TETH", balance: ETHBalance }]
    : [];

  return (
    <>
      <AddressSection address={walletAddress ?? ""} />
      <SearchBar />
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : (
        <TokenCardList balanceItems={balanceItems} />
      )}
      <Button fixedBottom={true} onClick={disconnect}>
        <h1>지갑 연결 끊기</h1>
      </Button>
    </>
  );
};
