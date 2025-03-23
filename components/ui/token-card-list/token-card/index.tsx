"use client";
import { TokenInfo } from "./types";
import "./token-card.css";
import { Button } from "@/components/button";
import { useRouter } from "next/navigation";
import { formatTokenBalance } from "@/helpers/formatTokenBalance";
export const TokenCard = ({ name, balance, symbol }: TokenInfo) => {
  const router = useRouter();
  const sendFormHandler = () => {
    router.push("/send-form");
  };
  return (
    <div className="card-container">
      <div className="card-metadata">
        <h1 className="card-title">{name}</h1>
        <h4 className="card-balance">
          {formatTokenBalance(balance) + " " + symbol}
        </h4>
      </div>
      <div className="card-bottom-container">
        <Button size={"m"} onClick={sendFormHandler}>
          토큰 보내기
        </Button>
      </div>
    </div>
  );
};
