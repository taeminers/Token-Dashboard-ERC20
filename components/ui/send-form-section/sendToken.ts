import { CONTRACT_ABI, CONTRACT_ADDRESS } from "@/constants/token";
import { ethers } from "ethers";

type SendTokenParams = {
  token: string;
  recipient: string;
  amount: string; // human-readable string (e.g., "0.5")
};

export async function sendToken({
  token,
  recipient,
  amount,
}: SendTokenParams): Promise<string> {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed");
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  if (token === "Test ETH") {
    const tx = await signer.sendTransaction({
      to: recipient,
      value: ethers.parseEther(amount),
    });
    await tx.wait();
    return tx.hash;
  }

  if (token === "AssignmentDev") {
    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      CONTRACT_ABI,
      signer
    );
    const decimals = await contract.decimals();
    const value = ethers.parseUnits(amount, decimals);

    const tx = await contract.transfer(recipient, value);
    await tx.wait();
    return tx.hash;
  }

  throw new Error("Invalid token type");
}
