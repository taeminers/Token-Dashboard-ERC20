import { Avatar } from "./avatar";
import { AddressProps } from "./types";
import { WalletAddress } from "./wallet-address";

export const AddressSection = ({ address }: AddressProps) => {
  return (
    <section className="flex gap-2.5 items-center p-4">
      <Avatar />
      {address && <WalletAddress wallet_address={address} />}
    </section>
  );
};
