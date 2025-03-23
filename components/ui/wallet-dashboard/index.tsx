"use client";
import { useWallet } from "@/context/WalletContext/WalletContext";
import { ConnectedView } from "./ConnectedView";
import { DisconnectedView } from "./DisconnectedView";
import { SearchProvider } from "@/context/SearchContext/SearchContext";

export const WalletDashboard = () => {
  const { isConnected, connect } = useWallet();

  return isConnected ? (
    <SearchProvider>
      <ConnectedView />
    </SearchProvider>
  ) : (
    <DisconnectedView onConnect={connect} />
  );
};
