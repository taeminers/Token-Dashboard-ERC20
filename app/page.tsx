import Header from "@/components/header";
import { WalletDashboard } from "@/components/ui/wallet-dashboard";
import { Suspense } from "react";

export default function Home() {
  return (
    <main>
      <Suspense fallback={<div>Loading...</div>}>
        <Header text="토큰 대시보드" />
        <WalletDashboard />
      </Suspense>
    </main>
  );
}
