import { RegisterOptions } from "react-hook-form";
import { FormData } from "./types";

type ValidationRules = {
  [K in keyof FormData]: Omit<
    RegisterOptions<FormData, K>,
    "valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled"
  >;
};

export const validationRules: ValidationRules = {
  recipientAddress: {
    required: "받는 주소를 입력해주세요",
    pattern: {
      value: /^0x[a-fA-F0-9]{40}$/,
      message: "올바른 이더리움 주소를 입력해주세요",
    },
  },
  amount: {
    required: "수량을 입력해주세요",
    pattern: {
      value: /^\d*\.?\d*$/,
      message: "올바른 수량을 입력해주세요",
    },
    validate: (value) => {
      const numValue = parseFloat(value);
      if (isNaN(numValue)) return "올바른 수량을 입력해주세요";
      if (numValue <= 0) return "0보다 큰 수량을 입력해주세요";
      return true;
    },
  },
};
