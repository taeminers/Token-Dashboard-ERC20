"use client";
import { Button } from "@/components/button";
import { TextField } from "../text-field";
import { useWallet } from "@/context/WalletContext/WalletContext";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { FormData } from "./types";
import { validationRules } from "./validation";
import { sendToken } from "./sendToken";
import { useState } from "react";
import { Spinner } from "@/components/Spinner";

export const SendFormSection = () => {
  const { tokenInfo, ETHBalance, refetchTokenData } = useWallet();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = handleSubmit(async (data) => {
    setIsLoading(true);
    setError(null);
    try {
      const hash = await sendToken({
        token: token || "",
        recipient: data.recipientAddress,
        amount: data.amount,
      });
      if (hash) {
        await refetchTokenData();
        router.push("/");
      }
    } catch (err: any) {
      // Handle user rejection
      if (err?.code === 4001 || err?.message?.includes("user rejected")) {
        setError("거래가 취소되었습니다.");
      }
      // Handle insufficient funds
      else if (err?.message?.includes("insufficient funds")) {
        setError("잔액이 부족합니다.");
      }
      // Handle other errors
      else {
        setError("거래 중 오류가 발생했습니다. 다시 시도해주세요.");
        console.error("Transaction error:", err);
      }
    } finally {
      setIsLoading(false);
    }
  });

  const availableBalance = token?.includes("ETH")
    ? parseFloat(ETHBalance)
    : parseFloat(tokenInfo?.balance || "0");

  return (
    <section className="py-2.5">
      <form onSubmit={onSubmit} className="flex flex-col justify-center gap-4">
        <div className="flex flex-col gap-1">
          <TextField
            placeholder_text="받는 주소"
            {...register("recipientAddress", validationRules.recipientAddress)}
          />
          {errors.recipientAddress && (
            <span className="text-red-500 text-sm">
              {errors.recipientAddress.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <TextField
            placeholder_text="수량"
            {...register("amount", {
              validate: (value) => {
                const numValue = parseFloat(value);
                if (isNaN(numValue)) return "올바른 수량을 입력해주세요";
                if (numValue <= 0) return "0보다 큰 수량을 입력해주세요";
                if (numValue > availableBalance)
                  return "보유 수량을 초과했습니다";
                return true;
              },
            })}
          />
          {errors.amount && (
            <span className="text-red-500 text-sm">
              {errors.amount.message}
            </span>
          )}
        </div>

        {error && (
          <div className="text-red-500 text-sm text-center">{error}</div>
        )}

        <Button size="l" type="submit" disabled={isLoading}>
          {isLoading ? <Spinner /> : "보내기"}
        </Button>
      </form>
    </section>
  );
};
