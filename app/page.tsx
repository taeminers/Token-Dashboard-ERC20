import Header from "@/components/header";
import { WalletDashboard } from "@/components/ui/wallet-dashboard";

export default function Home() {
  return (
    <main>
      <Header text="토큰 대시보드" />
      <WalletDashboard />
    </main>
  );
}
