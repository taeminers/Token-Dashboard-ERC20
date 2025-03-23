import Header from "@/components/ui/Header";
import { SendFormSection } from "@/components/send-form-section";
import { Suspense } from "react";
import { Spinner } from "@/components/ui/Spinner";

export default function SendForm() {
  return (
    <main>
      <Suspense fallback={<Spinner />}>
        <Header text="보내기" exit_icon={true} />
        <SendFormSection />
      </Suspense>
    </main>
  );
}
