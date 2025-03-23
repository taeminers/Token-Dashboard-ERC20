import { TokenCard } from "./token-card";
import "./token-card-list.css";
import { TokenInfo } from "./token-card/types";
type TokenCardList = {
  balanceItems: TokenInfo[];
};

export const TokenCardList = ({ balanceItems }: TokenCardList) => {
  return (
    <section className="card-list-wrapper">
      {balanceItems.map((item) => (
        <TokenCard {...item} key={item.balance} />
      ))}
    </section>
  );
};
