import { Button } from "@/components/button";
import Header from "@/components/header";
import { SearchBar } from "@/components/ui/search-bar";
import { AddressSection } from "@/components/ui/address-section";
import { TokenCardList } from "@/components/ui/token-card-list";
import { TokenCardProps } from "@/components/ui/token-card-list/token-card/types";

const testData: TokenCardProps[] = [
  {
    title: "first",
    balance: "1 ETH",
  },
  {
    title: "second",
    balance: "99 BTC",
  },
];

export default function Home() {
  return (
    <main>
      <Header text="토큰 대시보드" />
      <AddressSection />
      <SearchBar />
      <TokenCardList balanceItems={testData} />
      <Button fixedBottom={true}>
        <h1>지갑 연결 끊기</h1>
      </Button>
    </main>
  );
}
