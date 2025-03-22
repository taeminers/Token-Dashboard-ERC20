import Header from "@/components/header";
import { SendFormSection } from "@/components/ui/send-form-section";

export default function SendForm() {
  return (
    <main>
      <Header text="Sepolia ETH 보내기" exit_icon={true} />
      <SendFormSection />
    </main>
  );
}
