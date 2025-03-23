import { formatWalletAddress } from "@/helpers/formatWalletAddress";
import { WalletAddressProps } from "./types";
import "../address.css";
export const WalletAddress = ({ wallet_address }: WalletAddressProps) => {
  return (
    <h2 className="wallet-address-text">
      {formatWalletAddress(wallet_address)}
    </h2>
  );
};
