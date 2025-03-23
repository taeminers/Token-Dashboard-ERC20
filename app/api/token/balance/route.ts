import { CONTRACT_ADDRESS } from "@/constants/token";
import { NextResponse } from "next/server";

const ALCHEMY_URL = `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get("address");

  if (!address) {
    return NextResponse.json(
      { error: "Wallet address is required" },
      { status: 400 }
    );
  }

  try {
    const headers = { "Content-Type": "application/json" };

    // Get token balance
    const balanceRes = await fetch(ALCHEMY_URL, {
      method: "POST",
      headers,
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "alchemy_getTokenBalances",
        params: [address, [CONTRACT_ADDRESS]],
      }),
    });
    const balanceData = await balanceRes.json();
    const rawHexBalance = balanceData.result.tokenBalances[0].tokenBalance;

    // Get token metadata
    const metadataRes = await fetch(ALCHEMY_URL, {
      method: "POST",
      headers,
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 2,
        method: "alchemy_getTokenMetadata",
        params: [CONTRACT_ADDRESS],
      }),
    });
    const metadata = await metadataRes.json();
    const decimals = metadata.result.decimals;

    const balance = Number(BigInt(rawHexBalance)) / Math.pow(10, decimals);

    return NextResponse.json({
      name: metadata.result.name,
      symbol: metadata.result.symbol,
      balance: balance.toString(),
    });
  } catch (error) {
    console.error("Failed to fetch token data:", error);
    return NextResponse.json(
      { error: "Failed to fetch token data" },
      { status: 500 }
    );
  }
}
