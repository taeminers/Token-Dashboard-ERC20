import { Button } from "@/components/button";
import { TextField } from "../text-field";

export const SendFormSection = () => {
  return (
    <section className="py-2.5">
      <div className="flex flex-col justify-center gap-4">
        <TextField placeholder_text="받는 주소" />
        <TextField placeholder_text="수량" />
        <Button size="l">보내기</Button>
      </div>
    </section>
  );
};
