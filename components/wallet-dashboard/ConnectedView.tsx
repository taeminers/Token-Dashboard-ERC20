"use client";
import { Button } from "@/components/ui/Button";
import { AddressSection } from "@/components/address-section";
import { SearchBar } from "@/components/search-bar";
import { TokenCardList } from "@/components/token-card-list";
import { TokenInfo } from "../token-card-list/token-card/types";
import { useSearch } from "@/context/SearchContext/SearchContext";
import { useWallet } from "@/context/WalletContext/WalletContext";
import { Spinner } from "@/components/ui/Spinner";

export const ConnectedView = () => {
  const { walletAddress, ETHBalance, tokenInfo, loading, error, disconnect } =
    useWallet();
  const { searchTerm } = useSearch();

  const allBalanceItems: TokenInfo[] = tokenInfo
    ? [tokenInfo, { name: "Test ETH", symbol: "TETH", balance: ETHBalance }]
    : [];

  const filteredBalanceItems = allBalanceItems.filter((item) => {
    const searchLower = searchTerm.toLowerCase();
    return item.name?.toLowerCase().includes(searchLower);
  });

  return (
    <>
      <AddressSection address={walletAddress} />
      <SearchBar />
      {loading ? (
        <Spinner />
      ) : error ? (
        <div>Error: {error}</div>
      ) : (
        <TokenCardList balanceItems={filteredBalanceItems} />
      )}
      <Button fixedBottom={true} onClick={disconnect} size="l">
        <h1>지갑 연결 끊기</h1>
      </Button>
    </>
  );
};
