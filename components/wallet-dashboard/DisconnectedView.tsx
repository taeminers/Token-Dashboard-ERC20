"use client";
import { Button } from "@/components/ui/Button";

interface DisconnectedViewProps {
  onConnect: () => Promise<void>;
}

export const DisconnectedView = ({ onConnect }: DisconnectedViewProps) => {
  return (
    <Button fixedBottom={true} onClick={onConnect}>
      <h1>지갑 연결하기</h1>
    </Button>
  );
};
