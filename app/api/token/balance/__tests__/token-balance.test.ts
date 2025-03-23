// __tests__/api/token-balance.test.ts
import { GET } from "@/app/api/token/balance/route";
import { CONTRACT_ADDRESS } from "@/constants/token";

describe("GET /api/token/balance", () => {
  const mockAddress = "0x1234567890abcdef1234567890abcdef12345678";

  beforeEach(() => {
    global.fetch = jest.fn().mockImplementation((url, options: any) => {
      const body = JSON.parse(options.body);
      if (body.method === "alchemy_getTokenBalances") {
        return Promise.resolve({
          json: () =>
            Promise.resolve({
              result: {
                tokenBalances: [{ tokenBalance: "0xde0b6b3a7640000" }], // 1e18 (1 token)
              },
            }),
        });
      } else if (body.method === "alchemy_getTokenMetadata") {
        return Promise.resolve({
          json: () =>
            Promise.resolve({
              result: {
                name: "TestToken",
                symbol: "TT",
                decimals: 18,
              },
            }),
        });
      }
    });
  });

  it("should return token info when address is provided", async () => {
    const url = new URL(
      `http://localhost/api/token/balance?address=${mockAddress}`
    );
    const req = new Request(url.toString());

    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data).toEqual({
      name: "TestToken",
      symbol: "TT",
      balance: "1",
    });
  });

  it("should return 400 if address is missing", async () => {
    const url = new URL("http://localhost/api/token/balance");
    const req = new Request(url.toString());

    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBe("Wallet address is required");
  });

  it("should return 500 if fetch fails", async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error("Alchemy down")
    );

    const url = new URL(
      `http://localhost/api/token/balance?address=${mockAddress}`
    );
    const req = new Request(url.toString());

    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(500);
    expect(data.error).toBe("Failed to fetch token data");
  });
});
