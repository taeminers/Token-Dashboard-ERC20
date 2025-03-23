import Header from "@/components/ui/Header";
import { Spinner } from "@/components/ui/Spinner";
import { WalletDashboard } from "@/components/wallet-dashboard";
import { Suspense } from "react";

export default function Home() {
  return (
    <main>
      <Suspense fallback={<Spinner />}>
        <Header text="토큰 대시보드" />
        <WalletDashboard />
      </Suspense>
    </main>
  );
}
