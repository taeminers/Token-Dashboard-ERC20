import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { SendFormSection } from "../index";
import { useWallet } from "@/context/WalletContext/WalletContext";
import { useRouter, useSearchParams } from "next/navigation";
import { sendToken } from "../sendToken";

// Define MetaMask error type
interface MetaMaskError extends Error {
  code?: number;
}

// Mock dependencies
jest.mock("@/context/WalletContext/WalletContext");
jest.mock("next/navigation");
jest.mock("../sendToken", () => ({
  sendToken: jest.fn(),
}));

// Mock implementations
const mockUseWallet = useWallet as jest.MockedFunction<typeof useWallet>;
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockUseSearchParams = useSearchParams as jest.MockedFunction<
  typeof useSearchParams
>;
const mockSendToken = sendToken as jest.MockedFunction<typeof sendToken>;

const renderComponent = () => {
  const result = render(<SendFormSection />);
  const addressInput = screen.getByPlaceholderText("받는 주소");
  const amountInput = screen.getByPlaceholderText("수량");
  const submitButton = screen.getByRole("button");
  const form = submitButton.closest("form")!;
  return { ...result, addressInput, amountInput, submitButton, form };
};

describe("SendFormSection", () => {
  const mockRouter = {
    push: jest.fn(),
  };

  const mockSearchParams = {
    get: jest.fn(),
  };

  const mockRefetchTokenData = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup default mocks
    mockUseWallet.mockReturnValue({
      tokenInfo: { balance: "100" },
      ETHBalance: "1.5",
      refetchTokenData: mockRefetchTokenData,
    } as any);

    mockUseRouter.mockReturnValue(mockRouter as any);
    mockUseSearchParams.mockReturnValue(mockSearchParams as any);
    mockSearchParams.get.mockReturnValue("ETH");
    mockSendToken.mockResolvedValue("0xtxhash");
  });

  it("renders form fields correctly", () => {
    const { addressInput, amountInput, submitButton } = renderComponent();
    expect(addressInput).toBeInTheDocument();
    expect(amountInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });

  it("validates recipient address", async () => {
    const { addressInput, form } = renderComponent();

    await act(async () => {
      fireEvent.change(addressInput, { target: { value: "invalid-address" } });
      fireEvent.submit(form);
    });

    await waitFor(() => {
      const errorMessage = screen.getByText(
        "올바른 이더리움 주소를 입력해주세요"
      );
      expect(errorMessage).toBeInTheDocument();
      expect(errorMessage).toHaveClass("text-red-500", "text-sm");
    });
  });

  it("validates amount format", async () => {
    const { addressInput, amountInput, form } = renderComponent();

    await act(async () => {
      fireEvent.change(addressInput, {
        target: { value: "0x1234567890123456789012345678901234567890" },
      });
      fireEvent.change(amountInput, { target: { value: "abc" } });
      fireEvent.submit(form);
    });

    await waitFor(() => {
      const errorMessage = screen.getByText("올바른 수량을 입력해주세요");
      expect(errorMessage).toBeInTheDocument();
      expect(errorMessage).toHaveClass("text-red-500", "text-sm");
    });
  });

  it("validates amount is greater than zero", async () => {
    const { addressInput, amountInput, form } = renderComponent();

    await act(async () => {
      fireEvent.change(addressInput, {
        target: { value: "0x1234567890123456789012345678901234567890" },
      });
      fireEvent.change(amountInput, { target: { value: "0" } });
      fireEvent.submit(form);
    });

    await waitFor(() => {
      const errorMessage = screen.getByText("0보다 큰 수량을 입력해주세요");
      expect(errorMessage).toBeInTheDocument();
      expect(errorMessage).toHaveClass("text-red-500", "text-sm");
    });
  });

  it("validates balance for ETH transfer", async () => {
    mockUseWallet.mockReturnValue({
      tokenInfo: null,
      ETHBalance: "1.5",
      refetchTokenData: mockRefetchTokenData,
    } as any);

    const { addressInput, amountInput, form } = renderComponent();

    await act(async () => {
      fireEvent.change(addressInput, {
        target: { value: "0x1234567890123456789012345678901234567890" },
      });
      fireEvent.change(amountInput, { target: { value: "2.0" } });
      fireEvent.submit(form);
    });

    await waitFor(() => {
      const errorMessage = screen.getByText("보유 수량을 초과했습니다");
      expect(errorMessage).toBeInTheDocument();
      expect(errorMessage).toHaveClass("text-red-500", "text-sm");
    });
  });

  it("validates balance for token transfer", async () => {
    mockSearchParams.get.mockReturnValue("ERC20");
    mockUseWallet.mockReturnValue({
      tokenInfo: { balance: "100" },
      ETHBalance: "1.5",
      refetchTokenData: mockRefetchTokenData,
    } as any);

    const { addressInput, amountInput, form } = renderComponent();

    await act(async () => {
      fireEvent.change(addressInput, {
        target: { value: "0x1234567890123456789012345678901234567890" },
      });
      fireEvent.change(amountInput, { target: { value: "150" } });
      fireEvent.submit(form);
    });

    await waitFor(() => {
      const errorMessage = screen.getByText("보유 수량을 초과했습니다");
      expect(errorMessage).toBeInTheDocument();
      expect(errorMessage).toHaveClass("text-red-500", "text-sm");
    });
  });

  it("submits form successfully", async () => {
    const { addressInput, amountInput, form } = renderComponent();

    await act(async () => {
      fireEvent.change(addressInput, {
        target: { value: "0x1234567890123456789012345678901234567890" },
      });
      fireEvent.change(amountInput, { target: { value: "1.0" } });
      fireEvent.submit(form);
    });

    await waitFor(() => {
      expect(mockSendToken).toHaveBeenCalledWith({
        token: "ETH",
        recipient: "0x1234567890123456789012345678901234567890",
        amount: "1.0",
      });
      expect(mockRefetchTokenData).toHaveBeenCalled();
      expect(mockRouter.push).toHaveBeenCalledWith("/");
    });
  });

  it("shows loading state during submission", async () => {
    mockSendToken.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve("0xtxhash"), 100))
    );

    const { addressInput, amountInput, form, submitButton } = renderComponent();

    await act(async () => {
      fireEvent.change(addressInput, {
        target: { value: "0x1234567890123456789012345678901234567890" },
      });
      fireEvent.change(amountInput, { target: { value: "1.0" } });
      fireEvent.submit(form);
    });

    expect(submitButton).toBeDisabled();
    expect(submitButton.querySelector(".animate-spin")).toBeInTheDocument();

    await waitFor(() => {
      expect(
        submitButton.querySelector(".animate-spin")
      ).not.toBeInTheDocument();
      expect(submitButton).not.toBeDisabled();
    });
  });

  it("handles failed submission", async () => {
    mockSendToken.mockResolvedValue("");

    const { addressInput, amountInput, form, submitButton } = renderComponent();

    await act(async () => {
      fireEvent.change(addressInput, {
        target: { value: "0x1234567890123456789012345678901234567890" },
      });
      fireEvent.change(amountInput, { target: { value: "1.0" } });
      fireEvent.submit(form);
    });

    await waitFor(
      () => {
        expect(mockRouter.push).not.toHaveBeenCalled();
        expect(submitButton).not.toBeDisabled();
        expect(submitButton).toHaveTextContent("보내기");
      },
      { timeout: 2000 }
    );
  });

  it("handles user rejection from MetaMask", async () => {
    const userRejectionError: MetaMaskError = new Error(
      "user rejected transaction"
    );
    userRejectionError.code = 4001;
    mockSendToken.mockRejectedValueOnce(userRejectionError);

    const { addressInput, amountInput, form } = renderComponent();

    await act(async () => {
      fireEvent.change(addressInput, {
        target: { value: "0x1234567890123456789012345678901234567890" },
      });
      fireEvent.change(amountInput, { target: { value: "1.0" } });
      fireEvent.submit(form);
    });

    await waitFor(() => {
      const errorMessage = screen.getByText("거래가 취소되었습니다.");
      expect(errorMessage).toBeInTheDocument();
      expect(mockRouter.push).not.toHaveBeenCalled();
    });
  });

  it("handles insufficient funds error", async () => {
    const insufficientFundsError = new Error("insufficient funds");
    mockSendToken.mockRejectedValueOnce(insufficientFundsError);

    const { addressInput, amountInput, form } = renderComponent();

    await act(async () => {
      fireEvent.change(addressInput, {
        target: { value: "0x1234567890123456789012345678901234567890" },
      });
      fireEvent.change(amountInput, { target: { value: "1.0" } });
      fireEvent.submit(form);
    });

    await waitFor(() => {
      const errorMessage = screen.getByText("잔액이 부족합니다.");
      expect(errorMessage).toBeInTheDocument();
      expect(mockRouter.push).not.toHaveBeenCalled();
    });
  });

  it("handles unexpected transaction errors", async () => {
    const unexpectedError = new Error("unexpected error");
    mockSendToken.mockRejectedValueOnce(unexpectedError);

    const { addressInput, amountInput, form } = renderComponent();

    await act(async () => {
      fireEvent.change(addressInput, {
        target: { value: "0x1234567890123456789012345678901234567890" },
      });
      fireEvent.change(amountInput, { target: { value: "1.0" } });
      fireEvent.submit(form);
    });

    await waitFor(() => {
      const errorMessage = screen.getByText(
        "거래 중 오류가 발생했습니다. 다시 시도해주세요."
      );
      expect(errorMessage).toBeInTheDocument();
      expect(mockRouter.push).not.toHaveBeenCalled();
    });
  });

  it("resets error state on new submission", async () => {
    const userRejectionError: MetaMaskError = new Error(
      "user rejected transaction"
    );
    userRejectionError.code = 4001;
    mockSendToken.mockRejectedValueOnce(userRejectionError);

    const { addressInput, amountInput, form } = renderComponent();

    // First submission - should show error
    await act(async () => {
      fireEvent.change(addressInput, {
        target: { value: "0x1234567890123456789012345678901234567890" },
      });
      fireEvent.change(amountInput, { target: { value: "1.0" } });
      fireEvent.submit(form);
    });

    await waitFor(() => {
      expect(screen.getByText("거래가 취소되었습니다.")).toBeInTheDocument();
    });

    // Mock successful transaction for second attempt
    mockSendToken.mockResolvedValueOnce("0xtxhash");

    // Second submission - error should be cleared
    await act(async () => {
      fireEvent.submit(form);
    });

    await waitFor(() => {
      expect(
        screen.queryByText("거래가 취소되었습니다.")
      ).not.toBeInTheDocument();
      expect(mockRouter.push).toHaveBeenCalledWith("/");
    });
  });

  it("handles null token case", async () => {
    mockSearchParams.get.mockReturnValue(null);
    mockUseWallet.mockReturnValue({
      tokenInfo: { balance: "100" },
      ETHBalance: "1.5",
      refetchTokenData: mockRefetchTokenData,
    } as any);

    const { addressInput, amountInput, form } = renderComponent();

    await act(async () => {
      fireEvent.change(addressInput, {
        target: { value: "0x1234567890123456789012345678901234567890" },
      });
      fireEvent.change(amountInput, { target: { value: "50" } });
      fireEvent.submit(form);
    });

    await waitFor(() => {
      expect(mockSendToken).toHaveBeenCalledWith({
        token: "",
        recipient: "0x1234567890123456789012345678901234567890",
        amount: "50",
      });
    });
  });

  it("handles null tokenInfo case", async () => {
    mockSearchParams.get.mockReturnValue("TOKEN");
    mockUseWallet.mockReturnValue({
      tokenInfo: null,
      ETHBalance: "1.5",
      refetchTokenData: mockRefetchTokenData,
    } as any);

    const { addressInput, amountInput, form } = renderComponent();

    await act(async () => {
      fireEvent.change(addressInput, {
        target: { value: "0x1234567890123456789012345678901234567890" },
      });
      fireEvent.change(amountInput, { target: { value: "1.0" } });
      fireEvent.submit(form);
    });

    await waitFor(() => {
      const errorMessage = screen.getByText("보유 수량을 초과했습니다");
      expect(errorMessage).toBeInTheDocument();
    });
  });
});
