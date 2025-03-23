import Header from "@/components/header";
import { SendFormSection } from "@/components/ui/send-form-section";
import { Suspense } from "react";

export default function SendForm() {
  return (
    <main>
      <Suspense fallback={<div>Loading...</div>}>
        <Header text="보내기" exit_icon={true} />
        <SendFormSection />
      </Suspense>
    </main>
  );
}
