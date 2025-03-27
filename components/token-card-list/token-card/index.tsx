"use client";
import { TokenInfo } from "./types";
import "./token-card.css";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { formatTokenBalance } from "@/helpers/formatTokenBalance";
export const TokenCard = ({ name, balance, symbol }: TokenInfo) => {
  const router = useRouter();
  const sendFormHandler = () => {
    router.push(`/send-form?token=${name}`);
  };
  return (
    <div className="card__container">
      <div className="card__metadata">
        <h1 className="card__title">{name}</h1>
        <h4 className="card__balance">
          {formatTokenBalance(balance) + " " + symbol}
        </h4>
      </div>
      <div className="card__bottom-container">
        <Button size={"m"} onClick={sendFormHandler}>
          토큰 보내기
        </Button>
      </div>
    </div>
  );
};
