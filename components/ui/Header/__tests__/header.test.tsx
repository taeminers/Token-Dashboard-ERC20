import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Header from "../index";
import { useRouter, useSearchParams } from "next/navigation";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

describe("Header", () => {
  const mockRouter = {
    back: jest.fn(),
  };

  const mockSearchParams = {
    get: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);
  });

  it("renders header text without exit icon", () => {
    mockSearchParams.get.mockReturnValue(null);
    render(<Header text="Test Header" exit_icon={false} />);

    expect(screen.getByText("Test Header")).toBeInTheDocument();
    expect(screen.queryByAltText("exit-page-icon")).not.toBeInTheDocument();
    expect(screen.getByRole("banner")).toHaveClass("header-container-no-icons");
  });

  it("renders header text with exit icon", () => {
    mockSearchParams.get.mockReturnValue(null);
    render(<Header text="Test Header" exit_icon={true} />);

    expect(screen.getByText("Test Header")).toBeInTheDocument();
    expect(screen.getByAltText("exit-page-icon")).toBeInTheDocument();
    expect(screen.getByRole("banner")).toHaveClass("header-container-icons");
  });

  it("includes token in header text when available", () => {
    mockSearchParams.get.mockReturnValue("ETH");
    render(<Header text="Send" exit_icon={false} />);

    expect(screen.getByText("ETH Send")).toBeInTheDocument();
  });

  it("handles exit page click", () => {
    mockSearchParams.get.mockReturnValue(null);
    render(<Header text="Test Header" exit_icon={true} />);

    const exitIcon = screen.getByAltText("exit-page-icon");
    fireEvent.click(exitIcon);

    expect(mockRouter.back).toHaveBeenCalled();
  });
});
