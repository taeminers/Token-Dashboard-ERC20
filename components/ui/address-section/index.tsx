import { Avatar } from "./avatar";
import { WalletAddress } from "./wallet-address";

export const AddressSection = () => {
  return (
    <section className="flex gap-2.5 items-center p-4">
      <Avatar />
      <WalletAddress wallet_address={"0x1234567890ab"} />
    </section>
  );
};
