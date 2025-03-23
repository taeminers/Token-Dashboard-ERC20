"use client";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { ethers } from "ethers";
import { TokenInfo } from "@/components/token-card-list/token-card/types";

interface WalletContextType {
  walletAddress: string | null;
  isConnected: boolean;
  ETHBalance: string;
  tokenInfo: TokenInfo | null;
  loading: boolean;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  refetchTokenData: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [ETHBalance, setETHBalance] = useState("0");
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTokenData = async (address: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/token/balance?address=${address}`);
      const data = await response.json();

      if (data.error) {
        setError(data.error);
        setTokenInfo(null);
      } else {
        setTokenInfo(data);
      }
    } catch (err) {
      console.error("Failed to fetch token data:", err);
      setError("Failed to fetch token data");
      setTokenInfo(null);
    } finally {
      setLoading(false);
    }
  };

  const connect = async () => {
    try {
      if (typeof window.ethereum === "undefined") {
        alert("MetaMask가 설치되어 있지 않습니다. MetaMask를 설치해주세요.");
        window.open("https://metamask.io/download/", "_blank");
        return;
      }

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const address = accounts[0];
      setWalletAddress(address);

      const balance = await window.ethereum.request({
        method: "eth_getBalance",
        params: [address, "latest"],
      });
      const balanceInEth = ethers.formatEther(balance);
      setETHBalance(balanceInEth);
      setIsConnected(true);

      // Fetch token data after connecting
      await fetchTokenData(address);
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      setWalletAddress(null);
      setIsConnected(false);
      setETHBalance("0");
      setTokenInfo(null);
      setError("Failed to connect wallet");
    }
  };

  const disconnect = () => {
    setWalletAddress(null);
    setIsConnected(false);
    setETHBalance("0");
    setTokenInfo(null);
    setError(null);
  };
  const refetchTokenData = async () => {
    // will be used after sending transaction
    if (walletAddress) {
      await connect();
      await fetchTokenData(walletAddress);
    }
  };
  useEffect(() => {
    if (walletAddress) {
      fetchTokenData(walletAddress);
    }
  }, [walletAddress]);

  return (
    <WalletContext.Provider
      value={{
        walletAddress,
        isConnected,
        ETHBalance,
        tokenInfo,
        loading,
        error,
        connect,
        disconnect,
        refetchTokenData,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}
