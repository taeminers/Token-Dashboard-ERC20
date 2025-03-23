import { validationRules } from "../validation";
import { FormData } from "../types";

describe("Validation Rules", () => {
  describe("recipientAddress validation", () => {
    const { recipientAddress } = validationRules;

    it("should require recipient address", () => {
      expect(recipientAddress.required).toBe("받는 주소를 입력해주세요");
    });

    it("should validate Ethereum address format", () => {
      const { pattern } = recipientAddress;
      const validAddress = "0x123f681646d4a755815f9cb19e1acc8565a0c2ac";
      const invalidAddress = "123f681646d4a755815f9cb19e1acc8565a0c2ac";

      expect((pattern as { value: RegExp }).value.test(validAddress)).toBe(
        true
      );
      expect((pattern as { value: RegExp }).value.test(invalidAddress)).toBe(
        false
      );
      expect((pattern as { message: string }).message).toBe(
        "올바른 이더리움 주소를 입력해주세요"
      );
    });
  });

  describe("amount validation", () => {
    const { amount } = validationRules;

    it("should require amount", () => {
      expect(amount.required).toBe("수량을 입력해주세요");
    });

    it("should validate number format", () => {
      const { pattern } = amount;
      expect((pattern as { value: RegExp }).value.test("123")).toBe(true);
      expect((pattern as { value: RegExp }).value.test("123.456")).toBe(true);
      expect((pattern as { value: RegExp }).value.test("abc")).toBe(false);
      expect((pattern as { value: RegExp }).value.test("123.abc")).toBe(false);
      expect((pattern as { message: string }).message).toBe(
        "올바른 수량을 입력해주세요"
      );
    });

    it("should validate amount value", () => {
      const { validate } = amount;
      if (typeof validate === "function") {
        const formData: FormData = { recipientAddress: "0x123", amount: "1.0" };
        expect(validate("123", formData)).toBe(true);
        expect(validate("0.1", formData)).toBe(true);
        expect(validate("0", formData)).toBe("0보다 큰 수량을 입력해주세요");
        expect(validate("-1", formData)).toBe("0보다 큰 수량을 입력해주세요");
        expect(validate("abc", formData)).toBe("올바른 수량을 입력해주세요");
      }
    });
  });
});
