"use client";
import { useWallet } from "@/context/WalletContext";
import { ConnectedView } from "./ConnectedView";
import { DisconnectedView } from "./DisconnectedView";

export const WalletDashboard = () => {
  const { isConnected, connect } = useWallet();

  return isConnected ? (
    <ConnectedView />
  ) : (
    <DisconnectedView onConnect={connect} />
  );
};
