import { formatTokenBalance } from "../formatTokenBalance";

describe("formatTokenBalance", () => {
  it("should format whole numbers correctly", () => {
    expect(formatTokenBalance("1000")).toBe("1,000.000");
    expect(formatTokenBalance("0")).toBe("0.000");
  });

  it("should format decimal numbers correctly", () => {
    expect(formatTokenBalance("1000.123")).toBe("1,000.123");
    expect(formatTokenBalance("0.123")).toBe("0.123");
  });

  it("should round numbers to 3 decimal places", () => {
    expect(formatTokenBalance("1000.12345")).toBe("1,000.123");
    expect(formatTokenBalance("0.12345")).toBe("0.123");
  });

  it("should handle string numbers with leading/trailing zeros", () => {
    expect(formatTokenBalance("00100.120")).toBe("100.120");
    expect(formatTokenBalance("100.120000")).toBe("100.120");
  });

  it("should handle very large numbers", () => {
    expect(formatTokenBalance("1000000")).toBe("1,000,000.000");
    expect(formatTokenBalance("1000000.123")).toBe("1,000,000.123");
  });
});
