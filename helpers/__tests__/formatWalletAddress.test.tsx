import { formatWalletAddress } from "../formatWalletAddress";

describe("formatWalletAddress", () => {
  it("should format a valid ethereum address", () => {
    const address = "0x1234567890123456789012345678901234567890";
    expect(formatWalletAddress(address)).toBe("0x1234...567890");
  });

  it("should handle invalid or short addresses", () => {
    expect(formatWalletAddress("")).toBe("");
    expect(formatWalletAddress("0x123")).toBe("0x123");
    expect(formatWalletAddress("0x12345")).toBe("0x12345");
  });

  it("should format addresses of 12 or more characters", () => {
    const address1 = "0x12345678901";
    const address2 = "0x123456789012";
    expect(formatWalletAddress(address1)).toBe(
      `${address1.slice(0, 6)}...${address1.slice(-6)}`
    );
    expect(formatWalletAddress(address2)).toBe(
      `${address2.slice(0, 6)}...${address2.slice(-6)}`
    );
  });
});
