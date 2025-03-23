jest.mock("ethers");

import { sendToken } from "../sendToken";
import { CONTRACT_ADDRESS } from "@/constants/token";
import { BrowserProvider, Contract, parseEther, parseUnits } from "ethers";

describe("sendToken", () => {
  const mockSendTransaction = jest.fn().mockResolvedValue({
    hash: "0x123",
    wait: jest.fn().mockResolvedValue(undefined),
  });

  const mockGetSigner = jest.fn().mockResolvedValue({
    sendTransaction: mockSendTransaction,
  });

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Mock ethers functions
    (BrowserProvider as jest.Mock).mockImplementation(() => ({
      getSigner: mockGetSigner,
    }));

    (Contract as jest.Mock).mockImplementation(() => ({
      decimals: jest.fn().mockResolvedValue(18),
      transfer: jest.fn().mockResolvedValue({
        hash: "0x123",
        wait: jest.fn().mockResolvedValue(undefined),
      }),
    }));

    (parseEther as jest.Mock).mockReturnValue("1000000000000000000");
    (parseUnits as jest.Mock).mockReturnValue("1000000000000000000");

    // Mock window.ethereum
    Object.defineProperty(window, "ethereum", {
      value: {
        request: jest.fn(),
        on: jest.fn(),
        removeListener: jest.fn(),
      },
      writable: true,
    });
  });

  afterEach(() => {
    // Clean up
    Object.defineProperty(window, "ethereum", {
      value: undefined,
      writable: true,
    });
  });

  it("should throw error if MetaMask is not installed", async () => {
    Object.defineProperty(window, "ethereum", {
      value: undefined,
      writable: true,
    });

    await expect(
      sendToken({
        token: "Test ETH",
        recipient: "0x123",
        amount: "1.0",
      })
    ).rejects.toThrow("MetaMask is not installed");
  });

  it("should send ETH correctly", async () => {
    const params = {
      token: "Test ETH",
      recipient: "0x123",
      amount: "1.0",
    };

    const hash = await sendToken(params);
    expect(hash).toBe("0x123");

    expect(BrowserProvider).toHaveBeenCalledWith(window.ethereum);
    expect(mockGetSigner).toHaveBeenCalled();
    expect(mockSendTransaction).toHaveBeenCalledWith({
      to: "0x123",
      value: "1000000000000000000",
    });
  });

  it("should send ERC20 token correctly", async () => {
    const params = {
      token: "AssignmentDev",
      recipient: "0x123",
      amount: "1.0",
    };

    const hash = await sendToken(params);
    expect(hash).toBe("0x123");

    expect(BrowserProvider).toHaveBeenCalledWith(window.ethereum);
    expect(Contract).toHaveBeenCalledWith(
      CONTRACT_ADDRESS,
      expect.any(Array),
      expect.anything()
    );
    expect(parseUnits).toHaveBeenCalledWith("1.0", 18);
  });

  it("should throw error for invalid token type", async () => {
    await expect(
      sendToken({
        token: "InvalidToken",
        recipient: "0x123",
        amount: "1.0",
      })
    ).rejects.toThrow("Invalid token type");
  });
});
